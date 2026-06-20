import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  DollarSign,
  Briefcase,
  Layers,
  HelpCircle,
  MessageSquare,
  ChevronUp,
  X,
  Send,
  UserCheck,
  CheckCircle,
  FileCheck,
  FolderOpen,
  Eye,
  Lock,
  Smartphone,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  ArrowRight,
  Calendar,
  PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThreeHouse from "./components/ThreeHouse";
import FAQs from "./components/FAQs";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import CashOfferForm from "./components/CashOfferForm";
import { ChatMessage, LeadResponse } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "services" | "about" | "sell" | "contact">("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOfferSuccess, setShowOfferSuccess] = useState(false);
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      role: "model",
      text: "Hi! I am the J Morales Investments advisor. Are you looking to sell a property quickly in Merriam, KS, or the wider Kansas City area?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Admin section states
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [leadsError, setLeadsError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Schema Markup Injected dynamically
  useEffect(() => {
    // Inject Structured Local Business Schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "J Morales Investments",
      "url": "https://jmoralesinvestments.com",
      "telephone": "816-777-7474",
      "email": "jmorales1339@gmail.com",
      "image": "https://ais-dev-qzebj6utzqiro6bhvaevc6-81593684824.asia-east1.run.app/assets/house_mesh.png",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Merriam Dr",
        "addressLocality": "Merriam",
        "addressRegion": "KS",
        "postalCode": "66203",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 39.0208,
        "longitude": -94.6947
      },
      "areaServed": [
        "Merriam, KS",
        "Kansas City",
        "Shawnee, KS",
        "Overland Park, KS",
        "Mission, KS"
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    // Track scroll for "Scroll to Top" button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.head.removeChild(script);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update page-specific tabs & focus titles
  useEffect(() => {
    const titles = {
      home: "iWebNext | Sell Your House Fast in Merriam & Kansas City Area",
      services: "Specialist Real Estate Services | J Morales Investments",
      about: "Ethical Local Home Buyers | About J Morales Investments",
      sell: "Get a No-Obligation Direct Cash Offer | J Morales Investments",
      contact: "Contact Local Merriam Investors | J Morales Investments",
    };
    document.title = titles[activeTab];
  }, [activeTab]);

  // Handle lead list retrieval for transparent testing dashboard (Secured by mock passwords or simple inspect keys)
  const fetchLeadsData = async () => {
    try {
      setLeadsError("");
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Could not download leads.");
      const data = await res.json();
      setLeads(data);
    } catch (err: any) {
      setLeadsError(err.message || "Failed to retrieve database entries.");
    }
  };

  const verifyAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "816777" || adminPassword === "admin") {
      setAdminUnlocked(true);
      fetchLeadsData();
    } else {
      setLeadsError("Incorrect passcode! Correct code is 'admin' or '816777'");
    }
  };

  // Chatbot communication
  const sendChatMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatTyping(true);

    // Scroll chat window down
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send history format as plain text messages
        body: JSON.stringify({
          message: msgText,
          history: chatMessages.map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error("Chat connection degraded.");
      }

      const resData = await response.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: resData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errBotMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: "I experienced a temporary connection glitch. Please submit your request or call direct at 816-777-7474!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errBotMsg]);
    } finally {
      setIsChatTyping(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-navy-900">
      
      {/* HEADER / STICKY BRAND NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo Brand Title */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              M
            </div>
            <div className="leading-none">
              <span className="block text-xl font-bold tracking-tight uppercase text-white">
                J Morales
              </span>
              <span className="text-[10px] text-[#10B981] font-semibold tracking-[0.2em] uppercase block">
                Investments
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: "home", label: "Our Process" },
              { id: "services", label: "Service Areas" },
              { id: "about", label: "About Us" },
              { id: "sell", label: "Sell Your House" },
              { id: "contact", label: "FAQ / Contact" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "text-[#10B981] font-semibold bg-slate-800/40"
                      : "text-slate-300 hover:text-[#10B981] hover:bg-slate-950/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Contact CTA Button */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:8167777474"
              className="flex items-center space-x-2 px-4 py-2 border border-[#10B981] rounded text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all font-bold text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>816-777-7474</span>
            </a>

            <button
              onClick={() => {
                setActiveTab("sell");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-10 px-4 rounded bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider hidden lg:inline-flex items-center space-x-1.5 transition duration-300 shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <span>Get Offer Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING RECRUITING BAR */}
      <div className="sticky top-20 z-40 md:hidden bg-emerald-950/90 border-b border-emerald-500/25 px-4 py-2 text-center text-[11px] font-semibold text-emerald-300 flex justify-between items-center backdrop-blur bg-orange-950/20">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>We Buy Houses Fast in Merriam!</span>
        </span>
        <a
          href="tel:8167777474"
          className="bg-emerald-500 text-navy-900 py-1 px-3 rounded font-bold uppercase text-[10px] tracking-wider"
        >
          Click-To-Call
        </a>
      </div>

      {/* MAIN LAYOUT MAIN-STAGE WRAPPER */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-24">
        
        {/* VIEW CONDITIONAL RENDERING */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-28"
            >
              
              {/* 1. HERO MAIN AREA & ABOVE-THE-FOLD CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                
                {/* Visual Left Info panel */}
                <div id="hero-marketing-col" className="lg:col-span-7 space-y-6">
                  <div className="mb-6 inline-flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Local Merriam, KS Experts</span>
                  </div>

                  <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-6">
                    Sell Your House <span className="text-[#10B981]">Fast</span> in Merriam & Kansas City.
                  </h1>

                  <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl">
                    Avoid agent commissions, expensive repairs, and months of waiting. We buy houses as-is for cash with a guaranteed closing on your timeline. J Morales Investments is Merriam's expert local buyer.
                  </p>

                  {/* Simple 3-Step Process */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-8 mb-8">
                    <div className="flex flex-col space-y-2">
                      <span className="text-[#10B981] font-mono font-bold text-base">01.</span>
                      <h3 className="font-bold text-white text-sm sm:text-base">Contact Us</h3>
                      <p className="text-xs text-slate-500 leading-snug">Share property details in minutes.</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-[#10B981] font-mono font-bold text-base">02.</span>
                      <h3 className="font-bold text-white text-sm sm:text-base">Get Offer</h3>
                      <p className="text-xs text-slate-500 leading-snug">A fair, no-obligation cash offer.</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-[#10B981] font-mono font-bold text-base">03.</span>
                      <h3 className="font-bold text-white text-sm sm:text-base">Get Paid</h3>
                      <p className="text-xs text-slate-500 leading-snug">Close fast and walk away happy.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => {
                        setActiveTab("sell");
                        window.scrollTo({ top: document.getElementById("cash-offer-block")?.offsetTop || 300, behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto px-6 h-12 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      <span>Get My Free Offer Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <a
                      href="tel:8167777474"
                      className="w-full sm:w-auto px-6 h-12 rounded-lg border border-[#10B981] hover:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center space-x-2 transition-all text-xs font-bold"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Speak with J Morales: 816-777-7474</span>
                    </a>
                  </div>
                </div>

                {/* Left side dynamic cash offer form integration */}
                <div id="hero-form-col" className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-3xl -z-10" />
                  
                  {showOfferSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 bg-slate-900 border border-emerald-500/30 rounded-2xl text-center space-y-6"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="font-display font-bold text-white text-xl">Offer Requested Successfully!</h3>
                      <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                        Thank you for trusting J Morales Investments. We are analyzing properties in Merriam, KS, right now. J Morales himself will contact you within 24 hours to schedule a quick 15-minute as-is walkthrough and draft your fair cash valuation.
                      </p>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Next Steps Timeline</span>
                        <div className="flex items-center space-x-2 text-xs text-slate-300 font-light">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>1. Immediate database valuation analytics (Done)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-white font-medium">
                          <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                          <span>2. Call to confirm walkthrough details (Within 1-2 hours)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 font-light">
                          <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span>3. Walkthrough & No-Obligation cash payout assignment</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                        <a
                          href="tel:8167777474"
                          className="h-11 px-5 rounded-lg bg-emerald-500 text-navy-900 text-xs font-bold flex items-center justify-center space-x-2"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Call 816-777-7474</span>
                        </a>
                        <button
                          onClick={() => setShowOfferSuccess(false)}
                          className="h-11 px-5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-semibold"
                        >
                          View Form Again
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <CashOfferForm onSuccess={() => setShowOfferSuccess(true)} />
                  )}
                </div>
              </div>

              {/* 2. HOW IT WORKS (3 SIMPLE STEPS) */}
              <div id="how-it-works" className="space-y-12">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                    Easy Direct Path
                  </span>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-3">
                    Our Streamlined 3-Step Process
                  </h2>
                  <p className="text-slate-400 text-sm mt-3">
                    No open house visits, financing approvals, or agent headaches. Simple, rapid, and transparent direct buyouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      num: "01",
                      title: "Tell Us About Your House",
                      desc: "Submit your street address and contact details using our 100% free multi-step web form, or call us directly. It is completely confidential.",
                    },
                    {
                      num: "02",
                      title: "Arrange a Light Walkthrough",
                      desc: "We arrange a simple 15-minute as-is property walkthrough. You do not need to clean, paint, or make repairs. We accept it all.",
                    },
                    {
                      num: "03",
                      title: "Get Your Direct Cash Check",
                      desc: "Accept the cash offer, choose your comfortable closing timeframe (takes 7-14 days), and walk away with your funds at escrow.",
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="relative p-6 bg-slate-950/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-300"
                    >
                      <span className="absolute top-4 right-6 font-mono text-4xl lg:text-5xl font-black text-emerald-500/10 block selection:bg-transparent">
                        {step.num}
                      </span>
                      <h4 className="font-display text-base font-bold text-white tracking-tight pt-4">
                        {step.title}
                      </h4>
                      <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. INTERACTIVE 3D SECTION */}
              <div id="interactive-diagnostics" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                    Interactive Graphics
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">
                    Evaluating Infrastructure Integrity with Three.js
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    Every property possesses structural integrity from the foundation up. J Morales Investments utilizes predictive construction estimation models that values properties fairly based on as-is configurations.
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    Use your mouse to hover, tilt, or click on the 3D grid layout on the right. This represents our engineering focus on as-is structural integrity.
                  </p>
                  
                  <div className="pt-4 border-t border-slate-800/80 space-y-4">
                    <span className="text-slate-500 font-mono text-[9px] block">VERIFIABLE BENEFITS</span>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>We assume complete physical and repair risks</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Zero dependency on strict buyer home inspections</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <ThreeHouse />
                </div>
              </div>

              {/* 4. REPUTABLE LOCAL REALTOR SOLUTIONS BENEFIT SECTION */}
              <div id="benefits-detail" className="space-y-12">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                    Why Direct Buyout?
                  </span>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-3">
                    Say Goodbye to Traditional Listing Hardships
                  </h2>
                  <p className="text-slate-400 text-sm mt-3 font-light">
                    Traditional home listings are built for pristine houses. Let us help you compare listing options with a transparent direct checkout.
                  </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  
                  {/* Option Traditional */}
                  <div className="p-6 bg-slate-950/20 rounded-2xl border border-slate-900 space-y-6">
                    <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider block bg-slate-900/60 w-fit px-2 ml-auto">
                      Traditional Realtors
                    </span>
                    <h4 className="font-display text-base font-bold text-white tracking-tight">
                      Broker Listing Path
                    </h4>
                    <ul className="space-y-4 text-xs font-light text-slate-400">
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-red-950/40 border border-red-900/40 text-red-400 text-[10px] font-mono font-bold mt-0.5">X</span>
                        <span>Commission fees take up to 6% of the final sales value.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-red-950/40 border border-red-900/40 text-red-400 text-[10px] font-mono font-bold mt-0.5">X</span>
                        <span>Average waiting periods of 45-120 days waiting on approved buyers.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-red-950/40 border border-red-900/40 text-red-400 text-[10px] font-mono font-bold mt-0.5">X</span>
                        <span>Requires continuous cleaning, open-house walkthroughs, and inspections.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-red-950/40 border border-red-900/40 text-red-400 text-[10px] font-mono font-bold mt-0.5">X</span>
                        <span>Buyer loan fallovers are common, restarting the cycle from zero.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Option J Morales Investments */}
                  <div className="p-6 bg-emerald-950/10 rounded-2xl border border-emerald-500/20 space-y-6">
                    <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider block bg-emerald-950/40 w-fit px-2 ml-auto border border-emerald-500/20">
                      J Morales Purchases
                    </span>
                    <h4 className="font-display text-base font-bold text-white tracking-tight">
                      Direct Cash Buyouts
                    </h4>
                    <ul className="space-y-4 text-xs font-semibold text-slate-300">
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mt-0.5">✔</span>
                        <span>Zero commission fees, zero advertising charges. 100% free of charge.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mt-0.5">✔</span>
                        <span>Close as fast as 7-14 days with zero mortgages or lending risks.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mt-0.5">✔</span>
                        <span>We buy completely 'as-is'—no broom sweep or physical repairs needed.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold mt-0.5">✔</span>
                        <span>Reputable Kansas Title escrow company guarantees secure payment transfers.</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* 5. LOCAL SERVICE AREA GEODEV */}
              <div id="service-areas" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block block w-fit">
                    Regional Expertise
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">
                    Where We Buy Houses in Merriam & Wider KC Metro
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed font-light">
                    We know the local Merriam neighborhoods, Shawnee, Overland Park, Lenexa, Mission, Olathe, and the broader Kansas City metro. Our appraisals incorporate micro-market parameters block by block.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
                    {["Merriam Proper", "Shawnee KS", "Overland Park KS", "Mission KS", "Lenexa KS", "Roeland Park KS", "Olathe KS", "Kansas City Area"].map((area, i) => (
                      <div key={i} className="flex items-center space-x-1.5 py-1.5 px-3 bg-slate-950/40 rounded-lg border border-slate-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-mono text-[9px] block mb-1">LOCAL DISPATCH OFFICE</span>
                    <p className="text-slate-300 text-xs font-medium">Merriam, Kansas 66203</p>
                    <p className="text-slate-400 text-[11px] font-light mt-0.5">Quick 15-minute dispatch for regional walkthrough appointments.</p>
                  </div>
                </div>

                <div className="lg:col-span-7 h-[360px] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded font-mono text-[10.5px] text-emerald-400">
                    Centering: Merriam, Kansas
                  </div>
                  {/* Google Maps iframe centered on Merriam, KS */}
                  <iframe
                    title="Merriam KS Map Representation"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12411.393278453488!2d-94.69466332152778!3d39.02078657682977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0ebce2e7bdf55%3A0xbc4fd359ae23cf23!2sMerriam%2C%20KS%2066203!5e0!3m2!1sen!2sus!4v1718919192455!5m2!1sen!2sus"
                    className="w-full h-full border-0 brightness-[0.85] contrast-[1.1] grayscale-[0.2]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* 6. TESTIMONIALS SECTION */}
              <div id="testimonials" className="space-y-12">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                    Homeowner Reviews
                  </span>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-3">
                    Relief Stories from Satisfied Neighbors
                  </h2>
                  <p className="text-slate-400 text-sm mt-3 font-light">
                    Real physical support given to homeowners facing relocation, sudden tax issues, and probate challenges.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Maria S.",
                      sub: "Inherited Probate relief • Merriam Proper",
                      text: "J Morales Investments was a lifesaver. I inherited my father's home which required over $45,000 in foundation and interior restorations. Selling directly saved us from stressful estate listings. J Morales bought it exactly as-is.",
                    },
                    {
                      name: "David K.",
                      sub: "Relocation sale • Shawnee, KS",
                      text: "I was relocating out of Kansas City for a sudden employment promotion. I didn't have time to clean, paint, or host annoying realtor walkthroughs. They provided a fair cash value proposal and we completed closing in 10 days.",
                    },
                    {
                      name: "Linda & Thomas",
                      sub: "Tired Landlord exit • Overland Park, KS",
                      text: "We managed a rental house for 12 years until tenants abandoned it with massive physical damage. J Morales purchased the property directly with trash scattered everywhere, closing super fast. Highly ethical team!",
                    },
                  ].map((tst, idx) => (
                    <div
                      key={idx}
                      id={`testimonial-item-${idx}`}
                      className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <p className="text-slate-300 text-xs leading-relaxed italic">
                        "{tst.text}"
                      </p>
                      <div className="pt-4 border-t border-slate-900 mt-6 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold font-display uppercase">
                          {tst.name[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{tst.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 block">{tst.sub}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. FAQ COMPONENT */}
              <FAQs />

            </motion.div>
          )}

          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Services onSelectCTA={() => setActiveTab("sell")} />
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AboutUs />
            </motion.div>
          )}

          {activeTab === "sell" && (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto space-y-10"
            >
              <div className="text-center">
                <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
                  Online Offer Dispatch
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                  Begin Your Direct Cash Sale Quote
                </h2>
                <p className="text-slate-400 text-sm mt-3">
                  Please provide your property structural facts and contact choices. No commitments or broker fees.
                </p>
              </div>

              {showOfferSuccess ? (
                <div className="p-8 bg-slate-900 border border-emerald-500/30 rounded-2xl text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="font-display font-bold text-white text-xl">Thank You! Offer Requested</h3>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                    We've registered your property details. J Morales is analyzing Merriam sales right now. We will call you within 24 hours to arrange an as-is walkthrough.
                  </p>
                  <button
                    onClick={() => setShowOfferSuccess(false)}
                    className="py-2.5 px-6 rounded-lg bg-emerald-500 text-navy-900 font-bold text-xs uppercase"
                  >
                    Resubmit Another Property
                  </button>
                </div>
              ) : (
                <CashOfferForm onSuccess={() => setShowOfferSuccess(true)} />
              )}
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Contact Coordinates Left */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block block w-fit">
                    Direct Line
                  </span>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">
                    Get in Touch with J Morales Investments
                  </h2>
                  <p className="text-slate-300 text-xs leading-relaxed font-light">
                    Have any questions regarding probate, deed records, tax liens, or closing delays? Reach out directly to speak with J Morales. We offer free professional property consulting.
                  </p>

                  <div className="space-y-4">
                    <a
                      href="tel:8167777474"
                      className="flex items-start space-x-3.5 p-4 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Local Phone Number</span>
                        <span className="text-white text-base font-bold font-mono">816-777-7474</span>
                        <p className="text-slate-500 text-[10px] font-light mt-0.5">Call or text 24/7 for cash offer processing.</p>
                      </div>
                    </a>

                    <a
                      href="mailto:jmorales1339@gmail.com"
                      className="flex items-start space-x-3.5 p-4 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Office Support Email</span>
                        <span className="text-white text-base font-bold font-mono">jmorales1339@gmail.com</span>
                        <p className="text-slate-500 text-[10px] font-light mt-0.5">Email documentation or tax queries anytime.</p>
                      </div>
                    </a>

                    <div className="flex items-start space-x-3.5 p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                      <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Office Location</span>
                        <span className="text-white text-base font-bold">Merriam, Kansas 66203</span>
                        <p className="text-slate-500 text-[10px] font-light mt-0.5">Serving Merriam, Shawnee, and Overland Park areas.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure Contact Inquiry Form */}
                <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 md:p-8 relative">
                  <h3 className="font-display font-bold text-white text-lg mb-4">Send Us a Direct Message</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Inquiry registered! We will contact you shortly.");
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">My Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">My Telephone</label>
                        <input
                          type="tel"
                          required
                          className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Which situational support do you need?</label>
                      <select className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-xs outline-none cursor-pointer">
                        <option>General Property Cash Offer Inquiry</option>
                        <option>Probate / Estate Legal Questions</option>
                        <option>Late Taxes / Pre-foreclosure Consultation</option>
                        <option>Landlord Exit / Eviction Struggles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">Comments or Message Details</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide any details about structural issues or requested timelines here..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl p-3.5 text-xs outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Submit Secure Inquiry
                    </button>
                  </form>
                </div>
              </div>

              {/* Centered Map Section */}
              <div className="space-y-4">
                <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block block w-fit">
                  Kansas Operations Mapping
                </span>
                <div className="w-full h-[360px] rounded-2xl border border-slate-800 overflow-hidden relative">
                  <iframe
                    title="Merriam KS Map Large"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12411.393278453488!2d-94.69466332152778!3d39.02078657682977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0ebce2e7bdf55%3A0xbc4fd359ae23cf23!2sMerriam%2C%20KS%2066203!5e0!3m2!1sen!2sus!4v1718919192455!5m2!1sen!2sus"
                    className="w-full h-full border-0 brightness-[0.8] contrast-[1.1] grayscale-[0.2]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* VERIFIABLE DATABASE VIEWER (ADMIN DESK TOOL) */}
        <div id="leads-desk" className="pt-10 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-mono text-[9px] text-emerald-400/80 tracking-widest uppercase block mb-1">
                  SECURE LEAD INTEGRITY AUDITING
                </span>
                <h4 className="font-display font-bold text-emerald-400 text-sm flex items-center space-x-2">
                  <span>Interactive Server Database Desk</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px] text-slate-500">
                    leads.json Realtime
                  </span>
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  We write real-world client requests to a secure server-side JSON database to preserve testing integrity. Enter the password <span className="text-emerald-300 font-mono">admin</span> to inspect actual submissions!
                </p>
              </div>

              {!showAdminPanel ? (
                <button
                  type="button"
                  onClick={() => setShowAdminPanel(true)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-semibold text-white flex items-center space-x-2 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Inspect Database Logs</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {!adminUnlocked ? (
                    <form onSubmit={verifyAdminPassword} className="flex items-center space-x-2 w-full">
                      <input
                        type="password"
                        placeholder="Unlock passcode..."
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-lg text-xs outline-none focus:border-emerald-500 shrink-0 w-32"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-emerald-500 text-navy-900 rounded-lg text-xs font-bold shrink-0"
                      >
                        Unlock
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAdminPanel(false)}
                        className="p-1 rounded bg-slate-900 border border-slate-800"
                      >
                        <X className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={fetchLeadsData}
                        className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold"
                      >
                        Sync
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUnlocked(false);
                          setShowAdminPanel(false);
                          setAdminPassword("");
                        }}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Expansions */}
            {showAdminPanel && adminUnlocked && (
              <div className="mt-6 pt-5 border-t border-slate-900/60 space-y-4">
                {leadsError && (
                  <p className="text-red-300 text-xs font-mono">{leadsError}</p>
                )}

                {leads.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No Direct Cash Offers registered yet inside `./leads.json`. Submit the multi-step cash form to generate direct real-time entries!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                          <th className="pb-3 pl-2">Lead ID</th>
                          <th className="pb-3">Timestamp</th>
                          <th className="pb-3">Owner Name</th>
                          <th className="pb-3">Property Address</th>
                          <th className="pb-3">Contact Code</th>
                          <th className="pb-3">Condition</th>
                          <th className="pb-3">Situation Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {leads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-900/40">
                            <td className="py-3 pl-2 font-mono text-[10px] text-emerald-400 font-bold">{l.id}</td>
                            <td className="py-3 text-[10px] text-slate-500">
                              {new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="py-3 font-semibold text-slate-200">{l.fullName}</td>
                            <td className="py-3 font-light text-slate-300">{l.propertyAddress}, {l.propertyCity}, {l.propertyState} {l.propertyZip}</td>
                            <td className="py-3 font-mono text-[10.5px] text-slate-300">{l.phone} / {l.email}</td>
                            <td className="py-3 text-[11px]">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                l.propertyCondition === "Good"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : l.propertyCondition === "Fair"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}>
                                {l.propertyCondition}
                              </span>
                            </td>
                            <td className="py-3 text-slate-400 text-[11px] font-light truncate max-w-xs">{l.situation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* FLOATING REAL-TIME AI ADVISOR CHATBOT SECTION */}
      <div id="ai-chatbot" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-[330px] sm:w-[360px] h-[450px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden mb-3 border-emerald-500/10"
            >
              {/* Chat Header */}
              <div className="bg-slate-900 px-4 py-3.5 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-white leading-tight">J Morales AI Advisor</h5>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center space-x-1 uppercase tracking-wider font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
                      <span>Online Assistant</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 font-light text-xs">
                {chatMessages.map((msg) => {
                  const isModel = msg.role === "model";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                          isModel
                            ? "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800/80"
                            : "bg-emerald-500 text-navy-900 font-medium rounded-tr-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`text-[8.5px] block mt-1.5 text-right font-mono ${
                          isModel ? "text-slate-500" : "text-emerald-950/70"
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isChatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl rounded-tl-none px-4 py-3 text-slate-400 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Suggestion block */}
              <div className="px-3 py-2 border-t border-slate-900 bg-slate-950/40 flex flex-wrap gap-1.5">
                {[
                  "Do I pay commissions?",
                  "How long does it take?",
                  "Do you buy as-is?",
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setChatInput(sug);
                      sendChatMessage(sug);
                    }}
                    className="text-[9.5px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 py-1 px-2 rounded-lg cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage(chatInput);
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask about selling your property here..."
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow h-10 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white text-xs px-3 rounded-xl outline-none"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-900 flex items-center justify-center hover:bg-emerald-400 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-emerald-500 text-navy-900 flex items-center justify-center hover:bg-emerald-400 shadow-2xl transition duration-300 transform hover:scale-105 select-none relative group cursor-pointer"
        >
          {isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center border border-navy-900 animate-pulse">
                1
              </span>
            </>
          )}
        </button>
      </div>

      {/* FLOATING ACTION SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 flex items-center justify-center cursor-pointer shadow-xl"
            title="Scroll back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 text-center text-xs text-slate-500 font-light mt-16 leading-relaxed">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          
          <div className="flex justify-center items-center space-x-3.5 text-slate-400">
            <span onClick={() => setActiveTab("home")} className="hover:text-emerald-400 cursor-pointer">Home</span>
            <span>•</span>
            <span onClick={() => setActiveTab("services")} className="hover:text-emerald-400 cursor-pointer">Services</span>
            <span>•</span>
            <span onClick={() => setActiveTab("about")} className="hover:text-emerald-400 cursor-pointer">About Us</span>
            <span>•</span>
            <span onClick={() => setActiveTab("sell")} className="hover:text-emerald-400 cursor-pointer">Direct Offer</span>
            <span>•</span>
            <span onClick={() => setActiveTab("contact")} className="hover:text-emerald-400 cursor-pointer">Contact</span>
          </div>

          <div className="max-w-md mx-auto text-[11px] text-slate-500 text-center font-mono">
            J Morales Investments • Merriam, KS 66203 • Office: 816-777-7474 • Email: jmorales1339@gmail.com
          </div>

          <p className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} J Morales Investments. All Rights Reserved. All offers are confidential and non-binding.
          </p>

          <p className="text-[11.5px]">
            Developed by <a href="https://iwebnext.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold hover:underline">iWebNext</a>
          </p>

        </div>
      </footer>

    </div>
  );
}
