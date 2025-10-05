'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
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
  const { searchQuery, setSearchQuery, filterByType, setFilterByType, setGraphData, setLoading, setError, isLoading } = useGraphStore();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

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
        <div className="flex gap-2">
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
        </div>
      </div>

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