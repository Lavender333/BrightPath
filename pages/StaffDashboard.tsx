
import React, { useState } from 'react';
import { Application, ImpactSnapshot, ImpactStage } from '../types';

interface StaffDashboardProps {
  applications: Application[];
  onStatusChange: (id: string, status: Application['status']) => void;
  onGiveFeedback: (appId: string, week: number, feedback: string, needsRevision: boolean, revisionPrompt?: string) => void;
  onSaveImpact: (appId: string, stage: ImpactStage, snapshot: ImpactSnapshot) => void;
}

const emptyImpactSnapshot = (): Omit<ImpactSnapshot, 'recordedAt'> => ({
  decisionQuality: 2,
  communicationClarity: 2,
  selfManagement: 2,
  financialReasoning: 2,
  confidenceScore: 2,
  notes: '',
});

const StaffDashboard: React.FC<StaffDashboardProps> = ({ applications, onStatusChange, onGiveFeedback, onSaveImpact }) => {
  const [activeView, setActiveView] = useState('submissions');
  const [notification, setNotification] = useState<string | null>(null);
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [revisionInputs, setRevisionInputs] = useState<Record<string, string>>({});
  const [reviewModes, setReviewModes] = useState<Record<string, 'reviewed' | 'needs-revision'>>({});
  const [impactStage, setImpactStage] = useState<ImpactStage>('baseline');
  const [impactDrafts, setImpactDrafts] = useState<Record<string, Omit<ImpactSnapshot, 'recordedAt'>>>({});

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

  const acceptedApps = applications.filter(a => a.status === 'Accepted');
  const domains: Array<keyof Omit<ImpactSnapshot, 'notes' | 'recordedAt'>> = [
    'decisionQuality',
    'communicationClarity',
    'selfManagement',
    'financialReasoning',
    'confidenceScore',
  ];

  const getLatestSnapshot = (app: Application) => app.impact?.final || app.impact?.midpoint || app.impact?.baseline;

  const gainRows = acceptedApps
    .map(app => {
      const baseline = app.impact?.baseline;
      const latest = getLatestSnapshot(app);
      if (!baseline || !latest) return null;
      const gains = domains.map(d => latest[d] - baseline[d]);
      return { app, gains, improvedDomains: gains.filter(g => g > 0).length };
    })
    .filter(Boolean) as Array<{ app: Application; gains: number[]; improvedDomains: number }>;

  const cohortCoverage = {
    baseline: acceptedApps.filter(a => a.impact?.baseline).length,
    midpoint: acceptedApps.filter(a => a.impact?.midpoint).length,
    final: acceptedApps.filter(a => a.impact?.final).length,
  };

  const avgGainByDomain = domains.map((_, idx) => {
    if (!gainRows.length) return 0;
    const total = gainRows.reduce((sum, row) => sum + row.gains[idx], 0);
    return Number((total / gainRows.length).toFixed(2));
  });

  const improved3PlusRate = gainRows.length
    ? Math.round((gainRows.filter(r => r.improvedDomains >= 3).length / gainRows.length) * 100)
    : 0;

  const saveImpactSnapshot = (app: Application) => {
    const draft = impactDrafts[app.id] || emptyImpactSnapshot();
    const snapshot: ImpactSnapshot = {
      ...draft,
      recordedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    onSaveImpact(app.id, impactStage, snapshot);
    setNotification(`Saved ${impactStage} rubric for ${app.studentName}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvText = rows
      .map(cols => cols.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportStudentImpactCsv = () => {
    const rows: string[][] = [[
      'studentName',
      'parentEmail',
      'baselineDecision', 'baselineCommunication', 'baselineSelfManagement', 'baselineFinancial', 'baselineConfidence', 'baselineDate',
      'midpointDecision', 'midpointCommunication', 'midpointSelfManagement', 'midpointFinancial', 'midpointConfidence', 'midpointDate',
      'finalDecision', 'finalCommunication', 'finalSelfManagement', 'finalFinancial', 'finalConfidence', 'finalDate',
      'improvedDomainsCount',
    ]];

    acceptedApps.forEach(app => {
      const baseline = app.impact?.baseline;
      const midpoint = app.impact?.midpoint;
      const final = app.impact?.final;
      const latest = final || midpoint || baseline;
      const improvedDomains = baseline && latest
        ? domains.reduce((count, domain) => count + (latest[domain] > baseline[domain] ? 1 : 0), 0)
        : 0;

      rows.push([
        app.studentName,
        app.parentEmail,
        String(baseline?.decisionQuality ?? ''),
        String(baseline?.communicationClarity ?? ''),
        String(baseline?.selfManagement ?? ''),
        String(baseline?.financialReasoning ?? ''),
        String(baseline?.confidenceScore ?? ''),
        baseline?.recordedAt ?? '',
        String(midpoint?.decisionQuality ?? ''),
        String(midpoint?.communicationClarity ?? ''),
        String(midpoint?.selfManagement ?? ''),
        String(midpoint?.financialReasoning ?? ''),
        String(midpoint?.confidenceScore ?? ''),
        midpoint?.recordedAt ?? '',
        String(final?.decisionQuality ?? ''),
        String(final?.communicationClarity ?? ''),
        String(final?.selfManagement ?? ''),
        String(final?.financialReasoning ?? ''),
        String(final?.confidenceScore ?? ''),
        final?.recordedAt ?? '',
        String(improvedDomains),
      ]);
    });

    downloadCsv('brightpath-impact-student-report.csv', rows);
    setNotification('Student impact CSV exported.');
    setTimeout(() => setNotification(null), 3000);
  };

  const exportCohortSummaryCsv = () => {
    const rows: string[][] = [
      ['metric', 'value'],
      ['accepted_students', String(acceptedApps.length)],
      ['baseline_coverage', `${cohortCoverage.baseline}/${acceptedApps.length}`],
      ['midpoint_coverage', `${cohortCoverage.midpoint}/${acceptedApps.length}`],
      ['final_coverage', `${cohortCoverage.final}/${acceptedApps.length}`],
      ['improved_3_plus_domains_rate_percent', String(improved3PlusRate)],
      ['avg_gain_decision', String(avgGainByDomain[0])],
      ['avg_gain_communication', String(avgGainByDomain[1])],
      ['avg_gain_self_management', String(avgGainByDomain[2])],
      ['avg_gain_financial_reasoning', String(avgGainByDomain[3])],
      ['avg_gain_confidence', String(avgGainByDomain[4])],
    ];

    downloadCsv('brightpath-impact-cohort-summary.csv', rows);
    setNotification('Cohort summary CSV exported.');
    setTimeout(() => setNotification(null), 3000);
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
      case 'cohort':
        return (
          <div className="space-y-10 fade-in">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white border border-primary/5 p-6">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Accepted Students</p>
                <p className="text-3xl font-serif text-primary mt-2">{acceptedApps.length}</p>
              </div>
              <div className="bg-white border border-primary/5 p-6">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Baseline Coverage</p>
                <p className="text-3xl font-serif text-primary mt-2">{cohortCoverage.baseline}/{acceptedApps.length}</p>
              </div>
              <div className="bg-white border border-primary/5 p-6">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Final Coverage</p>
                <p className="text-3xl font-serif text-primary mt-2">{cohortCoverage.final}/{acceptedApps.length}</p>
              </div>
              <div className="bg-white border border-primary/5 p-6">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Improved 3+ Domains</p>
                <p className="text-3xl font-serif text-green-700 mt-2">{improved3PlusRate}%</p>
              </div>
            </div>

            <div className="bg-white border border-primary/5 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-serif text-primary">Cohort Growth Snapshot (Baseline → Latest)</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={exportStudentImpactCsv}
                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/20 hover:border-accent hover:text-accent"
                  >
                    Export Student CSV
                  </button>
                  <button
                    onClick={exportCohortSummaryCsv}
                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/20 hover:border-accent hover:text-accent"
                  >
                    Export Cohort CSV
                  </button>
                  {(['baseline', 'midpoint', 'final'] as ImpactStage[]).map(stage => (
                    <button
                      key={stage}
                      onClick={() => setImpactStage(stage)}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border ${impactStage === stage ? 'bg-accent text-white border-accent' : 'border-primary/20 opacity-70'}`}
                    >
                      Record {stage}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-5 gap-3 text-center">
                <div className="p-4 bg-bgSoft border border-primary/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Decision</p>
                  <p className="text-2xl font-serif mt-1">{avgGainByDomain[0]}</p>
                </div>
                <div className="p-4 bg-bgSoft border border-primary/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Communication</p>
                  <p className="text-2xl font-serif mt-1">{avgGainByDomain[1]}</p>
                </div>
                <div className="p-4 bg-bgSoft border border-primary/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Self-Management</p>
                  <p className="text-2xl font-serif mt-1">{avgGainByDomain[2]}</p>
                </div>
                <div className="p-4 bg-bgSoft border border-primary/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Financial</p>
                  <p className="text-2xl font-serif mt-1">{avgGainByDomain[3]}</p>
                </div>
                <div className="p-4 bg-bgSoft border border-primary/5">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Confidence</p>
                  <p className="text-2xl font-serif mt-1">{avgGainByDomain[4]}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {acceptedApps.map(app => {
                const existing = app.impact?.[impactStage];
                const draft = impactDrafts[app.id] || {
                  ...(existing || emptyImpactSnapshot()),
                };
                return (
                  <div key={app.id} className="bg-white border border-primary/5 p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                      <h4 className="text-2xl font-serif text-primary">{app.studentName}</h4>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                        Recording: {impactStage} {existing?.recordedAt ? `• Last saved ${existing.recordedAt}` : ''}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-5 gap-3 mb-4">
                      {[
                        { key: 'decisionQuality', label: 'Decision' },
                        { key: 'communicationClarity', label: 'Communication' },
                        { key: 'selfManagement', label: 'Self-Manage' },
                        { key: 'financialReasoning', label: 'Financial' },
                        { key: 'confidenceScore', label: 'Confidence' },
                      ].map(field => (
                        <div key={field.key} className="border border-primary/10 p-3 bg-bgSoft">
                          <label className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">{field.label}</label>
                          <select
                            value={draft[field.key as keyof Omit<ImpactSnapshot, 'recordedAt'>] as number}
                            onChange={(e) => {
                              const value = Number(e.target.value) as 1 | 2 | 3 | 4;
                              setImpactDrafts(prev => ({
                                ...prev,
                                [app.id]: {
                                  ...draft,
                                  [field.key]: value,
                                },
                              }));
                            }}
                            className="w-full bg-white border border-primary/20 p-2 text-sm"
                          >
                            <option value={1}>1 - Emerging</option>
                            <option value={2}>2 - Developing</option>
                            <option value={3}>3 - Proficient</option>
                            <option value={4}>4 - Advanced</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={draft.notes || ''}
                      onChange={(e) => setImpactDrafts(prev => ({ ...prev, [app.id]: { ...draft, notes: e.target.value } }))}
                      placeholder="Observation notes: behavior evidence, growth examples, and next support step..."
                      className="w-full border border-primary/10 p-4 text-sm mb-4"
                    />
                    <button
                      onClick={() => saveImpactSnapshot(app)}
                      className="bg-primary text-white px-6 py-3 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-accent"
                    >
                      Save {impactStage} Rubric
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
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
