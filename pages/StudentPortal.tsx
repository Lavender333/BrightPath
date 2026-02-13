
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Application, Submission } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

// --- Audio Utilities ---
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface StudentPortalProps {
  application?: Application;
  onPostSubmission: (email: string, submission: Submission) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ application, onPostSubmission }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInspector = application?.parentEmail === 'tester@brightpath.org';
  
  // Navigation State linked to URL Search Params for back-button support
  const showModule = searchParams.get('module') ? parseInt(searchParams.get('module')!) : null;
  const showImageLab = searchParams.get('lab') === 'asset';
  const showPitchLab = searchParams.get('lab') === 'pitch';

  const [submissionText, setSubmissionText] = useState('');
  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  
  // AI State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);
  const [auditSources, setAuditSources] = useState<any[]>([]);

  // Asset Lab State
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Video Pitch Lab State
  const [labMode, setLabMode] = useState<'record' | 'ai-gen' | 'live-coach'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [aiVideoPrompt, setAiVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenStatus, setVideoGenStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Live API State
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveNextStartTimeRef = useRef(0);
  const liveSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simpleMode, setSimpleMode] = useState<boolean>(() => localStorage.getItem('bp_simple_mode') === '1');
  const [showCelebration, setShowCelebration] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('bp_checklists_v1');
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  });

  const aiAvailable = !!(process.env.API_KEY || process.env.GEMINI_API_KEY);

  useEffect(() => {
    localStorage.setItem('bp_simple_mode', simpleMode ? '1' : '0');
  }, [simpleMode]);

  useEffect(() => {
    localStorage.setItem('bp_checklists_v1', JSON.stringify(checklistState));
  }, [checklistState]);

  const reviewedCount = application?.submissions.filter(s => s.status === 'Reviewed').length || 0;
  const inRevisionCount = application?.submissions.filter(s => s.status === 'Needs Revision').length || 0;
  const submittedWeeks = new Set(application?.submissions.map(s => s.week) || []);
  const streak = [1,2,3,4,5,6,7,8].reduce((count, week) => submittedWeeks.has(week) ? count + 1 : count, 0);

  // Dashboard Metrics
  const currentWeek = application?.submissions.length ? Math.min(application.submissions.length + 1, 8) : 1;
  const daysLeft = 21; 

  useEffect(() => {
    const key = `bp_reviewed_count_${application?.id || 'unknown'}`;
    const prior = Number(localStorage.getItem(key) || '0');
    if (reviewedCount > prior) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    localStorage.setItem(key, String(reviewedCount));
  }, [reviewedCount, application?.id]);
  
  const portfolioPages = [
    { week: 1, title: 'My Strength Map', description: 'Know Your Superpowers' },
    { week: 2, title: 'Money Choices Lab', description: 'Needs vs Wants' },
    { week: 3, title: 'Fix-It Challenge', description: 'Spot Small Problems' },
    { week: 4, title: 'Team Update', description: 'Share Your Progress' },
    { week: 5, title: 'Choice Scorecard', description: 'Pick the Best Option' },
    { week: 6, title: 'One-Slide Story', description: 'Explain Clearly' },
    { week: 7, title: 'Practice Pitch', description: 'Confident Speaking' },
    { week: 8, title: 'Final Showcase', description: 'Celebrate Growth' },
  ];

  const curriculumMap: Record<number, any> = {
    1: {
      title: "Who Are You Becoming?",
      sections: [{ header: "Facilitator Brief", body: "Great leaders know themselves first. This week, you will name your strengths and set one clear goal you can work on every week." }],
      task: "Make a 1-page Strength + Goal Map (3 strengths, 1 goal, 3 action steps).",
      timeEstimate: "20-30 minutes",
      checklist: ["Name 3 strengths", "Write 1 clear goal", "Add 3 action steps you can do this week"],
      example: "My strengths are listening, creativity, and staying calm. My goal is to improve my class presentation confidence. This week I will practice twice, ask for feedback, and write key points.",
      parentSupport: ["Ask your child to explain their goal in one sentence", "Celebrate effort, not perfection", "Help schedule two short practice times"],
      fallback: "If AI tools are offline, record your pitch using your phone and upload notes instead."
    },
    2: {
      title: "How Value Works",
      sections: [{ header: "The Value Loop", body: "Money is about choices. You will practice telling the difference between needs and wants, then decide how to spend a small budget wisely." }],
      task: "Use a $20 pretend budget and explain how you would spend, save, and give.",
      timeEstimate: "25-35 minutes",
      checklist: ["List at least 2 needs and 2 wants", "Split $20 into spend/save/give", "Explain one trade-off choice"],
      example: "I would spend $8 on school supplies, save $8 for a future need, and give $4 to a community cause.",
      parentSupport: ["Discuss one real family trade-off this week", "Ask your child why they chose save/give amounts", "Praise clear reasoning"],
      fallback: "If AI is unavailable, use paper and pencil to create your budget chart."
    },
    3: {
      title: "Spotting Real Opportunities",
      sections: [{ header: "The Friction Audit", body: "Everyday annoyances are clues to good ideas. You will spot problems at home or school and choose one that is realistic for a kid to improve." }],
      task: "List 3 problems you notice and pick 1 to improve this month.",
      timeEstimate: "20-30 minutes",
      checklist: ["Find 3 small real-life problems", "Pick 1 problem you can influence", "Write one simple solution to test"],
      example: "Problem: Backpacks block the classroom aisle. Solution: create a labeled backpack zone near the wall.",
      parentSupport: ["Take a 10-minute observation walk together", "Help narrow to one realistic problem", "Ask: what is one next action?"],
      fallback: "If audio mentor is unavailable, use the written reflection prompts only."
    },
    4: {
      title: "Live Strategy Workshop",
      sections: [{ header: "Briefing Your Peers", body: "Strong communicators are clear and kind. In this live session, you will share your update in under 2 minutes and ask one thoughtful question." }],
      task: "Prepare a short update: What I tried, what worked, what I will do next.",
      timeEstimate: "15-20 minutes prep + live session",
      checklist: ["Keep update under 2 minutes", "Share one success and one challenge", "Ask one respectful question"],
      example: "I tested my idea with 2 classmates. It worked because instructions were clear. Next, I will make a visual guide.",
      parentSupport: ["Practice once at home with a timer", "Encourage eye contact and slow pace", "Use one positive + one growth comment"],
      fallback: "If you miss live, submit a recorded 90-second update."
    },
    5: {
      title: "Making Decisions Clearly",
      sections: [{ header: "The Decision Matrix", body: "Big choices get easier when you score your options. You will use simple points (1–5) to compare ideas and choose your best next step." }],
      task: "Create a 3-choice scorecard and explain why your top choice wins.",
      timeEstimate: "25-35 minutes",
      checklist: ["List 3 possible choices", "Score each choice 1-5 for impact/effort", "Explain why your winner is best"],
      example: "Choice A scored highest because it helps more people and can be done this week.",
      parentSupport: ["Ask child to explain scores out loud", "Check if choice is realistic for their age", "Help break first step into 10 minutes"],
      fallback: "If AI support is down, use the printable scorecard format in your notes."
    },
    6: {
      title: "Explaining Your Idea Clearly",
      sections: [{ header: "The Executive Brief", body: "If you can explain it simply, you understand it. This week, you will turn your idea into one clear slide with a title, plan, and impact." }],
      task: "Build a one-slide brief: Problem, Idea, Plan, and Why it matters.",
      timeEstimate: "30-40 minutes",
      checklist: ["Use one clear title", "Include Problem + Idea + Plan + Impact", "Keep text short and easy to read"],
      example: "Problem: litter near playground. Idea: student cleanup teams. Plan: 10-minute Friday cleanup. Impact: cleaner, safer play area.",
      parentSupport: ["Review slide for readability", "Ask child to explain each section aloud", "Encourage one visual (icon/photo)"],
      fallback: "If slide tools are unavailable, write the four sections in a notebook and upload a photo."
    },
    7: {
      title: "Pitch Practice (Live)",
      sections: [{ header: "The Calm Pause", body: "Confident speakers slow down and breathe. You will practice your 60–90 second pitch and answer two follow-up questions with calm focus." }],
      task: "Practice with the AI mentor and submit your best 60–90 second pitch.",
      timeEstimate: "20-30 minutes",
      checklist: ["Pitch is 60-90 seconds", "Speak clearly with pauses", "Answer 2 follow-up questions"],
      example: "My project solves hallway traffic jams by adding directional floor arrows. We tested it for one week and saw smoother movement.",
      parentSupport: ["Do 2 short rehearsals with timer", "Use calm breathing before recording", "Give one specific compliment"],
      fallback: "If live mentor is unavailable, use 3 practice questions: What problem? Why this idea? What is your next step?"
    },
    8: {
      title: "Final Reflection & Polish",
      sections: [{ header: "Portfolio Synthesis", body: "You have built real skills. Now you will show your growth with your best work samples and a short reflection on what you learned." }],
      task: "Submit your final mini-portfolio (best 3 artifacts + 1 reflection paragraph).",
      timeEstimate: "30-45 minutes",
      checklist: ["Pick your best 3 artifacts", "Write one reflection paragraph", "Name one skill you improved most"],
      example: "I improved at making clear decisions. My best artifact was the choice scorecard because it helped me choose confidently.",
      parentSupport: ["Review all 8 weeks and celebrate growth", "Ask child to choose their proudest work", "Help child share final reflection"],
      fallback: "If uploads fail, submit artifact titles + reflection text and retry media later."
    }
  };

  const closeOverlay = () => {
    if (isLiveConnected) stopLiveCoach();
    setSearchParams({});
    setAuditFeedback(null);
    setAuditSources([]);
  };

  const openModule = (week: number) => {
    const prior = application?.submissions.find(s => s.week === week);
    setSubmissionText(prior?.content || '');
    setSearchParams({ module: week.toString() });
  };
  const openLab = (type: 'asset' | 'pitch') => setSearchParams({ lab: type });

  const speakFallback = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- Camera/Mic Logic (Triggered ONLY on click) ---
  const startRecording = async () => {
    setRecordedVideoUrl(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Permission for camera/microphone is required to record your pitch.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  };

  const startLiveCoach = async () => {
    if (!aiAvailable) {
      alert("Live AI Mentor is unavailable right now. Use the fallback prompt cards in this module and submit a recorded practice pitch.");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveConnected(true);
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const blob = { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioStr = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioStr) {
              liveNextStartTimeRef.current = Math.max(liveNextStartTimeRef.current, outCtx.currentTime);
              const pcm = decodeBase64(audioStr);
              const buffer = await decodePCM(pcm, outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.start(liveNextStartTimeRef.current);
              liveNextStartTimeRef.current += buffer.duration;
              liveSourcesRef.current.add(source);
              source.onended = () => liveSourcesRef.current.delete(source);
            }
          },
          onclose: () => setIsLiveConnected(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are an executive pitch mentor for a 10-year-old student. Be encouraging and calm.',
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      alert("Live AI is unavailable right now. Use fallback questions: What problem are you solving? Why this idea? What is your next step?");
    }
  };

  const stopLiveCoach = () => {
    liveSessionRef.current?.close();
    setIsLiveConnected(false);
  };

  // --- TTS Implementation ---
  const narrateBriefing = async () => {
    if (showModule === null || isSpeaking) return;
    setIsSpeaking(true);
    const textToSpeak = curriculumMap[showModule].sections.map((s: any) => s.body).join(' ');
    if (!aiAvailable) {
      speakFallback(textToSpeak);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Narrate with authority: ${textToSpeak}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodePCM(decodeBase64(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (err) {
      speakFallback(textToSpeak);
    }
  };

  const handleFinalSubmit = () => {
    if (showModule === null) return;
    const existing = application?.submissions.find(s => s.week === showModule);
    onPostSubmission(application?.parentEmail || '', {
      week: showModule,
      title: curriculumMap[showModule].title,
      content: submissionText,
      status: 'Submitted',
      revisedAt: existing?.status === 'Needs Revision' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : existing?.revisedAt,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    closeOverlay();
    setSubmissionText('');
  };

  if (!application) return <div className="p-20 text-center font-serif">Unauthorized access.</div>;

  return (
    <div className="min-h-screen bg-bgSoft pb-24 fade-in">
      {showCelebration && (
        <div className="fixed top-24 right-8 z-[170] bg-green-600 text-white px-6 py-4 shadow-2xl rounded-sm text-[10px] uppercase tracking-[0.3em] font-bold">
          Milestone Approved 🎉 Keep going!
        </div>
      )}
      {!aiAvailable && (
        <div className="mx-auto max-w-7xl mt-6 px-12">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 text-sm rounded-sm">
            AI tools are currently offline. You can still complete every task using the built-in examples and fallback activities.
          </div>
        </div>
      )}
      {/* Overlays are gated by URL search params. Backspacing (browser back) removes them naturally. */}
      {showImageLab && (
        <div className="fixed inset-0 z-[160] bg-primary/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-sm shadow-2xl p-12 relative">
            <button onClick={closeOverlay} className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100">Close Lab</button>
            <h2 className="text-3xl font-serif text-primary mb-8">Visual Asset Laboratory</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Describe a strategic visual..." className="w-full h-40 bg-bgSoft p-6 text-sm border rounded-sm outline-none" />
                <button onClick={() => setIsGeneratingImage(true)} className="w-full bg-primary text-white py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent">Generate Visual</button>
              </div>
              <div className="aspect-square bg-bgSoft border rounded-sm flex items-center justify-center overflow-hidden">
                <p className="text-[10px] opacity-20 uppercase tracking-widest">Awaiting Synthesis</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPitchLab && (
        <div className="fixed inset-0 z-[150] bg-primary/98 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="max-w-6xl w-full bg-white h-[90vh] rounded-sm flex flex-col md:flex-row relative overflow-hidden">
            <button onClick={closeOverlay} className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest opacity-30 z-20">Exit Lab</button>
            <div className="w-full md:w-80 bg-bgSoft p-12 flex flex-col gap-8 border-r border-primary/5">
              <h2 className="text-2xl font-serif">Pitch Lab</h2>
              <button onClick={() => setLabMode('record')} className={`p-6 border text-left text-[10px] font-bold uppercase tracking-widest ${labMode === 'record' ? 'bg-white border-accent' : 'opacity-40'}`}>Capture</button>
              <button onClick={() => setLabMode('live-coach')} className={`p-6 border text-left text-[10px] font-bold uppercase tracking-widest ${labMode === 'live-coach' ? 'bg-white border-accent' : 'opacity-40'}`}>AI Mentor</button>
            </div>
            <div className="flex-1 p-12 flex flex-col items-center justify-center gap-12 overflow-y-auto">
              {labMode === 'record' && (
                <div className="w-full max-w-2xl text-center space-y-8">
                  <div className="aspect-video bg-primary rounded-sm overflow-hidden shadow-2xl">
                    {recordedVideoUrl ? <video src={recordedVideoUrl} controls className="w-full h-full object-cover" /> : <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale" />}
                  </div>
                  <div className="flex gap-4 justify-center">
                    {!isRecording ? <button onClick={startRecording} className="bg-accent text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest">Start Recording</button> : <button onClick={stopRecording} className="bg-red-600 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest">Stop</button>}
                  </div>
                </div>
              )}
              {labMode === 'live-coach' && (
                <div className="w-full max-w-2xl text-center space-y-12">
                  {!aiAvailable && (
                    <div className="text-left bg-amber-50 border border-amber-200 text-amber-800 p-4 text-sm rounded-sm">
                      AI mentor is offline. Fallback: answer 3 prompts — What problem am I solving? Why this idea? What is my next step?
                    </div>
                  )}
                  <div className="w-48 h-48 bg-accent/5 border border-accent/20 rounded-full mx-auto flex items-center justify-center relative">
                    <div className={`absolute inset-0 border-2 border-accent rounded-full ${isLiveConnected ? 'animate-ping' : 'opacity-0'}`}></div>
                    <svg className={`w-12 h-12 text-accent ${isLiveConnected ? 'scale-110' : 'opacity-50'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  </div>
                  {!isLiveConnected ? (
                    <button onClick={startLiveCoach} className="bg-primary text-white px-16 py-6 text-[10px] font-bold uppercase tracking-widest shadow-xl">Initiate Voice Session</button>
                  ) : (
                    <button onClick={stopLiveCoach} className="bg-red-600 text-white px-16 py-6 text-[10px] font-bold uppercase tracking-widest shadow-xl">Terminate Session</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModule !== null && (
        <div className="fixed inset-0 z-[100] bg-primary/98 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-7xl w-full bg-white h-[95vh] rounded-sm flex flex-col md:flex-row relative">
            <div className="flex-1 p-12 overflow-y-auto no-scrollbar">
               <div className="flex justify-between items-center mb-12">
                 <button onClick={closeOverlay} className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100">Portal Home</button>
                 <div className="flex items-center gap-3">
                   <button onClick={() => setSimpleMode(!simpleMode)} className="text-[10px] font-bold uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-full">
                     {simpleMode ? 'Standard View' : 'Simple View'}
                   </button>
                   <button onClick={narrateBriefing} disabled={isSpeaking} className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-3 border border-accent/20 px-6 py-2 rounded-full">
                   {isSpeaking ? 'AI Narrating...' : 'Listen to Briefing'}
                   </button>
                 </div>
               </div>
               <h2 className={`${simpleMode ? 'text-4xl' : 'text-5xl'} font-serif text-primary mb-6`}>{curriculumMap[showModule].title}</h2>
               <p className="text-[11px] uppercase tracking-widest font-bold text-accent mb-10">Time Estimate: {curriculumMap[showModule].timeEstimate}</p>
               <div className="space-y-16 mb-24">
                 {curriculumMap[showModule].sections.map((s: any, i: number) => (
                   <div key={i} className="group">
                     <p className={`${simpleMode ? 'text-xl' : 'text-2xl'} font-serif leading-relaxed text-primary/80 italic`}>"{s.body}"</p>
                   </div>
                 ))}
               </div>
               <div className="bg-bgSoft border border-primary/10 p-8 rounded-sm mb-8">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-primary/60">Success Checklist</h4>
                 <div className="space-y-3">
                   {curriculumMap[showModule].checklist.map((item: string, idx: number) => {
                     const cKey = `${application.id}-${showModule}-${idx}`;
                     return (
                       <label key={cKey} className="flex items-start gap-3 text-sm text-primary/80">
                         <input
                           type="checkbox"
                           checked={!!checklistState[cKey]}
                           onChange={e => setChecklistState(prev => ({ ...prev, [cKey]: e.target.checked }))}
                           className="mt-1"
                         />
                         <span>{item}</span>
                       </label>
                     );
                   })}
                 </div>
               </div>
               <div className="bg-white border border-accent/20 p-8 rounded-sm mb-8">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-accent">Example Response</h4>
                 <p className="text-sm leading-relaxed text-primary/80">{curriculumMap[showModule].example}</p>
               </div>
               {application.submissions.find(s => s.week === showModule)?.status === 'Needs Revision' && (
                 <div className="bg-amber-50 border border-amber-200 p-8 rounded-sm mb-8">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-amber-700">Revision Requested</h4>
                   <p className="text-sm mb-3 text-amber-900">{application.submissions.find(s => s.week === showModule)?.feedback}</p>
                   <p className="text-sm font-semibold text-amber-900">Next Step: {application.submissions.find(s => s.week === showModule)?.revisionPrompt || 'Use checklist + example and revise clearly.'}</p>
                 </div>
               )}
               <div className="bg-primary text-white p-12 rounded-sm shadow-xl">
                 <h4 className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-6">Task</h4>
                 <p className="text-2xl font-serif mb-6 leading-tight">"{curriculumMap[showModule].task}"</p>
                 <p className="text-xs opacity-80">Fallback Activity: {curriculumMap[showModule].fallback}</p>
               </div>
            </div>
            <div className="w-full md:w-[450px] bg-bgSoft p-12 flex flex-col gap-10 border-l border-primary/5">
              <h3 className="text-2xl font-serif">My Submission</h3>
              <p className="text-xs uppercase tracking-widest font-bold opacity-50">Tip: use 4 short parts — Problem, Idea, Plan, Impact.</p>
              <textarea value={submissionText} onChange={e => setSubmissionText(e.target.value)} className="flex-grow bg-white border p-8 rounded-sm text-base outline-none font-sans shadow-sm" placeholder="Write your response in short clear sentences..." />
              <button onClick={handleFinalSubmit} className="w-full bg-primary text-white py-8 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-accent shadow-2xl transition-all">
                {application.submissions.find(s => s.week === showModule)?.status === 'Needs Revision' ? 'Resubmit Milestone' : 'Publish Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-12 py-16">
        <header className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-4">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.6em] block">BrightPath Lab HQ</span>
            <h1 className="text-7xl font-serif text-primary">Hello, {application.studentName}</h1>
            <button onClick={() => setSimpleMode(!simpleMode)} className="text-[10px] font-bold uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-full bg-white">
              {simpleMode ? 'Standard View' : 'Simple View'}
            </button>
          </div>
          <div className="flex gap-4">
             <div className="bg-white p-8 border border-primary/5 rounded-sm shadow-sm text-center min-w-[150px]">
               <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Days Remaining</p>
               <p className="text-4xl font-serif">{daysLeft}D</p>
             </div>
             <div className="bg-white p-8 border border-primary/5 rounded-sm shadow-sm text-center min-w-[150px]">
               <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Reviewed</p>
               <p className="text-4xl font-serif text-green-700">{reviewedCount}</p>
             </div>
             <div className="bg-white p-8 border border-primary/5 rounded-sm shadow-sm text-center min-w-[150px]">
               <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">Streak</p>
               <p className="text-4xl font-serif text-accent">{streak}</p>
             </div>
             <button onClick={() => openLab('asset')} className="bg-accent text-white p-8 rounded-sm shadow-xl flex flex-col items-center justify-center min-w-[150px] hover:scale-105 transition-all">
               <p className="text-[9px] font-bold uppercase tracking-widest mb-2 font-bold">Asset Lab</p>
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            <div className="bg-white p-16 border border-primary/5 shadow-sm relative group hover:shadow-2xl transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent group-hover:w-3 transition-all"></div>
              <h3 className="text-4xl font-serif mb-6 text-primary">Active Milestone: 0{currentWeek}</h3>
              <p className="opacity-60 text-xl font-serif italic mb-10 leading-relaxed max-w-xl">"{curriculumMap[currentWeek]?.title}" — One clear step at a time.</p>
              <button onClick={() => openModule(currentWeek)} className="bg-primary text-white px-12 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent shadow-xl transition-all">Enter Lab Environment</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {portfolioPages.map((page) => {
                const sub = application.submissions.find(s => s.week === page.week);
                const isComplete = sub?.status === 'Reviewed';
                const isPending = sub?.status === 'Submitted';
                const needsRevision = sub?.status === 'Needs Revision';
                const isActive = (page.week === currentWeek && !sub) || needsRevision || isInspector;

                return (
                  <div key={page.week} onClick={() => { if (isActive) openModule(page.week); }}
                    className={`p-8 border flex flex-col justify-between rounded-sm transition-all duration-700 aspect-[3/4.8] relative group cursor-pointer
                      ${isComplete ? 'bg-white border-accent shadow-sm' : needsRevision ? 'bg-amber-50 border-amber-300' : isPending ? 'bg-white opacity-70' : isActive ? 'bg-white border-dashed border-accent/50 hover:border-accent' : 'bg-bgSoft opacity-30 grayscale'}`}
                  >
                    <div>
                      <p className="text-[10px] font-bold opacity-30 tracking-widest mb-8">W.0{page.week}</p>
                      <h4 className="text-lg font-serif font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">{page.title}</h4>
                      <p className="text-[10px] opacity-40 leading-relaxed uppercase tracking-widest font-bold">{page.description}</p>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase pt-6 border-t border-primary/5 group-hover:tracking-[0.2em] transition-all">
                      {isComplete ? 'Published' : needsRevision ? 'Revise' : isPending ? 'Analyzing' : isActive ? 'Active' : 'Locked'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-16">
            <div className="bg-white p-12 border border-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-6">Badges & Wins</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-4 border ${reviewedCount >= 1 ? 'bg-green-50 border-green-200' : 'opacity-40'}`}>
                  <p className="text-xs font-bold">Starter</p>
                  <p className="text-[10px] opacity-60">First review earned</p>
                </div>
                <div className={`p-4 border ${streak >= 3 ? 'bg-accent/10 border-accent/40' : 'opacity-40'}`}>
                  <p className="text-xs font-bold">Consistency</p>
                  <p className="text-[10px] opacity-60">3-week streak</p>
                </div>
                <div className={`p-4 border ${reviewedCount >= 5 ? 'bg-primary/10 border-primary/30' : 'opacity-40'}`}>
                  <p className="text-xs font-bold">Momentum</p>
                  <p className="text-[10px] opacity-60">5 reviews</p>
                </div>
                <div className={`p-4 border ${reviewedCount >= 8 ? 'bg-yellow-50 border-yellow-300' : 'opacity-40'}`}>
                  <p className="text-xs font-bold">Showcase Ready</p>
                  <p className="text-[10px] opacity-60">All milestones done</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 border border-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-4">Parent Snapshot</h4>
              <p className="text-sm mb-3"><strong>Progress:</strong> {reviewedCount}/8 reviewed, {inRevisionCount} need revision.</p>
              <p className="text-sm mb-4"><strong>This Week:</strong> {curriculumMap[currentWeek]?.title}</p>
              <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">At-home support</h5>
              <ul className="list-disc pl-5 space-y-2 text-sm text-primary/80">
                {curriculumMap[currentWeek]?.parentSupport?.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-12 border border-primary/5 shadow-sm">
               <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-10">Facilitator Stream</h4>
               <div className="space-y-12">
                 {application.submissions.filter(s => s.feedback).map(s => (
                   <div key={s.week} className="border-l-2 border-accent/20 pl-8 group">
                     <p className="text-lg font-serif italic mb-4 opacity-70 leading-relaxed">"{s.feedback}"</p>
                     {s.status === 'Needs Revision' && (
                       <p className="text-[10px] uppercase tracking-widest font-bold text-amber-700 mb-2">Revision Prompt: {s.revisionPrompt || 'Revise with checklist and resubmit.'}</p>
                     )}
                     <p className="text-[9px] font-bold opacity-30 tracking-widest uppercase">W.0{s.week} Portfolio Review</p>
                   </div>
                 ))}
               </div>
            </div>
            <button onClick={() => openLab('pitch')} className="w-full bg-primary text-white p-12 relative overflow-hidden shadow-2xl hover:-translate-y-2 transition-all group">
               <h4 className="text-accent text-[11px] font-bold uppercase tracking-[0.5em] mb-6">Pitch Laboratory</h4>
               <p className="text-sm opacity-60 font-serif italic text-left leading-relaxed">Practice your authority. Capture your briefing. Engage with the Live AI Coach.</p>
               <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white border border-white/20 py-5 group-hover:bg-accent group-hover:border-accent">Enter Pitch Lab</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
