
import React, { useState } from 'react';

interface ApplyProps {
  onApply: (data: any) => void;
}

const Apply: React.FC<ApplyProps> = ({ onApply }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    parentName: '',
    parentEmail: '',
    interest: ''
  });

  const handleSubmit = () => {
    onApply(formData);
    setStep(3);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 fade-in">
            <h3 className="text-xl font-serif">Step 1: Student Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold opacity-40 mb-1 block">Student Name</label>
                <input 
                  type="text" 
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  placeholder="Full Name" 
                  className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold opacity-40 mb-1 block">Student Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  placeholder="9-12" 
                  className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" 
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold opacity-40 mb-1 block">Parent/Guardian Name</label>
                <input 
                  type="text" 
                  value={formData.parentName}
                  onChange={e => setFormData({...formData, parentName: e.target.value})}
                  placeholder="Full Name" 
                  className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" 
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold opacity-40 mb-1 block">Parent Email</label>
                <input 
                  type="email" 
                  value={formData.parentEmail}
                  onChange={e => setFormData({...formData, parentEmail: e.target.value})}
                  placeholder="email@example.com" 
                  className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" 
                />
              </div>
            </div>
            <button 
              disabled={!formData.studentName || !formData.parentEmail}
              onClick={() => setStep(2)} 
              className="w-full bg-primary text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-accent transition-all disabled:opacity-30"
            >
              Next: Commitments
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 fade-in">
             <h3 className="text-xl font-serif">Step 2: Parent Commitment</h3>
             <div className="p-10 bg-accent/5 border border-accent/10 rounded-sm">
                <p className="text-sm leading-relaxed mb-8 opacity-70">
                  BrightPath is a structured environment. By applying, you agree to:
                </p>
                <ul className="text-[10px] uppercase tracking-widest font-bold space-y-4 opacity-50 mb-10">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent"></span> Support weekly participation</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent"></span> Attendance at 3 live sessions</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-accent"></span> Timely portfolio submissions</li>
                </ul>
                <label className="flex items-center space-x-4 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-accent" id="agree" />
                  <span className="text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity">I understand and agree to these standards.</span>
                </label>
             </div>
             <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 border border-primary/10 py-5 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100">Back</button>
              <button onClick={handleSubmit} className="flex-2 bg-primary text-white px-12 py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-accent transition-all">Submit Application</button>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-20 space-y-8 fade-in">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-4xl font-serif">Application Received</h3>
            <p className="opacity-60 max-w-sm mx-auto leading-relaxed text-sm">
              Thank you, {formData.parentName}. We've sent a confirmation to <strong>{formData.parentEmail}</strong>. Our board will review your application within 5 business days.
            </p>
            <div className="pt-8">
              <a href="/" className="text-[10px] uppercase tracking-widest font-bold text-accent underline underline-offset-8">Return Home</a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in bg-white min-h-screen">
      <section className="bg-bgSoft py-24 px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-serif mb-4">Apply to the Lab</h1>
          <p className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold mb-8">Founding Cohort — Spring 2025</p>
          <p className="text-sm opacity-50 leading-relaxed italic max-w-lg mx-auto">
            Our selection process ensures a balanced, committed cohort of young leaders. 
            Estimated time: 5 minutes.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto border border-primary/5 p-12 md:p-16 shadow-2xl rounded-sm">
          {renderStep()}
        </div>
      </section>
    </div>
  );
};

export default Apply;
