
import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';
import FAQSection from '../components/FAQSection';

const Program: React.FC = () => {
  const curriculum = [
    { week: 1, title: 'Who Are You Becoming?', desc: 'Strengths + Goal Mapping. Students identify 3 strengths and build one age-appropriate growth goal.', live: false },
    { week: 2, title: 'How Value Works', desc: 'Money Choices Lab. Students practice needs vs wants using simple budget scenarios they can relate to.', live: false },
    { week: 3, title: 'Spotting Real Opportunities', desc: 'Fix-It Thinking. Students spot everyday problems at school/home and choose one realistic solution.', live: false },
    { week: 4, title: 'Live Strategy Workshop', desc: 'Live Cohort Session. Students share a short progress update and practice giving respectful peer feedback.', live: true },
    { week: 5, title: 'Making Decisions Clearly', desc: 'Choice Scorecards. Students compare 2-3 options with simple scoring to justify a decision.', live: false },
    { week: 6, title: 'Explaining Your Idea Clearly', desc: 'One-Slide Brief. Students organize their idea into a clear, kid-friendly structure.', live: false },
    { week: 7, title: 'Pitch Practice (Live)', desc: 'Live Session. Students rehearse a 60-90 second pitch and respond to guided Q&A with confidence.', live: true },
    { week: 8, title: 'Final Reflection & Polish', desc: 'Showcase Portfolio. Students submit their best work samples and reflect on personal growth.', live: false },
  ];

  const deliverySpecs = [
    { label: 'Format', value: 'Hybrid — Async modules + 3 required live Zoom sessions' },
    { label: 'Weekly Time', value: 'Approx. 45–60 minutes per week (Async + Task)' },
    { label: 'Live Sessions', value: 'Weeks 4, 7, and final Showcase Event' },
    { label: 'Session Length', value: '60 min (Weeks 4 & 7) / 90 min (Showcase)' },
    { label: 'Platform', value: 'Modules via BrightPath Lab. Live via Zoom.' },
    { label: 'Cohort Size', value: 'Maximum 6 students — No exceptions' },
    { label: 'Program Dates', value: 'Spring 2025 Cohort (See Enrollment Form)' },
    { label: 'Time Zone', value: 'Eastern Time — Recorded for async fallback (Weeks 4 & 7 only)' },
  ];

  const tuitionIncludes = [
    'Full 8-week curriculum access',
    '3 live facilitated Zoom sessions',
    'Portfolio template and weekly feedback',
    'BrightPath Showcase participation',
    'Printed portfolio (if in-person Showcase)',
    'Digital certificate of completion'
  ];

  const paymentSpecs = [
    { label: '$100 Deposit', value: 'Due at acceptance — Holds your seat' },
    { label: '$325 Balance', value: 'Due 14 days before program start' },
    { label: 'Installments', value: '2-payment option available on request' },
    { label: 'Scholarship', value: 'Need-based; apply at enrollment' },
    { label: 'Refund Policy', value: 'Full refund 14+ days before start; 50% 7-13 days; no refund < 7 days' },
  ];

  return (
    <div className="fade-in">
      {/* Program Hero */}
      <section className="bg-primary text-bgSoft py-40 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-accent tracking-[0.5em] uppercase text-[10px] mb-6 block font-bold">Laboratory Framework</span>
            <h1 className="text-6xl lg:text-8xl font-serif mb-10 leading-tight">Elite <br /><span className="italic text-accent/80">Foundations.</span></h1>
            <p className="text-xl opacity-80 leading-relaxed mb-12 font-serif italic max-w-2xl">
              "We provide the diagnostic environment where young leaders rise to the standard of calm, executive authority."
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to={Page.Apply}
                className="bg-accent text-white px-12 py-5 rounded-sm hover:bg-white hover:text-primary transition-all text-center tracking-[0.2em] uppercase text-[10px] font-bold shadow-xl"
              >
                Apply for Enrollment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-40 px-6 lg:px-12 bg-bgSoft">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <span className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">Milestone Roadmap</span>
            <h2 className="text-5xl font-serif text-primary">The 8-Week Curriculum</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {curriculum.map((item) => (
              <div key={item.week} className="relative bg-white p-12 border border-primary/5 hover:border-accent/30 transition-all duration-700 shadow-sm group">
                {item.live && (
                  <span className="absolute -top-3 right-6 bg-primary text-white px-4 py-1.5 text-[8px] uppercase tracking-widest font-bold">Required Live Lab</span>
                )}
                <span className="text-accent/10 font-serif text-8xl absolute -top-8 -left-4 group-hover:text-accent/20 transition-all">0{item.week}</span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif mb-6 pt-6 text-primary">{item.title}</h3>
                  <p className="text-sm opacity-50 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics & Delivery Grid */}
      <section className="py-40 px-6 lg:px-12 bg-white border-y border-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            {/* Delivery & Schedule Table */}
            <div>
              <span className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">Delivery & Schedule</span>
              <h3 className="text-4xl font-serif mb-12 text-primary">Operations Detail</h3>
              <div className="space-y-0 border-t border-primary/10">
                {deliverySpecs.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-6 border-b border-primary/5 gap-8">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 w-32 shrink-0">{item.label}</span>
                    <span className="text-sm font-medium text-primary text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tuition & Investment */}
            <div>
              <span className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">Tuition & Founding Rate</span>
              <h3 className="text-4xl font-serif mb-12 text-primary">The Investment</h3>
              <div className="bg-bgSoft p-12 border border-primary/5 mb-12">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-6xl font-serif text-primary">$425</span>
                  <span className="text-sm opacity-30 line-through font-bold uppercase tracking-widest">Regularly $595</span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-accent mb-8">Founding Cohort C-01 Special Rate</p>
                
                <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-6">What’s Included:</h4>
                <ul className="space-y-4">
                  {tuitionIncludes.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm opacity-70">
                      <div className="w-1.5 h-1.5 bg-accent"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Details */}
              <span className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold block mb-8">Payment Details</span>
              <div className="space-y-0 border-t border-primary/10">
                {paymentSpecs.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-6 border-b border-primary/5 gap-8">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 w-32 shrink-0">{item.label}</span>
                    <span className="text-sm font-medium text-primary text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
};

export default Program;
