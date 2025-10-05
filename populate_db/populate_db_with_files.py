"""
R2R Knowledge Graph Extraction Pipeline with Anthropic Claude
Extracts entities and relationships from R2R documents and populates Neo4j

This script:
1. Connects to R2R API to fetch documents
2. Uses Anthropic Claude to extract entities and relationships
3. Populates GraphAura Neo4j knowledge graph

Requirements:
    pip install anthropic r2r httpx neo4j pydantic
"""

import asyncio
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

import anthropic
from neo4j import AsyncGraphDatabase
from pydantic import BaseModel
import httpx


# ============================================
# CONFIGURATION
# ============================================

class Config:
    """Configuration for R2R and Neo4j connections."""
    # Anthropic API
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "your_anthropic_key_here")
    CLAUDE_MODEL = "claude-sonnet-4-20250514"  # or claude-opus-4-20250514 for best results

    # R2R API
    R2R_BASE_URL = os.getenv("R2R_BASE_URL", "http://localhost:7272")
    R2R_API_KEY = os.getenv("R2R_API_KEY", "")  # Optional, if R2R requires auth

    # Neo4j
    NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "your_password")
    NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

    # Processing
    BATCH_SIZE = 10  # Number of documents to process at once
    MAX_CHUNK_LENGTH = 4000  # Max characters to send to Claude per extraction


# ============================================
# DATA MODELS
# ============================================

class Entity(BaseModel):
    """Extracted entity from text."""
    id: str
    type: str  # person, organization, location, event, document, concept
    name: str
    description: Optional[str] = None
    properties: Dict[str, Any] = {}
    confidence_score: float = 0.9


class Relationship(BaseModel):
    """Extracted relationship between entities."""
    source_entity_name: str
    target_entity_name: str
    relationship_type: str
    properties: Dict[str, Any] = {}
    confidence_score: float = 0.9


class ExtractionResult(BaseModel):
    """Result from Claude extraction."""
    entities: List[Entity]
    relationships: List[Relationship]


# ============================================
# R2R CLIENT
# ============================================

class R2RClient:
    """Client for R2R API."""

    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=60.0)

    async def get_documents(self, limit: int = 100, offset: int = 0) -> List[Dict]:
        """Fetch documents from R2R."""
        url = f"{self.base_url}/v2/documents"
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        params = {"limit": limit, "offset": offset}

        try:
            response = await self.client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
        except Exception as e:
            print(f"Error fetching documents from R2R: {e}")
            return []

    async def get_document_chunks(self, document_id: str) -> List[Dict]:
        """Fetch chunks for a specific document."""
        url = f"{self.base_url}/v2/chunks"
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        params = {"document_id": document_id}

        try:
            response = await self.client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
        except Exception as e:
            print(f"Error fetching chunks for document {document_id}: {e}")
            return []

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


# ============================================
# ANTHROPIC KNOWLEDGE EXTRACTOR
# ============================================

class AnthropicKnowledgeExtractor:
    """Extract entities and relationships using Anthropic Claude."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-20250514"):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model = model

    async def extract_knowledge(self, text: str, context: Dict = None) -> ExtractionResult:
        """Extract entities and relationships from text using Claude."""

        system_prompt = """You are an expert knowledge graph extractor. Your task is to extract entities and relationships from the provided text.

Extract the following entity types:
- person: People mentioned in the text
- organization: Companies, institutions, groups
- location: Places, cities, buildings, addresses
- event: Meetings, conferences, launches, incidents
- concept: Ideas, technologies, methodologies, terms
- document: Referenced documents, reports, specifications

Extract relationships between entities:
- works_for, manages, collaborates_with, mentor_of (for people)
- located_in, part_of, owns (for organizations/locations)
- attended, organized, hosted (for events)
- authored, mentioned_in, references (for documents)
- related_to, similar_to, caused_by (for concepts)

For each entity, extract:
- type (from the list above)
- name (canonical name)
- description (brief description if available)
- properties (any additional relevant properties as key-value pairs)

For each relationship, extract:
- source_entity_name
- target_entity_name
- relationship_type (from the list above)
- properties (additional context)

Return ONLY valid JSON in this exact format:
{
  "entities": [
    {
      "id": "unique_id",
      "type": "person",
      "name": "John Doe",
      "description": "Software engineer at TechCorp",
      "properties": {"occupation": "Software Engineer", "email": "john@techcorp.com"},
      "confidence_score": 0.95
    }
  ],
  "relationships": [
    {
      "source_entity_name": "John Doe",
      "target_entity_name": "TechCorp",
      "relationship_type": "works_for",
      "properties": {"title": "Software Engineer", "since": "2020"},
      "confidence_score": 0.9
    }
  ]
}

Be thorough but accurate. Only extract entities and relationships that are clearly stated or strongly implied."""

        user_prompt = f"""Extract all entities and relationships from this text:

{text}

