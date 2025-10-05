"""
Standalone script to quickly populate GraphAura Neo4j database.
This can be run independently or integrated into your application.

Usage:
    python populate_db.py
"""

import asyncio
from neo4j import AsyncGraphDatabase
from datetime import datetime
from data import locations_data, people_data, docs_data, events_data, orgs_data, relationships

# Configuration - Update these with your Neo4j credentials
NEO4J_URI = "neo4j+s://5df056dc.databases.neo4j.io"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "Q_yYWRfoFx2IBXhz51c3z4IXnJyaiHhnOdje71loHNc"
NEO4J_DATABASE = "neo4j"


async def populate_database():
    """Populate the database with synthetic data."""

    driver = AsyncGraphDatabase.driver(
        NEO4J_URI,
        auth=(NEO4J_USER, NEO4J_PASSWORD)
    )

    try:
        await driver.verify_connectivity()
        print("✅ Connected to Neo4j")

        async with driver.session(database=NEO4J_DATABASE) as session:

            # Clear existing data (optional - comment out if you want to keep existing data)
            print("\n🗑️  Clearing existing data...")
            await session.run("MATCH (n) DETACH DELETE n")
            print("✅ Database cleared")

            # Entity IDs storage
            entity_ids = {}

            print("\n👥 Creating People...")

            for person in people_data:
                await session.run(
                    "CREATE (p:Person:Entity $props)",
                    props=person
                )
                entity_ids[person["name"]] = person["id"]
                print(f"  ✓ {person['name']}")

            print("\n🏢 Creating Organizations...")

            for org in orgs_data:
                await session.run(
                    "CREATE (o:Organization:Entity $props)",
                    props=org
                )
                entity_ids[org["name"]] = org["id"]
                print(f"  ✓ {org['name']}")

            print("\n📍 Creating Locations...")

            for location in locations_data:
                await session.run(
                    "CREATE (l:Location:Entity $props)",
                    props=location
                )
                entity_ids[location["name"]] = location["id"]
                print(f"  ✓ {location['name']}")

            print("\n📅 Creating Events...")

            for event in events_data:
                await session.run(
                    "CREATE (e:Event:Entity $props)",
                    props=event
                )
                entity_ids[event["name"]] = event["id"]
                print(f"  ✓ {event['name']}")

            print("\n📄 Creating Documents...")

            for doc in docs_data:
                await session.run(
                    "CREATE (d:Document:Entity $props)",
                    props=doc
                )
                entity_ids[doc["name"]] = doc["id"]
                print(f"  ✓ {doc['name']}")

            print("\n🔗 Creating Relationships...")

            # WORKS_FOR relationships


            for source_name, target_name, rel_type, props in relationships:
                props["created_at"] = datetime.utcnow().isoformat()
                props["weight"] = props.get("weight", 1.0)
                props["confidence_score"] = props.get("confidence_score", 0.95)

                await session.run(f"""
                    MATCH (source:Entity {{id: $source_id}})
                    MATCH (target:Entity {{id: $target_id}})
                    CREATE (source)-[r:{rel_type} $props]->(target)
                """,
                                  source_id=entity_ids[source_name],
                                  target_id=entity_ids[target_name],
                                  props=props
                                  )
                print(f"  ✓ {source_name} -{rel_type}-> {target_name}")

            # Verify results
            print("\n📊 Database Statistics:")

            result = await session.run("""
                MATCH (n)
                RETURN labels(n)[0] as type, count(n) as count
                ORDER BY type
            """)
            async for record in result:
                print(f"  {record['type']}: {record['count']} nodes")

            result = await session.run("""
                MATCH ()-[r]->()
                RETURN type(r) as type, count(r) as count
                ORDER BY type
            """)
            print("\n  Relationships:")
            async for record in result:
                print(f"  {record['type']}: {record['count']}")

            print("\n✨ Database populated successfully!")

    finally:
        await driver.close()


if __name__ == "__main__":
    asyncio.run(populate_database())
