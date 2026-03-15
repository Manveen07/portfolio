export const corpus = {
    personal: {
        name: "Manveen Singh",
        email: "manveen9650@gmail.com",
        phone: "+91 9289644633",
        linkedin: "https://linkedin.com/in/Manveen",
        github: "https://github.com/Manveen07",
        location: "Remote / Delhi, India",
        role: "AI/ML Engineer",
        focus: "Automation + Agent Systems + Real-World Deployment",
    },
    hero: {
        headline: "Automating the boring. Scaling the interesting.",
        subHeadline: "AI/ML engineer building multi-agent stacks and clever automation. Writes code that nags less than humans.",
        ctas: {
            primary: "View Case Studies",
            secondary: "Book a 15-Min Pipeline Audit",
        },
        terminalStatuses: [
            "Booting... calibrating sarcasm levels",
            "Re-aligning sub-agents... someone ignored instructions.",
            "Fixing Windows PATH issues... again.",
            "Brewing coffee... if response time > 30s, blame the coffee.",
            "Deploying patch: 'less drama, more logs'"
        ]
    },
    about: {
        pitch: "I’m an AI & automation engineer focused on building production-ready workflow systems that actually ship. I treat system architecture like a disciplined practice—automating repetitive workflows, building leverage, and focusing on scalable impact. Logs don't lie. People do.",
        flavor: "If I repeat it twice, I automate it.",
        specializations: [
            "Multi-Agent Stacks",
            "Workflow Automation",
            "API orchestration",
            "LLM Integration",
            "Data Engineering",
            "Web Scraping"
        ],
    },
    metrics: [
        { value: "100%", label: "Manual administrative friction eliminated in Caprae recruitment pipeline." },
        { value: "40%", label: "Reduction in manual research time for lead routing at Precise Leads." },
        { value: "35%+", label: "Erroneous financial data records blocked via custom validation layers." },
        { value: "5+", label: "Heterogeneous data sources aggregated seamlessly via automated workflows." },
    ],
    experience: [
        {
            role: "GTM Automation Engineer",
            company: "Precise Leads",
            location: "Remote",
            date: "Nov 2025 – Present",
            mission: "Increase GTM velocity by reducing human bottlenecks and operational overhead.",
            execution: [
                "Automating lead enrichment workflows and structuring CRM automated synchronization.",
                "Integrating APIs for high-volume data processing.",
                "Built a high-intent inbound discovery engine and scalable backend systems to trigger immediate action."
            ],
            impact: [
                "Reduced manual research time by 40%.",
                "Delivered faster outreach cycles and higher data quality.",
                "Improved overall GTM efficiency by replacing repetitive manual work with intelligent systems."
            ],
        },
        {
            role: "AI/ML Intern",
            company: "Caprae Capital Partners",
            location: "Remote (Brand Blvd, Glendale, US)",
            date: "June 2025 – Dec 2025",
            mission: "Automate the candidate lifecycle and normalize high-volume financial data.",
            execution: [
                "Spearheaded the ground-up development of a proprietary recruitment ecosystem.",
                "Engineered an AI-driven resume parsing and ranking system.",
                "Architected candidate scoring models powered by advanced embeddings."
            ],
            impact: [
                "Eliminated 100% of manual administrative friction in the hiring process.",
                "Reduced screening time and drastically increased candidate throughput.",
                "Improved candidate ranking consistency using systematic AI scoring logic."
            ],
        },
    ],
    education: {
        degree: "Bachelor of Technology in Computer Science",
        institution: "Maharaja Surajmal Institute of Technology",
        gpa: "8.7",
        duration: "Nov 2022 – Aug 2026",
        highSchool: {
            institution: "GHPS Public School",
            stream: "Non-Medical",
            percentage: "82%",
            year: "March 2021 – March 2022"
        }
    },
    caseStudies: [
        {
            id: "recruitment-automation",
            title: "AI-Powered Recruitment Automation Platform",
            tagline: "Reducing manual resume screening time by up to 70% and accelerating candidate shortlisting.",
            role: "Lead Engineer (Architecture + AI + Automation)",
            duration: "~6–8 weeks",
            problem: "Recruiters were spending 5–10 hours per week manually screening resumes, leading to slow time-to-shortlist, inconsistent evaluation criteria, and high recruiter fatigue.",
            solution: "Built a modular AI-powered recruitment system with a Resume Ingestion Pipeline (NLP parsing), an AI Ranking Engine (Embeddings + Vector DB scoring candidates), and an Automation Layer to auto-generate shortlist reports and schedule interviews.",
            techStack: ["Python", "FastAPI", "NLP (spaCy / LLM)", "Embeddings + Vector DB", "PostgreSQL", "Celery", "Slack API", "Docker"],
            results: [
                "Reduced manual screening time from 10 hrs/week to 3 hrs/week",
                "Increased candidate processing capacity by 3x",
                "Reduced time-to-shortlist from 5 days to 1.5 days",
                "Improved ranking consistency through AI scoring logic"
            ],
            image: "/images/recruitment-platform.png"
        },
        {
            id: "presentai",
            title: "PresentAI – Automated Presentation Agent",
            tagline: "Auto-generating professional slide decks in seconds.",
            role: "Architect + Builder",
            duration: "~4 weeks",
            problem: "Founders and PMs waste hours structuring slide decks, writing content, formatting layouts, and rewriting messy meeting notes.",
            solution: "Built an automated presentation agent that executes text-to-slide conversion. Implemented structured slide flow, speaker notes generation, and automated PPT export based on LLM abstractions.",
            techStack: ["Next.js", "Tailwind CSS", "Prisma", "Zustand", "PostgreSQL", "Gen AI / Prompt Engineering", "python-pptx", "React DnD", "Clerk"],
            results: [
                "Reduced deck creation time from 2 hours to 10–15 minutes",
                "Generated structured decks in under 60 seconds",
                "Enabled rapid iteration for pitch improvements"
            ],
            link: "https://github.com/Manveen07/PresentAI",
            image: "/images/presentai.png"
        },
        {
            id: "gtm-automation",
            title: "Lead Enrichment & GTM Automation",
            tagline: "Cutting manual enrichment time and maximizing outbound precision.",
            role: "GTM Automation Engineer",
            duration: "Ongoing",
            problem: "Lead enrichment was entirely manual, creating bottlenecks in outreach speed, resulting in poor data fidelity and high bounce rates.",
            solution: "Developed multi-source lead ingestion and an API enrichment layer. Orchestrated CRM syncing, Slack notifications, lead scoring, and automated data validation.",
            techStack: ["Python", "n8n", "Web Scraping", "REST APIs", "CRM Integrations", "PostgreSQL"],
            results: [
                "Reduced manual enrichment time from 8 hrs/week to 2 hrs/week",
                "Increased qualified leads by 30–50%",
                "Reduced outreach delay by 40%",
                "Improved CRM data consistency"
            ],
            image: "/images/gtm-automation.png"
        },
        {
            id: "asanabot",
            title: "AsanaBot – Real-Time Yoga Pose Analysis",
            tagline: "Domain-specific applied ML and Vision applications",
            role: "Machine Learning Engineer",
            duration: "August 2024",
            problem: "Need for specialized, real-time guidance in physical yoga posture correction with instant feedback.",
            solution: "Built AsanaBot using Vision Transformers and MediaPipe for accurate, real-time yoga pose classification and corrective feedback. Implemented efficient video processing and pose detection algorithms.",
            techStack: ["Python", "Vision Transformers", "MediaPipe", "OpenCV", "NLP"],
            results: [
                "Delivered real-time visual guidance processing video efficiently",
                "Accurate detection and classification of various yoga poses",
                "Instant visual guidance and corrective suggestions",
                "Efficient video processing for real-time performance"
            ],
            link: "https://github.com/Manveen07/AsanaBot",
            image: "/images/asanabot.png"
        }
    ],
    skills: {
        coreLanguages: ["Python", "C", "JavaScript", "SQL", "TypeScript"],
        frameworks: ["Next.js", "React", "Tailwind CSS", "FastAPI"],
        aiAndMl: ["LLM Integration", "Prompt Engineering", "Embeddings", "Vector Search", "Transformer Models", "Vision Transformers"],
        dataAndLibraries: ["PostgreSQL", "ETL Pipelines", "Pandas", "Scikit-learn", "Data Normalization"],
        automationAndDatabases: ["n8n", "Process Automation Design", "Lead Enrichment Automation", "CRM Automation"],
        tools: ["Docker", "Background Job Workers", "Deployment Pipelines", "Git"]
    },
    futureVision: {
        build: [
            "Autonomous business agents",
            "Intelligent execution pipelines",
            "Quant-enhanced automation systems",
            "Scalable algorithmic workflows"
        ],
        become: "A high-leverage engineer capable of designing decision-making infrastructure."
    },
    contact: {
        calendlyLink: "https://calendly.com/manveen9650/30min",
        emailSubject: "Pipeline Audit Request - ",
        availability: "Available for freelance automation projects and consulting"
    }
};
