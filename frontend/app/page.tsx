'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Plus, MessageCircle } from 'lucide-react';
import { useGraphStore } from '@/stores/graphStore';
import { graphApi } from '@/lib/api';

const Graph3D = dynamic(() => import('@/components/Graph3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-white text-xl">Loading 3D Graph...</div>
    </div>
  ),
});

export default function Home() {
  const { searchQuery, setSearchQuery, filterByType, setFilterByType, setGraphData, setLoading, setError, isLoading, graphData } = useGraphStore();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [isProcessingJournal, setIsProcessingJournal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', message: string, timestamp: string}>>([]);
  const [isProcessingChat, setIsProcessingChat] = useState(false);

  useEffect(() => {
    const loadGraphData = async () => {
      setLoading(true);
      try {
        const data = await graphApi.getGraph();
        setGraphData(data);
        console.log('Loaded graph data:', data.nodes.length, 'nodes,', data.links.length, 'links');
      } catch (error) {
        console.error('Failed to load graph data:', error);
        setError('Failed to load graph data');
      } finally {
        setLoading(false);
        // Show app after a short delay for smooth transition
        setTimeout(() => setAppLoaded(true), 500);
      }
    };

    loadGraphData();
  }, [setGraphData, setLoading, setError]);

  const handleJournalSubmit = async () => {
    if (!journalText.trim()) return;
    
    setIsProcessingJournal(true);
    try {
      // Call API to process journal entry with Gemini
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: journalText,
          graphData: graphData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process journal entry');
      }

      const result = await response.json();
      console.log('Journal analysis:', result.analysis);
      
      // Add analyzed entities to the graph
      if (result.analysis && result.analysis.entities) {
        const analysis = result.analysis;
        const entities = analysis.entities;
        
        // Safely extract entities with proper null checks
        const people = Array.isArray(entities.people) ? entities.people : [];
        const places = Array.isArray(entities.places) ? entities.places : [];
        const events = Array.isArray(entities.events) ? entities.events : [];
        
        // Create journal entry node
        const journalEntryId = `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const journalEntryNode = {
          id: journalEntryId,
          name: analysis.title || `Journal Entry ${new Date().toLocaleDateString()}`,
          type: 'journal' as const,
          val: 10,
          color: '#8B5CF6', // Purple for journal entries
          metadata: { 
            source: 'journal', 
            timestamp: new Date().toISOString(),
            description: journalText,
            summary: analysis.summary || '',
            insights: analysis.insights || []
          }
        };

        // Add entities as nodes with proper GraphNode structure
        const entitiesToAdd = [
          journalEntryNode, // Add journal entry as the main node
          ...people.map((person: string) => ({
            id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: person,
            type: 'person' as const,
            val: 8,
            color: '#3B82F6', // Blue for people
            metadata: { source: 'journal', timestamp: new Date().toISOString() }
          })),
          ...places.map((place: string) => ({
            id: `place_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: place,
            type: 'location' as const,
            val: 6,
            color: '#EF4444', // Red for locations
            metadata: { source: 'journal', timestamp: new Date().toISOString() }
          })),
          ...events.map((event: string) => ({
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: event,
            type: 'event' as const,
            val: 7,
            color: '#10B981', // Green for events
            metadata: { source: 'journal', timestamp: new Date().toISOString() }
          }))
        ];
        
        // Create connections between journal entry and all extracted entities
        const newLinks = [];
        const entityNodes = entitiesToAdd.slice(1); // Skip the journal entry node itself
        
        // Connect journal entry to all extracted entities
        entityNodes.forEach(entity => {
          newLinks.push({
            source: journalEntryId,
            target: entity.id,
            relationship: 'contains',
            strength: 0.9,
            color: '#8B5CF6'
          });
        });
        
        // Also connect entities to each other if there are multiple
        if (entityNodes.length > 1) {
          for (let i = 0; i < entityNodes.length; i++) {
            for (let j = i + 1; j < entityNodes.length; j++) {
              newLinks.push({
                source: entityNodes[i].id,
                target: entityNodes[j].id,
                relationship: 'mentioned_together',
                strength: 0.7,
                color: '#94A3B8'
              });
            }
          }
        }
        
        // Add nodes to current graph data with proper initialization
        const currentNodes = Array.isArray(graphData?.nodes) ? graphData.nodes : [];
        const currentLinks = Array.isArray(graphData?.links) ? graphData.links : [];
        
        setGraphData({
          nodes: [...currentNodes, ...entitiesToAdd],
          links: [...currentLinks, ...newLinks]
        });
        
        console.log('Added entities to graph:', entitiesToAdd);
        console.log('Added connections:', newLinks);
        
        // Show success message
        const entityCount = entitiesToAdd.length - 1; // Subtract 1 for the journal entry node
        alert(`✅ Journal entry saved! Added ${entityCount} entities to your knowledge graph.`);
      }
      
      // Clear the input
      setJournalText('');
      setShowJournaling(false);
      
    } catch (error) {
      console.error('Failed to process journal entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process journal entry';
      
      // Show user-friendly error message
      if (errorMessage.includes('quota')) {
        setError('AI analysis is temporarily unavailable due to quota limits. Please try again later or contact support.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessingJournal(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = chatMessage.trim();
    setChatMessage('');
    setIsProcessingChat(true);
    
    // Add user message to history
    const newHistory = [...chatHistory, {
      role: 'user' as const,
      message: userMessage,
      timestamp: new Date().toISOString()
    }];
    setChatHistory(newHistory);
    
    try {
      console.log('Sending chat request:', { 
        message: userMessage, 
        graphData: graphData, 
        chatHistory: newHistory,
        graphDataType: typeof graphData,
        chatHistoryType: typeof newHistory,
        graphDataKeys: graphData ? Object.keys(graphData) : 'null',
        chatHistoryLength: newHistory ? newHistory.length : 'null'
      });
      
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          graphData: graphData,
          chatHistory: newHistory
        }),
      });

      console.log('Chat response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API error response:', errorText);
        throw new Error(`Failed to process chat message: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Chat API success:', result);
      
      // Add AI response to history
      setChatHistory([...newHistory, {
        role: 'assistant' as const,
        message: result.response,
        timestamp: result.timestamp
      }]);
      
    } catch (error) {
      console.error('Failed to process chat message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message';
      
      // Add user message to history even if API fails
      setChatHistory([...newHistory, {
        role: 'assistant' as const,
        message: `Sorry, I'm currently unable to respond. Error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsProcessingChat(false);
    }
  };

  // Show splash screen while loading
  if (!appLoaded) {
    return (
      <div className="w-screen h-screen bg-[#000011] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <Image
              src="/logoap.png"
              alt="BrainClone Logo"
              width={120}
              height={120}
              className="mx-auto animate-pulse"
              priority
            />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            BrainClone
          </h1>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#000011] overflow-hidden">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl">
        {/* Logo with Animation */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <Image
              src="/logoap.png"
              alt="BrainClone Logo"
              width={40}
              height={40}
              className={`transition-all duration-1000 ${
                logoLoaded 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-50 rotate-180'
              }`}
              onLoad={() => setLogoLoaded(true)}
              priority
            />
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-blue-400/30 rounded-full blur-sm transition-all duration-1000 ${
              logoLoaded ? 'opacity-100 scale-110' : 'opacity-0 scale-50'
            }`} />
          </div>
          <h1 className={`text-2xl font-bold text-white transition-all duration-1000 delay-300 ${
            logoLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            BrainClone
          </h1>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter by Type */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilterByType(null)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              !filterByType ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterByType('person')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterByType === 'person' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            People
          </button>
          <button
            onClick={() => setFilterByType('event')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterByType === 'event' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setFilterByType('location')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterByType === 'location' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setFilterByType('journal')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterByType === 'journal' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Journals
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Play Button */}
          <button
            onClick={() => {
              const event = new CustomEvent('startOverview');
              window.dispatchEvent(event);
            }}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <Play className="w-5 h-5" />
          </button>

          {/* Journal Button */}
          <button
            onClick={() => setShowJournaling(!showJournaling)}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Memory</span>
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Journaling Panel */}
      {showJournaling && (
        <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-md">
          <h3 className="text-lg font-semibold text-white mb-3">Add Memory</h3>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Describe your day, thoughts, experiences... AI will connect it to your knowledge graph!"
            className="w-full h-32 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleJournalSubmit}
              disabled={!journalText.trim() || isProcessingJournal}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessingJournal ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Brain</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowJournaling(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute bottom-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-md h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-3">Ask Your Brain</h3>
          <div className="bg-gray-700 rounded-lg p-3 mb-3 flex-1 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <p className="text-gray-300 text-sm">Ask me anything about your memories, experiences, or insights from your knowledge graph!</p>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-600 text-gray-100'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {isProcessingChat && (
                  <div className="flex justify-start">
                    <div className="bg-gray-600 text-gray-100 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about your memories..."
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isProcessingChat}
            />
            <button 
              onClick={handleChatSubmit}
              disabled={!chatMessage.trim() || isProcessingChat}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowChat(false)}
            className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Close Chat
          </button>
        </div>
      )}

      {/* Selected Node Info */}
      <SelectedNodeInfo />

      {/* 3D Graph */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-white text-xl">Fetching graph data...</div>
        </div>
      ) : (
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-white text-xl">Loading 3D Graph...</div>
          </div>
        }>
          <Graph3D backgroundColor="#000011" />
        </Suspense>
      )}
    </div>
  );
}

function SelectedNodeInfo() {
  const { selectedNode } = useGraphStore();

  if (!selectedNode) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-sm">
      <h3 className="text-lg font-semibold text-white mb-2">{selectedNode.name}</h3>
      <p className="text-sm text-gray-300 capitalize mb-2">Type: {selectedNode.type}</p>
      {selectedNode.metadata && (
        <div className="text-sm text-gray-400">
          {Object.entries(selectedNode.metadata).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="capitalize">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}