import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Mic, Square, Play, MessageSquare, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export default function MockInterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/analysis/' + id);
        if (res.data.success) {
          const analysisData = res.data.data;
          const interviewDeck =
            (analysisData.interviewPrep && analysisData.interviewPrep.questions) ||
            (analysisData.analysis &&
              analysisData.analysis.interviewPrep &&
              analysisData.analysis.interviewPrep.questions) ||
            [];
          if (interviewDeck.length > 0) {
            setQuestions(interviewDeck);
          }
        }
      } catch (err) {
        console.error('Failed to load analysis for interview', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserTranscript((prev) => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      synthesisRef.current.cancel();
    };
  }, []);

  const speakQuestion = () => {
    if (!questions[currentIdx]) return;
    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[currentIdx].question);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthesisRef.current.speak(utterance);
  };

  const evaluateAnswer = (transcript) => {
    if (!transcript.trim()) return;
    const currentQ = questions[currentIdx];
    const transcriptLower = transcript.toLowerCase();
    const requiredPoints = currentQ.key_points_to_mention || [];
    let matchedKeywords = 0;
    requiredPoints.forEach((point) => {
      const words = point.toLowerCase().split(' ');
      const match = words.some((w) => w.length > 3 && transcriptLower.includes(w));
      if (match) matchedKeywords++;
    });
    const score =
      requiredPoints.length > 0 ? (matchedKeywords / requiredPoints.length) * 100 : 80;
    setFeedback({
      score: Math.round(score),
      message:
        score > 50
          ? 'Good start! You hit several key points.'
          : 'Try to include more specific technical details.',
      missed: requiredPoints,
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      evaluateAnswer(userTranscript);
    } else {
      setUserTranscript('');
      setFeedback(null);
      if (recognitionRef.current) recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserTranscript('');
    setCurrentIdx((prev) => Math.min(prev + 1, questions.length - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Interview Room...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center gap-4">
        No questions found for this analysis.
        <button onClick={() => navigate('/dashboard')} className="text-indigo-400 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const recordBtnClass = isRecording
    ? 'px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
    : 'px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-400" /> AI Voice Mock Interview
            </h1>
            <p className="text-slate-400 text-sm">
              Question {currentIdx + 1} of {questions.length} &bull; Category: {currentQ.category}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: AI Interviewer */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center relative shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                  <MessageSquare className="w-10 h-10 text-indigo-400" />
                  <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white leading-relaxed">
                    &ldquo;{currentQ.question}&rdquo;
                  </h3>
                </div>
                <button
                  onClick={speakQuestion}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Play className="w-4 h-4" /> Listen to Question
                </button>
              </div>
            </div>

            {/* Right: User Response */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300">Your Response</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Live Transcript
                </span>
              </div>

              <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 font-mono text-sm text-slate-300 overflow-y-auto min-h-[200px]">
                {userTranscript || (
                  <span className="text-slate-600 italic">
                    Click Start Recording and speak your answer clearly...
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button onClick={toggleRecording} className={recordBtnClass}>
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 fill-current" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Start Recording
                    </>
                  )}
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={isRecording}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold flex items-center gap-2 transition-all border border-slate-700"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Panel */}
          {feedback && (
            <div className="mt-6 glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Instant Feedback
              </h3>
              <p className="text-sm text-slate-300 mb-4">{feedback.message}</p>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Points to Mention:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {feedback.missed.map((pt, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
