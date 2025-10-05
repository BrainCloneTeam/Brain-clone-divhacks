import uuid
from datetime import datetime

docs_data = [
    # Existing documents
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Product Requirements Document",
        "document_type": "Requirements",
        "file_path": "/docs/prd/analytics_platform_v2.3.pdf",
        "publication_date": "2024-06-01T00:00:00Z",
        "page_count": 45,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Technical Architecture Specification",
        "document_type": "Technical Specification",
        "file_path": "/docs/specs/tech_arch_v1.5.md",
        "publication_date": "2024-07-15T00:00:00Z",
        "page_count": 30,
        "created_at": datetime.utcnow().isoformat()
    },
    # New documents
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Q3 2024 Financial Report",
        "document_type": "Financial Report",
        "file_path": "/docs/finance/q3_2024_report.pdf",
        "publication_date": "2024-10-01T00:00:00Z",
        "page_count": 68,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Employee Handbook 2024",
        "document_type": "Policy Document",
        "file_path": "/docs/hr/employee_handbook_2024.pdf",
        "publication_date": "2024-01-01T00:00:00Z",
        "page_count": 120,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Security Best Practices Guide",
        "document_type": "Technical Guide",
        "file_path": "/docs/security/best_practices_v3.0.md",
        "publication_date": "2024-08-20T00:00:00Z",
        "page_count": 55,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Marketing Strategy Q4 2024",
        "document_type": "Strategy Document",
        "file_path": "/docs/marketing/q4_strategy.pdf",
        "publication_date": "2024-09-01T00:00:00Z",
        "page_count": 42,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "AI Ethics Framework",
        "document_type": "Policy Document",
        "file_path": "/docs/research/ai_ethics_framework.pdf",
        "publication_date": "2024-07-01T00:00:00Z",
        "page_count": 35,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "API Documentation v4.2",
        "document_type": "Technical Documentation",
        "file_path": "/docs/api/api_docs_v4.2.html",
        "publication_date": "2024-09-15T00:00:00Z",
        "page_count": 150,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "User Research Report - Q2 2024",
        "document_type": "Research Report",
        "file_path": "/docs/research/user_research_q2_2024.pdf",
        "publication_date": "2024-07-10T00:00:00Z",
        "page_count": 78,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "document",
        "name": "Partnership Agreement - Innovate.io",
        "document_type": "Legal Document",
        "file_path": "/docs/legal/partnership_innovate_io.pdf",
        "publication_date": "2024-05-15T00:00:00Z",
        "page_count": 28,
        "created_at": datetime.utcnow().isoformat()
    }
]
events_data = [
    # Existing events
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Q3 2024 Product Launch",
        "event_type": "Product Launch",
        "start_date": "2024-09-15T10:00:00Z",
        "end_date": "2024-09-15T14:00:00Z",
        "status": "completed",
        "attendance": 250,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "AI Tech Summit 2024",
        "event_type": "Conference",
        "start_date": "2024-11-20T09:00:00Z",
        "end_date": "2024-11-22T17:00:00Z",
        "status": "planned",
        "attendance": 5000,
        "created_at": datetime.utcnow().isoformat()
    },
    # New events
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Annual Developer Conference 2024",
        "event_type": "Conference",
        "start_date": "2024-10-05T09:00:00Z",
        "end_date": "2024-10-07T18:00:00Z",
        "status": "ongoing",
        "attendance": 3500,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "TechCorp Team Building Retreat",
        "event_type": "Team Building",
        "start_date": "2024-08-10T08:00:00Z",
        "end_date": "2024-08-12T17:00:00Z",
        "status": "completed",
        "attendance": 150,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Cybersecurity Workshop Series",
        "event_type": "Workshop",
        "start_date": "2024-09-20T13:00:00Z",
        "end_date": "2024-09-20T17:00:00Z",
        "status": "completed",
        "attendance": 85,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Q4 2024 Investor Meeting",
        "event_type": "Business Meeting",
        "start_date": "2024-12-05T14:00:00Z",
        "end_date": "2024-12-05T16:00:00Z",
        "status": "planned",
        "attendance": 30,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Women in Tech Networking Event",
        "event_type": "Networking",
        "start_date": "2024-09-28T18:00:00Z",
        "end_date": "2024-09-28T21:00:00Z",
        "status": "completed",
        "attendance": 200,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Startup Pitch Competition",
        "event_type": "Competition",
        "start_date": "2024-10-15T10:00:00Z",
        "end_date": "2024-10-15T16:00:00Z",
        "status": "planned",
        "attendance": 500,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Healthcare Innovation Symposium",
        "event_type": "Symposium",
        "start_date": "2024-11-08T09:00:00Z",
        "end_date": "2024-11-09T17:00:00Z",
        "status": "planned",
        "attendance": 800,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Machine Learning Bootcamp",
        "event_type": "Training",
        "start_date": "2024-10-20T09:00:00Z",
        "end_date": "2024-10-24T17:00:00Z",
        "status": "planned",
        "attendance": 50,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "event",
        "name": "Open Source Contributors Meetup",
        "event_type": "Meetup",
        "start_date": "2024-09-30T17:00:00Z",
        "end_date": "2024-09-30T20:00:00Z",
        "status": "completed",
        "attendance": 120,
        "created_at": datetime.utcnow().isoformat()
    }
]
locations_data = [
    # Existing locations
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "TechCorp HQ Building",
        "address": "123 Market Street",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "location_type": "Office",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "Moscone Convention Center",
        "address": "747 Howard Street",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "location_type": "Conference Center",
        "latitude": 37.7842,
        "longitude": -122.4016,
        "created_at": datetime.utcnow().isoformat()
    },
    # New locations
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "Innovate.io Office",
        "address": "456 Valencia Street",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "location_type": "Office",
        "latitude": 37.7625,
        "longitude": -122.4216,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "TechCorp Austin Campus",
        "address": "789 Congress Avenue",
        "city": "Austin",
        "state": "Texas",
        "country": "United States",
        "location_type": "Office",
        "latitude": 30.2672,
        "longitude": -97.7431,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "DataFlow Analytics HQ",
        "address": "1500 Broadway",
        "city": "New York",
        "state": "New York",
        "country": "United States",
        "location_type": "Office",
        "latitude": 40.7580,
        "longitude": -73.9855,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "CloudSecure Seattle Office",
        "address": "2001 8th Avenue",
        "city": "Seattle",
        "state": "Washington",
        "country": "United States",
        "location_type": "Office",
        "latitude": 47.6062,
        "longitude": -122.3321,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "Tech Innovation Hub",
        "address": "301 Howard Street",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "location_type": "Co-working Space",
        "latitude": 37.7897,
        "longitude": -122.3972,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "Boston Conference Hall",
        "address": "415 Summer Street",
        "city": "Boston",
        "state": "Massachusetts",
        "country": "United States",
        "location_type": "Conference Center",
        "latitude": 42.3488,
        "longitude": -71.0418,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "AI Solutions Lab Facility",
        "address": "3600 Cambridge Street",
        "city": "Palo Alto",
        "state": "California",
        "country": "United States",
        "location_type": "Research Facility",
        "latitude": 37.4419,
        "longitude": -122.1430,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "location",
        "name": "MediTech Solutions Campus",
        "address": "9500 Euclid Avenue",
        "city": "Cleveland",
        "state": "Ohio",
        "country": "United States",
        "location_type": "Office",
        "latitude": 41.5034,
        "longitude": -81.6098,
        "created_at": datetime.utcnow().isoformat()
    }
]
orgs_data = [
    # Existing organizations
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "TechCorp Industries",
        "industry": "Technology",
        "organization_type": "Private Corporation",
        "founded_date": "2015-01-15T00:00:00Z",
        "employee_count": 750,
        "website": "https://techcorp.com",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "Innovate.io",
        "industry": "Software",
        "organization_type": "Startup",
        "founded_date": "2019-03-20T00:00:00Z",
        "employee_count": 75,
        "website": "https://innovate.io",
        "created_at": datetime.utcnow().isoformat()
    },
    # New organizations
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "DataFlow Analytics",
        "industry": "Data Analytics",
        "organization_type": "Private Corporation",
        "founded_date": "2017-06-10T00:00:00Z",
        "employee_count": 320,
        "website": "https://dataflow-analytics.com",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "CloudSecure Systems",
        "industry": "Cybersecurity",
        "organization_type": "Public Corporation",
        "founded_date": "2012-09-05T00:00:00Z",
        "employee_count": 1200,
        "website": "https://cloudsecure.com",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "GreenTech Ventures",
        "industry": "Clean Technology",
        "organization_type": "Venture Capital",
        "founded_date": "2018-02-14T00:00:00Z",
        "employee_count": 25,
        "website": "https://greentech-vc.com",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "AI Solutions Lab",
        "industry": "Artificial Intelligence",
        "organization_type": "Research Institute",
        "founded_date": "2020-11-01T00:00:00Z",
        "employee_count": 150,
        "website": "https://aisolutionslab.org",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "QuantumLeap Computing",
        "industry": "Quantum Computing",
        "organization_type": "Startup",
        "founded_date": "2021-04-12T00:00:00Z",
        "employee_count": 45,
        "website": "https://quantumleap.tech",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "organization",
        "name": "MediTech Solutions",
        "industry": "Healthcare Technology",
        "organization_type": "Private Corporation",
        "founded_date": "2016-08-20T00:00:00Z",
        "employee_count": 580,
        "website": "https://meditech-solutions.com",
        "created_at": datetime.utcnow().isoformat()
    }
]
people_data = [
    # Existing people
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Dr. Sarah Chen",
        "email": "sarah.chen@techcorp.com",
        "occupation": "Chief Technology Officer",
        "birth_date": "1985-03-15T00:00:00Z",
        "nationality": "American",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Michael Rodriguez",
        "email": "m.rodriguez@techcorp.com",
        "occupation": "Senior Software Engineer",
        "birth_date": "1990-07-22T00:00:00Z",
        "nationality": "Mexican-American",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Emily Watson",
        "email": "emily.watson@techcorp.com",
        "occupation": "Product Manager",
        "birth_date": "1988-11-05T00:00:00Z",
        "nationality": "British",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Dr. David Kim",
        "email": "david.kim@techcorp.com",
        "occupation": "Data Scientist",
        "birth_date": "1987-04-18T00:00:00Z",
        "nationality": "Korean-American",
        "created_at": datetime.utcnow().isoformat()
    },
    # New people
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Jennifer Thompson",
        "email": "j.thompson@techcorp.com",
        "occupation": "VP of Engineering",
        "birth_date": "1983-09-12T00:00:00Z",
        "nationality": "Canadian",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Raj Patel",
        "email": "raj.patel@techcorp.com",
        "occupation": "DevOps Engineer",
        "birth_date": "1992-02-28T00:00:00Z",
        "nationality": "Indian",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Lisa Anderson",
        "email": "lisa.anderson@techcorp.com",
        "occupation": "UX Designer",
        "birth_date": "1991-06-14T00:00:00Z",
        "nationality": "American",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Carlos Mendes",
        "email": "carlos.mendes@innovate.io",
        "occupation": "CEO",
        "birth_date": "1980-11-30T00:00:00Z",
        "nationality": "Brazilian",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Aisha Mohammed",
        "email": "aisha.mohammed@techcorp.com",
        "occupation": "Security Engineer",
        "birth_date": "1989-08-05T00:00:00Z",
        "nationality": "Egyptian",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Thomas Mueller",
        "email": "t.mueller@innovate.io",
        "occupation": "CTO",
        "birth_date": "1986-04-22T00:00:00Z",
        "nationality": "German",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Maria Garcia",
        "email": "maria.garcia@techcorp.com",
        "occupation": "Marketing Director",
        "birth_date": "1984-12-10T00:00:00Z",
        "nationality": "Spanish",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "James O'Brien",
        "email": "james.obrien@techcorp.com",
        "occupation": "Financial Controller",
        "birth_date": "1982-03-25T00:00:00Z",
        "nationality": "Irish",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Dr. Yuki Tanaka",
        "email": "yuki.tanaka@innovate.io",
        "occupation": "AI Research Scientist",
        "birth_date": "1988-07-08T00:00:00Z",
        "nationality": "Japanese",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Sophie Laurent",
        "email": "sophie.laurent@techcorp.com",
        "occupation": "HR Manager",
        "birth_date": "1987-01-19T00:00:00Z",
        "nationality": "French",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "type": "person",
        "name": "Kevin Zhang",
        "email": "kevin.zhang@techcorp.com",
        "occupation": "Backend Developer",
        "birth_date": "1993-05-03T00:00:00Z",
        "nationality": "Chinese-American",
        "created_at": datetime.utcnow().isoformat()
    }
]
relationships = [
                # Existing relationships
                ("Dr. Sarah Chen", "TechCorp Industries", "WORKS_FOR",
                 {"title": "Chief Technology Officer", "start_date": "2020-01-15T00:00:00Z"}),
                ("Michael Rodriguez", "TechCorp Industries", "WORKS_FOR",
                 {"title": "Senior Software Engineer", "start_date": "2021-03-01T00:00:00Z"}),
                ("Emily Watson", "TechCorp Industries", "WORKS_FOR",
                 {"title": "Product Manager", "start_date": "2021-06-15T00:00:00Z"}),
                ("Dr. David Kim", "TechCorp Industries", "WORKS_FOR",
                 {"title": "Data Scientist", "start_date": "2022-01-10T00:00:00Z"}),

                ("Dr. Sarah Chen", "Michael Rodriguez", "MANAGES",
                 {"start_date": "2021-03-01T00:00:00Z"}),
                ("Dr. Sarah Chen", "Emily Watson", "MANAGES",
                 {"start_date": "2021-06-15T00:00:00Z"}),

                ("Michael Rodriguez", "Dr. David Kim", "COLLABORATES_WITH",
                 {"project": "Analytics Platform", "start_date": "2024-01-15T00:00:00Z"}),
                ("Emily Watson", "Dr. David Kim", "COLLABORATES_WITH",
                 {"project": "Analytics Platform", "start_date": "2024-01-15T00:00:00Z"}),

                ("Dr. Sarah Chen", "Michael Rodriguez", "MENTOR_OF",
                 {"focus_area": "Technical Leadership", "start_date": "2022-01-01T00:00:00Z"}),

                ("TechCorp Industries", "TechCorp HQ Building", "LOCATED_IN",
                 {"primary": True}),

                ("Dr. Sarah Chen", "Q3 2024 Product Launch", "ATTENDED",
                 {"role": "Keynote Speaker"}),
                ("Emily Watson", "Q3 2024 Product Launch", "ATTENDED",
                 {"role": "Organizer"}),

                ("Moscone Convention Center", "AI Tech Summit 2024", "HOSTED",
                 {"capacity_used": 5000}),

                ("TechCorp Industries", "Q3 2024 Product Launch", "ORGANIZED",
                 {"role": "Host"}),

                ("Emily Watson", "Product Requirements Document", "AUTHORED",
                 {"role": "Primary Author", "date": "2024-06-01T00:00:00Z"}),
                ("Dr. Sarah Chen", "Technical Architecture Specification", "AUTHORED",
                 {"role": "Technical Lead", "date": "2024-07-15T00:00:00Z"}),

                # New WORKS_FOR relationships
                ("Jennifer Thompson", "Dr. Sarah Chen", "MANAGES",
                 {"start_date": "2020-01-15T00:00:00Z"}),
                ("Jennifer Thompson", "Raj Patel", "MANAGES",
                 {"start_date": "2022-08-15T00:00:00Z"}),
                ("Jennifer Thompson", "Aisha Mohammed", "MANAGES",
                 {"start_date": "2021-11-10T00:00:00Z"}),
                ("Emily Watson", "Lisa Anderson", "MANAGES",
                 {"start_date": "2023-02-01T00:00:00Z"}),
                ("Carlos Mendes", "Thomas Mueller", "MANAGES",
                 {"start_date": "2019-04-01T00:00:00Z"}),
                ("Thomas Mueller", "Dr. Yuki Tanaka", "MANAGES",
                 {"start_date": "2020-06-15T00:00:00Z"}),

                # New COLLABORATES_WITH relationships
                ("Michael Rodriguez", "Kevin Zhang", "COLLABORATES_WITH",
                 {"project": "Backend Infrastructure", "start_date": "2023-06-15T00:00:00Z"}),
                ("Lisa Anderson", "Emily Watson", "COLLABORATES_WITH",
                 {"project": "UX Redesign Initiative", "start_date": "2024-03-01T00:00:00Z"}),
                ("Raj Patel", "Aisha Mohammed", "COLLABORATES_WITH",
                 {"project": "Security Automation", "start_date": "2024-02-10T00:00:00Z"}),
                ("Dr. David Kim", "Dr. Yuki Tanaka", "COLLABORATES_WITH",
                 {"project": "AI Research Partnership", "start_date": "2024-05-01T00:00:00Z"}),
                ("Jennifer Thompson", "Carlos Mendes", "COLLABORATES_WITH",
                 {"project": "Strategic Partnership", "start_date": "2024-01-20T00:00:00Z"}),

                # New MENTOR_OF relationships
                ("Jennifer Thompson", "Dr. Sarah Chen", "MENTOR_OF",
                 {"focus_area": "Executive Leadership", "start_date": "2020-06-01T00:00:00Z"}),
                ("Emily Watson", "Lisa Anderson", "MENTOR_OF",
                 {"focus_area": "Product Design", "start_date": "2023-03-15T00:00:00Z"}),
                ("Dr. David Kim", "Kevin Zhang", "MENTOR_OF",
                 {"focus_area": "Data Engineering", "start_date": "2023-07-01T00:00:00Z"}),
                ("Thomas Mueller", "Dr. Yuki Tanaka", "MENTOR_OF",
                 {"focus_area": "AI Research", "start_date": "2020-08-01T00:00:00Z"}),

                # New LOCATED_IN relationships
                ("Innovate.io", "Innovate.io Office", "LOCATED_IN",
                 {"primary": True}),
                ("TechCorp Industries", "TechCorp Austin Campus", "LOCATED_IN",
                 {"primary": False}),
                ("DataFlow Analytics", "DataFlow Analytics HQ", "LOCATED_IN",
                 {"primary": True}),
                ("CloudSecure Systems", "CloudSecure Seattle Office", "LOCATED_IN",
                 {"primary": True}),
                ("AI Solutions Lab", "AI Solutions Lab Facility", "LOCATED_IN",
                 {"primary": True}),
                ("MediTech Solutions", "MediTech Solutions Campus", "LOCATED_IN",
                 {"primary": True}),

                # New ATTENDED relationships
                ("Michael Rodriguez", "Q3 2024 Product Launch", "ATTENDED",
                 {"role": "Technical Presenter"}),
                ("Dr. David Kim", "Q3 2024 Product Launch", "ATTENDED",
                 {"role": "Demo Presenter"}),
                ("Jennifer Thompson", "AI Tech Summit 2024", "ATTENDED",
                 {"role": "Panel Speaker"}),
                ("Dr. Sarah Chen", "AI Tech Summit 2024", "ATTENDED",
                 {"role": "Keynote Speaker"}),
                ("Thomas Mueller", "AI Tech Summit 2024", "ATTENDED",
                 {"role": "Workshop Leader"}),
                ("Dr. Yuki Tanaka", "AI Tech Summit 2024", "ATTENDED",
                 {"role": "Researcher Presenter"}),
                ("Lisa Anderson", "Annual Developer Conference 2024", "ATTENDED",
                 {"role": "UX Track Speaker"}),
                ("Raj Patel", "Annual Developer Conference 2024", "ATTENDED",
                 {"role": "DevOps Workshop Leader"}),
                ("Aisha Mohammed", "Cybersecurity Workshop Series", "ATTENDED",
                 {"role": "Lead Instructor"}),
                ("Maria Garcia", "Women in Tech Networking Event", "ATTENDED",
                 {"role": "Organizer"}),
                ("Emily Watson", "Women in Tech Networking Event", "ATTENDED",
                 {"role": "Speaker"}),
                ("Carlos Mendes", "Startup Pitch Competition", "ATTENDED",
                 {"role": "Judge"}),
                ("Dr. David Kim", "Machine Learning Bootcamp", "ATTENDED",
                 {"role": "Instructor"}),
                ("Kevin Zhang", "Open Source Contributors Meetup", "ATTENDED",
                 {"role": "Contributor"}),
                ("Michael Rodriguez", "Open Source Contributors Meetup", "ATTENDED",
                 {"role": "Presenter"}),

                # New HOSTED relationships
                ("TechCorp HQ Building", "Q3 2024 Product Launch", "HOSTED",
                 {"capacity_used": 250}),
                ("Boston Conference Hall", "Annual Developer Conference 2024", "HOSTED",
                 {"capacity_used": 3500}),
                ("Tech Innovation Hub", "Cybersecurity Workshop Series", "HOSTED",
                 {"capacity_used": 85}),
                ("Innovate.io Office", "Startup Pitch Competition", "HOSTED",
                 {"capacity_used": 500}),
                ("Tech Innovation Hub", "Women in Tech Networking Event", "HOSTED",
                 {"capacity_used": 200}),
                ("MediTech Solutions Campus", "Healthcare Innovation Symposium", "HOSTED",
                 {"capacity_used": 800}),
                ("AI Solutions Lab Facility", "Machine Learning Bootcamp", "HOSTED",
                 {"capacity_used": 50}),
                ("Tech Innovation Hub", "Open Source Contributors Meetup", "HOSTED",
                 {"capacity_used": 120}),

                # New ORGANIZED relationships
                ("TechCorp Industries", "Annual Developer Conference 2024", "ORGANIZED",
                 {"role": "Co-organizer"}),
                ("CloudSecure Systems", "Cybersecurity Workshop Series", "ORGANIZED",
                 {"role": "Host"}),
                ("TechCorp Industries", "Women in Tech Networking Event", "ORGANIZED",
                 {"role": "Sponsor"}),
                ("GreenTech Ventures", "Startup Pitch Competition", "ORGANIZED",
                 {"role": "Host"}),
                ("MediTech Solutions", "Healthcare Innovation Symposium", "ORGANIZED",
                 {"role": "Host"}),
                ("AI Solutions Lab", "Machine Learning Bootcamp", "ORGANIZED",
                 {"role": "Host"}),
                ("TechCorp Industries", "TechCorp Team Building Retreat", "ORGANIZED",
                 {"role": "Host"}),

                # New AUTHORED relationships
                ("Michael Rodriguez", "Technical Architecture Specification", "AUTHORED",
                 {"role": "Contributing Engineer", "date": "2024-07-15T00:00:00Z"}),
                ("James O'Brien", "Q3 2024 Financial Report", "AUTHORED",
                 {"role": "Primary Author", "date": "2024-10-01T00:00:00Z"}),
                ("Sophie Laurent", "Employee Handbook 2024", "AUTHORED",
                 {"role": "Editor", "date": "2024-01-01T00:00:00Z"}),
                ("Aisha Mohammed", "Security Best Practices Guide", "AUTHORED",
                 {"role": "Primary Author", "date": "2024-08-20T00:00:00Z"}),
                ("Maria Garcia", "Marketing Strategy Q4 2024", "AUTHORED",
                 {"role": "Primary Author", "date": "2024-09-01T00:00:00Z"}),
                ("Dr. Sarah Chen", "AI Ethics Framework", "AUTHORED",
                 {"role": "Lead Author", "date": "2024-07-01T00:00:00Z"}),
                ("Dr. Yuki Tanaka", "AI Ethics Framework", "AUTHORED",
                 {"role": "Contributing Researcher", "date": "2024-07-01T00:00:00Z"}),
                ("Michael Rodriguez", "API Documentation v4.2", "AUTHORED",
                 {"role": "Technical Writer", "date": "2024-09-15T00:00:00Z"}),
                ("Kevin Zhang", "API Documentation v4.2", "AUTHORED",
                 {"role": "Contributing Developer", "date": "2024-09-15T00:00:00Z"}),
                ("Lisa Anderson", "User Research Report - Q2 2024", "AUTHORED",
                 {"role": "Lead Researcher", "date": "2024-07-10T00:00:00Z"}),
                ("Emily Watson", "User Research Report - Q2 2024", "AUTHORED",
                 {"role": "Product Lead", "date": "2024-07-10T00:00:00Z"}),
                ("Dr. Sarah Chen", "Partnership Agreement - Innovate.io", "AUTHORED",
                 {"role": "Technical Signatory", "date": "2024-05-15T00:00:00Z"}),
                ("Carlos Mendes", "Partnership Agreement - Innovate.io", "AUTHORED",
                 {"role": "CEO Signatory", "date": "2024-05-15T00:00:00Z"}),

                # PARTNER_WITH relationships (Organization to Organization)
                ("TechCorp Industries", "Innovate.io", "PARTNER_WITH",
                 {"partnership_type": "Technology Partnership", "start_date": "2024-05-15T00:00:00Z"}),
                ("TechCorp Industries", "DataFlow Analytics", "PARTNER_WITH",
                 {"partnership_type": "Data Services", "start_date": "2023-09-01T00:00:00Z"}),
                ("CloudSecure Systems", "TechCorp Industries", "PARTNER_WITH",
                 {"partnership_type": "Security Services", "start_date": "2022-06-10T00:00:00Z"}),
                ("GreenTech Ventures", "Innovate.io", "PARTNER_WITH",
                 {"partnership_type": "Investment", "start_date": "2021-11-20T00:00:00Z"}),
                ("AI Solutions Lab", "TechCorp Industries", "PARTNER_WITH",
                 {"partnership_type": "Research Collaboration", "start_date": "2023-03-01T00:00:00Z"}),

                # REVIEWED relationships (Documents)
                ("Dr. Sarah Chen", "Product Requirements Document", "REVIEWED",
                 {"review_date": "2024-06-05T00:00:00Z", "status": "Approved"}),
                ("Jennifer Thompson", "Technical Architecture Specification", "REVIEWED",
                 {"review_date": "2024-07-20T00:00:00Z", "status": "Approved"}),
                ("James O'Brien", "Marketing Strategy Q4 2024", "REVIEWED",
                 {"review_date": "2024-09-05T00:00:00Z", "status": "Approved"}),

                # SPOKE_AT relationships (Person to Event)
                ("Dr. Sarah Chen", "Annual Developer Conference 2024", "SPOKE_AT",
                 {"topic": "Future of Cloud Architecture", "session_date": "2024-10-06T14:00:00Z"}),
                ("Jennifer Thompson", "AI Tech Summit 2024", "SPOKE_AT",
                 {"topic": "Engineering Leadership in AI Era", "session_date": "2024-11-21T10:00:00Z"}),
                ("Aisha Mohammed", "Cybersecurity Workshop Series", "SPOKE_AT",
                 {"topic": "Zero Trust Security Models", "session_date": "2024-09-20T14:00:00Z"}),

                # SPONSORED relationships (Organization to Event)
                ("TechCorp Industries", "AI Tech Summit 2024", "SPONSORED",
                 {"sponsorship_level": "Platinum", "amount": 50000}),
                ("CloudSecure Systems", "Cybersecurity Workshop Series", "SPONSORED",
                 {"sponsorship_level": "Gold", "amount": 15000}),
                ("GreenTech Ventures", "Startup Pitch Competition", "SPONSORED",
                 {"sponsorship_level": "Diamond", "amount": 75000}),

                # INVESTED_IN relationships
                ("GreenTech Ventures", "Innovate.io", "INVESTED_IN",
                 {"investment_date": "2021-11-20T00:00:00Z", "amount": 5000000, "round": "Series A"}),
                ("GreenTech Ventures", "QuantumLeap Computing", "INVESTED_IN",
                 {"investment_date": "2022-08-15T00:00:00Z", "amount": 3000000, "round": "Seed"}),
            ]