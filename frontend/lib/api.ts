import axios from 'axios';
import { z } from 'zod';
import { GraphData, GraphNode, GraphLink, NODE_COLORS, NodeType } from '@/types/graph';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zaida-unvitreous-indiscriminatingly.ngrok-free.dev/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const GraphNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['person', 'event', 'location']),
  val: z.number(),
  color: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const GraphLinkSchema = z.object({
  source: z.string(),
  target: z.string(),
  relationship: z.string(),
  strength: z.number().optional(),
});

const GraphDataSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  links: z.array(GraphLinkSchema),
});

// Demo data for when backend is not available
const DEMO_GRAPH_DATA: GraphData = {
  nodes: [
    { id: "sarah", name: "Sarah Chen", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "College roommate and best friend", category: "Person" } },
    { id: "alex", name: "Alex Kim", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Study partner and CS lab partner", category: "Person" } },
    { id: "stanford", name: "Stanford University", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Alma mater where I studied computer science", category: "Location" } },
    { id: "graduation", name: "College Graduation", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Proud moment walking across the stage", category: "Event" } },
    { id: "mike", name: "Mike Rodriguez", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "High school friend and hiking buddy", category: "Person" } },
    { id: "yosemite", name: "Yosemite National Park", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Breathtaking national park with granite cliffs and waterfalls", category: "Location" } },
    { id: "hike", name: "Half Dome Hike", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Challenging 16-mile hike to the top of Half Dome", category: "Event" } },
    { id: "grandma", name: "Grandma Rose", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Beloved grandmother who taught me to cook", category: "Person" } },
    { id: "family_home", name: "Family Home", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Childhood home in Chicago suburbs", category: "Location" } },
    { id: "recipes", name: "Learning Grandma's Recipes", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Special time learning family recipes and stories", category: "Event" } },
  ],
  links: [
    { source: "sarah", target: "graduation", relationship: "ATTENDED", strength: 1 },
    { source: "alex", target: "stanford", relationship: "STUDIED_AT", strength: 1 },
    { source: "graduation", target: "stanford", relationship: "OCCURRED_AT", strength: 1 },
    { source: "mike", target: "hike", relationship: "HIKED_WITH", strength: 1 },
    { source: "hike", target: "yosemite", relationship: "OCCURRED_AT", strength: 1 },
    { source: "grandma", target: "recipes", relationship: "TAUGHT", strength: 1 },
    { source: "recipes", target: "family_home", relationship: "OCCURRED_AT", strength: 1 },
    { source: "sarah", target: "alex", relationship: "INTRODUCED_TO", strength: 1 },
    { source: "grandma", target: "sarah", relationship: "MET", strength: 1 },
  ]
};

export const graphApi = {
  async getGraph(): Promise<GraphData> {
    try {
      // Use the visualize endpoint to get graph data
      const response = await api.post('/graph/visualize', {
        include_metadata: true,
        max_nodes: 1000
      });

      if (response.data && response.data.nodes && response.data.links) {
        // Transform backend data to frontend format
        const nodes: GraphNode[] = response.data.nodes.map((node: any) => ({
          id: node.id || node.name,
          name: node.name,
          type: (node.type || node.category || 'event').toLowerCase() as NodeType,
          val: node.val || 5,
          color: node.color || NODE_COLORS[(node.type || 'event').toLowerCase() as NodeType] || '#666666',
          metadata: {
            description: node.description,
            category: node.category,
            ...node.metadata
          }
        }));

        const links: GraphLink[] = response.data.links.map((link: any) => ({
          source: link.source,
          target: link.target,
          relationship: link.relationship || link.type || 'RELATED_TO',
          strength: link.strength || 1,
          color: link.color || '#94A3B8'
        }));

        console.log('Loaded graph from backend:', nodes.length, 'nodes,', links.length, 'links');
        return { nodes, links };
      }

      // Fallback: try Cypher query if visualize endpoint doesn't work
      const cypherResponse = await api.post('/graph/cypher', {
        query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-(m) RETURN DISTINCT n, r, m LIMIT 500'
      });

      const nodes = new Map<string, GraphNode>();
      const links: GraphLink[] = [];
      const linkSet = new Set<string>();

      if (cypherResponse.data && cypherResponse.data.results) {
        cypherResponse.data.results.forEach((record: any) => {
          // Add nodes
          if (record.n && !nodes.has(record.n.id || record.n.name)) {
            const nodeType = (record.n.type === 'Event' ? 'event' :
                             record.n.type === 'Location' ? 'location' :
                             record.n.type === 'Person' ? 'person' : 'event') as NodeType;

            nodes.set(record.n.id || record.n.name, {
              id: record.n.id || record.n.name,
              name: record.n.name,
              type: nodeType,
              val: 5,
              color: NODE_COLORS[nodeType],
              metadata: {
                description: record.n.description,
                category: record.n.type,
              },
            });
          }

          if (record.m && !nodes.has(record.m.id || record.m.name)) {
            const nodeType = (record.m.type === 'Event' ? 'event' :
                             record.m.type === 'Location' ? 'location' :
                             record.m.type === 'Person' ? 'person' : 'event') as NodeType;

            nodes.set(record.m.id || record.m.name, {
              id: record.m.id || record.m.name,
              name: record.m.name,
              type: nodeType,
              val: 5,
              color: NODE_COLORS[nodeType],
              metadata: {
                description: record.m.description,
                category: record.m.type,
              },
            });
          }

          // Add relationships as links
          if (record.r && record.n && record.m) {
            const sourceId = record.n.id || record.n.name;
            const targetId = record.m.id || record.m.name;
            const linkId = `${sourceId}-${targetId}`;
            const reverseLinkId = `${targetId}-${sourceId}`;

            if (!linkSet.has(linkId) && !linkSet.has(reverseLinkId)) {
              links.push({
                source: sourceId,
                target: targetId,
                relationship: record.r.type || 'RELATED_TO',
                strength: 1,
              });
              linkSet.add(linkId);
            }
          }
        });
      }

      return {
        nodes: Array.from(nodes.values()),
        links: links,
      };
    } catch (error) {
      console.warn('Backend not available, using demo data:', error);
      return DEMO_GRAPH_DATA;
    }
  },

  async getNode(nodeId: string): Promise<GraphNode> {
    try {
      const response = await api.get(`/graph/nodes/${nodeId}`);
      return GraphNodeSchema.parse(response.data);
    } catch (error) {
      // Return demo node if backend not available
      const demoNode = DEMO_GRAPH_DATA.nodes.find(n => n.id === nodeId);
      if (demoNode) return demoNode;
      throw new Error('Node not found');
    }
  },

  async createNode(node: Omit<GraphNode, 'id'>): Promise<GraphNode> {
    try {
      // Use the entities endpoint to create a new entity
      const entityData = {
        name: node.name,
        type: node.type.toUpperCase(), // Backend expects uppercase
        description: node.metadata?.description || '',
        confidence_score: 0.9,
        metadata: node.metadata || {}
      };

      const response = await api.post('/graph/entities', entityData);
      
      // Return the created node with backend ID
      return {
        ...node,
        id: response.data.entity_id || `entity_${Date.now()}`,
        metadata: {
          ...node.metadata,
          entity_id: response.data.entity_id,
          backend_created: true
        }
      };
    } catch (error) {
      console.warn('Failed to create entity in backend:', error);
      // Fallback: return node with generated ID
      return { ...node, id: `local_${Date.now()}` };
    }
  },

  async updateNode(nodeId: string, updates: Partial<GraphNode>): Promise<GraphNode> {
    try {
      const response = await api.patch(`/graph/nodes/${nodeId}`, updates);
      return GraphNodeSchema.parse(response.data);
    } catch (error) {
      // In demo mode, return updated node
      const demoNode = DEMO_GRAPH_DATA.nodes.find(n => n.id === nodeId);
      if (demoNode) return { ...demoNode, ...updates };
      throw new Error('Node not found');
    }
  },

  async deleteNode(nodeId: string): Promise<void> {
    try {
      await api.delete(`/graph/nodes/${nodeId}`);
    } catch (error) {
      // In demo mode, just log the action
      console.log('Demo mode: Would delete node', nodeId);
    }
  },

  async createLink(link: Omit<GraphLink, 'color'>): Promise<GraphLink> {
    try {
      // Use the relationships endpoint to create a relationship
      const relationshipData = {
        source_entity_id: link.source,
        target_entity_id: link.target,
        relationship_type: link.relationship,
        strength: link.strength || 1.0,
        metadata: {}
      };

      const response = await api.post('/graph/relationships', relationshipData);
      
      return {
        ...link,
        color: '#94A3B8',
        metadata: {
          relationship_id: response.data.relationship_id,
          backend_created: true
        }
      };
    } catch (error) {
      console.warn('Failed to create relationship in backend:', error);
      // Fallback: return link with default color
      return { ...link, color: '#666' };
    }
  },

  async deleteLink(sourceId: string, targetId: string): Promise<void> {
    try {
      await api.delete(`/graph/links/${sourceId}/${targetId}`);
    } catch (error) {
      // In demo mode, just log the action
      console.log('Demo mode: Would delete link', sourceId, targetId);
    }
  },

  async searchNodes(query: string): Promise<GraphNode[]> {
    try {
      // Use the search entities endpoint
      const response = await api.post('/graph/search/entities', {
        query: query,
        limit: 50,
        include_metadata: true
      });

      if (response.data && response.data.entities) {
        return response.data.entities.map((entity: any) => ({
          id: entity.id || entity.name,
          name: entity.name,
          type: (entity.type || 'event').toLowerCase() as NodeType,
          val: 5,
          color: NODE_COLORS[(entity.type || 'event').toLowerCase() as NodeType] || '#666666',
          metadata: {
            description: entity.description,
            category: entity.type,
            confidence: entity.confidence_score,
            ...entity.metadata
          }
        }));
      }

      return [];
    } catch (error) {
      console.warn('Search failed, using local filter:', error);
      // Fallback: filter demo nodes
      return DEMO_GRAPH_DATA.nodes.filter(node => 
        node.name.toLowerCase().includes(query.toLowerCase()) ||
        node.metadata?.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getNeighbors(nodeId: string, depth: number = 1): Promise<GraphData> {
    try {
      const response = await api.get(`/graph/nodes/${nodeId}/neighbors`, {
        params: { depth },
      });
      return GraphDataSchema.parse(response.data);
    } catch (error) {
      // In demo mode, find neighbors from demo data
      const neighbors = DEMO_GRAPH_DATA.links
        .filter(link => link.source === nodeId || link.target === nodeId)
        .map(link => link.source === nodeId ? link.target : link.source);
      
      const neighborNodes = DEMO_GRAPH_DATA.nodes.filter(node => 
        neighbors.includes(node.id) || node.id === nodeId
      );
      
      const neighborLinks = DEMO_GRAPH_DATA.links.filter(link =>
        neighborNodes.some(node => node.id === link.source || node.id === link.target)
      );

      return { nodes: neighborNodes, links: neighborLinks };
    }
  },
};

export const r2rApi = {
  async uploadDocument(file: File, metadata?: Record<string, any>): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await api.post('/r2r/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.document_id;
  },

  async query(query: string, documentId?: string): Promise<any> {
    const response = await api.post('/r2r/query', {
      query,
      document_id: documentId,
      search_settings: {
        use_hybrid_search: true,
        limit: 10,
      },
    });
    return response.data;
  },

  async extractEntities(documentId: string): Promise<GraphData> {
    const response = await api.post(`/r2r/documents/${documentId}/extract`);
    return GraphDataSchema.parse(response.data);
  },
};

export const authApi = {
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  async register(email: string, password: string, name: string): Promise<any> {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  async getCurrentUser(): Promise<any> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};