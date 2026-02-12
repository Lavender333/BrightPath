
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Program from './pages/Program';
import Apply from './pages/Apply';
import About from './pages/About';
import Board from './pages/Board';
import Impact from './pages/Impact';
import Sponsor from './pages/Sponsor';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import StudentPortal from './pages/StudentPortal';
import { Page, Application, Message, Submission } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [userType, setUserType] = useState<'staff' | 'student' | null>(null);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  
  const [apps, setApps] = useState<Application[]>([
    { 
      id: '101', 
      studentName: 'Emma Vance', 
      age: 11, 
      appliedDate: 'Oct 12', 
      status: 'Accepted', 
      parentName: 'Sarah Vance', 
      parentEmail: 'parent@test.com', 
      note: 'Strong tech interest',
      paymentStatus: 'Deposit Paid',
      messages: [],
      submissions: [
        { week: 1, title: 'Identity & Goal Map', content: 'My goal is to learn how to lead a small team by the end of the year.', status: 'Reviewed', feedback: 'Great clarity on your leadership style, Emma.', submittedAt: 'Oct 15' },
        { week: 2, title: 'The Value Scenarios', content: 'I chose to invest in the community garden because it creates long-term value for everyone.', status: 'Reviewed', feedback: 'Thoughtful analysis of social capital.', submittedAt: 'Oct 22' }
      ]
    },
    {
      id: 'tester',
      studentName: 'Inspector Candidate',
      age: 12,
      appliedDate: 'Today',
      status: 'Accepted',
      parentName: 'HQ Evaluator',
      parentEmail: 'tester@brightpath.org',
      note: 'Full Module Access Account',
      paymentStatus: 'Fully Paid',
      messages: [],
      submissions: []
    },
    { 
      id: '102', 
      studentName: 'Julian Reed', 
      age: 12, 
      appliedDate: 'Oct 11', 
      status: 'Accepted', 
      parentName: 'Mark Reed', 
      parentEmail: 'j.reed@parent.com', 
      note: 'Entrepreneurial mindset',
      paymentStatus: 'Unpaid',
      messages: [],
      submissions: []
    }
  ]);

  const addApplication = (newApp: Partial<Application>) => {
    const app: Application = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: newApp.studentName || '',
      age: newApp.age || 0,
      parentName: newApp.parentName || '',
      parentEmail: newApp.parentEmail || '',
      status: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      paymentStatus: 'Unpaid',
      note: '',
      messages: [],
      submissions: []
    };
    setApps(prev => [app, ...prev]);
  };

  const updateAppStatus = (id: string, status: Application['status']) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSubmission = (studentEmail: string, submission: Submission) => {
    setApps(prev => prev.map(a => {
      if (a.parentEmail === studentEmail) {
        const existing = a.submissions.find(s => s.week === submission.week);
        if (existing) {
          return {
            ...a,
            submissions: a.submissions.map(s => s.week === submission.week ? { ...s, ...submission } : s)
          };
        }
        return { ...a, submissions: [...a.submissions, submission] };
      }
      return a;
    }));
  };

  const handleFeedback = (appId: string, week: number, feedback: string) => {
    setApps(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          submissions: a.submissions.map(s => s.week === week ? { ...s, feedback, status: 'Reviewed' as const } : s)
        };
      }
      return a;
    }));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen font-sans">
        <ScrollToTop />
        <Navbar userType={userType} onLogout={() => { setUserType(null); setActiveEmail(null); }} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/program" element={<Program />} />
            <Route path="/apply" element={<Apply onApply={addApplication} />} />
            <Route path="/about" element={<About />} />
            <Route path="/board" element={<Board />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/login" element={<Login onLogin={(type, email) => { setUserType(type); setActiveEmail(email || 'parent@test.com'); }} />} />
            
            <Route path="/staff" element={
              <StaffDashboard 
                applications={apps} 
                onStatusChange={updateAppStatus} 
                onGiveFeedback={handleFeedback}
              />
            } />
            <Route path="/portal" element={
              <StudentPortal 
                application={apps.find(a => a.parentEmail === (activeEmail || 'parent@test.com'))} 
                onPostSubmission={handleSubmission}
              />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
