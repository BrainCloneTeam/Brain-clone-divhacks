import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GraphData, GraphNode, GraphLink, NodeType } from '@/types/graph';

// Function to sync graph data to API for cross-device persistence
const syncToAPI = async (data: GraphData) => {
  try {
    await fetch('/api/graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.warn('Failed to sync graph data to API:', error);
  }
};

interface GraphState {
  graphData: GraphData;
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  highlightedNodes: Set<string>;
  highlightedLinks: Set<string>;
  filterByType: NodeType | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  setGraphData: (data: GraphData) => void;
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  addLink: (link: GraphLink) => void;
  removeLink: (sourceId: string, targetId: string) => void;
  setSelectedNode: (node: GraphNode | null) => void;
  setHoveredNode: (node: GraphNode | null) => void;
  setHighlightedNodes: (nodeIds: string[]) => void;
  setHighlightedLinks: (linkIds: string[]) => void;
  setFilterByType: (type: NodeType | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearGraph: () => void;
  getNeighbors: (nodeId: string) => { nodes: Set<string>; links: Set<string> };
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      graphData: { nodes: [], links: [] },
      selectedNode: null,
      hoveredNode: null,
      highlightedNodes: new Set(),
      highlightedLinks: new Set(),
      filterByType: null,
      searchQuery: '',
      isLoading: false,
      error: null,

  setGraphData: (data) => {
    set({ graphData: data });
    // Sync to API for cross-device persistence
    syncToAPI(data);
  },

  addNode: (node) =>
    set((state) => ({
      graphData: {
        ...state.graphData,
        nodes: [...state.graphData.nodes, node],
      },
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      graphData: {
        nodes: Array.isArray(state.graphData?.nodes) ? state.graphData.nodes.filter((n) => n.id !== nodeId) : [],
        links: Array.isArray(state.graphData?.links) ? state.graphData.links.filter(
          (l) =>
            (typeof l.source === 'string' ? l.source : l.source.id) !== nodeId &&
            (typeof l.target === 'string' ? l.target : l.target.id) !== nodeId
        ) : [],
      },
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      graphData: {
        ...state.graphData,
        nodes: state.graphData.nodes.map((n) =>
          n.id === nodeId ? { ...n, ...updates } : n
        ),
      },
    })),

  addLink: (link) =>
    set((state) => ({
      graphData: {
        ...state.graphData,
        links: [...state.graphData.links, link],
      },
    })),

  removeLink: (sourceId, targetId) =>
    set((state) => ({
      graphData: {
        ...state.graphData,
        links: Array.isArray(state.graphData?.links) ? state.graphData.links.filter((l) => {
          const source = typeof l.source === 'string' ? l.source : l.source.id;
          const target = typeof l.target === 'string' ? l.target : l.target.id;
          return !(source === sourceId && target === targetId);
        }) : [],
      },
    })),

  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setHighlightedNodes: (nodeIds) => set({ highlightedNodes: new Set(nodeIds) }),
  setHighlightedLinks: (linkIds) => set({ highlightedLinks: new Set(linkIds) }),
  setFilterByType: (type) => set({ filterByType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearGraph: () => set({ graphData: { nodes: [], links: [] }, selectedNode: null }),

  getNeighbors: (nodeId) => {
    const { graphData } = get();
    const neighborNodes = new Set<string>();
    const neighborLinks = new Set<string>();

    if (!Array.isArray(graphData?.links)) {
      return { nodes: neighborNodes, links: neighborLinks };
    }

    graphData.links.forEach((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;

      if (sourceId === nodeId) {
        neighborNodes.add(targetId);
        neighborLinks.add(`${sourceId}-${targetId}`);
      } else if (targetId === nodeId) {
        neighborNodes.add(sourceId);
        neighborLinks.add(`${sourceId}-${targetId}`);
      }
    });

    return { nodes: neighborNodes, links: neighborLinks };
  },
}),
{
  name: 'brainclone-graph-storage', // unique name for localStorage key
  storage: createJSONStorage(() => ({
    getItem: (name: string) => localStorage.getItem(name),
    setItem: (name: string, value: string) => {
      // Avoid re-writing identical data to reduce quota usage
      if (localStorage.getItem(name) === value) return;
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        // Best-effort: on quota errors, drop persistence for this write
        console.warn('Persist storage quota reached, skipping save');
      }
    },
    removeItem: (name: string) => localStorage.removeItem(name)
  })),
  partialize: (state) => {
    // Persist a minimized snapshot to reduce size: strip coordinates and transient fields
    const nodes = Array.isArray(state.graphData?.nodes)
      ? state.graphData.nodes.map((n) => ({
          id: n.id,
          name: n.name,
          type: n.type,
          val: n.val,
          color: n.color,
          metadata: n.metadata,
        }))
      : [];
    const links = Array.isArray(state.graphData?.links)
      ? state.graphData.links.map((l) => ({
          source: typeof l.source === 'string' ? l.source : l.source.id,
          target: typeof l.target === 'string' ? l.target : l.target.id,
          relationship: l.relationship,
          strength: l.strength,
          color: l.color,
        }))
      : [];
    return { graphData: { nodes, links } };
  },
}
  )
);