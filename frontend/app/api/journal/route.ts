import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text, graphData } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Journal text is required' },
        { status: 400 }
      );
    }

    // Analyze the journal entry with Gemini
    const analysis = await geminiService.analyzeJournalEntry(text, graphData);

    // TODO: Save to database and update knowledge graph
    // For now, we'll return the analysis and let the frontend handle the graph update
    
    return NextResponse.json({
      success: true,
      analysis,
      message: 'Journal entry processed successfully'
    });

  } catch (error) {
    console.error('Error processing journal entry:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to process journal entry', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
