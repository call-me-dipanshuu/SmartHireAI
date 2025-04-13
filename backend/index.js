import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(cors());
app.use(bodyParser.json());

// const candidates = [
//   { name: 'Alice', skills: ['React', 'Node.js'], experience: 4 },
//   { name: 'Bob', skills: ['Python', 'Django'], experience: 3 },
//   { name: 'Carol', skills: ['Java', 'Spring'], experience: 5 },
// ];
const candidates = [
  {
    name: "Alice Johnson",
    skills: ["React", "JavaScript", "UI/UX"],
    experience: 3,
    bio: "Frontend engineer passionate about crafting user-centric web apps using modern JavaScript frameworks."
  },
  {
    name: "Brian Smith",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    experience: 5,
    bio: "ML specialist with experience in building production-grade recommendation systems and NLP pipelines."
  },
  {
    name: "Catherine Lee",
    skills: ["Java", "Spring Boot", "Microservices"],
    experience: 6,
    bio: "Backend engineer focused on scalable APIs, microservice architecture, and enterprise Java development."
  },
  {
    name: "David Kim",
    skills: ["Node.js", "Express", "MongoDB"],
    experience: 4,
    bio: "Full-stack developer building RESTful APIs and web apps using JavaScript and NoSQL databases."
  },
  {
    name: "Ella Thompson",
    skills: ["AWS", "DevOps", "Docker", "Kubernetes"],
    experience: 7,
    bio: "Cloud architect experienced in container orchestration, CI/CD pipelines, and scalable cloud deployments."
  },
];


// const jobs = [
//   { title: 'Frontend Developer', skills: ['React'], experience: 3 },
//   { title: 'Backend Developer', skills: ['Node.js'], experience: 4 },
//   { title: 'Python Developer', skills: ['Python'], experience: 2 },
// ];

const jobs = [
  {
    title: "Senior React Developer",
    skills: ["React", "JavaScript", "CSS"],
    experience: 4,
    description: "We’re seeking a frontend expert to lead component design and UI improvements in our SaaS dashboard."
  },
  {
    title: "ML Engineer",
    skills: ["Python", "Machine Learning", "NLP"],
    experience: 3,
    description: "Join our AI lab to build and fine-tune language models, recommendation systems, and real-time pipelines."
  },
  {
    title: "DevOps Engineer",
    skills: ["AWS", "Docker", "CI/CD"],
    experience: 5,
    description: "Looking for a hands-on DevOps engineer to manage cloud infrastructure, automate builds and monitor systems."
  },
  {
    title: "Backend Java Developer",
    skills: ["Java", "Spring Boot", "APIs"],
    experience: 4,
    description: "Help us enhance our microservices ecosystem powering enterprise data products."
  },
  {
    title: "Node.js Fullstack Engineer",
    skills: ["Node.js", "React", "MongoDB"],
    experience: 3,
    description: "Build and maintain our ecommerce platform using a modern MERN stack with focus on performance and UX."
  },
];


// app.post('/api/find-candidates', (req, res) => {
//   const { skills, experience } = req.body;
//   const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
//   const filtered = candidates.filter(c =>
//     skillArray.some(skill => c.skills.map(s => s.toLowerCase()).includes(skill)) &&
//     c.experience >= parseInt(experience)
//   );
//   res.json(filtered);
// });

app.post('/api/find-candidates', async (req, res) => {
  const { skills, experience } = req.body;
  const query = `${skills}, ${experience} years of experience`;
  const queryEmbedding = await getEmbedding(query);

  const results = await Promise.all(candidates.map(async candidate => {
    const profileText = `${candidate.name} has skills in ${candidate.skills.join(', ')} with ${candidate.experience} years experience.`;
    const profileEmbedding = await getEmbedding(profileText);
    const score = cosineSimilarity(queryEmbedding, profileEmbedding);
    return { ...candidate, score };
  }));

  const top = results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json(top);
});

app.post('/api/find-jobs', async (req, res) => {
  const { skills, experience } = req.body;
  const query = `${skills}, ${experience} years of experience`;
  const queryEmbedding = await getEmbedding(query);

  const scored = await Promise.all(jobs.map(async (job) => {
    const jobText = `${job.title}. Requires: ${job.skills.join(', ')}. ${job.experience}+ years preferred. ${job.description}`;
    const jobEmbedding = await getEmbedding(jobText);
    const score = cosineSimilarity(queryEmbedding, jobEmbedding);
    return { ...job, score };
  }));

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 5);
  res.json(top);
});


// app.post('/api/find-jobs', (req, res) => {
//   const { skills, experience } = req.body;
//   const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
//   const filtered = jobs.filter(j =>
//     skillArray.some(skill => j.skills.map(s => s.toLowerCase()).includes(skill)) &&
//     j.experience <= parseInt(experience)
//   );
//   res.json(filtered);
// });

// const fetch = require("node-fetch");


async function getEmbedding(text) {
  const res = await fetch('http://127.0.0.1:8000/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.embedding;
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

app.listen(3001, () => console.log('Server running on http://localhost:3001'));