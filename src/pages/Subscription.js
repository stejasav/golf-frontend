import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { subscribeUser } from "../services/api";

function FeatureItem({ label, active, highlight }) {
  return (
    <div className={`flex items-center gap-3 ${!active ? "opacity-40" : ""}`}>
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          active
            ? highlight
              ? "bg-[#7eda5a]/20"
              : "bg-[#f0faf2]"
            : "bg-gray-100"
        }`}
      >
        {active ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={highlight ? "#1a5c2e" : "#6b7b6e"}
            strokeWidth="4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8a9e8d"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <span
        className={`text-xs font-bold ${highlight ? "text-[#0a2212]" : "text-[#6b7b6e]"}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function Subscription({ token, user, setToken, setUser }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isPro = user?.subscriptionStatus === "active";

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await subscribeUser(token);
      setUser((prev) => ({ ...prev, subscriptionStatus: "active" }));
      navigate("/dashboard");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <Navbar user={user} setToken={setToken} />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <p className="text-[#1a5c2e] text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            Membership Tiers
          </p>
          <h1 className="text-[#0a2212] text-4xl md:text-5xl font-black tracking-tight mb-4">
            Choose your <span className="text-[#1a5c2e]">Impact</span>
          </h1>
          <p className="text-[#6b7b6e] text-sm max-w-md mx-auto font-medium">
            Join a community of golfers playing for a purpose. Upgrade to unlock
            prizes and charity contributions.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
              !isPro
                ? "bg-white border-[#1a5c2e]/10 shadow-sm"
                : "bg-[#f8faf5] border-[#1a5c2e]/10 opacity-60"
            }`}
          >
            <div className="mb-8">
              <h2 className="text-[#0a2212] text-xl font-bold mb-1">
                Guest Entry
              </h2>
              <p className="text-[#8a9e8d] text-xs font-black uppercase tracking-widest">
                Free Forever
              </p>
            </div>
            <div className="space-y-4 mb-10">
              <FeatureItem label="View Leaderboards" active />
              <FeatureItem label="Browse History" active />
              <FeatureItem label="Add Monthly Scores" active={false} />
              <FeatureItem label="Enter Prize Draws" active={false} />
              <FeatureItem label="Direct Charity Impact" active={false} />
            </div>
            <button
              disabled
              className="w-full py-4 rounded-2xl border border-[#e2eee4] text-[#8a9e8d] text-xs font-black uppercase tracking-widest"
            >
              {!isPro ? "Current Level" : "Basic Access"}
            </button>
          </div>

          <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-[#7eda5a] to-[#1a5c2e] shadow-2xl shadow-[#1a5c2e]/30">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0a2212] text-[#7eda5a] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full z-10 shadow-lg">
              Recommended
            </div>
            <div className="bg-white rounded-[2.3rem] p-8 h-full">
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <h2 className="text-[#0a2212] text-2xl font-black tracking-tight">
                    Pro Member
                  </h2>
                  <div className="text-right">
                    <p className="text-[#1a5c2e] text-2xl font-black leading-none">
                      ₹0
                    </p>
                    <p className="text-[#8a9e8d] text-[10px] font-bold uppercase">
                      per month
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mb-10">
                <FeatureItem label="Unlimited Score Entries" active highlight />
                <FeatureItem
                  label="Monthly Prize Eligibility"
                  active
                  highlight
                />
                <FeatureItem
                  label="Custom Charity Selection"
                  active
                  highlight
                />
                <FeatureItem
                  label="Verified Performance Badge"
                  active
                  highlight
                />
                <FeatureItem label="Instant Payouts" active highlight />
              </div>
              {isPro ? (
                <div className="flex flex-col items-center gap-3">
                  <button
                    disabled
                    className="w-full bg-[#f0faf2] text-[#1a5c2e] py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-[#c8eecb]"
                  >
                    Active Subscription
                  </button>
                  <p className="text-[#8a9e8d] text-[10px] font-bold uppercase tracking-tighter italic">
                    Renews next month
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full bg-[#1a5c2e] hover:bg-[#0a2212] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#1a5c2e]/20 active:scale-[0.98] group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Processing..." : "Upgrade to Pro"}
                    {!loading && (
                      <svg
                        className="group-hover:translate-x-1 transition-transform"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[#b8ccba] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Secure Checkout · Cancel Anytime
          </p>
          <div className="flex justify-center gap-8 opacity-40 grayscale">
            <div className="font-black text-xs text-[#0a2212]">UPI</div>
            <div className="font-black text-xs text-[#0a2212]">VISA</div>
            <div className="font-black text-xs text-[#0a2212]">MASTERCARD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
