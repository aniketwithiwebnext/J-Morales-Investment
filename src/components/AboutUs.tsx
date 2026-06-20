import { CheckCircle, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function AboutUs() {
  const corporateValuePoints = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Ethical Transactions First",
      desc: "Our transactions follow clear ethical guidelines. If a cash offer isn't the best path for your unique situation, we will openly explain alternative routes like typical listings or partner referrals.",
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      title: "Deep Merriam Local Focus",
      desc: "We live and invest right here. We know the Merriam, Shawnee, Mission, and Overland Park neighborhoods inside-out, ensuring customized, fair valuations matching real local market conditions.",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      title: "Transparency Throughout",
      desc: "No fine print, structural gimmicks, or lowball surprises. We walk you through every dollar of our property rehabilitation calculation so you understand exactly how our cash valuation is determined.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: "Supportive Solutions Broker",
      desc: "Whether dealing with a sudden family inheritance, troublesome out-of-state rentals, or distressing pre-foreclosure court dates, we handle all logistical burdens with complete compassion.",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Visual column with local real estate theme */}
        <div id="about-visual-col" className="lg:col-span-5 space-y-4">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2 block">
              Merriam’s Private Home Buyer
            </div>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mb-4">
              Our Vision & Ethical Mission
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Founded on the belief that selling a home should not be traumatic or draining. J Morales Investments has assisted homeowners throughout Merriam and Greater Kansas City navigate rapid closures with extreme success.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              We stand apart from out-of-state corporate consolidators by acting local, keeping cash local, and treating homeowners like true neighbors facing real-life scenarios.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 text-xl font-bold">100%</span>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Ethical Pledge</span>
              </div>
              <div className="text-right">
                <span className="text-white text-base font-bold">Merriam, KS</span>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Operations Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core mission description */}
        <div id="about-details-col" className="lg:col-span-7 space-y-6">
          <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-block">
            Who We Are
          </span>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            Assisting Homeowners Navigate Difficult Situations with Honesty
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            We understand that houses represent memories—and sometimes, burdens. Whether you inherited an older estate that requires major physical work, or need cash quickly due to a pending foreclosure status, we serve as your stress relief partner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {corporateValuePoints.map((val, idx) => (
              <div key={idx} id={`value-point-${idx}`} className="flex items-start space-x-3 p-4 bg-slate-950/20 rounded-xl border border-slate-900 hover:border-slate-800 transition">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 flex-shrink-0 mt-0.5">
                  {val.icon}
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white text-sm mb-1">{val.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
