import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function CompanyPage() {
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Company — SubTrackr'; }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-[#E8E8F0] pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#666680] text-sm font-semibold mb-12 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white">We're fighting the subscription fatigue.</h1>
          <p className="text-xl md:text-2xl text-[#9999BB] leading-relaxed max-w-3xl">We started SubTrackr because managing digital lives shouldn't feel like a part-time job.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
             <h2 className="text-3xl font-black mb-6">Our Mission</h2>
             <p className="text-[#9999BB] leading-relaxed mb-6">In the digital age, companies bank on you forgetting your subscriptions. It's a business model built on friction and inattention. We're here to flip the script.</p>
             <p className="text-[#9999BB] leading-relaxed">By combining AI precision with intuitive design, we give you the tools to instantly audit your spending and definitively cancel what you don't need.</p>
          </div>
          <div className="h-80 rounded-[40px] bg-gradient-to-br from-[#6C63FF]/20 to-transparent border border-[#6C63FF]/20 flex items-center justify-center">
             <div className="text-center">
               <div className="text-6xl font-black text-white mix-blend-overlay opacity-30 tracking-widest mb-2">2026</div>
               <div className="text-sm font-bold uppercase tracking-widest text-[#3ECFCF]">Est. India</div>
             </div>
          </div>
        </div>

        <div className="p-12 rounded-[40px] bg-[#0F0F1A] border border-white/5 mb-24 text-center">
           <MapPin size={48} className="text-[#6C63FF] mx-auto mb-6" />
           <h3 className="text-2xl font-black text-white mb-4">HQ & Locations</h3>
           <p className="text-[#9999BB]">We are a remote-first team fully distributed across India.<br/>Built specifically for the unique nuances of Indian fintech ecosystems.</p>
        </div>
      </div>
    </div>
  );
}