Return the result as JSON only, no additional commentary."""

        try:
            message = await self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=0,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )

            # Parse Claude's response
            response_text = message.content[0].text

            # Extract JSON from response (Claude might add explanation)
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start == -1 or json_end == 0:
                print("⚠️  No JSON found in Claude response")
                return ExtractionResult(entities=[], relationships=[])

            json_text = response_text[json_start:json_end]
            data = json.loads(json_text)

            # Add IDs to entities if missing
            for i, entity in enumerate(data.get("entities", [])):
                if "id" not in entity:
                    entity["id"] = f"{entity['type']}_{entity['name'].replace(' ', '_')}_{i}"

            return ExtractionResult(**data)

        except json.JSONDecodeError as e:
            print(f"⚠️  Error parsing Claude response as JSON: {e}")
            print(f"Response: {response_text[:500]}")
            return ExtractionResult(entities=[], relationships=[])
        except Exception as e:
            print(f"⚠️  Error calling Anthropic API: {e}")
            return ExtractionResult(entities=[], relationships=[])


# ============================================
# NEO4J GRAPH POPULATOR
# ============================================

class Neo4jGraphPopulator:
    """Populate Neo4j with extracted entities and relationships."""

    def __init__(self, uri: str, user: str, password: str, database: str):
        self.driver = AsyncGraphDatabase.driver(uri, auth=(user, password))
        self.database = database
        self.entity_cache = {}  # Cache entity IDs to avoid duplicates

    async def initialize(self):
        """Initialize database with constraints."""
        async with self.driver.session(database=self.database) as session:
            # Create constraints
            constraints = [
                "CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE",
                "CREATE INDEX entity_name IF NOT EXISTS FOR (e:Entity) ON (e.name)",
                "CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type)",
            ]

            for constraint in constraints:
                try:
                    await session.run(constraint)
                except:
                    pass  # Constraint might already exist

    async def add_entity(self, entity: Entity, source_doc_id: str = None):
        """Add entity to Neo4j graph."""
        async with self.driver.session(database=self.database) as session:
            # Determine label based on type
            label_map = {
                "person": "Person",
                "organization": "Organization",
                "location": "Location",
                "event": "Event",
                "document": "Document",
                "concept": "Concept"
            }
            label = label_map.get(entity.type.lower(), "Entity")

            # Prepare properties
            props = {
                "id": entity.id,
                "type": entity.type,
                "name": entity.name,
                "description": entity.description,
                "confidence_score": entity.confidence_score,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }

            # Add custom properties
            props.update(entity.properties)

            # Add source document if provided
            if source_doc_id:
                props["source_document"] = source_doc_id

            # Merge entity (create if not exists, update if exists)
            query = f"""
            MERGE (e:{label}:Entity {{id: $id}})
            ON CREATE SET e = $props
            ON MATCH SET e += $props, e.updated_at = $updated_at
            RETURN e.id as id
            """

            result = await session.run(
                query,
                id=entity.id,
                props=props,
                updated_at=datetime.utcnow().isoformat()
            )
            record = await result.single()

            # Cache entity
            self.entity_cache[entity.name] = entity.id

            return record["id"] if record else None

    async def add_relationship(self, relationship: Relationship):
        """Add relationship to Neo4j graph."""
        async with self.driver.session(database=self.database) as session:
            # Get entity IDs from cache
            source_id = self.entity_cache.get(relationship.source_entity_name)
            target_id = self.entity_cache.get(relationship.target_entity_name)

            if not source_id or not target_id:
                print(f"⚠️  Skipping relationship {relationship.relationship_type}: "
                      f"entities not found in cache")
                return

            # Prepare relationship properties
            props = {
                "weight": 1.0,
                "confidence_score": relationship.confidence_score,
                "created_at": datetime.utcnow().isoformat(),
            }
            props.update(relationship.properties)

            # Create relationship
            rel_type = relationship.relationship_type.upper()
            query = f"""
            MATCH (source:Entity {{id: $source_id}})
            MATCH (target:Entity {{id: $target_id}})
            MERGE (source)-[r:{rel_type}]->(target)
            ON CREATE SET r = $props
            ON MATCH SET r += $props
            """

            await session.run(
                query,
                source_id=source_id,
                target_id=target_id,
                props=props
            )

    async def get_statistics(self):
        """Get graph statistics."""
        async with self.driver.session(database=self.database) as session:
            # Count nodes
            result = await session.run("""
                MATCH (n:Entity)
                RETURN labels(n)[1] as type, count(n) as count
                ORDER BY type
            """)

            nodes = {}
            async for record in result:
                node_type = record["type"] if record["type"] else "Unknown"
                nodes[node_type] = record["count"]

            # Count relationships
            result = await session.run("""
                MATCH ()-[r]->()
                RETURN type(r) as type, count(r) as count
                ORDER BY type
            """)

            relationships = {}
            async for record in result:
                relationships[record["type"]] = record["count"]

            return {"nodes": nodes, "relationships": relationships}

    async def close(self):
        """Close Neo4j connection."""
        await self.driver.close()


# ============================================
# MAIN PIPELINE
# ============================================

class R2RKnowledgeGraphPipeline:
    """Complete pipeline for extracting knowledge graph from R2R."""

    def __init__(self, config: Config):
        self.config = config
        self.r2r_client = R2RClient(config.R2R_BASE_URL, config.R2R_API_KEY)
        self.extractor = AnthropicKnowledgeExtractor(
            config.ANTHROPIC_API_KEY,
            config.CLAUDE_MODEL
        )
        self.graph_populator = Neo4jGraphPopulator(
            config.NEO4J_URI,
            config.NEO4J_USER,
            config.NEO4J_PASSWORD,
            config.NEO4J_DATABASE
        )

    async def process_document(self, document: Dict) -> Dict[str, int]:
        """Process a single R2R document."""
        doc_id = document.get("id")
        doc_name = document.get("metadata", {}).get("title", "Unknown Document")

        print(f"\n📄 Processing document: {doc_name} (ID: {doc_id})")

        # Get document chunks
        chunks = await self.r2r_client.get_document_chunks(doc_id)

        if not chunks:
            print(f"   ⚠️  No chunks found for document {doc_id}")
            return {"entities": 0, "relationships": 0}

        print(f"   Found {len(chunks)} chunks")

        total_entities = 0
        total_relationships = 0

        # Process each chunk
        for i, chunk in enumerate(chunks):
            chunk_text = chunk.get("text", "")

            if not chunk_text or len(chunk_text) < 50:
                continue

            # Truncate if too long
            if len(chunk_text) > self.config.MAX_CHUNK_LENGTH:
                chunk_text = chunk_text[:self.config.MAX_CHUNK_LENGTH]

            print(f"   Processing chunk {i + 1}/{len(chunks)}...", end='\r')

            # Extract knowledge
            result = await self.extractor.extract_knowledge(chunk_text)

            # Add entities to graph
            for entity in result.entities:
                await self.graph_populator.add_entity(entity, source_doc_id=doc_id)
                total_entities += 1

            # Add relationships to graph
            for relationship in result.relationships:
                await self.graph_populator.add_relationship(relationship)
                total_relationships += 1

        print(f"   ✅ Extracted {total_entities} entities and {total_relationships} relationships")

        return {"entities": total_entities, "relationships": total_relationships}

    async def run(self, max_documents: int = None):
        """Run the complete pipeline."""
        print("=" * 60)
        print("🚀 R2R Knowledge Graph Extraction Pipeline")
        print("=" * 60)
        print(f"📚 R2R: {self.config.R2R_BASE_URL}")
        print(f"🤖 Claude Model: {self.config.CLAUDE_MODEL}")
        print(f"💾 Neo4j: {self.config.NEO4J_URI}")
        print("=" * 60)

        try:
            # Initialize Neo4j
            print("\n🔧 Initializing Neo4j...")
            await self.graph_populator.initialize()
            print("✅ Neo4j initialized")

            # Fetch documents from R2R
            print(f"\n📥 Fetching documents from R2R...")
            documents = await self.r2r_client.get_documents(limit=max_documents or 100)

            if not documents:
                print("❌ No documents found in R2R")
                return

            print(f"✅ Found {len(documents)} documents")

            # Process documents
            total_stats = {"entities": 0, "relationships": 0}

            for doc in documents:
                stats = await self.process_document(doc)
                total_stats["entities"] += stats["entities"]
                total_stats["relationships"] += stats["relationships"]

                # Small delay to avoid rate limiting
                await asyncio.sleep(0.5)

            # Final statistics
            print("\n" + "=" * 60)
            print("📊 Extraction Complete!")
            print("=" * 60)
            print(f"📄 Documents processed: {len(documents)}")
            print(f"🔵 Total entities extracted: {total_stats['entities']}")
            print(f"🔗 Total relationships extracted: {total_stats['relationships']}")

            # Get graph statistics
            graph_stats = await self.graph_populator.get_statistics()

            print("\n💾 Graph Statistics:")
            print("   Nodes:")
            for node_type, count in graph_stats["nodes"].items():
                print(f"      {node_type}: {count}")

            print("   Relationships:")
            for rel_type, count in graph_stats["relationships"].items():
                print(f"      {rel_type}: {count}")

            print("\n✨ Knowledge graph ready!")

        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()

        finally:
            # Cleanup
            await self.r2r_client.close()
            await self.graph_populator.close()


# ============================================
# ENTRY POINT
# ============================================

async def main():
    """Main entry point."""
    config = Config()

    # Validate configuration
    if config.ANTHROPIC_API_KEY == "your_anthropic_key_here":
        print("❌ Please set ANTHROPIC_API_KEY in environment or config")
        return

    # Create and run pipeline
    pipeline = R2RKnowledgeGraphPipeline(config)
    await pipeline.run(max_documents=10)  # Process first 10 documents


if __name__ == "__main__":
    asyncio.run(main())
