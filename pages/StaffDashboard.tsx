
import React, { useState } from 'react';
import { Application } from '../types';

interface StaffDashboardProps {
  applications: Application[];
  onStatusChange: (id: string, status: Application['status']) => void;
  onGiveFeedback: (appId: string, week: number, feedback: string, needsRevision: boolean, revisionPrompt?: string) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ applications, onStatusChange, onGiveFeedback }) => {
  const [activeView, setActiveView] = useState('submissions');
  const [notification, setNotification] = useState<string | null>(null);
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [revisionInputs, setRevisionInputs] = useState<Record<string, string>>({});
  const [reviewModes, setReviewModes] = useState<Record<string, 'reviewed' | 'needs-revision'>>({});

  const handleStatusUpdate = (id: string, status: Application['status']) => {
    onStatusChange(id, status);
    setNotification(`Candidate status updated to ${status}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const submitFeedback = (appId: string, week: number) => {
    const key = `${appId}-${week}`;
    const feedback = feedbackInputs[key];
    const mode = reviewModes[key] || 'reviewed';
    const needsRevision = mode === 'needs-revision';
    const revisionPrompt = revisionInputs[key];

    if (feedback) {
      onGiveFeedback(appId, week, feedback, needsRevision, revisionPrompt);
      setNotification(needsRevision ? `Revision requested and published to student portal.` : `Analysis published to student portal.`);
      setFeedbackInputs(prev => ({ ...prev, [key]: '' }));
      setRevisionInputs(prev => ({ ...prev, [key]: '' }));
      setReviewModes(prev => ({ ...prev, [key]: 'reviewed' }));
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const navItems = [
    { id: 'cohort', label: 'Cohort Overview' },
    { id: 'inbox', label: 'Candidates' },
    { id: 'submissions', label: 'Briefing Review' },
    { id: 'payments', label: 'Financials' },
    { id: 'messaging', label: 'Support Desk' },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'submissions':
        return (
          <div className="space-y-12 fade-in">
            {applications.filter(a => a.status === 'Accepted').map(app => (
              <div key={app.id} className="bg-white border border-primary/5 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-primary/5 bg-bgSoft/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-serif text-primary">{app.studentName}</h3>
                    <p className="text-[10px] uppercase font-bold opacity-30 tracking-[0.3em]">C-01 Candidate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif text-accent">{app.submissions.length} / 8</p>
                    <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Milestones Complete</p>
                  </div>
                </div>
                <div className="p-10 space-y-12">
                  {app.submissions.length === 0 ? (
                    <div className="text-center py-16 text-sm opacity-20 italic font-serif">Awaiting candidate briefings.</div>
                  ) : (
                    app.submissions.map(sub => (
                      <div key={sub.week} className="grid md:grid-cols-2 gap-12 p-10 border border-primary/5 bg-bgSoft/10 rounded-sm">
                        <div>
                          <div className="flex justify-between mb-6">
                            <span className="text-[10px] uppercase font-bold text-accent tracking-[0.4em]">Laboratory W.0{sub.week}: {sub.title}</span>
                            <span className="text-[9px] opacity-30 font-bold uppercase tracking-widest">{sub.submittedAt}</span>
                          </div>
                          <div className="mb-4">
                            <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold rounded-sm border ${sub.status === 'Reviewed' ? 'bg-green-50 text-green-700 border-green-200' : sub.status === 'Needs Revision' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-primary/5 text-primary/60 border-primary/10'}`}>
                              {sub.status}
                            </span>
                          </div>
                          <div className="bg-white p-8 border border-primary/5 shadow-inner">
                             <p className="text-base leading-relaxed text-primary/70 whitespace-pre-wrap font-serif italic">"{sub.content}"</p>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] uppercase font-bold opacity-30 mb-4 tracking-widest">Facilitator Diagnosis</label>
                          {(sub.status === 'Reviewed' || sub.status === 'Needs Revision') ? (
                            <div className="bg-white p-8 border border-accent/20 italic text-sm opacity-70 font-serif leading-relaxed">
                              <p>{sub.feedback}</p>
                              {sub.status === 'Needs Revision' && sub.revisionPrompt && (
                                <p className="not-italic mt-4 text-[11px] uppercase tracking-widest font-bold opacity-60">Next step: {sub.revisionPrompt}</p>
                              )}
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                  onClick={() => setReviewModes(prev => ({ ...prev, [`${app.id}-${sub.week}`]: 'reviewed' }))}
                                  className={`py-3 text-[10px] uppercase tracking-widest font-bold border ${ (reviewModes[`${app.id}-${sub.week}`] || 'reviewed') === 'reviewed' ? 'bg-green-50 border-green-300 text-green-700' : 'border-primary/20 opacity-60'}`}
                                >
                                  Mark Reviewed
                                </button>
                                <button
                                  onClick={() => setReviewModes(prev => ({ ...prev, [`${app.id}-${sub.week}`]: 'needs-revision' }))}
                                  className={`py-3 text-[10px] uppercase tracking-widest font-bold border ${ (reviewModes[`${app.id}-${sub.week}`] || 'reviewed') === 'needs-revision' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-primary/20 opacity-60'}`}
                                >
                                  Request Revision
                                </button>
                              </div>
                              <textarea 
                                value={feedbackInputs[`${app.id}-${sub.week}`] || ''}
                                onChange={e => setFeedbackInputs({...feedbackInputs, [`${app.id}-${sub.week}`]: e.target.value})}
                                placeholder="Enter executive feedback..."
                                className="flex-grow bg-white border border-primary/10 p-6 text-sm focus:border-accent outline-none font-sans shadow-sm"
                              />
                              {(reviewModes[`${app.id}-${sub.week}`] || 'reviewed') === 'needs-revision' && (
                                <textarea
                                  value={revisionInputs[`${app.id}-${sub.week}`] || ''}
                                  onChange={e => setRevisionInputs({ ...revisionInputs, [`${app.id}-${sub.week}`]: e.target.value })}
                                  placeholder="Add one clear next-step prompt for the student..."
                                  className="mt-4 bg-white border border-amber-200 p-6 text-sm focus:border-amber-400 outline-none font-sans shadow-sm"
                                />
                              )}
                              <button 
                                onClick={() => submitFeedback(app.id, sub.week)}
                                className="mt-6 bg-primary text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent transition-all"
                              >
                                Publish to Student
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'inbox':
        return (
          <div className="bg-white border border-primary/5 shadow-sm fade-in">
             <div className="p-10 border-b border-primary/5 bg-bgSoft/20 font-serif text-3xl">Candidate Stream</div>
             <table className="w-full text-left">
                <thead className="bg-bgSoft text-[10px] uppercase tracking-[0.4em] opacity-40">
                  <tr>
                    <th className="px-10 py-5 font-bold">Candidate</th>
                    <th className="px-10 py-5 font-bold">Status</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-bgSoft/20 transition-colors">
                      <td className="px-10 py-8">
                        <p className="font-serif text-xl text-primary">{app.studentName}</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mt-1">{app.parentName}</p>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold rounded-sm border ${app.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-accent/10 text-accent border-accent/30'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right space-x-3">
                        {app.status === 'Applied' && (
                          <button onClick={() => handleStatusUpdate(app.id, 'Accepted')} className="text-[9px] uppercase tracking-[0.2em] font-bold text-green-700 hover:bg-green-50 px-6 py-3 border border-green-300">Enroll Candidate</button>
                        )}
                        <button className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 hover:opacity-100">Review Application</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        );
      default:
        return <div className="text-center py-48 opacity-20 italic font-serif">Awaiting administrative input.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-bgSoft flex flex-col">
      {notification && (
        <div className="fixed top-28 right-12 z-[100] bg-primary text-white p-6 shadow-2xl border-l-8 border-accent fade-in">
           <p className="text-[10px] uppercase tracking-[0.4em] font-bold">{notification}</p>
        </div>
      )}

      <nav className="bg-white border-b border-primary/5 sticky top-20 z-40 px-12">
        <div className="max-w-7xl mx-auto flex gap-12 overflow-x-auto no-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`py-10 text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 transition-all whitespace-nowrap
                ${activeView === item.id ? 'text-accent border-accent' : 'text-primary/30 border-transparent hover:text-primary/60'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
             <span className="text-accent text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">Operations Center</span>
             <h1 className="text-6xl font-serif text-primary">Lab Headquarters</h1>
             <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mt-4 italic">Managing Enrollment Cycle C-01</p>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
