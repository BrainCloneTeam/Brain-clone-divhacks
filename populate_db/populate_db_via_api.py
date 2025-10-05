"""
Standalone script to populate GraphAura database via API endpoints.
This uses the FastAPI endpoints to create entities and relationships,
which will automatically populate both Neo4j and PostgreSQL.

Usage:
    python populate_db_via_api.py
"""

import asyncio
import httpx
from datetime import datetime
from data import locations_data, people_data, docs_data, events_data, orgs_data, relationships

# Configuration - Update these with your API details
API_BASE_URL = "http://localhost:8000/api/v1"  # Adjust to your API URL
API_TIMEOUT = 30.0


async def populate_via_api():
    """Populate the database using API endpoints."""

    async with httpx.AsyncClient(timeout=API_TIMEOUT) as client:

        # Test API connectivity
        try:
            response = await client.get(f"{API_BASE_URL}/health")
            print("✅ Connected to API")
        except Exception as e:
            print(f"❌ Failed to connect to API: {e}")
            return

        # Entity IDs storage
        entity_ids = {}

        print("\n👥 Creating People...")
        for person in people_data:
            try:
                entity_data = {
                    "type": "person",
                    "name": person["name"],
                    "properties": {k: v for k, v in person.items() if k not in ["name", "id"]},
                    "confidence_score": person.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/entities",
                    json=entity_data
                )
                response.raise_for_status()
                result = response.json()
                entity_ids[person["name"]] = result["entity_id"]
                print(f"  ✓ {person['name']} (ID: {result['entity_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create {person['name']}: {e}")

        print("\n🏢 Creating Organizations...")
        for org in orgs_data:
            try:
                entity_data = {
                    "type": "organization",
                    "name": org["name"],
                    "properties": {k: v for k, v in org.items() if k not in ["name", "id"]},
                    "confidence_score": org.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/entities",
                    json=entity_data
                )
                response.raise_for_status()
                result = response.json()
                entity_ids[org["name"]] = result["entity_id"]
                print(f"  ✓ {org['name']} (ID: {result['entity_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create {org['name']}: {e}")

        print("\n📍 Creating Locations...")
        for location in locations_data:
            try:
                entity_data = {
                    "type": "location",
                    "name": location["name"],
                    "properties": {k: v for k, v in location.items() if k not in ["name", "id"]},
                    "confidence_score": location.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/entities",
                    json=entity_data
                )
                response.raise_for_status()
                result = response.json()
                entity_ids[location["name"]] = result["entity_id"]
                print(f"  ✓ {location['name']} (ID: {result['entity_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create {location['name']}: {e}")

        print("\n📅 Creating Events...")
        for event in events_data:
            try:
                entity_data = {
                    "type": "event",
                    "name": event["name"],
                    "properties": {k: v for k, v in event.items() if k not in ["name", "id"]},
                    "confidence_score": event.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/entities",
                    json=entity_data
                )
                response.raise_for_status()
                result = response.json()
                entity_ids[event["name"]] = result["entity_id"]
                print(f"  ✓ {event['name']} (ID: {result['entity_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create {event['name']}: {e}")

        print("\n📄 Creating Documents...")
        for doc in docs_data:
            try:
                entity_data = {
                    "type": "document",
                    "name": doc["name"],
                    "properties": {k: v for k, v in doc.items() if k not in ["name", "id"]},
                    "confidence_score": doc.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/entities",
                    json=entity_data
                )
                response.raise_for_status()
                result = response.json()
                entity_ids[doc["name"]] = result["entity_id"]
                print(f"  ✓ {doc['name']} (ID: {result['entity_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create {doc['name']}: {e}")

        print("\n🔗 Creating Relationships...")
        for source_name, target_name, rel_type, props in relationships:
            try:
                if source_name not in entity_ids or target_name not in entity_ids:
                    print(f"  ✗ Skipping {source_name} -{rel_type}-> {target_name}: Entity not found")
                    continue

                relationship_data = {
                    "source_id": entity_ids[source_name],
                    "target_id": entity_ids[target_name],
                    "type": rel_type.lower(),
                    "properties": props,
                    "weight": props.get("weight", 1.0),
                    "confidence_score": props.get("confidence_score", 0.95)
                }

                response = await client.post(
                    f"{API_BASE_URL}/graph/relationships",
                    json=relationship_data
                )
                response.raise_for_status()
                result = response.json()
                print(f"  ✓ {source_name} -{rel_type}-> {target_name} (ID: {result['relationship_id']})")
            except Exception as e:
                print(f"  ✗ Failed to create relationship {source_name} -{rel_type}-> {target_name}: {e}")

        # Get statistics
        print("\n📊 Database Statistics:")
        try:
            # Search for all entities to get counts by type
            entity_types = ["person", "organization", "location", "event", "document"]

            for entity_type in entity_types:
                response = await client.post(
                    f"{API_BASE_URL}/graph/search/entities",
                    json={"type": entity_type},
                    params={"limit": 1000}
                )
                if response.status_code == 200:
                    result = response.json()
                    print(f"  {entity_type.capitalize()}: {result['count']} nodes")

            print("\n  Total entities created: ", len(entity_ids))
            print(
                f"  Total relationships created: {len([r for r in relationships if r[0] in entity_ids and r[1] in entity_ids])}")

        except Exception as e:
            print(f"  ✗ Could not fetch statistics: {e}")

        print("\n✨ Database populated successfully via API!")


if __name__ == "__main__":
    asyncio.run(populate_via_api())
