import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this would connect to a real database
let graphStorage: any = { nodes: [], links: [] };

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: graphStorage
    });
  } catch (error) {
    console.error('Error loading graph data:', error);
    return NextResponse.json(
      { error: 'Failed to load graph data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nodes, links } = await request.json();

    if (!Array.isArray(nodes) || !Array.isArray(links)) {
      return NextResponse.json(
        { error: 'Invalid graph data format' },
        { status: 400 }
      );
    }

    // Save the graph data
    graphStorage = { nodes, links };

    return NextResponse.json({
      success: true,
      message: 'Graph data saved successfully',
      count: { nodes: nodes.length, links: links.length }
    });

  } catch (error) {
    console.error('Error saving graph data:', error);
    return NextResponse.json(
      { error: 'Failed to save graph data' },
      { status: 500 }
    );
  }
}
