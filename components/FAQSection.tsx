
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-primary/10 py-8 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none"
      >
        <span className="text-xl font-serif text-primary group-hover:text-accent transition-colors duration-300">
          {question}
        </span>
        <span className={`text-accent text-2xl transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-base text-primary/60 leading-relaxed max-w-3xl font-serif italic">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What age is right for this?",
      answer: "BrightPath Lab is designed for students ages 9–12. Maturity matters more than exact age — students should be comfortable reading and writing independently."
    },
    {
      question: "How much parent involvement is needed?",
      answer: "Minimal — parents support weekly submissions (approx. 10–15 min check-in) and attend the Showcase. There are no required parent sessions."
    },
    {
      question: "What if my child misses a live session?",
      answer: "Weeks 4 and 7 sessions are recorded for enrolled students. The Showcase is required for portfolio certification."
    },
    {
      question: "Is there a scholarship?",
      answer: "Yes. Need-based scholarships fund one full seat ($425 value). Apply via the scholarship link in the enrollment form."
    },
    {
      question: "What technology does my child need?",
      answer: "A laptop or tablet with a stable internet connection and access to a PDF viewer. No special software required."
    },
    {
      question: "How is student work kept private?",
      answer: "All student work is kept confidential. No names or work are shared publicly without written parental consent. We comply with COPPA guidelines."
    },
    {
      question: "What is your refund policy?",
      answer: "Full refund if requested 14+ days before start; 50% if 7–13 days; no refund within 7 days of start."
    },
    {
      question: "When will I hear back on my application?",
      answer: "Within 5 business days. You’ll receive an email with your decision, next steps, and deposit instructions."
    }
  ];

  return (
    <section className="py-40 px-6 lg:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          <span className="text-accent tracking-[0.4em] uppercase text-[10px] font-bold block mb-4">Deep Context</span>
          <h2 className="text-5xl font-serif text-primary">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-primary/5">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="mt-20 p-10 bg-bgSoft border border-primary/5 text-center">
          <p className="text-sm opacity-60 font-serif italic">
            Have a question not listed here? Email us at <a href="mailto:hello@brightpathyouth.org" className="text-accent underline underline-offset-4 font-bold">hello@brightpathyouth.org</a> or attend an Info Session.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
