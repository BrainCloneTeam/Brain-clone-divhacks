import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

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
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
    // Include relevant graph data for context
    const nodes = graphData?.nodes || [];
    const links = graphData?.links || [];
    
    // Get sample nodes (first 10) to provide context
    const sampleNodes = nodes.slice(0, 10).map((n: any) => ({
      name: n.name,
      type: n.type || 'concept'
    }));

    const prompt = `You are a helpful AI assistant with access to the user's memory database.

User's question: "${question}"

Memory database contains:
- ${nodes.length} nodes (concepts, people, places, events)
- ${links.length} connections between them
- Sample nodes: ${JSON.stringify(sampleNodes)}

Use this memory data to provide a helpful, contextual response. Reference relevant memories when appropriate:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown formatting
      text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold **text**
      text = text.replace(/\*(.*?)\*/g, '$1'); // Remove italic *text*
      text = text.replace(/^\* /gm, '• '); // Convert * to bullet points
      
      return text;
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('API quota exceeded. Please wait a moment and try again, or upgrade your plan for higher limits.');
      }
      
      throw new Error('Failed to process chat message');
    }
  }
}

export const geminiService = new GeminiService();
