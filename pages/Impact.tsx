
import React from 'react';

const Impact: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-bgSoft py-32 px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-accent tracking-[0.4em] uppercase text-xs mb-4 block">The Results</span>
          <h1 className="text-5xl font-serif mb-12">Impact & Outcomes</h1>
          <div className="grid grid-cols-3 gap-8 border-y border-primary/5 py-12">
             <div>
               <p className="text-4xl font-serif mb-2">6</p>
               <p className="text-[10px] uppercase tracking-widest opacity-40">Students Served</p>
             </div>
             <div>
               <p className="text-4xl font-serif mb-2">100%</p>
               <p className="text-[10px] uppercase tracking-widest opacity-40">Portfolio Completion</p>
             </div>
             <div>
               <p className="text-4xl font-serif mb-2">6</p>
               <p className="text-[10px] uppercase tracking-widest opacity-40">Presentations Delivered</p>
             </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif mb-16 text-center">Portfolio Previews</h2>
        <div className="grid md:grid-cols-3 gap-12">
           {[
             { title: 'Personal Goal Map', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600' },
             { title: 'Budget Simulation', img: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=600' },
             { title: 'Venture Framework', img: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?auto=format&fit=crop&q=80&w=600' }
           ].map((p, i) => (
             <div key={i} className="group cursor-pointer">
               <div className="aspect-[3/2] bg-bgSoft mb-4 overflow-hidden border border-primary/5 group-hover:border-accent/50 transition-all">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale" />
               </div>
               <p className="font-serif text-center">{p.title}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary text-bgSoft py-32 px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-3xl font-serif italic leading-relaxed mb-8">
            “BrightPath helped my child think in ways we hadn’t seen before. The structure and focus gave them a new sense of confidence in how they present their ideas.”
          </p>
          <div className="h-px w-12 bg-accent mx-auto mb-6"></div>
          <p className="uppercase tracking-[0.3em] text-[10px] font-bold opacity-60">Founding Cohort Parent</p>
        </div>
      </section>
    </div>
  );
};

export default Impact;
