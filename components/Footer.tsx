
import React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../types';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-bgSoft py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 border-b border-bgSoft/10 pb-12 mb-12">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-widest mb-6">BRIGHTPATH</h2>
          <p className="text-sm opacity-60 leading-relaxed max-w-xs">
            BrightPath Youth, Inc. is an Ohio nonprofit organization dedicated to structured leadership and financial intelligence.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 text-sm font-medium tracking-wide">
          <Link to={Page.Home} className="opacity-70 hover:opacity-100">Home</Link>
          <Link to={Page.Board} className="opacity-70 hover:opacity-100">Board & Governance</Link>
          <Link to="/media-release" className="opacity-70 hover:opacity-100">Media Release</Link>
          <Link to="/privacy" className="opacity-70 hover:opacity-100">Privacy Policy</Link>
        </div>

        <div className="text-sm">
          <h3 className="uppercase tracking-[0.2em] opacity-40 mb-4 font-bold">Inquiries</h3>
          <a href="mailto:hello@brightpathyouth.org" className="text-accent underline underline-offset-8">
            hello@brightpathyouth.org
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] opacity-30">
        <p>&copy; {new Date().getFullYear()} BrightPath Youth, Inc.</p>
        <p>501(c)(3) Status Pending/Approved</p>
      </div>
    </footer>
  );
};

export default Footer;
