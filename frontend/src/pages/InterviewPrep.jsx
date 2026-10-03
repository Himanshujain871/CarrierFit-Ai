import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FlashCard from '../components/FlashCard';
import { MessageSquare, Filter, Award, Sparkles } from 'lucide-react';

export default function InterviewPrep() {
  const [filterCategory, setFilterCategory] = useState('All');

  const questions = [
    {
      id: 1,
      category: 'Technical',
      question: 'How do you structure microservices communication and resilient API gateways in Node.js?',
      purpose: 'Evaluates architectural knowledge & inter-service decoupling.',
      sampleAnswer: 'I use asynchronous event brokers (e.g. RabbitMQ/Kafka) for non-blocking background jobs and REST with circuit breakers for synchronous calls. API gateways handle stateless JWT authentication, rate limiting, and request routing.',
      keyPointsToMention: ['Circuit breakers', 'Stateless JWT auth', 'Asynchronous event queues', 'Rate limiting'],
      difficulty: 'Hard',
    },
    {
      id: 2,
      category: 'Behavioral',
      question: 'Describe a situation where you had to push back against an unreasonable deadline.',
      purpose: 'Tests negotiation, MVP scope prioritization, and stakeholder management.',
      sampleAnswer: 'I presented empirical evidence showing test coverage risks and technical debt implications. I proposed an MVP core release for phase 1 followed by non-critical features in phase 2.',
      keyPointsToMention: ['Empirical data presentation', 'Phase 1 MVP scope triage', 'Stakeholder alignment'],
      difficulty: 'Medium',
    },
    {
      id: 3,
      category: 'STAR Method',
      question: 'Walk me through a scenario where you solved a severe database latency issue.',
      purpose: 'Validates technical problem solving using Situation-Task-Action-Result.',
      sampleAnswer: 'SITUATION: Database response latency reached 900ms under load.\nTASK: Reduce latency below 150ms.\nACTION: Refactored N+1 queries, added Redis caching layer, and created compound indexes.\nRESULT: Latency dropped by 83% to 120ms.',
      keyPointsToMention: ['Query indexing', 'Redis cache layer', '83% latency drop'],
      difficulty: 'Hard',
    },
    {
      id: 4,
      category: 'Gaps & Weaknesses',
      question: 'The job requires Docker & Kubernetes containerization. How would you bridge your current experience gap in cloud orchestration?',
      purpose: 'Tests self-awareness and learning velocity.',
      sampleAnswer: 'I have hands-on experience containerizing Node & Python apps using Docker files. I am currently completing Kubernetes cluster setup tutorials and can leverage my strong Linux and CI/CD foundation to achieve full production mastery within two weeks.',
      keyPointsToMention: ['Docker fundamentals', 'Transferable Linux skills', '2-week ramp-up plan'],
      difficulty: 'Medium',
    },
  ];

  const categories = ['All', 'Technical', 'Behavioral', 'STAR Method', 'Gaps & Weaknesses'];

  const filteredQuestions = filterCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === filterCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <MessageSquare className="w-7 h-7 text-amber-400" />
                Tailored Interview Preparation Deck
              </h1>
              <p className="text-slate-400 text-sm">
                AI-generated interview questions, sample responses, and strategy points based on your resume and target job.
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'glass-card text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuestions.map((q, idx) => (
              <FlashCard key={q.id || idx} q={q} index={idx} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
