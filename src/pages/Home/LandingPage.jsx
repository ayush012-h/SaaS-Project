import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Bot, Bell, XCircle, Check, Play, ChevronDown, CheckCircle2, ShieldCheck, Zap, ArrowRight, Target, Users, LayoutDashboard, CreditCard, BarChart3, Settings, Calendar as CalendarIcon, FileText, Mail, MessageSquare, Send, Shield, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// --- Custom Hooks ---
function useInView(options = {}) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options.once) observer.disconnect();
      } else if (!options.once) {
        setInView(false);
      }
    }, { rootMargin: options.margin || '-100px', ...options });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);
  return [setRef, inView];
}

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className, onClick, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

export default function LandingPage() {
  const { session } = useAuth();
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cursorSpringX = useSpring(0, { stiffness: 500, damping: 50 });
  const cursorSpringY = useSpring(0, { stiffness: 500, damping: 50 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleMouseMove = (e) => {
      cursorSpringX.set(e.clientX);
      cursorSpringY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-brand-purple/30 selection:text-text-primary cursor-none overflow-x-hidden transition-colors duration-300">
      {/* --- Cursor Effects --- */}
      <motion.div 
        style={{ x: cursorSpringX, y: cursorSpringY }}
        className="fixed top-0 left-0 w-2 h-2 bg-brand-purple rounded-full pointer-events-none z-[100] translate-x-[-50%] translate-y-[-50%]" 
      />
      <motion.div 
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
        className="fixed top-0 left-0 w-10 h-10 border border-brand-purple/30 rounded-full pointer-events-none z-[99] translate-x-[-50%] translate-y-[-50%] backdrop-blur-[2px]" 
      />

      {/* --- Progress Bar --- */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-brand-gradient origin-left z-[101]" style={{ scaleX: scrollYProgress }} />

      {/* --- Background System --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.15)_0%,transparent_70%)] animate-aurora-1" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(62,207,207,0.1)_0%,transparent_70%)] animate-aurora-2" />
        <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vh] rounded-full bg-[radial-gradient(circle,rgba(255,99,179,0.08)_0%,transparent_70%)] animate-aurora-3" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-30" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 55 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-[#6C63FF]/20 animate-float-up"
              style={{
                width: Math.random() * 2 + 0.4 + 'px',
                height: Math.random() * 2 + 0.4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.4 + 0.1,
                animationDuration: Math.random() * 10 + 10 + 's',
                animationDelay: Math.random() * 5 + 's'
              }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10%, 5%); } }
        @keyframes aurora-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-8%, -10%); } }
        @keyframes aurora-3 { 0%, 100% { transform: scale(1); opacity: 0.08; } 50% { transform: scale(1.2); opacity: 0.12; } }
        @keyframes float-up { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-100vh) translateX(20px); } }
        .animate-aurora-1 { animation: aurora-1 18s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 22s ease-in-out infinite; }
        .animate-aurora-3 { animation: aurora-3 15s ease-in-out infinite; }
        .animate-float-up { animation: float-up linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-xl border-border-subtle shadow-md' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#3ECFCF] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20 group-hover:scale-110 transition-transform">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-[#9999BB] bg-clip-text text-transparent">SubTrackr</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it works', 'Pricing', 'About', 'Contact'].map(item => (
              <Link key={item} to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-teal transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">Sign in</Link>
                <MagneticButton className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-brand-purple/40 hover:brightness-110">
                  <Link to={session ? "/dashboard" : "/register"}>{session ? "Dashboard" : "Start free"}</Link>
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 backdrop-blur-sm mb-12 shadow-[0_0_20px_rgba(108,99,255,0.1)]"
          >
            <span className="text-[13px] font-bold text-text-primary">🚀 Now with AI-powered insights</span>
          </motion.div>

          <h1 className="text-[clamp(48px,10vw,96px)] font-black tracking-[-0.04em] leading-[0.95] mb-8">
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="block text-text-primary">Stop Losing Money</motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="block bg-brand-gradient bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent"
              style={{ paddingBottom: '0.1em' }}
            >
              On Subscriptions
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12"
          >
            The average Indian spends <span className="text-text-primary font-semibold">₹4,800/year</span> on forgotten subscriptions. SubTrackr finds them, tracks them, and helps you cancel what you don't need.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <MagneticButton className="group relative px-8 py-5 rounded-2xl bg-brand-gradient text-white font-black text-lg shadow-elevation-purple hover:shadow-glow-purple transition-all overflow-hidden">
              <Link to={session ? "/dashboard" : "/register"} className="relative z-10">
                {session ? "Go to Dashboard" : "Start for Free — No credit card"}
              </Link>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </MagneticButton>
            
            <button className="px-8 py-5 rounded-2xl bg-transparent border border-border-subtle text-text-primary font-bold text-lg hover:bg-bg-hover transition-all flex items-center gap-3 group">
              <Play size={20} className="fill-current text-text-primary group-hover:scale-110 transition-transform" /> Watch demo
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-4 mb-20"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-bg-primary bg-bg-elevated flex items-center justify-center overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/80?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-text-primary leading-none mb-1">Join 50,000+ users</p>
              <p className="text-xs text-text-secondary"><span className="text-warning">★★★★★</span> 4.9/5 rating</p>
            </div>
          </motion.div>

          {/* Screenshot Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="relative w-full max-w-5xl mx-auto px-4"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden border border-border-subtle shadow-md bg-bg-card"
            >
              <div className="aspect-[16/10] w-full p-4 flex flex-col">
                <div className="h-8 border-b border-border-subtle flex items-center px-4 gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 flex gap-4 overflow-hidden">
                  {/* Sidebar Mockup */}
                  <div className="w-40 hidden md:flex flex-col gap-3 p-4 rounded-xl bg-bg-primary/50 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-8 rounded-lg bg-brand-gradient" />
                       <div className="w-16 h-2 bg-text-muted/20 rounded" />
                    </div>
                    {[LayoutDashboard, CreditCard, BarChart3, Settings].map((Icon, i) => (
                      <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${i === 0 ? 'bg-brand-purple/10 text-brand-purple' : 'text-text-muted'}`}>
                        <Icon size={14} />
                        <div className={`h-1.5 w-16 rounded ${i === 0 ? 'bg-brand-purple/30' : 'bg-text-muted/10'}`} />
                      </div>
                    ))}
                  </div>

                  {/* Main Content Mockup */}
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {/* Banner */}
                    <div className="rounded-2xl bg-brand-gradient/10 border border-brand-purple/20 p-6 relative overflow-hidden">
                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <div className="text-xl font-black text-text-primary mb-1">Welcome! 👋</div>
                            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Financial Command Center</div>
                          </div>
                          <div className="bg-bg-card/80 backdrop-blur-md rounded-xl p-3 border border-brand-purple/20 flex items-start gap-3 max-w-[240px]">
                             <Zap size={14} className="text-brand-purple shrink-0 mt-0.5" />
                             <div>
                                <div className="text-text-primary text-[9px] font-bold">AI Suggestion</div>
                                <div className="text-[8px] text-text-secondary mt-0.5 italic">Cancel Prime? No usage this month.</div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { l: 'Monthly', v: '₹3,450', c: 'var(--brand-purple)' },
                        { l: 'Active', v: '12', c: 'var(--brand-teal)' },
                        { l: 'Savings', v: '₹998', c: 'var(--accent-pink)' }
                      ].map((card, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-bg-primary/50 border border-border-subtle">
                           <div className="text-[8px] text-text-muted font-bold uppercase tracking-widest mb-1">{card.l}</div>
                           <div className="text-lg font-black" style={{ color: card.c }}>{card.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Table Placeholder */}
                    <div className="flex-1 rounded-2xl bg-bg-primary/50 border border-border-subtle p-4">
                       <div className="flex justify-between items-center mb-4">
                          <div className="h-3 w-32 bg-text-muted/10 rounded" />
                          <div className="h-6 w-20 bg-brand-purple/20 rounded-lg" />
                       </div>
                       <div className="space-y-3">
                          {[
                            { n: 'Netflix', val: '₹649', col: '#E50914' },
                            { n: 'Spotify', val: '₹179', col: '#1DB954' },
                            { n: 'Amazon', val: '₹149', col: '#00A8E1' }
                          ].map((sub, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                               <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded bg-text-muted/10" style={{ backgroundColor: `${sub.col}20` }} />
                                  <div className="text-[10px] font-bold text-text-primary">{sub.n}</div>
                               </div>
                               <div className="text-[10px] font-black text-text-primary">{sub.val}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Social Proof Ticker --- */}
      <div className="relative py-20 overflow-hidden bg-bg-primary border-y border-border-subtle">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-bg-primary to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-bg-primary to-transparent z-10" />
        
        <div className="flex flex-col gap-10">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {['Netflix', 'Spotify', 'Amazon Prime', 'Hotstar', 'Adobe', 'YouTube Premium', 'Notion', 'Figma', 'ChatGPT', 'Swiggy One', 'Zomato Gold'].map((logo, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                   <Target size={20} className="text-text-primary" />
                </div>
                <span className="text-2xl font-black text-text-muted group-hover:text-text-primary transition-colors">{logo}</span>
              </div>
            ))}
          </motion.div>

          <motion.div 
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {['Disney+', 'Uber', 'Cred', 'Coursera', 'LinkedIn', 'Canva', 'Zoom', 'Slack', 'GitHub', 'Airtel Black', 'Jiocinema'].map((logo, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                   <Bot size={20} className="text-text-primary" />
                </div>
                <span className="text-2xl font-black text-text-muted group-hover:text-text-primary transition-colors">{logo}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- Section 3: Stats Counter --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="₹4,800" label="Average wasted per year" delay={0} />
            <StatCard value="50,000+" label="Users tracking subscriptions" delay={0.1} />
            <StatCard value="₹49" label="Pro plan per month" delay={0.2} />
            <StatCard value="3 min" label="To find all subscriptions" delay={0.3} />
          </div>
        </div>
      </section>

      {/* --- Section 4: Features --- */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Everything you need to take control</motion.h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} className="h-1 bg-gradient-to-r from-[#6C63FF] to-[#3ECFCF] mx-auto rounded-full" />
          </div>

          <div className="flex flex-col gap-8">
            <FeatureBlock 
              title="AI finds subscriptions automatically" 
              desc="Paste your bank statement and our AI detects every recurring charge instantly. No manual entry required." 
              icon={<Bot size={32} className="text-[#6C63FF]" />} 
              visual={<AIScannerMockup />}
              pill="Saves 2 hours of manual work"
              align="left"
            />
            <FeatureBlock 
              title="Never get surprised by renewals" 
              desc="Get smart alerts 7 days before any subscription renews. Cancel before you get charged." 
              icon={<Bell size={32} className="text-[#3ECFCF]" />} 
              visual={<RenewalMockup />}
              pill="100% of renewals tracked"
              align="right"
            />
            <FeatureBlock 
              title="Cancel anything in 2 minutes" 
              desc="AI-generated step-by-step cancellation guides for every service. No more hunting for the cancel button." 
              icon={<XCircle size={32} className="text-[#FF63B3]" />} 
              visual={<CancelGuideMockup />}
              pill="Works for 500+ services"
              align="left"
            />
          </div>
        </div>
      </section>

      {/* --- Section 5: Interactive Demo --- */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0F0F1A]/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">See it in action</h2>
          </div>
          <InteractiveDemoTabs />
        </div>
      </section>

      {/* --- Section 6: Testimonials --- */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x px-4">
             <TestimonialCard 
               quote="Found 3 subscriptions I completely forgot about. Saved ₹1,200 in the first week." 
               name="Priya S." 
               loc="Mumbai" 
               saved="₹1,200"
             />
             <TestimonialCard 
               quote="The AI scanner is insane. Pasted my bank statement and it found everything in 10 seconds." 
               name="Rahul M." 
               loc="Bangalore" 
               saved="₹3,400"
             />
             <TestimonialCard 
               quote="Finally cancelled my gym membership I haven't used in 6 months. The guide made it stupidly easy." 
               name="Arjun K." 
               loc="Delhi" 
               saved="₹4,500"
             />
          </div>
        </div>
      </section>

      {/* --- Section 7: Pricing --- */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">Simple, honest pricing</h2>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
               <span className="text-text-primary">Monthly</span>
               <div className="w-12 h-6 rounded-full bg-bg-surface p-1 flex items-center justify-end">
                  <div className="w-4 h-4 rounded-full bg-brand-teal" />
               </div>
               <span className="text-text-muted">Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             {/* Free Card */}
             <motion.div 
               variants={fadeInUp} 
               initial="hidden" 
               whileInView="show" 
               viewport={{ once: true }}
               className="p-10 rounded-3xl bg-bg-card border border-border-subtle h-full flex flex-col"
             >
                <h3 className="text-xl font-bold mb-2 text-text-primary">Free Forever</h3>
                <div className="flex items-baseline gap-1 mb-10">
                   <span className="text-5xl font-black text-text-primary">₹0</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                   {['5 subscriptions max', 'Basic alerts', 'Manual entry only', 'Email notifications'].map(f => (
                     <li key={f} className="flex gap-3 text-text-secondary text-sm"><Check size={18} className="text-brand-teal" /> {f}</li>
                   ))}
                </ul>
                <Link 
                  to={session ? "/dashboard" : "/register"}
                  className="w-full py-4 rounded-xl bg-bg-surface border border-border-subtle text-text-primary font-bold hover:bg-bg-hover transition-colors text-center block"
                >
                  Get started free
                </Link>
             </motion.div>

             {/* Pro Card */}
             <motion.div 
               variants={fadeInUp} 
               initial="hidden" 
               whileInView="show" 
               viewport={{ once: true }}
               className="p-1 bg-brand-gradient rounded-[32px] overflow-hidden shadow-glow-purple relative group hover:scale-[1.02] transition-transform"
             >
                <div className="bg-bg-card rounded-[31px] p-10 h-full relative z-10 overflow-hidden">
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 blur-[80px] -mr-32 -mt-32" />
                   
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-text-primary">Pro</h3>
                      <div className="bg-brand-gradient text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                   </div>
                   
                   <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-sm text-text-muted line-through mr-2 font-bold">₹199</span>
                      <span className="text-5xl font-black text-text-primary">₹49</span>
                      <span className="text-text-secondary">/mo</span>
                   </div>

                   <ul className="space-y-4 mb-10">
                      {['Unlimited subscriptions', 'AI email scanner', 'Cancellation guides', 'Smart budget alerts', 'Yearly report', 'Priority support'].map(f => (
                        <li key={f} className="flex gap-3 text-text-primary text-sm font-semibold"><CheckCircle2 size={18} className="text-brand-teal" /> {f}</li>
                      ))}
                   </ul>
                   
                   <MagneticButton className="w-full py-4 rounded-xl bg-brand-gradient text-white font-black shadow-lg shadow-brand-purple/30 hover:brightness-110">
                      <Link to={session ? "/dashboard" : "/register"} className="w-full h-full block text-white">
                        {session ? "Upgrade to Pro" : "Start with Pro"}
                      </Link>
                   </MagneticButton>
                   <p className="text-center text-[10px] text-text-muted mt-4 font-bold uppercase tracking-widest">No credit card required for trial</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* --- Section 8: FAQ --- */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
           <h2 className="text-4xl font-black text-center mb-16 tracking-tighter">Common Questions</h2>
           <div className="space-y-4">
              {[
                { q: "Is my bank data safe?", a: "We never store your banking credentials. Our AI scanner only reads your statement text and we use 256-bit encryption for all data." },
                { q: "How does AI find my subscriptions?", a: "We use specialized LLMs trained to recognize thousands of recurring service providers in Indian bank statements." },
                { q: "Can I cancel my SubTrackr Pro plan?", a: "Yes, you can cancel at any time with one click from your settings. You'll keep access until the end of the billing period." },
                { q: "Does it work with Indian banks?", a: "Absolutely. We support statements from all major Indian banks including HDFC, ICICI, SBI, and Axis." }
              ].map((item, i) => (
                <FAQItem key={i} question={item.q} answer={item.a} />
              ))}
           </div>
        </div>
      </section>

      {/* --- Section: About --- */}
      <section id="about" className="py-32 px-6 bg-[#0F0F1A]/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">About SubTrackr</h2>
            <div className="h-1 bg-gradient-to-r from-[#6C63FF] to-[#3ECFCF] mx-auto rounded-full w-20" />
            <p className="text-lg text-[#9999BB] leading-relaxed max-w-2xl mx-auto mt-8">
              We started with a simple belief: financial clarity shouldn't require a finance degree. We're on a mission to put money back in your pocket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'Your financial data is yours alone with bank-grade encryption.' },
              { icon: Zap, title: 'AI That Works', desc: 'We surface insights that matter, completely automatically.' },
              { icon: Heart, title: 'Built For You', desc: 'Designed to solve real problems and ease mental load.' },
              { icon: Globe, title: 'Always Improving', desc: 'We ship new features weekly based on your feedback.' }
            ].map((v, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-bg-card border border-border-subtle hover:border-brand-teal/30 transition-colors shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center mb-6">
                  <v.icon size={24} className="text-brand-teal" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section: Contact --- */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Get in touch</h2>
            <div className="h-1 bg-gradient-to-r from-[#6C63FF] to-[#3ECFCF] mx-auto rounded-full w-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 rounded-3xl bg-bg-card border border-border-subtle hover:border-brand-purple/40 transition-colors shadow-2xl flex flex-col group">
               <Send size={32} className="text-brand-purple mb-8 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold text-text-primary mb-3">Feedback & Support</h3>
               <p className="text-sm text-text-secondary mb-8 flex-1 leading-relaxed">
                 For technical issues, feedback, or feature requests. Let us know how we can improve SubTrackr for you.
               </p>
               <a href="mailto:support@subtrackr.me" className="inline-block px-6 py-3 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm border border-brand-purple/20 text-center hover:bg-brand-purple/20 transition-colors">support@subtrackr.me</a>
            </div>
            <div className="p-10 rounded-3xl bg-bg-card border border-border-subtle hover:border-brand-teal/40 transition-colors shadow-2xl flex flex-col group">
               <MessageSquare size={32} className="text-brand-teal mb-8 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold text-text-primary mb-3">Partnerships & Press</h3>
               <p className="text-sm text-text-secondary mb-8 flex-1 leading-relaxed">
                 Interested in partnering with us or writing about SubTrackr? We'd love to chat.
               </p>
               <a href="mailto:hello@subtrackr.me" className="inline-block px-6 py-3 rounded-xl bg-brand-teal/10 text-brand-teal font-bold text-sm border border-brand-teal/20 text-center hover:bg-brand-teal/20 transition-colors">hello@subtrackr.me</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 9: Final CTA --- */}
      <section className="py-40 px-6 relative overflow-hidden text-center border-t border-border-subtle">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(108,99,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10">
           <motion.h2 variants={fadeInUp} initial="hidden" whileInView="show" className="text-5xl md:text-7xl font-black tracking-tighter mb-8 max-w-4xl mx-auto leading-tight text-text-primary">Start saving money today</motion.h2>
           <motion.p variants={fadeInUp} initial="hidden" whileInView="show" className="text-xl text-text-secondary max-w-xl mx-auto mb-12">Join 50,000+ Indians who stopped leaking money on forgotten subscriptions</motion.p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <MagneticButton className="px-10 py-5 rounded-2xl bg-brand-gradient text-white font-black text-xl shadow-elevation-purple hover:shadow-glow-purple">
                 <Link to={session ? "/dashboard" : "/register"} className="w-full h-full block text-white">
                   {session ? "Go to Dashboard" : "Start Free Now"}
                 </Link>
              </MagneticButton>
              <button className="px-10 py-5 rounded-2xl bg-bg-surface border border-border-subtle text-text-primary font-bold text-xl hover:bg-bg-hover transition-all">
                 <Link to="/pricing" className="w-full h-full block text-text-primary">View Pricing</Link>
              </button>
           </div>
           
           <p className="text-text-muted text-sm font-bold uppercase tracking-widest italic">Free forever • No credit card required • Setup in 2 mins</p>
        </div>
      </section>

      {/* --- Section 10: Footer --- */}
      <footer className="bg-bg-primary pt-24 pb-12 px-6 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-2 md:col-span-1">
                 <Link to="/" className="flex items-center gap-2 mb-6 group">
                   <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                     <Zap size={16} className="text-white fill-current" />
                   </div>
                   <span className="text-xl font-black tracking-tighter text-text-primary">SubTrackr</span>
                 </Link>
                 <p className="text-text-muted text-sm leading-relaxed mb-6">Stop losing money silently. AI-powered subscription tracking for the modern Indian saver.</p>
                 <div className="flex gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-bg-surface border border-border-subtle hover:border-brand-purple/30 transition-colors cursor-pointer" />)}
                 </div>
              </div>
              
              <FooterColumn title="Product" links={['Features', 'Pricing', 'Scanner', 'How it works', 'Changelog']} />
              <FooterColumn title="Company" links={['About Us', 'Success Stories', 'Privacy Policy', 'Terms of Service', 'Support']} />
              <FooterColumn title="Community" links={['Twitter', 'Discord', 'Indian Indie Hub', 'Product Hunt']} />
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-subtle text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">
              <p>© 2026 SubTrackr INC. All rights reserved.</p>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                 <span>Made with ❤️ in India</span>
                 <span className="text-lg">🇮🇳</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

// --- Sub-components ---

function FooterColumn({ title, links }) {
  const ROUTES = {
    'Features': '/features', 'Pricing': '/pricing', 'Scanner': '/scanner-info',
    'How it works': '/how-it-works', 'Changelog': '/changelog',
    'About Us': '/about', 'Success Stories': '/success-stories',
    'Privacy Policy': '/privacy', 'Terms of Service': '/terms', 'Support': '/support',
    'Twitter': '#', 'Discord': '#', 'Indian Indie Hub': '#', 'Product Hunt': '#',
  };
  return (
    <div>
      <h4 className="text-text-primary text-xs font-black uppercase tracking-widest mb-6">{title}</h4>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={ROUTES[link] || '#'} className="text-text-muted text-sm hover:text-text-primary transition-colors">{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ value, label, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 rounded-[32px] bg-bg-card border border-border-subtle group hover:border-brand-purple/30 transition-colors"
    >
      <h3 className="text-5xl font-black bg-brand-gradient bg-clip-text text-transparent mb-2">{value}</h3>
      <p className="text-sm font-bold text-text-muted uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

function FeatureBlock({ title, desc, icon, visual, pill, align }) {
  const isLeft = align === 'left';
  return (
    <motion.div 
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 p-8 md:p-16 rounded-[48px] bg-bg-card border border-border-subtle overflow-hidden relative group`}
    >
       <div className={`flex-1 relative z-10 text-center ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
          <div className="inline-flex px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-widest mb-6">{pill}</div>
          <div className={`mb-6 flex justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>{icon}</div>
          <h3 className="text-3xl font-black text-text-primary tracking-tighter mb-4">{title}</h3>
          <p className="text-lg text-text-secondary leading-relaxed max-w-md mx-auto md:mx-0">{desc}</p>
       </div>
       <div className="flex-1 w-full relative z-10">
          <div className="rounded-3xl border border-border-subtle overflow-hidden bg-bg-primary shadow-2xl transition-transform group-hover:scale-[1.02]">
             {visual}
          </div>
       </div>
    </motion.div>
  );
}

function AIScannerMockup() {
  return (
    <div className="aspect-video w-full bg-bg-primary p-6 font-mono text-xs flex flex-col gap-3">
       <div className="flex items-center gap-2 text-brand-purple">
          <Zap size={14} /> <span>Analyzing HDFC_JAN_2026.pdf...</span>
       </div>
       <div className="space-y-2 opacity-50">
          <div className="h-2 w-full bg-text-muted/10 rounded" />
          <div className="h-2 w-3/4 bg-text-muted/10 rounded" />
       </div>
       <motion.div 
         initial={{ x: -100, opacity: 0 }}
         whileInView={{ x: 0, opacity: 1 }}
         className="p-3 rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-brand-teal flex justify-between items-center"
       >
          <span>✓ Found: Netflix India</span>
          <span className="font-bold">₹649.00</span>
       </motion.div>
       <motion.div 
         initial={{ x: -100, opacity: 0 }}
         whileInView={{ x: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="p-3 rounded-lg bg-brand-purple/10 border border-brand-purple/30 text-brand-purple flex justify-between items-center"
       >
          <span>✓ Found: Adobe Creative Cloud</span>
          <span className="font-bold">₹2,394.00</span>
       </motion.div>
    </div>
  );
}

function RenewalMockup() {
  return (
    <div className="aspect-video w-full bg-bg-primary p-8 flex flex-col items-center justify-center gap-6">
       <div className="grid grid-cols-7 gap-3 w-full">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg border border-border-subtle flex items-center justify-center text-[10px] text-text-muted">{i+1}</div>
          ))}
       </div>
       <motion.div 
         animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
         transition={{ repeat: Infinity, duration: 2 }}
         className="w-full p-4 rounded-xl bg-bg-card border border-brand-teal/50 flex items-center gap-4 shadow-sm"
       >
          <div className="w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center text-brand-teal"><CalendarIcon size={20} /></div>
          <div className="flex-1">
             <div className="text-xs font-bold text-text-primary mb-1">Spotify Premium Renewal</div>
             <div className="text-[10px] text-brand-teal font-bold">In 7 Days (₹179)</div>
          </div>
          <XCircle size={16} className="text-accent-pink cursor-pointer" />
       </motion.div>
    </div>
  );
}

function CancelGuideMockup() {
  return (
    <div className="aspect-video w-full bg-bg-primary p-8">
       <div className="mb-6 flex items-center gap-2">
          <ShieldCheck size={18} className="text-accent-pink" />
          <span className="text-xs font-black uppercase text-text-primary">Cancellation Guide: Hotstar</span>
       </div>
       <div className="space-y-4">
          {[
            { t: "Go to Account Settings", s: "Completed" },
            { t: "Click 'Cancel Membership'", s: "In progress" },
            { t: "Confirm Cancellation", s: "Pending" }
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-brand-teal text-white' : 'border border-border-subtle text-text-muted'}`}>{i+1}</div>
               <div className="flex-1 h-[2px] bg-bg-surface relative">
                  <div className={`absolute inset-y-0 left-0 bg-brand-teal ${i === 0 ? 'w-full' : 'w-0'}`} />
               </div>
               <div className="text-[10px] text-text-primary font-semibold w-24 text-right">{step.t}</div>
            </div>
          ))}
       </div>
    </div>
  );
}

function InteractiveDemoTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: 'Dashboard', icon: <LayoutDashboard size={16} />, content: 'Full overview of your spending patterns and active trials.' },
    { title: 'AI Scanner', icon: <Bot size={16} />, content: 'The fastest way to import your history from any Indian bank.' },
    { title: 'Calendar', icon: <CalendarIcon size={16} />, content: 'A bird\'s eye view of your upcoming billing cycles.' }
  ];

  return (
    <div className="flex flex-col gap-8">
       <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === i ? 'bg-brand-purple text-white shadow-lg' : 'bg-bg-surface text-text-muted hover:bg-bg-hover hover:text-text-primary'}`}
            >
               {tab.icon} {tab.title}
            </button>
          ))}
       </div>
       <div className="rounded-[40px] border border-white/10 bg-[#080810] p-2 overflow-hidden shadow-inner">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               transition={{ duration: 0.4 }}
               className="aspect-[16/9] w-full rounded-[32px] bg-[#0F0F1A] p-8 flex flex-col items-center justify-center relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.05)_0%,transparent_70%)]" />
                <div className="relative z-10 text-center">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 mx-auto text-[#6C63FF]">{tabs[activeTab].icon}</div>
                   <h4 className="text-2xl font-black text-white mb-4 italic tracking-tighter">"{tabs[activeTab].title} Interface"</h4>
                   <p className="text-[#9999BB] max-w-sm mb-8 leading-relaxed font-semibold">{tabs[activeTab].content}</p>
                   <button className="px-6 py-2 rounded-lg border border-white/10 text-white text-xs font-bold flex items-center gap-2 group mx-auto">
                      Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </motion.div>
          </AnimatePresence>
       </div>
       <div className="mt-8 flex justify-center">
         <MagneticButton className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
            Explore Dashboard →
         </MagneticButton>
       </div>
    </div>
  );
}

function TestimonialCard({ quote, name, loc, saved }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="min-w-[320px] md:min-w-[380px] p-10 rounded-[40px] bg-bg-card border border-border-subtle snap-start flex flex-col justify-between group hover:border-brand-purple/40 transition-colors"
    >
       <div>
          <div className="flex gap-1 mb-8">
             {Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-4 h-4 rounded-sm bg-warning">★</div> )}
          </div>
          <p className="text-lg text-text-primary leading-relaxed italic font-medium mb-12">"{quote}"</p>
       </div>
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-gradient p-[1px]">
             <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center text-text-primary font-black text-xl">{name[0]}</div>
          </div>
          <div>
             <div className="text-text-primary font-black tracking-tight">{name} <span className="text-text-muted font-bold">— {loc}</span></div>
             <div className="text-[11px] font-black uppercase text-brand-teal tracking-widest mt-0.5">Saved {saved}</div>
          </div>
       </div>
    </motion.div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card overflow-hidden">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full p-6 flex items-center justify-between text-left group"
       >
          <span className="text-text-primary font-bold tracking-tight group-hover:text-brand-purple transition-colors">{question}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
             <ChevronDown size={20} className="text-text-muted" />
          </motion.div>
       </button>
       <AnimatePresence>
          {isOpen && (
            <motion.div 
               initial={{ height: 0 }}
               animate={{ height: 'auto' }}
               exit={{ height: 0 }}
               className="overflow-hidden"
            >
               <div className="p-6 pt-0 text-text-secondary text-sm leading-relaxed border-t border-border-subtle">
                  {answer}
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
