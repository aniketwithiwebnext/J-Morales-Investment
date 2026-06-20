import React, { useState } from "react";
import { ArrowRight, Check, MapPin, Loader2, Calendar, ClipboardCheck, PhoneCall, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LeadSubmitData } from "../types";

interface CashOfferFormProps {
  onSuccess: () => void;
}

export default function CashOfferForm({ onSuccess }: CashOfferFormProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LeadSubmitData>({
    propertyAddress: "",
    propertyCity: "Merriam",
    propertyState: "KS",
    propertyZip: "",
    situation: "Distressed Property",
    bedrooms: "3",
    bathrooms: "2",
    propertyCondition: "Fair",
    notes: "",
    fullName: "",
    phone: "",
    email: "",
    preferredContact: "Phone",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const nextStep = () => {
    setError("");
    // Simple verification per step
    if (step === 1) {
      if (!formData.propertyAddress.trim()) {
        setError("Please enter the property street address.");
        return;
      }
      if (!formData.propertyZip.trim() || formData.propertyZip.length < 5) {
        setError("Please enter a valid 5-digit ZIP code.");
        return;
      }
    }
    if (step === 2) {
      // Step 2 features (bedrooms, baths etc.) always configured with default options
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Contact info validation
    if (!formData.fullName.trim()) {
      setError("Please fill in your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("Please enter a valid 10-digit telephone number.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register cash offer lead. Please try again.");
      }

      const resData = await response.json();
      if (resData.success) {
        onSuccess();
      } else {
        throw new Error(resData.error || "Unspecified error.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please contact us at 816-777-7474.");
    } finally {
      setLoading(false);
    }
  };

  const situations = [
    "Distressed Property / Needs Extensive Repairs",
    "Inherited Estate / Probate",
    "Foreclosure Alternative / Bank Intervention",
    "Tired Landlord / Troublesome Tenant",
    "Immediate Financial Relocation",
    "Divorce Split / Joint Assets",
    "Other / Out-of-State Holder",
  ];

  return (
    <div id="cash-offer-block" className="relative w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-900/10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase block mb-1">
            QUALIFIED LEAD INITIATIVE
          </span>
          <h3 className="font-display font-bold text-white text-lg md:text-xl">
            Get Your No-Obligation Cash Offer
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[10px]">
          <span className="text-slate-500 font-medium">STEP</span>
          <span className="text-emerald-400 font-bold">{step}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">3</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-800/60">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Property Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="propertyAddress"
                    required
                    placeholder="e.g. 5800 Merriam Dr..."
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl pl-10 pr-4 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    name="propertyCity"
                    value={formData.propertyCity}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="propertyState"
                    value={formData.propertyState}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  ZIP / Postal Code *
                </label>
                <input
                  type="text"
                  name="propertyZip"
                  required
                  placeholder="e.g. 66203"
                  maxLength={5}
                  value={formData.propertyZip}
                  onChange={handleChange}
                  className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  What is your primary selling reason?
                </label>
                <select
                  name="situation"
                  value={formData.situation}
                  onChange={handleChange}
                  className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition appearance-none cursor-pointer"
                >
                  {situations.map((sit, i) => (
                    <option key={i} value={sit}>
                      {sit}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer mt-4"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, "6+"].map((num) => (
                      <option key={num} value={num}>
                        {num} Bed
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    Bathrooms
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition cursor-pointer"
                  >
                    {[1, 1.5, 2, 2.5, 3, 3.5, "4+"].map((num) => (
                      <option key={num} value={num}>
                        {num} Bath
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Property Condition Estimation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Good", "Fair", "Needs Repair / Poor"].map((cond) => {
                    const isSelected = formData.propertyCondition === cond;
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => setFormData({ ...formData, propertyCondition: cond })}
                        className={`py-3.5 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Additional Details or Unique Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="e.g. Roof is 15 years old, tenant occupied, inherited probate pending..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl p-3.5 text-xs outline-none transition resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="h-11 border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="h-11 bg-emerald-500 hover:bg-emerald-400 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>Last Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    Local Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={14}
                    placeholder="e.g. 8167777474"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Preferred Contact Choice
                </label>
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full h-11 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-white rounded-xl px-4 text-sm outline-none transition cursor-pointer"
                >
                  <option value="Phone">Phone Call (Fastest)</option>
                  <option value="Text">Text SMS</option>
                  <option value="Email">Email Communication</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 py-2 bg-slate-950/40 px-3 rounded-lg border border-slate-900/60">
                <input
                  type="checkbox"
                  defaultChecked
                  id="consent"
                  required
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20"
                />
                <label htmlFor="consent" className="text-[10px] text-slate-400 leading-tight">
                  Agree to receive custom cash offer quotes. No spam, we guarantee complete privacy.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="h-11 border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 bg-emerald-500 hover:bg-emerald-400 text-navy-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Get Cash Offer</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Trust guarantees below form */}
      <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-slate-800/60 text-center font-mono text-[9px] text-slate-500">
        <div className="flex items-center justify-center space-x-1.5 py-1 bg-slate-950/20 rounded border border-slate-900">
          <Award className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>100% FREE NO OBLIGATION</span>
        </div>
        <div className="flex items-center justify-center space-x-1.5 py-1 bg-slate-950/20 rounded border border-slate-900">
          <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>CONFIDENTIAL PROCESSING</span>
        </div>
      </div>
    </div>
  );
}
