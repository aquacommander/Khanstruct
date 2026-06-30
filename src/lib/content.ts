import type {
  Project,
  Experience,
  Hackathon,
  Metric,
  Service,
  GDGEvent,
  NavItem,
} from './types';

// ─── Navigation ───────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Work', href: '/work' },
  { label: 'Domains', href: '/domains' },
  { label: 'GDG Tulsa', href: '/gdg-tulsa' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

// ─── Services ─────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: 'design',
    title: 'Design',
    description:
      'Crafting functional digital experiences that tell your story and drive engagement — from first impression to conversion.',
    capabilities: [
      { icon: 'layout', label: 'Product UI & UX' },
      { icon: 'target', label: 'Landing Pages' },
      { icon: 'palette', label: 'Brand Systems' },
      { icon: 'layers', label: 'Design Systems' },
      { icon: 'film', label: 'Storytelling Visuals' },
    ],
    accentColor: '#d7ff3f',
  },
  {
    id: 'data',
    title: 'Data Management',
    description:
      'Building reliable data systems that help you make better decisions, faster — structured, normalized, and ready to scale.',
    capabilities: [
      { icon: 'git-branch', label: 'Data Pipelines' },
      { icon: 'database', label: 'CRM & Normalization' },
      { icon: 'bar-chart', label: 'Dashboards & Reporting' },
      { icon: 'server', label: 'Data Architecture' },
      { icon: 'book-open', label: 'Knowledge Systems' },
    ],
    accentColor: '#d7ff3f',
  },
  {
    id: 'ai',
    title: 'AI Implementation',
    description:
      'Deploying AI solutions and automation that streamline operations, reduce friction, and unlock compounding value.',
    capabilities: [
      { icon: 'cpu', label: 'AI Agents & Automation' },
      { icon: 'zap', label: 'Gemini & Vertex AI' },
      { icon: 'search', label: 'RAG & Vector Systems' },
      { icon: 'cloud', label: 'Google Cloud' },
      { icon: 'layers', label: 'Multimodal Applications' },
    ],
    accentColor: '#d7ff3f',
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────

// Real projects from suyama.blog, grouped into AI / Frontend / Backend.
// Cover images are the project screenshots in /public/projects.
export const PROJECTS: Project[] = [
  {
    slug: "zebracat",
    title: "Zebracat AI",
    category: "AI Video",
    summary:
      "AI platform that converts text, audio, and blog content into professional videos optimized for social media.",
    problem:
      "Producing social-ready video from text or audio is slow, manual, and expensive.",
    solution:
      "Built a Next.js/TypeScript app with AI text-to-video, TensorFlow computer-vision scene & avatar generation, backend rendering, and Stripe subscriptions.",
    outcome:
      "Turns text and audio into professional social videos automatically.",
    technologies: ["OpenAI","TensorFlow","Next.js","TypeScript","Tailwind CSS","MongoDB","Stripe"],
    coverImage: "/projects/zebracat.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: true,
    verifiedLinks: [{ label: "Live Site", url: "https://www.zebracat.ai/" }],
  },
  {
    slug: "job-wizard",
    title: "Job Wizard",
    category: "AI Extension",
    summary:
      "AI-powered Chrome extension that autofills job applications with personalized, AI-generated data.",
    problem:
      "Job seekers waste hours re-entering the same information across hundreds of applications.",
    solution:
      "Built a React/TypeScript Chrome extension using AI-generated data and Chrome Extension APIs for form detection and secure injection.",
    outcome:
      "Saves job seekers time with accurate, AI-driven autofill.",
    technologies: ["OpenAI","React","TypeScript","Styled-Components","Chrome Extension API"],
    coverImage: "/projects/jobwizard.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: false,
    verifiedLinks: [{ label: "Chrome Store", url: "https://chromewebstore.google.com/detail/jobwizard-ai-autofill-job/kbhgdbfkbgkokgkkdhnnlmkhnokjmfib" }],
  },
  {
    slug: "ollama-chatbot",
    title: "Ollama Chatbot",
    category: "GenAI / LLM",
    summary:
      "Samples showing how to build applications powered by Generative AI and LLMs.",
    problem:
      "Developers need practical, runnable patterns for building GenAI applications.",
    solution:
      "Built chatbot, computer-vision, and vector-DB integrations in Python demonstrating real GenAI workflows.",
    outcome:
      "Reusable examples for chatbot, vision, and vector-DB GenAI apps.",
    technologies: ["Python","Agent","LLM","Vector DB","Chatbot","Computer Vision","GenAI"],
    coverImage: "/projects/ollama.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: false,
    verifiedLinks: [{ label: "GitHub", url: "https://github.com/aquacommander/Ollama-Chatbot" }],
  },
  {
    slug: "multiagent-medical-assistant",
    title: "MultiAgent Medical Assistant",
    category: "Multi-Agent AI",
    summary:
      "GenAI-powered multi-agent assistant for medical diagnostics and healthcare research.",
    problem:
      "Medical diagnostics and research need coordinated, multi-step AI reasoning over many sources.",
    solution:
      "Built a multi-agent RAG system with LangChain, medical-imaging support, and a chatbot interface.",
    outcome:
      "An AI assistant supporting medical diagnostics and research.",
    technologies: ["Python","Agent","RAG","medical-imaging","Chatbot","LLM","GenAI","LangChain"],
    coverImage: "/projects/multiagent.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: false,
    verifiedLinks: [{ label: "GitHub", url: "https://github.com/aquacommander/MultiAgent-Medical-Assistant" }],
  },
  {
    slug: "parasol-finance",
    title: "Parasol Finance ($PSOL)",
    category: "Web3 / DeFi",
    summary:
      "The first community-governed IDO (Initial DEX Offering) platform built on the Solana blockchain.",
    problem:
      "Token launches are often unfair and lack genuine community governance.",
    solution:
      "Built a secure Next.js/TypeScript UI with Firebase auth & real-time updates and Solana smart contracts (Phantom & Solflare wallets).",
    outcome:
      "A community-governed IDO launchpad on Solana.",
    technologies: ["Next.js","TypeScript","Tailwind CSS","Firebase","Solana"],
    coverImage: "/projects/parosol.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://parasol.build/" }],
  },
  {
    slug: "menaji",
    title: "Menaji",
    category: "E-commerce",
    summary:
      "U.S.-based e-commerce platform offering high-definition cosmetics and advanced skincare for men.",
    problem:
      "A premium grooming brand needs a responsive, secure storefront that converts.",
    solution:
      "Built a responsive React/TypeScript site with Node/Express/MongoDB and Shopify for product management and secure checkout.",
    outcome:
      "A polished e-commerce experience for men’s cosmetics and skincare.",
    technologies: ["React","TypeScript","Styled-Components","Node.js","Express","MongoDB","Shopify"],
    coverImage: "/projects/menaji.png",
    visualTheme: "dark-green",
    accentColor: "#d7ff3f",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://www.menaji.com/" }],
  },
  {
    slug: "cerashealth",
    title: "CerasHealth",
    category: "Healthcare SaaS",
    summary:
      "A healthcare company providing innovative solutions for managing chronic conditions.",
    problem:
      "Managing chronic conditions needs connected, real-time tooling that most healthcare software lacks.",
    solution:
      "Built the React/TypeScript front end and Rails API backend with PostgreSQL for monitoring and care data.",
    outcome:
      "A connected-care SaaS that helps patients and providers manage chronic conditions.",
    technologies: ["React","TypeScript","Rails","API","PostgreSQL","SaaS","Healthcare"],
    coverImage: "/projects/cerashealth.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: true,
    verifiedLinks: [{ label: "Live Site", url: "https://cerashealth.com" }],
  },
  {
    slug: "pickade",
    title: "PicKade",
    category: "Gaming / Web3",
    summary:
      "Your destination for a modern Minecraft minigames experience.",
    problem:
      "Minecraft minigame communities lack a polished, modern web home.",
    solution:
      "Built a React, Web3-enabled front end for browsing and playing Minecraft minigames.",
    outcome:
      "A modern destination for Minecraft minigames.",
    technologies: ["React","Gaming","Minecraft","Web3"],
    coverImage: "/projects/pickade.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://pickade.net/" }],
  },
  {
    slug: "cbet",
    title: "CBet",
    category: "Casino / Gaming",
    summary:
      "An online gambling platform offering slots, table games, live dealer games, and more.",
    problem:
      "Online casinos need fast, responsive interfaces across a large game catalog.",
    solution:
      "Built the React/TypeScript front end for the casino’s game catalog and live play.",
    outcome:
      "A responsive casino spanning slots, table, and live dealer games.",
    technologies: ["React","Casino","Gaming","TypeScript"],
    coverImage: "/projects/cbet.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://cbet.world" }],
  },
  {
    slug: "raffle-famous",
    title: "Raffle Famous",
    category: "Web3 / NFT Raffle",
    summary:
      "An online platform where individuals purchase tickets for a chance to win prizes.",
    problem:
      "Trustless raffles need on-chain ticketing and a smooth purchase flow.",
    solution:
      "Built the React front end and Ruby API with blockchain/NFT integration for ticketing.",
    outcome:
      "A Web3 raffle where users buy tickets to win prizes.",
    technologies: ["React","Web3","NFT","Raffle","Ruby","API","Blockchain"],
    coverImage: "/projects/raffle.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://rafffle.famousfoxes.com/" }],
  },
  {
    slug: "sportsblog",
    title: "SportsBlog",
    category: "Sports / CMS",
    summary:
      "A platform where sports fans write and share thoughts, opinions, and analysis.",
    problem:
      "Sports fans need a fast publishing platform to share analysis at scale.",
    solution:
      "Built the React front end and a Rails/PostgreSQL CMS backend for publishing.",
    outcome:
      "A community platform for sports writing and analysis.",
    technologies: ["React","Blog","Sports","CMS","Rails","API","PostgreSQL"],
    coverImage: "/projects/sportsblog.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://sportsblog.com/" }],
  },
  {
    slug: "mapbox",
    title: "MapBox",
    category: "Geospatial / Maps",
    summary:
      "AI-powered location technology for automakers, mobile app developers, and logistics services.",
    problem:
      "Products need rich, performant geospatial features beyond basic maps.",
    solution:
      "Built AI-powered location and map experiences on the Mapbox platform and APIs.",
    outcome:
      "Geospatial features for automotive, mobile, and logistics use cases.",
    technologies: ["Maps","AI","Geospatial","API"],
    coverImage: "/projects/mapbox.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://www.mapbox.com/" }],
  },
  {
    slug: "bloxmoon",
    title: "BloxMoon",
    category: "Casino / Web3",
    summary:
      "An online gambling platform offering slots, table games, live dealer games, and more.",
    problem:
      "Web3 casinos need responsive UIs and reliable microservice backends.",
    solution:
      "Built the React front end and Ruby API microservices for the casino platform.",
    outcome:
      "A Web3 casino spanning slots, table, and live dealer games.",
    technologies: ["React","Casino","Gaming","Web3","Ruby","API","Microservices"],
    coverImage: "/projects/bloxmoon.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://bloxmoon.com/" }],
  },
  {
    slug: "armory",
    title: "Armory",
    category: "Web3 / Gaming",
    summary:
      "A Web3 community where members get items.",
    problem:
      "Web3 gaming communities need infrastructure to distribute and manage items.",
    solution:
      "Built the React front end and API backend for the Web3 community and item system.",
    outcome:
      "A Web3 community platform for gaming items.",
    technologies: ["React","Web3","Gaming","Community","API","Backend"],
    coverImage: "/projects/armory.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://cyberstadium.gg" }],
  },
  {
    slug: "amino-rewards",
    title: "Amino Rewards",
    category: "Social / Rewards",
    summary:
      "A rewards feature within Amino — a social networking app for healthy communities.",
    problem:
      "Community apps need engaging rewards to drive retention.",
    solution:
      "Built the React/mobile front end for the social rewards feature.",
    outcome:
      "A rewards system inside a community social app.",
    technologies: ["React","Mobile","Social","Rewards"],
    coverImage: "/projects/aminorewards.png",
    visualTheme: "dark-blue",
    accentColor: "#4a9eff",
    featured: false,
    verifiedLinks: [{ label: "Live Site", url: "https://aminorewards.com/" }],
  },
  {
    slug: "pixora",
    title: "Pixora",
    category: "Image Platform",
    summary:
      "An image-sharing platform to upload images, build an audience, and connect with other creators.",
    problem:
      "Creators need a platform to share images and grow an audience.",
    solution:
      "Built a Next.js/Node backend with MongoDB, Bcrypt auth, and Multer uploads.",
    outcome:
      "An image-sharing platform with accounts and uploads.",
    technologies: ["Next.js","Node.js","Bcrypt","Multer","MongoDB"],
    coverImage: "/projects/pixora.png",
    visualTheme: "dark-purple",
    accentColor: "#a855f7",
    featured: true,
    verifiedLinks: [{ label: "GitHub", url: "https://github.com/aquacommander/Pixora" }],
  },
  {
    slug: "appointy",
    title: "Appointy",
    category: "MERN / Booking",
    summary:
      "A full-stack doctor appointment web app with patient, doctor, and admin logins.",
    problem:
      "Clinics need an end-to-end booking system across patient, doctor, and admin roles.",
    solution:
      "Built a MERN-stack app (Next.js/Node/MongoDB) with role-based logins and booking.",
    outcome:
      "A full-stack doctor-appointment booking system.",
    technologies: ["Next.js","Node.js","doctor-booking-system","MongoDB"],
    coverImage: "/projects/appointy.png",
    visualTheme: "dark-purple",
    accentColor: "#a855f7",
    featured: false,
    verifiedLinks: [{ label: "GitHub", url: "https://github.com/aquacommander/Appointy" }],
  },
  {
    slug: "australian-banking-db",
    title: "Australian Banking DB",
    category: "Fintech / API",
    summary:
      "An ongoing collection of Open Banking data APIs for Australian deposit-taking institutions.",
    problem:
      "Open Banking data is scattered across institutions and hard to consume.",
    solution:
      "Built and maintain a structured collection of Open Banking / consumer-data APIs.",
    outcome:
      "A consolidated reference of Australian Open Banking APIs.",
    technologies: ["API","Fintech","banking","banking-apis","consumer-data"],
    coverImage: "/projects/banking.png",
    visualTheme: "dark-purple",
    accentColor: "#a855f7",
    featured: false,
    verifiedLinks: [{ label: "GitHub", url: "https://github.com/aquacommander/Australian-Banking-DB" }],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────

export const EXPERIENCE: Experience[] = [
  {
    id: 'khanstruct',
    period: '2026 – Present',
    company: 'Khanstruct',
    role: 'Founder & AI Engineer',
    location: 'Tulsa, OK',
    description:
      'Independent AI studio building multimodal agents, automation pipelines, and structured knowledge systems. Built Cortana — a multimodal AI agent with real-time voice, vision, and UI navigation using Gemini Live API. Designed personal Second Brain at scale in Notion.',
    tags: ['Gemini Live API', 'React', 'TypeScript', 'Cloud Run', 'Python'],
  },
  {
    id: 'rcubed',
    period: '2024 – 2025',
    company: 'R-Cubed Consulting',
    role: 'Business Development, Marketing & Ops',
    location: 'Tulsa, OK',
    description:
      'Oracle and NetSuite consulting firm. Owned the full sales pipeline, company website, and marketing operations. Authored the BDR Outbound Handbook. Completed NetSuite SuiteLife Partner Training.',
    tags: ['HubSpot', 'Apollo', 'WordPress', 'Oracle', 'NetSuite'],
  },
  {
    id: 'trulo',
    period: '2024 – 2025',
    company: 'Trulo Homes / Red River Dev',
    role: 'Marketing Director',
    location: 'Tulsa, OK',
    description:
      'Multi-location real estate marketing across 8 markets. Full Google + Meta stack management. Earned Google Ads Display Certification. 26+ Google Business Profile events in a single quarter.',
    tags: ['Google Ads', 'Meta Ads', 'Analytics', 'Looker Studio'],
  },
  {
    id: 'roserock',
    period: '2024 – 2025',
    company: 'Rose Rock Development',
    role: 'Marketing & Client Operations',
    location: 'Tulsa, OK',
    description:
      'Supported marketing and operational materials across Reunion Building, Palace, Adams, and Vandever properties. Meta Business Suite, web development, calendar management.',
    tags: ['Meta Business', 'Canva', 'Google Workspace'],
  },
];

// ─── Hackathons ───────────────────────────────────────────────────────────

export const HACKATHONS: Hackathon[] = [
  {
    id: 'gemini-live',
    title: 'Gemini Live Agent Challenge',
    organizer: 'Google',
    year: '2026',
    prizePool: '$80K',
    participants: '11,915',
    project: 'Cortana — Multimodal AI Agent',
  },
  {
    id: 'gemini-3',
    title: 'Gemini 3 Hackathon',
    organizer: 'Google',
    year: '2025–2026',
    prizePool: '$100K',
    participants: '35,628',
    project: 'Submitted project entry',
  },
  {
    id: 'adk',
    title: 'Agent Dev Kit Hackathon',
    organizer: 'Google Cloud',
    year: '2025',
    prizePool: '$50K',
    participants: '10,376',
    project: 'Gemini Marketing Taskforce',
  },
  {
    id: 'worlds-largest',
    title: "World's Largest Hackathon",
    organizer: 'Bolt',
    year: '2025',
    prizePool: '$1M+',
    participants: '128,453',
    project: 'Submitted project entry',
  },
  {
    id: 'meta-horizon',
    title: 'Meta Horizon Creator Competition',
    organizer: 'Meta',
    year: '2025',
    prizePool: '$1M',
    participants: '1,407',
    project: 'The Spartan Covenant — AI sci-fi game',
  },
  {
    id: 'perplexity',
    title: 'Perplexity Hackathon',
    organizer: 'Perplexity',
    year: '2025',
    prizePool: '$35K',
    participants: '4,367',
    project: 'Cortona OS — multi-agent workflow system',
  },
  {
    id: 'maps-platform',
    title: 'Google Maps Platform Awards',
    organizer: 'Google',
    year: '2025',
    participants: '3,932',
    project: 'Cortana MapLens',
  },
  {
    id: 'houston',
    title: 'Houston Hackathon 2025',
    organizer: 'Impact Hub Houston',
    year: '2025',
    participants: '70',
    project: 'Open data solutions for Houston',
    inPerson: true,
    location: 'Houston, TX',
  },
];

// ─── Metrics ──────────────────────────────────────────────────────────────

export const METRICS: Metric[] = [
  { value: '20+', label: 'Projects Delivered', numericTarget: 20, verified: false },
  { value: '16', label: 'Hackathons Entered', numericTarget: 16, verified: true },
  { value: '205+', label: 'GitHub Repositories', numericTarget: 205, verified: true },
  { value: '$3M+', label: 'Prize Pools Entered', verified: true },
];

// ─── GDG Events ───────────────────────────────────────────────────────────

export const GDG_EVENTS: GDGEvent[] = [
  // No upcoming events confirmed — leaving empty for client to populate
];

// ─── GDG Focus Areas ──────────────────────────────────────────────────────

export const GDG_FOCUS_AREAS = [
  {
    id: 'google-tech',
    icon: 'google',
    title: 'Google Technologies',
    description:
      'From Android to Cloud, we explore the best of Google developer tools and platforms.',
  },
  {
    id: 'career',
    icon: 'trending-up',
    title: 'Career Growth',
    description: 'Helping developers level up their skills and advance their careers.',
  },
  {
    id: 'community',
    icon: 'users',
    title: 'Community Impact',
    description: 'Using technology to solve real problems and give back to our community.',
  },
  {
    id: 'diversity',
    icon: 'heart',
    title: 'Diversity & Inclusion',
    description: 'Creating an inclusive space for everyone to learn, share, and grow together.',
  },
];

// ─── GDG Metrics ──────────────────────────────────────────────────────────

export const GDG_METRICS: Metric[] = [
  { value: '500+', label: 'Members', verified: false },
  { value: '25+', label: 'Events Hosted', verified: false },
  { value: '50+', label: 'Workshops', verified: false },
  { value: '15+', label: 'Community Partners', verified: false },
];

// ─── Contact Links ────────────────────────────────────────────────────────

export const CONTACT_LINKS = [
  { label: 'GitHub', sublabel: 'zainkhan1994 · 205 repos', url: 'https://github.com/zainkhan1994' },
  { label: 'Google Dev Profile', sublabel: 'g.dev/khanstruct', url: 'https://g.dev/khanstruct' },
  { label: 'Devpost', sublabel: 'Level 6 · 16 Hackathons', url: 'https://devpost.com/zainkhan1994-zk' },
  { label: 'Kaggle', sublabel: 'zainkhan1994', url: 'https://www.kaggle.com/zainkhan1994zk' },
  { label: 'LinkedIn', sublabel: 'Connect with Zain', url: 'https://www.linkedin.com/in/zainkhan23/' },
];

export const EMAIL = 'zain@thekhanstruct.com';

// Google Calendar appointment scheduling page (opens in a new tab).
export const BOOK_MEETING_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3jDQ8YdrtmpjDaXr3o_8efW9KZBnbNbwV_OxGqULG2iCXWrRTTngJXv38J005y_f5AzZf49qyo';
