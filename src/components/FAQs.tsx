import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Process",
    question: "How does the cash offer process work? (We buy houses Merriam)",
    answer: "Our process is straightforward and transparent. First, you submit your property address and contact details online or call us at 816-777-7474. Second, we do some quick research on local sales in Merriam, KS, and arrange a short, friendly visit to look at the property. Third, we present a fair, all-cash offer. If you accept, we handle all closing costs and paperwork, letting you select the exact date we close at a reputable local title company.",
  },
  {
    category: "Costs",
    question: "Are there any real estate commissions, agent fees, or closing costs?",
    answer: "Absolutely not. When you sell to J Morales Investments, you don't pay any agent fees, advertising costs, or listing commissions. Our cash home buyers Kansas City purchase directly from you. The cash offer we make is exactly what you get at the closing table, as we cover 100% of standard Kansas title agent fees and closing costs.",
  },
  {
    category: "Property Condition",
    question: "Do I need to clean or make expensive repairs? (Sell my house fast Merriam KS)",
    answer: "No, you don't need to lift a finger! We buy houses Merriam completely 'as-is'. You don't have to clean, paint, clear out junk, or fix structural issues. Whether the house has termite damage, needs fresh roofing, or is full of unwanted belongings, we'll purchase it exactly as it sits.",
  },
  {
    category: "Timeframe",
    question: "How fast can you close? (Real estate investors Merriam KS)",
    answer: "We are extremely flexible! Because we buy properties with our own liquid funds and don't require conventional bank approvals, we can close in as little as 7 to 14 days. If you prefer more time to relocate, arrange estate division, or settle items, we are happy to schedule the closing date weeks or months out to fit your custom timeline.",
  },
  {
    category: "Alternatives",
    question: "How are you different from a traditional local real estate agent?",
    answer: "Traditional agents list files on the MLS and wait for qualified retail buyers, a process that takes 45 to 90+ days and requires constant home walkthroughs, cleaning, extensive repairs, and buyer financing contingencies. J Morales Investments doesn't list your house—we are the cash buyers ourselves! We guarantee an all-cash close, assume all repair risks, bypass appraisals, and make it entirely hands-off.",
  },
  {
    category: "Tricky Situations",
    question: "What if I am facing foreclosure, inherited an unwanted property, or have bad tenants?",
    answer: "We specialize in solving complex property challenges. If you are facing foreclosure, we may be able to negotiate with your lender or purchase the property before the auction to save your credit. If you inherited a property in probate, we work with legal experts to purchase the house quickly so you can distribute estate funds. If you have troublesome renters, we will purchase the rental and handle tenant lease transitions directly.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
          Knowledge Base
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
          Frequently Answered Inquiries
        </h3>
        <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
          Explore complete details about direct cash offers, Merriam property investments, and hassle-free relocation closing options.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              id={`faq-item-${idx}`}
              className={`rounded-xl border transition-all duration-350 overflow-hidden ${
                isOpen
                  ? "bg-slate-900/60 border-emerald-500/40 shadow-lg shadow-emerald-900/5"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/30 font-light"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group"
              >
                <div className="flex items-start space-x-3 pr-4">
                  <HelpCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                    isOpen ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
                  }`} />
                  <span className={`font-display text-sm md:text-base font-semibold ${
                    isOpen ? "text-white" : "text-slate-300 group-hover:text-slate-200"
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg border transition-all ${
                  isOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-300"
                }`}>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-6 md:px-6 md:pb-7 pt-0 border-t border-slate-900 text-slate-300 text-sm md:text-sm leading-relaxed whitespace-pre-line font-light">
                      <p>{faq.answer}</p>
                      
                      <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-400">
                          {faq.category}
                        </span>
                        <span>•</span>
                        <span>Verified Investor Response</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12 bg-slate-900/30 rounded-2xl border border-slate-800 p-6 md:p-8 max-w-xl mx-auto">
        <h4 className="font-display font-medium text-white mb-2 text-base">Have a unique estate situation?</h4>
        <p className="text-slate-400 text-xs mb-4">
          Every homeowner’s puzzle is different. We have custom purchasing programs to accommodate divorce splits, probate delays, structures with heavy repairs, and pre-foreclosures.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <a
            href="tel:8167777474"
            className="w-full sm:w-auto h-11 px-5 rounded-lg bg-emerald-500 text-navy-900 text-xs font-semibold text-center flex items-center justify-center space-x-2 hover:bg-emerald-400 transition"
          >
            <span>Talk to J Morales: 816-777-7474</span>
          </a>
        </div>
      </div>
    </div>
  );
}
