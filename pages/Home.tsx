
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';

const Home: React.FC = () => {
  const heroImages = [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
  ];
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [heroImages.length]);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-[90vh] flex items-center px-6 lg:px-12 py-12 md:py-0">
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
                Submit Application
              </Link>
              <Link
                to={Page.Program}
                className="w-full sm:w-auto border border-primary/20 px-10 py-5 rounded-sm hover:bg-primary/5 transition-all duration-300 text-center text-[10px] uppercase tracking-[0.2em] font-bold"
              >
                View Program Details
              </Link>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-8 font-bold">Cohort C-01 Enrollment Open.</p>
          </div>
          <div className="block">
            <div className="relative aspect-[4/5] max-w-md mx-auto md:max-w-none bg-bgSoft border border-primary/5 rounded-sm overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,42,56,0.2)]">
              {heroImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt="Happy student learning"
                  className={`absolute inset-0 object-cover w-full h-full grayscale mix-blend-multiply hover:grayscale-0 transition-all duration-1000 ${activeHeroImage === index ? 'opacity-80' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(to right, rgba(201,162,77,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,162,77,0.35) 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>
              <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${activeHeroImage === index ? 'w-6 bg-accent' : 'w-2 bg-white/50'}`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity Section */}
      <section className="bg-primary text-bgSoft py-14 px-6 lg:px-12 border-y border-bgSoft/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-accent mb-5">Founding Cohort Capacity</p>
          <h2 className="text-3xl lg:text-5xl font-serif leading-tight">Cohort size limited to 6 students.</h2>
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
            <div className="h-px w-24 bg-accent mt-8"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Identity & Framing', desc: 'Transitioning from "student" to "strategist." Developing the personal standards of calm excellence.' },
              { title: 'Systems Intelligence', desc: 'Understanding financial flows, capital allocation, and the logic of trade-offs early.' },
              { title: 'Decision Modeling', desc: 'Utilizing structured reasoning and weighted criteria to navigate complex scenarios.' },
              { title: 'Executive Presence', desc: 'The art of the briefing. Eliminating filler, articulating value, and maintaining composure.' }
            ].map((p, i) => (
              <div key={p.title} className="p-12 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 transform group">
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
            Accepting <span className="italic">Applications</span> Now.
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
