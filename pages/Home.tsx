import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';

const Home: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center px-6 lg:px-12" id="hero">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block">Junior Executive Training Lab</span>
            <h1 className="text-5xl lg:text-8xl font-serif leading-[1.1] mb-10 text-primary">
              Leadership and financial intelligence for <span className="italic">next-generation</span> decision makers.
            </h1>
            <p className="text-lg lg:text-xl opacity-80 mb-12 max-w-lg leading-relaxed font-serif">
              BrightPath Youth, Inc. is an Ohio nonprofit delivering a selective 8-week leadership and financial intelligence cohort for students ages 8–14.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link
                to={Page.Apply}
                className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-sm hover:bg-accent transition-all duration-500 text-center text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl"
              >
                Request Candidate Evaluation
              </Link>
              <a
                href="#private-briefing-details"
                className="w-full sm:w-auto border border-primary/20 px-10 py-5 rounded-sm hover:bg-primary/5 transition-all duration-300 text-center text-[10px] uppercase tracking-[0.2em] font-bold"
              >
                Private Briefing Details
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[4/5] bg-bgSoft border border-primary/5 rounded-sm overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,42,56,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                alt="BrightPath Lab Concept"
                className="object-cover w-full h-full grayscale mix-blend-multiply opacity-80 hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is BrightPath */}
      <section className="bg-white py-32 px-6 lg:px-12 border-y border-primary/5" id="what-is-brightpath">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-30 mb-16 italic">What Is BrightPath</h2>
          <div className="space-y-10">
            <p className="text-3xl lg:text-5xl font-serif leading-tight text-primary">
              BrightPath is a selective laboratory for youth leadership and financial intelligence.
            </p>
            <p className="text-xl opacity-60 max-w-2xl mx-auto leading-relaxed font-serif italic text-justify">
              We blend structured frameworks, guided practice, and high-accountability coaching so students can reason clearly, communicate with confidence, and make thoughtful decisions under pressure.
            </p>
            <div className="h-px w-24 bg-accent mx-auto mt-12"></div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-bgSoft py-32 px-6 lg:px-12" id="who-its-for">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Who It’s For</span>
            <h2 className="text-5xl font-serif text-primary">Students ages 8–14 ready for rigorous growth.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Emerging Leaders', desc: 'Students who are curious, coachable, and motivated to build strong habits of ownership.' },
              { title: 'Future Builders', desc: 'Young thinkers interested in entrepreneurship, decision making, and practical money intelligence.' },
              { title: 'High-Potential Communicators', desc: 'Students ready to improve executive presence through structure, brevity, and composure.' }
            ].map((group) => (
              <div key={group.title} className="p-10 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500 shadow-sm">
                <h3 className="text-xl font-serif mb-6 text-primary">{group.title}</h3>
                <p className="text-sm opacity-50 leading-relaxed font-medium">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-white py-32 px-6 lg:px-12 border-y border-primary/5" id="outcomes">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Outcomes</span>
            <h2 className="text-5xl font-serif text-primary">What students can demonstrate by week eight.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              'Structured decision-making under real constraints.',
              'Clear written and verbal briefings with executive polish.',
              'Foundational financial intelligence and capital logic.',
              'Personal accountability through measurable weekly deliverables.'
            ].map((outcome, i) => (
              <div key={outcome} className="p-10 bg-bgSoft border border-primary/5 shadow-sm">
                <div className="w-8 h-8 border border-accent/30 mb-8 flex items-center justify-center text-accent">
                  <span className="text-[10px] font-bold">0{i + 1}</span>
                </div>
                <p className="text-sm opacity-60 leading-relaxed font-medium">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laboratory Framework */}
      <section className="bg-bgSoft py-32 px-6 lg:px-12" id="laboratory-framework">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Laboratory Framework</span>
            <h2 className="text-5xl font-serif text-primary">The BrightPath Framework</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Identity & Framing', desc: 'Transitioning from "student" to "strategist." Developing the personal standards of calm excellence.' },
              { title: 'Systems Intelligence', desc: 'Understanding financial flows, capital allocation, and the logic of trade-offs early.' },
              { title: 'Decision Modeling', desc: 'Utilizing structured reasoning and weighted criteria to navigate complex scenarios.' },
              { title: 'Executive Presence', desc: 'The art of the briefing. Eliminating filler, articulating value, and maintaining composure.' }
            ].map((p, i) => (
              <div key={p.title} className="p-10 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500 shadow-sm group">
                <div className="w-8 h-8 border border-accent/30 mb-8 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all text-accent">
                  <span className="text-[10px] font-bold">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-serif mb-6 text-primary">{p.title}</h3>
                <p className="text-sm opacity-50 leading-relaxed font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8-Week Curriculum Snapshot */}
      <section className="bg-white py-32 px-6 lg:px-12 border-y border-primary/5" id="curriculum-snapshot">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">8-Week Curriculum Snapshot</span>
            <h2 className="text-5xl font-serif text-primary">A disciplined progression from identity to impact.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { week: 'Weeks 1–2', focus: 'Identity, standards, and cognitive framing.' },
              { week: 'Weeks 3–4', focus: 'Value creation, systems thinking, and money principles.' },
              { week: 'Weeks 5–6', focus: 'Decision models, trade-offs, and scenario analysis.' },
              { week: 'Weeks 7–8', focus: 'Executive briefings, synthesis, and final presentation.' }
            ].map((item) => (
              <div key={item.week} className="p-8 bg-bgSoft border border-primary/5 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4">{item.week}</p>
                <p className="text-base font-serif text-primary leading-relaxed">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="bg-bgSoft py-32 px-6 lg:px-12" id="program-structure">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Program Structure</span>
            <h2 className="text-5xl font-serif text-primary">Cohort logistics at a glance.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Format', value: '8-week selective cohort' },
              { label: 'Schedule', value: 'Weekly live laboratory sessions' },
              { label: 'Ages', value: '8–14 years old' },
              { label: 'Tuition', value: '$1,200 total program investment' }
            ].map((fact) => (
              <div key={fact.label} className="p-8 bg-white border border-primary/5 shadow-sm text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4">{fact.label}</p>
                <p className="text-base font-serif text-primary leading-relaxed">{fact.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-10 bg-white border border-primary/5 shadow-sm" id="private-briefing-details">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-6 text-center">Private Briefing Details</p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: 'Selection', value: 'Application review plus parent/candidate fit conversation.' },
                { label: 'Weekly Expectations', value: 'Live session attendance, guided assignments, and mentor feedback loops.' },
                { label: 'Deliverables', value: 'Decision frameworks, financial reasoning drills, and executive brief presentations.' },
                { label: 'Family Communication', value: 'Progress visibility and milestone updates throughout the cohort.' }
              ].map((item) => (
                <div key={item.label} className="p-8 bg-bgSoft border border-primary/5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4">{item.label}</p>
                  <p className="text-base font-serif text-primary leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity Section */}
      <section className="bg-white py-24 px-6 lg:px-12 border-y border-primary/5" id="scarcity">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold mb-8">Scarcity Notice</p>
          <p className="text-3xl lg:text-5xl font-serif leading-tight text-primary mb-6">Cohort size limited to 6 students.</p>
          <p className="text-lg opacity-60 font-serif">Admission remains selective to protect facilitator attention, rigor, and coaching quality.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 lg:px-12 text-center bg-white" id="final-cta">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl lg:text-7xl font-serif mb-10 leading-[1.1] text-primary">
            Accepting <span className="italic">Candidate</span> Briefings.
          </h2>
          <p className="text-lg opacity-50 mb-16 font-serif">The founding cohort is limited to 6 students to ensure absolute facilitator focus.</p>
          <Link
            to={Page.Apply}
            className="inline-block bg-primary text-white px-20 py-6 rounded-sm hover:bg-accent transition-all duration-500 font-bold tracking-[0.3em] uppercase text-[10px] shadow-2xl"
          >
            Submit Application
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
