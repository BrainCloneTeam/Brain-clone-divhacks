import axios from 'axios';
import { z } from 'zod';
import { GraphData, GraphNode, GraphLink, NODE_COLORS, NodeType } from '@/types/graph';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

    // Additional nodes only of original types
    { id: "lisa", name: "Lisa Tran", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Colleague and coding mentor", category: "Person" } },
    { id: "sanfran", name: "San Francisco", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "City where I had my first tech internship", category: "Location" } },
    { id: "hackathon", name: "Local Hackathon", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "24-hour coding competition with friends", category: "Event" } },
    { id: "workshop", name: "AI Workshop", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Hands-on AI model training workshop", category: "Event" } },
    { id: "conference", name: "Tech Conference 2025", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Annual conference about future tech trends", category: "Event" } },
    
    // Cluster A: Travel memories (disconnected from others)
    { id: "tokyo", name: "Tokyo", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Trip to Japan in spring", category: "Location" } },
    { id: "kyoto", name: "Kyoto", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Visited temples and gardens", category: "Location" } },
    { id: "sakura_trip", name: "Sakura Festival", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Cherry blossom viewing", category: "Event" } },
    { id: "yuki", name: "Yuki Tanaka", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Local guide in Kyoto", category: "Person" } },

    // Cluster B: Career projects (disconnected from others)
    { id: "alpha_corp", name: "Alpha Corp HQ", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Downtown office", category: "Location" } },
    { id: "proj_aurora", name: "Project Aurora", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Realtime analytics rollout", category: "Event" } },
    { id: "jordan", name: "Jordan Park", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Tech lead on Aurora", category: "Person" } },
    { id: "samir", name: "Samir Patel", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Data engineer teammate", category: "Person" } },

    // Cluster C: Hobbies group (disconnected from others)
    { id: "climbing_gym", name: "Summit Climbing Gym", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Thursday sessions", category: "Location" } },
    { id: "boulder_meet", name: "Bouldering Meetup", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Community climb night", category: "Event" } },
    { id: "nina", name: "Nina Alvarez", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Climbing partner", category: "Person" } },
    { id: "owen", name: "Owen Lee", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Route setter", category: "Person" } },

    // Cluster D: Music scene
    { id: "brooklyn_hall", name: "Brooklyn Music Hall", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Small venue in NYC", category: "Location" } },
    { id: "indie_night", name: "Indie Night", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Local bands showcase", category: "Event" } },
    { id: "aria", name: "Aria Nguyen", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Vocalist", category: "Person" } },
    { id: "theo", name: "Theo Brooks", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Guitarist", category: "Person" } },
    { id: "lena", name: "Lena Park", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Drummer", category: "Person" } },

    // Cluster E: Europe trip
    { id: "paris", name: "Paris", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Summer holiday in France", category: "Location" } },
    { id: "louvre", name: "Louvre Museum", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Art museum visit", category: "Location" } },
    { id: "paris_marathon", name: "Paris Marathon", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Ran the 10k fun run", category: "Event" } },
    { id: "marco", name: "Marco Rossi", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Tour guide", category: "Person" } },

    // Cluster F: Research group
    { id: "mit_media_lab", name: "MIT Media Lab", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Innovation lab", category: "Location" } },
    { id: "hci_symposium", name: "HCI Symposium", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Human-computer interaction talks", category: "Event" } },
    { id: "li_wei", name: "Dr. Li Wei", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Research fellow", category: "Person" } },
    { id: "priya", name: "Priya Nair", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "PhD candidate", category: "Person" } },

    // Cluster G: Startup circle
    { id: "nova_hub", name: "Nova Hub", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Coworking space", category: "Location" } },
    { id: "pitch_day", name: "Pitch Day", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Startup showcase", category: "Event" } },
    { id: "cecil", name: "Cecil Grant", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Founder, Fintech", category: "Person" } },
    { id: "mia", name: "Mia Schultz", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "VC analyst", category: "Person" } },

    // Cluster H: Sports rec league
    { id: "city_arena", name: "City Arena", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Community court", category: "Location" } },
    { id: "basket_final", name: "Basketball Finals", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "League championship", category: "Event" } },
    { id: "coach_dan", name: "Coach Dan", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Team coach", category: "Person" } },
    { id: "tasha", name: "Tasha Reed", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Point guard", category: "Person" } },

    // Cluster I: Book club
    { id: "neighborhood_cafe", name: "Neighborhood Cafe", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Monthly meetup spot", category: "Location" } },
    { id: "mystery_month", name: "Mystery Month", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Detective novels discussion", category: "Event" } },
    { id: "sophie", name: "Sophie Bennett", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Organizer", category: "Person" } },
    { id: "raul", name: "Raul Gomez", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Member", category: "Person" } },

    // Cluster J: Food tour
    { id: "bangkok", name: "Bangkok", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Street food heaven", category: "Location" } },
    { id: "yaowarat", name: "Yaowarat Market", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Chinatown night market", category: "Location" } },
    { id: "thai_food_tour", name: "Thai Food Tour", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Culinary exploration", category: "Event" } },
    { id: "noi", name: "Chef Noi", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Street chef", category: "Person" } },

    // Cluster K: University club
    { id: "campus_center", name: "Campus Center", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Student union building", category: "Location" } },
    { id: "ai_club_fair", name: "AI Club Fair", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Recruiting new members", category: "Event" } },
    { id: "derek", name: "Derek Huang", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Club president", category: "Person" } },
    { id: "mira", name: "Mira Kapoor", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Workshop coordinator", category: "Person" } },

    // Cluster L: Family moments
    { id: "central_park", name: "Central Park", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Picnic spot", category: "Location" } },
    { id: "family_picnic", name: "Family Picnic", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Summer gathering", category: "Event" } },
    { id: "dad", name: "Dad", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Father", category: "Person" } },
    { id: "sis", name: "Sister", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Sibling", category: "Person" } },

    // Cluster M: Gaming guild
    { id: "lan_cafe", name: "LAN Cafe", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Weekend hangout", category: "Location" } },
    { id: "guild_tournament", name: "Guild Tournament", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Bracket finals", category: "Event" } },
    { id: "raven", name: "Raven", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Guild leader", category: "Person" } },
    { id: "kiko", name: "Kiko", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Support main", category: "Person" } },

    // Cluster N: Wellness & yoga
    { id: "serenity_studio", name: "Serenity Studio", type: "location", val: 1, color: NODE_COLORS.location, metadata: { description: "Yoga studio", category: "Location" } },
    { id: "sunrise_flow", name: "Sunrise Flow", type: "event", val: 1, color: NODE_COLORS.event, metadata: { description: "Morning class", category: "Event" } },
    { id: "ella", name: "Ella Monroe", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Instructor", category: "Person" } },
    { id: "haruto", name: "Haruto Sato", type: "person", val: 1, color: NODE_COLORS.person, metadata: { description: "Classmate", category: "Person" } },
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

    // Additional links
    { source: "lisa", target: "workshop", relationship: "ATTENDED", strength: 1 },
    { source: "lisa", target: "hackathon", relationship: "PARTICIPATED_IN", strength: 1 },
    { source: "alex", target: "conference", relationship: "SPEAKER_AT", strength: 1 },
    { source: "hackathon", target: "sanfran", relationship: "OCCURRED_IN", strength: 1 },
    { source: "workshop", target: "conference", relationship: "PART_OF", strength: 1 },
    { source: "mike", target: "conference", relationship: "ATTENDED", strength: 1 },

    // Links for Cluster A (Travel)
    { source: "sakura_trip", target: "tokyo", relationship: "OCCURRED_AT", strength: 1 },
    { source: "sakura_trip", target: "kyoto", relationship: "VISITED", strength: 1 },
    { source: "yuki", target: "kyoto", relationship: "LIVES_IN", strength: 1 },
    { source: "yuki", target: "sakura_trip", relationship: "GUIDED", strength: 1 },

    // Links for Cluster B (Career)
    { source: "proj_aurora", target: "alpha_corp", relationship: "OCCURRED_AT", strength: 1 },
    { source: "jordan", target: "proj_aurora", relationship: "LEADS", strength: 1 },
    { source: "samir", target: "proj_aurora", relationship: "WORKED_ON", strength: 1 },

    // Links for Cluster C (Hobbies)
    { source: "boulder_meet", target: "climbing_gym", relationship: "OCCURRED_AT", strength: 1 },
    { source: "nina", target: "boulder_meet", relationship: "ATTENDED", strength: 1 },
    { source: "owen", target: "climbing_gym", relationship: "WORKS_AT", strength: 1 },

    // Links for Cluster D (Music)
    { source: "indie_night", target: "brooklyn_hall", relationship: "OCCURRED_AT", strength: 1 },
    { source: "aria", target: "indie_night", relationship: "PERFORMED_AT", strength: 1 },
    { source: "theo", target: "indie_night", relationship: "PERFORMED_AT", strength: 1 },
    { source: "lena", target: "indie_night", relationship: "PERFORMED_AT", strength: 1 },

    // Links for Cluster E (Europe trip)
    { source: "paris_marathon", target: "paris", relationship: "OCCURRED_AT", strength: 1 },
    { source: "louvre", target: "paris", relationship: "LOCATED_IN", strength: 1 },
    { source: "marco", target: "louvre", relationship: "GUIDED", strength: 1 },

    // Links for Cluster F (Research)
    { source: "hci_symposium", target: "mit_media_lab", relationship: "OCCURRED_AT", strength: 1 },
    { source: "li_wei", target: "hci_symposium", relationship: "PRESENTED_AT", strength: 1 },
    { source: "priya", target: "hci_symposium", relationship: "ATTENDED", strength: 1 },

    // Links for Cluster G (Startup)
    { source: "pitch_day", target: "nova_hub", relationship: "OCCURRED_AT", strength: 1 },
    { source: "cecil", target: "pitch_day", relationship: "PITCHED_AT", strength: 1 },
    { source: "mia", target: "pitch_day", relationship: "JUDGED", strength: 1 },

    // Links for Cluster H (Sports)
    { source: "basket_final", target: "city_arena", relationship: "OCCURRED_AT", strength: 1 },
    { source: "coach_dan", target: "basket_final", relationship: "COACHED", strength: 1 },
    { source: "tasha", target: "basket_final", relationship: "PLAYED_IN", strength: 1 },

    // Links for Cluster I (Book club)
    { source: "mystery_month", target: "neighborhood_cafe", relationship: "OCCURRED_AT", strength: 1 },
    { source: "sophie", target: "mystery_month", relationship: "ORGANIZED", strength: 1 },
    { source: "raul", target: "mystery_month", relationship: "ATTENDED", strength: 1 },

    // Links for Cluster J (Food tour)
    { source: "thai_food_tour", target: "bangkok", relationship: "OCCURRED_IN", strength: 1 },
    { source: "yaowarat", target: "bangkok", relationship: "LOCATED_IN", strength: 1 },
    { source: "noi", target: "thai_food_tour", relationship: "LED", strength: 1 },

    // Links for Cluster K (University club)
    { source: "ai_club_fair", target: "campus_center", relationship: "OCCURRED_AT", strength: 1 },
    { source: "derek", target: "ai_club_fair", relationship: "HOSTED", strength: 1 },
    { source: "mira", target: "ai_club_fair", relationship: "ORGANIZED", strength: 1 },

    // Links for Cluster L (Family)
    { source: "family_picnic", target: "central_park", relationship: "OCCURRED_AT", strength: 1 },
    { source: "dad", target: "family_picnic", relationship: "ATTENDED", strength: 1 },
    { source: "sis", target: "family_picnic", relationship: "ATTENDED", strength: 1 },

    // Links for Cluster M (Gaming)
    { source: "guild_tournament", target: "lan_cafe", relationship: "OCCURRED_AT", strength: 1 },
    { source: "raven", target: "guild_tournament", relationship: "LED", strength: 1 },
    { source: "kiko", target: "guild_tournament", relationship: "PLAYED_IN", strength: 1 },

    // Links for Cluster N (Wellness)
    { source: "sunrise_flow", target: "serenity_studio", relationship: "OCCURRED_AT", strength: 1 },
    { source: "ella", target: "sunrise_flow", relationship: "INSTRUCTED", strength: 1 },
    { source: "haruto", target: "sunrise_flow", relationship: "ATTENDED", strength: 1 },
  ]
};

export const graphApi = {
  async getGraph(): Promise<GraphData> {
    try {
      // Try to fetch from backend first
      const response = await api.post('/graph/cypher?query=' + encodeURIComponent('MATCH (n) OPTIONAL MATCH (n)-[r]-(m) RETURN DISTINCT n, r, m LIMIT 500'));

      const nodes = new Map<string, GraphNode>();
      const links: GraphLink[] = [];
      const linkSet = new Set<string>(); // To avoid duplicate links

      // Process results
      if (response.data.results) {
        response.data.results.forEach((record: any) => {
          // Add nodes
          if (record.n && !nodes.has(record.n.name)) {
            const nodeType = (record.n.category === 'Event' ? 'event' :
                             record.n.category === 'Date' ? 'event' :
                             record.n.category === 'Location' ? 'location' :
                             record.n.category === 'Person' ? 'person' : 'event') as NodeType;

            nodes.set(record.n.name, {
              id: record.n.name,
              name: record.n.name,
              type: nodeType,
              val: 1,
              color: NODE_COLORS[nodeType],
              metadata: {
                description: record.n.description,
                category: record.n.category,
              },
            });
          }

          if (record.m && !nodes.has(record.m.name)) {
            const nodeType = (record.m.category === 'Event' ? 'event' :
                             record.m.category === 'Date' ? 'event' :
                             record.m.category === 'Location' ? 'location' :
                             record.m.category === 'Person' ? 'person' : 'event') as NodeType;

            nodes.set(record.m.name, {
              id: record.m.name,
              name: record.m.name,
              type: nodeType,
              val: 1,
              color: NODE_COLORS[nodeType],
              metadata: {
                description: record.m.description,
                category: record.m.category,
              },
            });
          }

          // Add relationships as links
          if (record.r && record.n && record.m) {
            const linkId = `${record.n.name}-${record.m.name}`;
            const reverseLinkId = `${record.m.name}-${record.n.name}`;

            if (!linkSet.has(linkId) && !linkSet.has(reverseLinkId)) {
              links.push({
                source: record.n.name,
                target: record.m.name,
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
      // Return demo data when backend is not available (e.g., on Vercel)
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
      const response = await api.post('/graph/nodes', node);
      return GraphNodeSchema.parse(response.data);
    } catch (error) {
      // In demo mode, just return the node with a generated ID
      return { ...node, id: `demo_${Date.now()}` };
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
      const response = await api.post('/graph/links', link);
      return GraphLinkSchema.parse(response.data);
    } catch (error) {
      // In demo mode, just return the link
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
      const response = await api.get('/graph/search', { params: { q: query } });
      return z.array(GraphNodeSchema).parse(response.data);
    } catch (error) {
      // In demo mode, filter demo nodes
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