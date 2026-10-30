// Single source of truth for site content.
// The server seeds MongoDB from this file, and the client uses it as an offline fallback.
// Filled from Pranav's resume. Empty link fields are hidden on the site until filled in.

export const profile = {
  name: 'Pranav',
  fullName: 'Pranav Hasban',
  title: 'Software Engineer · AI/ML',
  tagline: 'Full stack apps, cloud systems and ML models, built end to end.',
  about: [
    'I am Pranav Hasban, an Information Technology student at VIT Vellore (CGPA 8.5, graduating 2028). I build full stack products with the MERN stack and take ML models from training to a working app, from an AI shopping assistant to live webcam emotion recognition.',
    'I like problems where engineering and ML meet: streaming LLM responses into a React UI, forecasting data center load with LSTMs on AWS, or running YOLOv8 on drone telemetry. I am looking for SWE and AI/ML internships where I can own features end to end.',
  ],
  location: 'Vellore, India',
  email: 'pranavhasban70285@gmail.com',
  links: {
    github: 'https://github.com/pranavhasban2006',
    linkedin: '',
    leetcode: '',
    codeforces: '',
    resume: '/resume.pdf',
  },
  stats: [
    { value: 250, suffix: '+', label: 'LeetCode problems solved' },
    { value: 8.5, decimals: 1, suffix: '', label: 'CGPA at VIT Vellore' },
    { value: 39.5, decimals: 1, suffix: '%', label: 'data center energy cut by AURA' },
  ],
};

export const projects = [
  {
    slug: 'nexcart',
    order: 1,
    title: 'NexCart',
    kind: 'Full stack · AI',
    summary:
      'A production ready e-commerce platform with a Gemini powered shopping assistant that streams answers, recommends products and helps with carts and orders.',
    tech: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'PayPal', 'JWT'],
    highlights: [
      'Streaming AI chatbot via custom Express endpoint + ReadableStream',
      'JWT auth, role based access, guest to user cart merging',
      'PayPal payments with full order lifecycle',
      'Admin dashboard for products, orders, users, inventory',
      'Deployed: Render (API) + Vercel (web)',
    ],
    github: '',
    demo: '',
    accent: '#00f0ff',
  },
  {
    slug: 'aura',
    order: 2,
    title: 'AURA',
    kind: 'Cloud · ML',
    summary:
      'Autonomous University Resource Allocator: a green cloud framework that forecasts data center demand and schedules servers and batch jobs around grid carbon intensity. Team of 3; I built the React frontend.',
    tech: ['React', 'Node.js', 'AWS Lambda', 'SageMaker', 'DynamoDB', 'Cognito', 'TensorFlow'],
    highlights: [
      'LSTM forecast: 20% lower error than weekly baseline',
      'Energy -39.5%, CO2 -41.3% vs always on',
      '99.5% SLA compliance on 5.4M real readings',
      'Scenario simulator with CSV and printable reports',
    ],
    github: '',
    demo: '',
    accent: '#c6ff00',
  },
  {
    slug: 'emotion-detection',
    order: 3,
    title: 'Multimodal Emotion Detection',
    kind: 'AI / ML research',
    summary:
      'Recognises 7 emotions from images, video clips and live webcam streams, with a plug in design ready for audio, text and EEG models.',
    tech: ['PyTorch', 'FastAPI', 'React', 'MediaPipe', 'WebSockets', 'SQLite'],
    highlights: [
      'ResNet-18 and CNN models trained on FER-2013',
      'MediaPipe face pipeline, 5 fps sampling, smoothing',
      'Frames processed in memory, never stored',
      'Confidence weighted late fusion + pytest suite',
    ],
    github: '',
    demo: '',
    accent: '#ff2bd6',
  },
];

export const experience = [
  {
    role: 'Finalist, International Innovation Challenge 3',
    company: 'Manipal University Jaipur',
    period: '2026',
    points: [
      'Built SPECTR, a drone defense prototype: an ESP32 drone node streams AES encrypted telemetry (GPS, tilt, obstacle distance, temperature) over MQTT to a Python backend.',
      'YOLOv8 weapon detection triggers email alerts to operators and feeds a live React dashboard.',
    ],
    link: 'https://github.com/pranavhasban2006/innovatorsquest',
  },
  {
    role: 'OCI AI Foundations Associate',
    company: 'Oracle',
    period: '2025',
    points: ['Certified in AI and ML fundamentals on Oracle Cloud Infrastructure.'],
  },
  {
    role: 'B.Tech in Information Technology',
    company: 'Vellore Institute of Technology',
    period: '2024 to 2028 (expected)',
    points: [
      'CGPA 8.5.',
      'Competitive programming: 250+ LeetCode problems (rating 1450) and Codeforces rating 1080+.',
    ],
  },
];

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript', 'SQL'] },
  { group: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'MediaPipe', 'LSTM', 'CNN', 'Pandas', 'NumPy'] },
  { group: 'Full stack', items: ['React', 'Redux Toolkit', 'Tailwind', 'Node.js', 'Express', 'FastAPI', 'MongoDB', 'JWT'] },
  { group: 'Cloud & tools', items: ['AWS', 'SageMaker', 'Lambda', 'DynamoDB', 'Docker', 'Git', 'Render', 'Vercel'] },
];

export const posts = [
  {
    slug: 'streaming-gemini-in-nexcart',
    title: 'Streaming an AI shopping assistant',
    date: '2026-10-30',
    readMins: 4,
    excerpt: 'How NexCart streams Gemini answers token by token from Express into a React sidebar.',
    tags: ['llm', 'mern'],
    body: 'Draft: NexCart has a chatbot sidebar powered by the Gemini API. Instead of waiting for the full answer, a custom Express endpoint streams the response and the React client reads it with ReadableStream, so text appears as it is generated. The assistant knows the catalogue and the cart, so it can recommend products and help with orders. Pranav: expand this with what was hard and what you learned.',
  },
  {
    slug: 'carbon-aware-scheduling-aura',
    title: 'Cutting data center CO2 by 41% in simulation',
    date: '2026-10-20',
    readMins: 5,
    excerpt: 'What building AURA taught me about forecasting load and scheduling around grid carbon intensity.',
    tags: ['cloud', 'ml'],
    body: 'Draft: AURA forecasts university data center demand with an LSTM (20% lower error than a weekly baseline) and schedules servers and flexible batch jobs for hours when the grid is cleaner. On 5.4M real building load readings from CU-BEMS, it cut energy by 39.5% and CO2 by 41.3% against always on servers while keeping 99.5% SLA compliance. Pranav: expand this with your part, the React simulator and dashboard.',
  },
];

export const dsa = {
  intro:
    'Competitive programming keeps my fundamentals sharp: 250+ problems solved on LeetCode and rated contests on both LeetCode and Codeforces.',
  platforms: [
    {
      name: 'LeetCode',
      link: 'leetcode', // uses profile.links.leetcode
      accent: '#ffa116',
      stats: [
        { value: 250, suffix: '+', label: 'problems solved' },
        { value: 1450, suffix: '', label: 'contest rating' },
      ],
    },
    {
      name: 'Codeforces',
      link: 'codeforces', // uses profile.links.codeforces
      accent: '#3b9cff',
      stats: [{ value: 1080, suffix: '+', label: 'rating' }],
    },
  ],
  // Optional: list the topics you are strongest in, e.g. ['Graphs', 'Dynamic programming']. Hidden while empty.
  topics: [],
};
