import React from "react";
import { Home, Trash2, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";

interface ServiceItem {
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
  scenarios: string[];
}

const services: ServiceItem[] = [
  {
    icon: <Home className="w-5 h-5 text-emerald-400" />,
    tag: "Primary Service",
    title: "Cash Home Buying",
    desc: "We buy homes directly from you without conventional lending delays, broker appraisals, or listing commissions. Our internal cash reserves guarantee rapid closeouts.",
    scenarios: ["As-is buying", "No structural appraisals required", "Closing date on your schedule", "100% free of marketing noise"],
  },
  {
    icon: <Trash2 className="w-5 h-5 text-emerald-400" />,
    tag: "Condition Resolution",
    title: "Distressed Property Solutions",
    desc: "Is your home burdened with costly foundation cracks, water damage, fire issues, or outright code violations? Avoid expensive updates—we assume all structural rehabilitation.",
    scenarios: ["Heavy foundation repairs", "Fire/water/molded damage", "Excessive trash or hoarder cleanups", "Severe code violations"],
  },
  {
    icon: <Award className="w-5 h-5 text-emerald-400" />,
    tag: "Estate Division",
    title: "Inherited Property Assistance",
    desc: "Managing an estate in probate can be an emotional, bureaucratic ordeal. We guide families with simple cash options, bypassing physical property distribution loops.",
    scenarios: ["Estates in probate/will cycles", "Unwanted heirlooms left behind", "Multi-family heir division help", "Distant out-of-province owners"],
  },
  {
    icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    tag: "Priceless Protection",
    title: "Foreclosure Alternatives",
    desc: "If you have missed payments or received pre-foreclosure notices, act immediately. We can buy your home to settle your mortgage debt and preserve your financial history.",
    scenarios: ["Late mortgage reminders", "Active pre-foreclosure listings", "Quick liquidation to secure equity", "Short-sale options support"],
  },
  {
    icon: <FileText className="w-5 h-5 text-emerald-400" />,
    tag: "Landlord Reprieve",
    title: "Rental Property Purchases",
    desc: "Tired of tracking late rental checks, repairing tenant abuse, or battling evictions? Let us purchase your rental estate directly, with or without occupying tenants.",
    scenarios: ["Late rent payments or evictions", "Bad physical upkeep", "Damaged HVAC/major systems", "Sell with current tenants in place"],
  },
];

interface ServicesProps {
  onSelectCTA: () => void;
}

export default function Services({ onSelectCTA }: ServicesProps) {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
          Specialist Offerings
        </span>
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">
          Reliable Real Estate Solutions Centered Around Your Needs
        </h2>
        <p className="text-slate-400 text-sm mt-3">
          Explore our tailored programs in Merriam, KS, engineered to move you away from unwanted property stress on your own timetable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <div
            key={idx}
            id={`service-card-${idx}`}
            className="group flex flex-col justify-between p-6 bg-slate-950/30 rounded-2xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-emerald-400 tracking-wider uppercase bg-emerald-950/40 py-1 px-2.5 rounded border border-emerald-500/20">
                  {svc.tag}
                </span>
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 border border-slate-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                  {svc.icon}
                </div>
              </div>

              <h4 className="font-display text-lg font-bold text-white tracking-tight pt-1">
                {svc.title}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {svc.desc}
              </p>

              <div className="pt-4 border-t border-slate-900 space-y-2">
                <span className="font-mono text-[9px] text-slate-500 block">TYPICAL EXAMPLES</span>
                <ul className="grid grid-cols-1 gap-1.5 text-left text-slate-400 text-[11px] leading-tight">
                  {svc.scenarios.map((sc, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                      <span>{sc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={onSelectCTA}
              className="mt-6 w-full py-2.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 bg-slate-950 hover:bg-slate-900 text-white hover:text-emerald-400 text-xs font-semibold tracking-wide transition duration-300 cursor-pointer"
            >
              Request Offer for This Situation
            </button>
          </div>
        ))}

        {/* Dynamic customized scenario card */}
        <div id="service-card-custom" className="flex flex-col justify-between p-6 bg-gradient-to-br from-indigo-950/10 via-slate-950/20 to-emerald-950/10 rounded-2xl border border-dashed border-slate-800 text-center shadow-xl">
          <div className="space-y-4 my-auto py-4">
            <span className="font-mono text-[9px] text-slate-500 tracking-wider uppercase bg-slate-900/60 py-1 px-2.5 rounded border border-slate-800">
              Custom Situations
            </span>
            <h4 className="font-display text-lg font-bold text-white tracking-tight">
              Have a Different Situation?
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Bankruptcy, tax liens, boundary issues, out-of-state assets, or half-complete renovations? We provide free consultancy to analyze any title issue in Merriam, KS.
            </p>
          </div>
          <button
            type="button"
            onClick={onSelectCTA}
            className="w-full py-3 rounded-lg bg-emerald-500 text-navy-900 text-xs font-bold tracking-wide hover:bg-emerald-400 transition cursor-pointer"
          >
            Describe Your Situation Now
          </button>
        </div>
      </div>
    </div>
  );
}
