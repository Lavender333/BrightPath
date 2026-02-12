
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="fade-in">
      <section className="bg-bgSoft py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif mb-12">About BrightPath</h1>
          <div className="space-y-8">
            <h2 className="text-accent tracking-widest uppercase text-xs font-bold">Our Mission</h2>
            <p className="text-3xl font-serif leading-tight">
              BrightPath equips youth with structured thinking frameworks, financial awareness, and communication confidence through focused cohort-based programming.
            </p>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div>
          <h2 className="text-4xl font-serif mb-8">Why BrightPath?</h2>
          <p className="text-lg opacity-70 mb-8 leading-relaxed">
            Modern education often prioritizes information. <br />
            <strong>BrightPath prioritizes capability.</strong>
          </p>
          <div className="space-y-6">
            {[
              { title: 'Models Over Memorization', desc: 'Learning to think in mental models for strategy.' },
              { title: 'Early Systems Awareness', desc: 'Understanding financial systems before adulthood.' },
              { title: 'Executive Presence', desc: 'Presenting ideas with quiet confidence and clarity.' },
              { title: 'Ownership Mindset', desc: 'Developing a sense of responsibility for personal growth.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 bg-accent h-1.5 mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{item.title}</h4>
                  <p className="text-sm opacity-60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-mutedSage/10 aspect-square rounded-full flex items-center justify-center border border-primary/5">
           <div className="text-center p-12 italic opacity-60 text-lg font-serif">
             "We build labs for future thinkers."
           </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-primary text-bgSoft py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1">
             <span className="text-accent tracking-[0.4em] uppercase text-xs mb-4 block font-bold">The Founder</span>
             <h2 className="text-5xl font-serif mb-2 text-white">Antoinette Williams</h2>
             <p className="text-accent tracking-[0.2em] uppercase text-[10px] font-bold mb-8">Executive Facilitator & Founder</p>
             <p className="text-lg opacity-70 leading-relaxed mb-6 font-serif italic">
               Antoinette Williams founded BrightPath on the conviction that strategic clarity and financial intelligence are not natural traits, but disciplines that can be mastered by the young.
             </p>
             <p className="text-lg opacity-70 leading-relaxed mb-6">
               With a background in high-stakes strategy and diagnostic systems, Antoinette has spent her career bridging the gap between potential and performance. She created BrightPath to provide a rigorous, supportive environment where youth can rise to the standard of executive authority.
             </p>
             <p className="text-lg opacity-70 leading-relaxed">
               Under her leadership, BrightPath remains committed to pedagogical excellence, nonprofit transparency, and the mission of equipping the next generation with the tools of ownership.
             </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/5] bg-bgSoft/10 rounded-sm overflow-hidden shadow-2xl group">
               <img 
                 src="https://images.unsplash.com/photo-1567532939604-b6c5b0adcc2c?auto=format&fit=crop&q=80&w=800" 
                 alt="Antoinette Williams" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60 group-hover:opacity-10 transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
