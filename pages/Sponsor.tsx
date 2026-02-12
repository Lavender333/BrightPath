
import React from 'react';

const Sponsor: React.FC = () => {
  return (
    <div className="fade-in py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div>
           <span className="text-accent tracking-[0.4em] uppercase text-xs mb-4 block">Partner With Us</span>
           <h1 className="text-5xl font-serif mb-8">Invest in Future Leadership</h1>
           <p className="text-lg opacity-60 leading-relaxed mb-12">
             BrightPath welcomes community sponsors to support scholarship seats and program infrastructure. Your support directly enables high-potential youth to access world-class leadership training.
           </p>
           
           <div className="space-y-12">
             <div className="border-l-4 border-accent pl-8 py-2">
               <h3 className="text-2xl font-serif mb-2">Anchor Sponsor – $3,000+</h3>
               <p className="text-sm opacity-60">Supports program infrastructure and operational scaling for future cohorts.</p>
             </div>
             <div className="border-l-4 border-mutedSage pl-8 py-2">
               <h3 className="text-2xl font-serif mb-2">Scholarship Sponsor – $500</h3>
               <p className="text-sm opacity-60">Directly funds one full scholarship seat for a student in need.</p>
             </div>
           </div>

           <div className="mt-16 bg-bgSoft p-12 rounded-sm text-center border border-primary/5">
              <p className="text-sm mb-6 opacity-70 italic">Sponsors are acknowledged in our annual report and invited to student showcase events.</p>
              <a href="mailto:hello@brightpathyouth.org" className="inline-block bg-primary text-white px-12 py-4 text-xs uppercase tracking-widest hover:bg-accent transition-all duration-300">
                Contact for Sponsorship
              </a>
           </div>
        </div>

        <div className="hidden md:block">
           <div className="aspect-[4/5] bg-bgSoft border border-primary/5 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" alt="Sponsorship" className="w-full h-full object-cover opacity-40 mix-blend-multiply grayscale" />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                 <p className="text-3xl font-serif opacity-70">Building a bridge to tomorrow, together.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsor;
