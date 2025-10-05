import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { message, graphData, chatHistory } = body;

    if (!message || typeof message !== 'string') {
      console.log('Invalid message:', message);
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Calling Gemini service with :', { message, graphData, chatHistory });
    
    // Get response from Gemini with full context
    const response = await geminiService.chatWithContext(message, graphData, chatHistory);
    
    console.log('Gemini response received:', response.substring(0, 100) + '...');
    
    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
