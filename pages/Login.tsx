
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Page } from '../types';

interface LoginProps {
  onLogin: (type: 'staff' | 'student', email?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShow2FA(true);
  };

  const verify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('staff');
    navigate(Page.Staff);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('student', 'parent@test.com');
    navigate(Page.StudentPortal);
  };

  const handleInspectorLogin = () => {
    onLogin('student', 'tester@brightpath.org');
    navigate(Page.StudentPortal);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  if (show2FA) {
    return (
      <div className="min-h-screen bg-bgSoft flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 shadow-2xl rounded-sm border border-primary/5 fade-in text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-serif mb-2 tracking-tight text-primary">Security Check</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">Identity Verification</p>
          </div>
          <p className="text-sm opacity-60 mb-8 leading-relaxed">
            Protecting student PII is our priority. Enter any 6 digits for this demo.
          </p>
          <form onSubmit={verify2FA} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-full h-12 text-center text-xl font-bold bg-bgSoft border-b border-primary/20 focus:border-accent outline-none"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  required
                />
              ))}
            </div>
            <button className="w-full bg-primary text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-accent transition-all duration-300 shadow-lg">
              Verify & Launch Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSoft flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 shadow-2xl rounded-sm border border-primary/5 fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif mb-2 tracking-tight text-primary">BrightPath Portal</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">Access Point</p>
        </div>

        <div className="flex border-b border-primary/5 mb-8">
          <button 
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'student' ? 'text-accent border-b-2 border-accent' : 'text-primary/30'}`}
          >
            Student
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'staff' ? 'text-accent border-b-2 border-accent' : 'text-primary/30'}`}
          >
            Staff
          </button>
        </div>

        <div className="mb-6 p-4 bg-accent/5 border border-accent/10 text-[10px] uppercase tracking-widest font-bold text-accent text-center">
          {activeTab === 'student' ? (
            <div className="space-y-2">
              <p>Demo Student: parent@test.com / PIN: 1234</p>
              <div className="h-px bg-accent/20 w-1/2 mx-auto my-2"></div>
              <button 
                onClick={handleInspectorLogin}
                className="text-primary hover:text-accent underline cursor-pointer"
              >
                ENTER AS EXECUTIVE INSPECTOR (ALL MODELS UNLOCKED)
              </button>
            </div>
          ) : (
            <span>Demo Staff: admin@brightpath.org / Pass: admin</span>
          )}
        </div>

        {activeTab === 'student' ? (
          <form onSubmit={handleStudentLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Parent Email</label>
              <input type="email" required className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" defaultValue="parent@test.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">PIN</label>
              <input type="password" required className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none tracking-[1em]" defaultValue="1234" />
            </div>
            <button className="w-full bg-primary text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-accent transition-all shadow-lg">Enter Lab</button>
          </form>
        ) : (
          <form onSubmit={handleStaffLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Email</label>
              <input type="email" required className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" defaultValue="admin@brightpath.org" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Password</label>
              <input type="password" required className="w-full bg-bgSoft border-b border-primary/10 p-4 focus:border-accent outline-none" defaultValue="admin" />
            </div>
            <button className="w-full bg-accent text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-primary transition-all shadow-lg">Login to HQ</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
