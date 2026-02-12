
import React from 'react';

const Board: React.FC = () => {
  const members = [
    {
      name: 'Sarah J. Emerson',
      role: 'Chair of the Board',
      bio: 'Executive Director at a leading educational foundation with 15+ years experience in curriculum development and nonprofit leadership.'
    },
    {
      name: 'Marcus Chen',
      role: 'Treasurer',
      bio: 'Strategic financial advisor specializing in impact investing and community-based financial literacy initiatives.'
    },
    {
      name: 'Dr. Elena Rossi',
      role: 'Board Secretary',
      bio: 'PhD in Developmental Psychology with a focus on cognitive growth in adolescents. Advisor on BrightPath pedagogical standards.'
    }
  ];

  return (
    <div className="fade-in py-32 px-6 lg:px-12 bg-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-serif mb-16 text-center">Board of Directors</h1>
        
        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {members.map((m, i) => (
            <div key={i} className="space-y-4 border-l border-accent/20 pl-6 py-4">
              <h3 className="text-xl font-serif">{m.name}</h3>
              <p className="text-accent font-bold uppercase tracking-widest text-[10px]">{m.role}</p>
              <p className="text-sm opacity-60 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>

        <div className="bg-bgSoft p-12 rounded-sm border border-primary/5 max-w-3xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold mb-6 opacity-40">Governance Statement</h2>
          <p className="text-sm opacity-60 leading-relaxed italic">
            BrightPath is governed by an independent board of directors. Annual reports and meeting summaries are documented and maintained in accordance with nonprofit best practices. We believe in transparency and absolute alignment with our mission of youth empowerment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Board;
