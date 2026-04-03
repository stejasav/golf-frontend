import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields to continue.");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      if (res.token) {
        setToken(res.token);
        navigate("/dashboard");
      } else {
        setError(res.msg || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=90&w=1400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2212]/95 via-[#0d3319]/85 to-[#1a5c2e]/60" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c8f5a0]/20 border border-[#c8f5a0]/30 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#c8f5a0" />
                <path
                  d="M12 2v4M12 18v4M2 12h4M18 12h4"
                  stroke="#c8f5a0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-white font-semibold tracking-wide text-sm">
              Par & Give
            </span>
          </div>
          <div>
            <div className="w-10 h-[2px] bg-[#7eda5a] mb-8" />
            <h2 className="text-[3.2rem] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Every stroke.
              <br />
              <span className="text-[#7eda5a]">Every life</span>
              <br />
              it changes.
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-xs font-light">
              The platform where your handicap funds real charity. Monthly
              draws. Real prizes. Genuine impact.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <div>
                <p className="text-[#7eda5a] text-2xl font-bold">₹48K+</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
                  Donated
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-[#7eda5a] text-2xl font-bold">3,140</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
                  Members
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-[#7eda5a] text-2xl font-bold">24</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
                  Charities
                </p>
              </div>
            </div>
          </div>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Secure · Stripe Powered · HTTPS
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[48%] flex items-center justify-center bg-[#f8faf5] px-8 py-12">
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-2 mb-12 lg:hidden">
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
              Welcome back
            </h1>
            <p className="text-[#6b7b6e] text-sm">
              Sign in to your player dashboard
            </p>
          </div>

          <div className="space-y-5">
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
                className="w-full bg-white border border-[#d4e4d6] rounded-xl px-4 py-3.5 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#8a9e8d] font-semibold">
                  Password
                </label>
                <button className="text-[11px] text-[#2d7a3a] hover:text-[#1a5c2e] font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-white border border-[#d4e4d6] rounded-xl px-4 py-3.5 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
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
              onClick={handleLogin}
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
                  Authenticating...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#e2eee4]" />
              <span className="text-[11px] text-[#a8bfab] uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-[#e2eee4]" />
            </div>

            <p className="text-center text-[#6b7b6e] text-sm">
              New to Par & Give?{" "}
              <Link
                to="/signup"
                className="text-[#2d7a3a] font-semibold hover:text-[#1a5c2e] underline underline-offset-4 transition-colors"
              >
                Create your membership
              </Link>
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-[#e2eee4]">
            <p className="text-center text-[10px] text-[#b8ccba] uppercase tracking-widest">
              Secured by SSL · Powered by Stripe · Par &amp; Give © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
