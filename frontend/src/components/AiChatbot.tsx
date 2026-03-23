'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'Which course should I start with?',
  'How does video locking work?',
  'How do I track my progress?',
  'What topics does Python cover?',
];

// Simple rule-based responses — no API key needed
function getResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('python')) return 'The Python Full Course covers variables, data types, control flow, OOP, file handling, and working with APIs. Great for beginners!';
  if (q.includes('typescript') || q.includes('ts')) return 'The TypeScript Masterclass goes from basics (types, interfaces) to advanced topics like generics, decorators, and using TypeScript with React.';
  if (q.includes('docker')) return 'Docker in 2 Hours covers containers, images, Dockerfiles, Docker Compose, volumes, and multi-container apps. Perfect for DevOps beginners.';
  if (q.includes('sql')) return 'SQL in 4 Hours covers SELECT, filtering, sorting, JOINs, subqueries, CTEs, and performance with indexes. Great for backend developers.';
  if (q.includes('react')) return 'The React Complete Guide covers components, props, state, hooks (useState, useEffect, useContext), and custom hooks with real project walkthroughs.';
  if (q.includes('javascript') || q.includes('js')) return 'JavaScript Fundamentals covers variables, functions, DOM manipulation, arrow functions, promises, and async/await — perfect for beginners.';

  if (q.includes('start') || q.includes('begin') || q.includes('first') || q.includes('recommend')) {
    return 'I recommend starting with JavaScript Fundamentals if you\'re new to programming. If you already know JS, try TypeScript Masterclass or React Complete Guide next!';
  }
  if (q.includes('lock') || q.includes('unlock') || q.includes('locked')) {
    return 'Videos are unlocked sequentially — you must complete each video before the next one unlocks. This ensures you build knowledge step by step. The first video in every course is always unlocked.';
  }
  if (q.includes('progress') || q.includes('track')) {
    return 'Your progress is tracked automatically as you watch videos. The player saves your position every 5 seconds, and marks a video complete when it ends. You can see your progress % on each course page.';
  }
  if (q.includes('free') || q.includes('cost') || q.includes('price') || q.includes('pay')) {
    return 'All courses on Kodemy are completely free! Just create an account and enroll in any course to get started.';
  }
  if (q.includes('certificate') || q.includes('cert')) {
    return 'Certificates are coming soon! Complete a course and you\'ll be able to download a certificate of completion.';
  }
  if (q.includes('how many') || q.includes('courses')) {
    return 'We currently have 6 expert courses: JavaScript Fundamentals, TypeScript Masterclass, React Complete Guide, Python Full Course, Docker in 2 Hours, and SQL in 4 Hours.';
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return 'Hey there! 👋 I\'m your Kodemy AI Assistant. Ask me about any course, how the platform works, or which course to start with!';
  }
  if (q.includes('thank')) {
    return 'You\'re welcome! Happy learning! 🚀 Let me know if you have any other questions.';
  }

  return 'Great question! I can help you with course recommendations, explain how the platform works, or tell you about specific courses. Try asking "Which course should I start with?" or "What does the Python course cover?"';
}

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I\'m your Kodemy AI Assistant. Ask me anything about our courses or how the platform works! 🎓' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Listen for navbar button click
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const reply = getResponse(text);
    setTyping(false);
    setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-105"
        aria-label="Open AI Assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✦</div>
            <div>
              <p className="text-white font-semibold text-sm">Kodemy AI Assistant</p>
              <p className="text-gray-400 text-xs">Ask me anything about courses</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 flex gap-2 flex-wrap border-t border-gray-100 bg-white">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-2.5 py-1.5 rounded-full transition-colors border border-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about courses..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-3 py-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
