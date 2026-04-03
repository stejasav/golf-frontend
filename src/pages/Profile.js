import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDashboard } from "../services/api";

export default function Profile({ token, setToken }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) return;
    getDashboard(token).then(setData);
  }, [token]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f8faf5] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#1a5c2e] border-t-transparent animate-spin" />
        <p className="text-[#6b7b6e] text-sm font-medium">
          Loading your profile…
        </p>
      </div>
    );
  }

  const { user, scores = [], winnings = [], charity, charityPercentage } = data;
  const totalWon = winnings.reduce((sum, w) => sum + (w.prize || 0), 0);
  const isPro = user.subscriptionStatus === "active";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PG";

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b.value, 0) / scores.length)
    : null;

  const bestScore = scores.length
    ? Math.max(...scores.map((s) => s.value))
    : null;

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <Navbar user={user} setToken={setToken} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <div className="relative overflow-hidden bg-[#1a5c2e] rounded-2xl p-8 shadow-lg shadow-[#1a5c2e]/20">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#7eda5a]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#7eda5a]/20 border-2 border-[#7eda5a]/30 flex items-center justify-center shrink-0">
              <span className="text-[#7eda5a] text-3xl font-bold">
                {initials}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-2xl font-bold tracking-tight leading-tight">
                {user.name}
              </h1>
              <p className="text-white/50 text-sm mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    isPro
                      ? "bg-[#7eda5a]/15 border-[#7eda5a]/30 text-[#7eda5a]"
                      : "bg-[#fef3c7]/15 border-[#f59e0b]/30 text-[#fbbf24]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isPro ? "bg-[#7eda5a]" : "bg-[#fbbf24]"}`}
                  />
                  {isPro ? "Pro Member" : "Free Plan"}
                </span>
                <span className="text-white/20 text-[10px] uppercase tracking-widest">
                  Member since{" "}
                  {new Date(user.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Rounds Played", value: scores.length },
            { label: "Avg. Score", value: avgScore ?? "—" },
            { label: "Best Score", value: bestScore ?? "—" },
            { label: "Total Won", value: `₹${totalWon.toLocaleString()}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e2eee4] rounded-2xl p-5 shadow-sm"
            >
              <p className="text-[#8a9e8d] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
                {stat.label}
              </p>
              <p className="text-[#0a2212] text-2xl font-bold leading-none">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white border border-[#e2eee4] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[#e2eee4] bg-[#f8faf5]">
              <h2 className="text-[#0a2212] font-bold text-sm">
                Account Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  ),
                  label: "Full Name",
                  value: user.name,
                },
                {
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: "Email Address",
                  value: user.email,
                },
                {
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  ),
                  label: "Plan",
                  value: isPro ? "Pro Member" : "Free Plan",
                  badge: !isPro ? (
                    <Link
                      to="/subscription"
                      className="text-[9px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2 py-0.5 rounded-full hover:bg-[#fde68a] transition-colors"
                    >
                      Upgrade
                    </Link>
                  ) : null,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f0faf2] text-[#1a5c2e] flex items-center justify-center shrink-0">
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#8a9e8d] text-[10px] uppercase tracking-wider font-semibold">
                      {row.label}
                    </p>
                    <p className="text-[#0a2212] text-sm font-semibold mt-0.5 truncate">
                      {row.value}
                    </p>
                  </div>
                  {row.badge && <div className="shrink-0">{row.badge}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e2eee4] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[#e2eee4] bg-[#f8faf5]">
              <h2 className="text-[#0a2212] font-bold text-sm">
                Charity Contribution
              </h2>
            </div>
            <div className="p-6">
              {charity ? (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#f0faf2] border border-[#c8eecb] flex items-center justify-center shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1a5c2e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#0a2212] font-bold text-sm">
                        {charity.name}
                      </p>
                      <p className="text-[#8a9e8d] text-xs mt-0.5">
                        Active charity partner
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#8a9e8d] text-xs font-medium">
                        Monthly contribution
                      </span>
                      <span className="text-[#1a5c2e] text-sm font-bold">
                        {charityPercentage || 10}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#e8f4e8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1a5c2e] rounded-full"
                        style={{
                          width: `${Math.min(charityPercentage || 10, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-[#a8bfab] text-[10px] mt-1.5">
                      Minimum 10% · Adjustable anytime
                    </p>
                  </div>
                  <Link
                    to="/charities"
                    className="block w-full text-center text-[#2d7a3a] border border-[#c8eecb] bg-[#f0faf2] hover:bg-[#e4f5e6] rounded-xl py-2.5 text-xs font-semibold transition-all"
                  >
                    Change Charity
                  </Link>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0faf2] flex items-center justify-center mx-auto mb-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7eda5a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <p className="text-[#0a2212] font-semibold text-sm">
                    No charity selected
                  </p>
                  <p className="text-[#8a9e8d] text-xs mt-1 mb-4">
                    Choose a cause to support each month
                  </p>
                  <Link
                    to="/charities"
                    className="inline-block bg-[#1a5c2e] hover:bg-[#0d3319] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#1a5c2e]/15"
                  >
                    Browse Charities →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e2eee4] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#e2eee4] bg-[#f8faf5] flex items-center justify-between">
            <div>
              <h2 className="text-[#0a2212] font-bold text-sm">
                Recent Scores
              </h2>
              <p className="text-[#8a9e8d] text-xs mt-0.5">
                Stableford · Last 5 rounds
              </p>
            </div>
            {scores.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-[#e2eee4] rounded-xl px-3 py-1.5">
                <span className="text-[#1a5c2e] text-xs font-bold">
                  {scores.length}/5
                </span>
                <span className="text-[#8a9e8d] text-xs">logged</span>
              </div>
            )}
          </div>
          <div className="p-6">
            {scores.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[#0a2212] font-semibold text-sm">
                  No rounds logged yet
                </p>
                <p className="text-[#8a9e8d] text-xs mt-1">
                  Head to the dashboard to log your first score
                </p>
              </div>
            ) : (
              <div className="flex items-end gap-3 flex-wrap">
                {scores.map((s, i) => {
                  const pct = Math.round((s.value / 45) * 100);
                  const isLatest = i === 0;
                  return (
                    <div
                      key={s._id}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span className="text-[#8a9e8d] text-[10px] font-medium">
                        {new Date(s.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <div
                        className="w-10 bg-[#e8f4e8] rounded-lg overflow-hidden"
                        style={{ height: "80px" }}
                      >
                        <div
                          className={`w-full rounded-lg transition-all duration-700 ${isLatest ? "bg-[#1a5c2e]" : "bg-[#7eda5a]"}`}
                          style={{
                            height: `${pct}%`,
                            marginTop: `${100 - pct}%`,
                          }}
                        />
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                          isLatest
                            ? "bg-[#1a5c2e] text-[#7eda5a]"
                            : "bg-[#f0faf2] text-[#0a2212]"
                        }`}
                      >
                        {s.value}
                      </div>
                      {isLatest && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#7eda5a]">
                          Latest
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e2eee4] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#e2eee4] bg-[#f8faf5] flex items-center justify-between">
            <div>
              <h2 className="text-[#0a2212] font-bold text-sm">
                Draw Winnings
              </h2>
              <p className="text-[#8a9e8d] text-xs mt-0.5">
                Your prize history
              </p>
            </div>
            {winnings.length > 0 && (
              <div className="text-right">
                <p className="text-[#1a5c2e] font-bold text-base">
                  ₹{totalWon.toLocaleString()}
                </p>
                <p className="text-[#8a9e8d] text-[10px] uppercase tracking-wider">
                  Total won
                </p>
              </div>
            )}
          </div>
          <div className="p-6">
            {winnings.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[#0a2212] font-semibold text-sm">
                  No winnings yet
                </p>
                <p className="text-[#8a9e8d] text-xs mt-1">
                  Keep entering draws — your win is coming
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {winnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#e2eee4] bg-[#f8faf5] hover:bg-[#f0faf2] hover:border-[#a8d8a8] transition-all"
                  >
                    <div>
                      <p className="text-[#8a9e8d] text-[10px] uppercase tracking-widest font-bold">
                        {w.month}
                      </p>
                      <p className="text-[#0a2212] text-sm font-semibold mt-0.5">
                        {w.matchCount}-Number Match
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#1a5c2e] font-bold text-base">
                        ₹{w.prize}
                      </p>
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${w.status === "paid" ? "text-[#7eda5a]" : "text-[#c8962a]"}`}
                      >
                        {w.status || "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
