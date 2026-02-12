
import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';

const Home: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block">Junior Executive Training Lab</span>
            <h1 className="text-5xl lg:text-8xl font-serif leading-[1.1] mb-10 text-primary">
              The bridge to <span className="italic">strategic</span> ownership.
            </h1>
            <p className="text-lg lg:text-xl opacity-80 mb-12 max-w-lg leading-relaxed font-serif">
              An 8-week structured environment for ages 9–12. High-fidelity frameworks. Selective cohorts. Cognitive rigor disguised as development.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link
                to={Page.Apply}
                className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-sm hover:bg-accent transition-all duration-500 text-center text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl"
              >
                Request Candidate Evaluation
              </Link>
              <button className="w-full sm:w-auto border border-primary/20 px-10 py-5 rounded-sm hover:bg-primary/5 transition-all duration-300 text-center text-[10px] uppercase tracking-[0.2em] font-bold">
                Private Briefing Details
              </button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-8 font-bold">
              Cohort C-01 Limited to 6 selected students.
            </p>
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

      {/* Distinction Section */}
      <section className="bg-white py-32 px-6 lg:px-12 border-y border-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-30 mb-16 italic">
            Refined Logic. Absolute Structure.
          </h2>
          <div className="space-y-10">
            <p className="text-3xl lg:text-5xl font-serif leading-tight text-primary">
              BrightPath is a laboratory for <br />future executive capability.
            </p>
            <p className="text-xl opacity-60 max-w-2xl mx-auto leading-relaxed font-serif italic text-justify">
              "Elite thinkers don’t just memorize; they diagnose. We provide the diagnostic frameworks for high-performing youth to navigate complex decisions with calm authority."
            </p>
            <div className="h-px w-24 bg-accent mx-auto mt-12"></div>
          </div>
        </div>
      </section>

      {/* Framework Pillars */}
      <section className="bg-bgSoft py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Core Cognitive Pillars</span>
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
                   <span className="text-[10px] font-bold">0{i+1}</span>
                </div>
                <h3 className="text-xl font-serif mb-6 text-primary">{p.title}</h3>
                <p className="text-sm opacity-50 leading-relaxed font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 lg:px-12 text-center bg-white">
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
