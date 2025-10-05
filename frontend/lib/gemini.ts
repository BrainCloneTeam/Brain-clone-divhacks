import { GoogleGenerativeAI } from '@google/generative-ai';
// npx opik-configure OR npm install opik
// npm install opik-gemini @google/genai
import { trackGemini } from "opik-gemini";
import { Opik } from "opik";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const customOpikClient = new Opik({
  apiKey: "jEXIPpzrZARnH1PrlA4SaANRt", // If not using environment variables
  projectName: "Opik DivHacks",
});
// Configure the tracked client with options
const trackedGenAI = trackGemini(genAI, {
  // Optional array of tags to apply to all traces
  traceMetadata: {
    tags: ["gemini", "production", "user-query", "rag-pipeline"],
    // Optional metadata to include with all traces
    environment: "production",
    version: "1.2.3",
    component: "memory_retrieval",
  },
  // Optional custom name for the generation/trace
  generationName: "MemoryRetrievalService",
  // Optional pre-configured Opik client
  // If not provided, a singleton instance will be used
  client: customOpikClient
});


export interface JournalAnalysis {
  title: string;
  summary: string;
  entities: {
    people: string[];
    places: string[];
    events: string[];
    emotions: string[];
    topics: string[];
  };
  connections: {
    type: 'person' | 'event' | 'location' | 'topic';
    name: string;
    relationship: string;
    confidence: number;
  }[];
  insights: string[];
}

export class GeminiService {
  private model = trackedGenAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async analyzeJournalEntry(text: string, existingGraph?: any): Promise<JournalAnalysis> {
    const prompt = `Analyze: "${text}"

Return JSON: {title, summary, entities: {people:[], places:[], events:[], emotions:[], topics:[]}, connections: [{type, name, relationship, confidence}], insights: []}

JSON only:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response (remove markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const analysis = JSON.parse(jsonText) as JournalAnalysis;
      return analysis;
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

      // Handle quota exceeded error
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('API quota exceeded. Please wait a moment and try again, or upgrade your plan for higher limits.');
      }

      throw new Error('Failed to analyze journal entry');
    }
  }

  async chatWithContext(question: string, graphData: any, chatHistory: any[] = []): Promise<string> {
    // STEP 1: Neo4j Graph Traversal - Extract relevant nodes and relationships
    const startTime = Date.now();
    const nodes = graphData?.nodes || [];
    const links = graphData?.links || [];

    // Log graph traversal metrics for Opik tracing
    const graphTraversalTime = Date.now() - startTime;
    console.log(`[Opik Trace] Neo4j graph traversal completed: ${nodes.length} nodes, ${links.length} links (${graphTraversalTime}ms)`);

    // STEP 2: Node Description Retrieval - Get detailed context from relevant nodes
    const retrievalStartTime = Date.now();

    // Retrieve relevant nodes based on question keywords (simplified semantic matching)
    const questionLower = question.toLowerCase();
    const relevantNodes = nodes.filter((n: any) => {
      const name = (n.name || '').toLowerCase();
      const description = (n.description || '').toLowerCase();
      return questionLower.split(' ').some(word =>
        word.length > 3 && (name.includes(word) || description.includes(word))
      );
    }).slice(0, 10); // Top 10 most relevant nodes

    // Construct detailed node descriptions for context
    const nodeDescriptions = relevantNodes.map((n: any) => ({
      name: n.name,
      type: n.type || 'concept',
      description: n.description || 'No description available',
      confidence: n.confidence || 0.5
    }));

    const retrievalTime = Date.now() - retrievalStartTime;
    console.log(`[Opik Trace] Node description retrieval completed: ${relevantNodes.length} relevant nodes (${retrievalTime}ms)`);
    console.log(`[Opik Trace] Retrieved nodes:`, nodeDescriptions.map(n => n.name).join(', '));

    // STEP 3: Construct enriched context for Gemini
    const prompt = `You are a helpful AI assistant with access to the user's memory database.

User's question: "${question}"

Memory database statistics:
- Total nodes: ${nodes.length} (concepts, people, places, events)
- Total connections: ${links.length}
- Relevant memories retrieved: ${relevantNodes.length}

Relevant memory details:
${nodeDescriptions.map(n => `- ${n.name} (${n.type}): ${n.description} [confidence: ${n.confidence}]`).join('\n')}

Use this memory data to provide a helpful, contextual response. Reference specific memories when appropriate and explain how they relate to the user's question:`;

    try {
      // STEP 4: Gemini Response Generation
      const geminiStartTime = Date.now();
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      const geminiTime = Date.now() - geminiStartTime;
      console.log(`[Opik Trace] Gemini response generation completed (${geminiTime}ms)`);
      console.log(`[Opik Trace] Total pipeline time: ${Date.now() - startTime}ms`);

      // Clean up markdown formatting
      text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold **text**
      text = text.replace(/\*(.*?)\*/g, '$1'); // Remove italic *text*
      text = text.replace(/^\* /gm, '• '); // Convert * to bullet points

      return text;
    } catch (error) {
      console.error('[Opik Trace] Error in RAG pipeline:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('API quota exceeded. Please wait a moment and try again, or upgrade your plan for higher limits.');
      }
      
      throw new Error('Failed to process chat message');
    }
  }
}

export const geminiService = new GeminiService();

await trackedGenAI.flush();