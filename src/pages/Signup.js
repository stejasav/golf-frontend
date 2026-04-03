import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please complete all fields to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const res = await signupUser({ name, email, password });
      if (res.msg) {
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="w-full lg:w-[48%] flex items-center justify-center bg-white px-8 py-12 order-2 lg:order-1">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-full bg-[#1a5c2e] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#7eda5a" />
                <path
                  d="M12 2v4M12 18v4M2 12h4M18 12h4"
                  stroke="#7eda5a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[#0a2212] font-semibold tracking-wide text-sm">
              Par & Give
            </span>
          </div>

          <div className="mb-10">
            <h1 className="text-[#0a2212] text-3xl font-bold tracking-tight mb-2">
              Create your membership
            </h1>
            <p className="text-[#6b7b6e] text-sm leading-relaxed">
              Join thousands of golfers driving real-world impact.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#8a9e8d] font-semibold mb-2">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. James Henderson"
                className="w-full bg-[#f8faf5] border border-[#d4e4d6] rounded-xl px-4 py-3.5 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:bg-white focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#8a9e8d] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="name@domain.com"
                className="w-full bg-[#f8faf5] border border-[#d4e4d6] rounded-xl px-4 py-3.5 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:bg-white focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#8a9e8d] font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Min. 6 characters"
                className="w-full bg-[#f8faf5] border border-[#d4e4d6] rounded-xl px-4 py-3.5 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:bg-white focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-red-500 shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#1a5c2e] hover:bg-[#0d3319] text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#1a5c2e]/20 hover:shadow-[#1a5c2e]/30 active:scale-[0.99] disabled:opacity-60 text-sm tracking-wide mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="40"
                      strokeDashoffset="10"
                    />
                  </svg>
                  Creating your membership...
                </span>
              ) : (
                "Start My Membership →"
              )}
            </button>

            <p className="text-center text-[#6b7b6e] text-sm pt-1">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#2d7a3a] font-semibold hover:text-[#1a5c2e] underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#e2eee4]">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-[#a8bfab]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  SSL Secured
                </span>
              </div>
              <div className="w-px h-4 bg-[#d4e4d6]" />
              <div className="flex items-center gap-1.5 text-[#a8bfab]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  Stripe Payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden order-1 lg:order-2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=90&w=1400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#0a2212]/95 via-[#0d3319]/80 to-[#1a5c2e]/50" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div />
          <div>
            <div className="w-10 h-[2px] bg-[#7eda5a] mb-8" />
            <h2 className="text-[3rem] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              The noble side
              <br />
              <span className="text-[#7eda5a]">of the green.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-xs font-light">
              Where your handicap helps heal the world. Monthly draws, real
              prizes, and a charity that grows with every round you play.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "Monthly prize draws with real cash payouts",
                "Min. 10% of every subscription to your chosen charity",
                "Stableford score tracking — your last 5 rounds, always live",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7eda5a]/20 border border-[#7eda5a]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#7eda5a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Par & Give · digitalheroes.co.in
          </p>
        </div>
      </div>
    </div>
  );
}
