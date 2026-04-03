import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScoreForm from "../components/ScoreForm";
import { getDashboard, getLatestDraw } from "../services/api";

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-md ${
        accent
          ? "bg-[#1a5c2e] border-[#1a5c2e] shadow-lg shadow-[#1a5c2e]/20"
          : "bg-white border-[#e2eee4] shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className={`text-[10px] uppercase tracking-[0.2em] font-black ${accent ? "text-[#7eda5a]" : "text-[#8a9e8d]"}`}
        >
          {label}
        </p>
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-white/10" : "bg-[#f0faf2]"}`}
          >
            {icon}
          </div>
        )}
      </div>
      <p
        className={`text-3xl font-bold leading-none mb-1 tracking-tight ${accent ? "text-white" : "text-[#0a2212]"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-[11px] mt-2 font-medium ${accent ? "text-white/60" : "text-[#8a9e8d]"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function ScoreBar({ score, index }) {
  const pct = Math.min(Math.round((score.value / 45) * 100), 100);
  const isTop = index === 0;

  return (
    <div className="flex items-center gap-4 group py-1">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-mono shrink-0 transition-all duration-500 ${
          isTop
            ? "bg-[#1a5c2e] text-[#7eda5a] shadow-md shadow-[#1a5c2e]/20"
            : "bg-[#f0faf2] text-[#0a2212] group-hover:bg-[#e4f5e6]"
        }`}
      >
        {score.value}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[#6b7b6e] text-xs font-semibold">
            {new Date(score.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {isTop && (
            <span className="text-[9px] uppercase tracking-widest font-black text-[#1a5c2e] bg-[#7eda5a]/20 px-2 py-0.5 rounded-md border border-[#7eda5a]/30">
              Latest Round
            </span>
          )}
        </div>
        <div className="h-2 bg-[#e8f4e8] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? "bg-[#1a5c2e]" : "bg-[#7eda5a]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ token, setToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestDraw, setLatestDraw] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const storedToken = token || localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
        return;
      }
      const [dashboardRes, latestDrawRes] = await Promise.all([
        getDashboard(storedToken),
        getLatestDraw(),
      ]);
      setData(dashboardRes);
      setLatestDraw(latestDrawRes);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#f8faf5] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#1a5c2e]/10 border-t-[#1a5c2e] animate-spin" />
        <p className="text-[#8a9e8d] text-xs font-bold uppercase tracking-widest animate-pulse">
          Syncing Dashboard...
        </p>
      </div>
    );
  }

  const avgScore =
    data.scores?.length > 0
      ? Math.round(
          data.scores.reduce((a, b) => a + b.value, 0) / data.scores.length,
        )
      : 0;

  const calculatePrizePortion = (percentage) => {
    if (!latestDraw?.totalPool) return "0";
    return Math.floor(
      latestDraw.totalPool * (percentage / 100),
    ).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <Navbar setToken={setToken} user={data.user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#7eda5a]" />
              <p className="text-[#8a9e8d] text-[10px] uppercase font-black tracking-[0.2em]">
                Live Dashboard
              </p>
            </div>
            <h1 className="text-[#0a2212] text-4xl font-black tracking-tight">
              Hello,{" "}
              <span className="text-[#1a5c2e]">
                {data.user?.name?.split(" ")[0] || "Golfer"}
              </span>
            </h1>
            <p className="text-[#6b7b6e] text-sm mt-1 font-medium">
              You've contributed{" "}
              <span className="text-[#1a5c2e] font-bold">
                ₹{((data.scores?.length || 0) * 50).toLocaleString()}
              </span>{" "}
              to charity through your play.
            </p>
          </div>

          <div
            onClick={() => navigate("/draw-results")}
            className="cursor-pointer group flex items-center gap-4 bg-white border border-[#e2eee4] rounded-2xl p-1 pr-5 shadow-sm hover:border-[#1a5c2e] transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#f0faf2] flex items-center justify-center text-[#1a5c2e] font-bold">
              {latestDraw?.month?.slice(0, 3) || "MAR"}
            </div>
            <div>
              <p className="text-[#0a2212] text-sm font-bold group-hover:text-[#1a5c2e]">
                Current Draw
              </p>
              <p className="text-[#8a9e8d] text-[10px] uppercase font-black tracking-tighter">
                View Live Results →
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            label="Total Winnings"
            value={`₹${(data.totalWon || 0).toLocaleString()}`}
            sub="Paid into your wallet"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            }
          />
          <StatCard
            accent
            label="Active Charity"
            value={data.charity?.name || "--"}
            sub={
              data.charity
                ? `${data.charityPercentage || 10}% impact allocation`
                : "Select a charity to start contributing"
            }
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            }
          />
          <StatCard
            label="Total Rounds"
            value={data.scores?.length || 0}
            sub="Lifetime play"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            }
          />
          <StatCard
            label="Average Score"
            value={avgScore}
            sub="Stableford points"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-[#e2eee4] rounded-[2rem] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[#e2eee4] flex justify-between items-center">
                <div>
                  <h2 className="text-[#0a2212] font-bold text-lg">
                    Performance History
                  </h2>
                  <p className="text-[#8a9e8d] text-xs font-medium">
                    Stableford tracking · Last 5 rounds
                  </p>
                </div>
              </div>
              <div className="p-8">
                {!data.scores || data.scores.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[#8a9e8d] text-sm italic">
                      No rounds logged yet. Start playing!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {data.scores.slice(0, 5).map((s, i) => (
                      <ScoreBar key={s._id || i} score={s} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#e2eee4] rounded-[2rem] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[#e2eee4] flex justify-between items-center">
                <div>
                  <h2 className="text-[#0a2212] font-bold text-lg">
                    My Winnings
                  </h2>
                  <p className="text-[#8a9e8d] text-xs font-medium">
                    Direct payouts from past draws
                  </p>
                </div>
                <button
                  onClick={() => navigate("/draw-history")}
                  className="text-[#1a5c2e] text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Full History
                </button>
              </div>
              <div className="p-8">
                {!data.winnings || data.winnings.length === 0 ? (
                  <div className="py-8 text-center bg-[#f8faf5] rounded-2xl border border-dashed border-[#c8eecb]">
                    <p className="text-[#8a9e8d] text-xs font-bold uppercase tracking-widest">
                      No winnings yet
                    </p>
                    <p className="text-[#6b7b6e] text-[11px] mt-1">
                      Winning draws will be listed here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.winnings.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-5 rounded-2xl border border-[#e2eee4] bg-[#fcfdfb] hover:border-[#1a5c2e] transition-all"
                      >
                        <div>
                          <p className="text-[#1a5c2e] text-[9px] font-black uppercase tracking-widest">
                            {w.month}
                          </p>
                          <p className="text-[#0a2212] text-sm font-bold mt-1">
                            {w.matchCount}-Ball Match
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1a5c2e] font-black text-xl">
                            ₹{w.prize.toLocaleString()}
                          </p>
                          <span className="text-[9px] font-black uppercase text-[#7eda5a] bg-[#7eda5a]/10 px-2 py-0.5 rounded">
                            Success
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {data.user.subscriptionStatus !== "active" && (
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2212] to-[#1a5c2e] rounded-3xl p-8 shadow-xl shadow-[#1a5c2e]/20 text-center">
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7eda5a]/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-white font-bold text-xl tracking-tight">
                    Ready for Pro Status?
                  </h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-md mx-auto">
                    Unlock your eligibility for the{" "}
                    <span className="text-[#7eda5a] font-bold">
                      ₹{latestDraw?.totalPool?.toLocaleString()}
                    </span>{" "}
                    prize pool and maximize the impact of your scores.
                  </p>
                  <div className="mt-8 w-full sm:w-auto">
                    <button
                      onClick={() => navigate("/subscription")}
                      className="group relative flex items-center justify-center gap-3 bg-[#7eda5a] hover:bg-[#8efb6a] text-[#0a2212] font-black px-10 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#7eda5a]/20 hover:shadow-[#7eda5a]/40 active:scale-[0.95]"
                    >
                      Upgrade to Pro
                      <svg
                        className="group-hover:translate-x-1 transition-transform"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
                      Instant Activation • Secure Payouts
                    </p>
                  </div>
                </div>
              </div>
            )}

            <ScoreForm token={token} refresh={fetchData} user={data.user} />

            <div className="bg-[#1a5c2e] rounded-[2rem] p-8 shadow-2xl shadow-[#1a5c2e]/30 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10">
                <p className="text-[#7eda5a] text-[10px] font-black uppercase tracking-[0.25em] mb-2">
                  Live Prize Pool
                </p>
                <p className="text-white text-4xl font-black mb-1 leading-none tracking-tight">
                  ₹{latestDraw?.totalPool?.toLocaleString() || "0"}
                </p>
                <p className="text-white/50 text-[11px] mb-8 font-medium italic">
                  {latestDraw?.month || "Current"} Draw Allocation
                </p>
                <div className="space-y-4">
                  {[
                    { label: "5-Number Jackpot", pct: 40 },
                    { label: "4-Number Match", pct: 35 },
                    { label: "3-Number Match", pct: 25 },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7eda5a]" />
                        <span className="text-white/80 text-xs font-bold">
                          {tier.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-black">
                          ₹{calculatePrizePortion(tier.pct)}
                        </p>
                        <p className="text-[#7eda5a] text-[9px] font-black uppercase tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                          {tier.pct}% Tier
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                      Draw Closes
                    </p>
                    <p className="text-[#7eda5a] font-bold text-xs">
                      April 30, 2026
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-black uppercase border border-white/10">
                    Live
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2eee4] rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f0faf2] border border-[#c8eecb] flex items-center justify-center text-[#1a5c2e]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#0a2212] font-black text-base">
                    {data.charity?.name || "No Charity Selected"}
                  </p>
                  <p className="text-[#8a9e8d] text-[10px] font-black uppercase tracking-widest">
                    {data.charity ? "Active Partner" : "Action Required"}
                  </p>
                </div>
              </div>
              {data.charity ? (
                <>
                  <p className="text-[#6b7b6e] text-xs leading-relaxed mb-6 font-medium">
                    You are contributing{" "}
                    <span className="text-[#1a5c2e] font-bold">
                      {data.charityPercentage || 10}%
                    </span>{" "}
                    of your play towards this cause.
                  </p>
                  <button
                    onClick={() => navigate("/charities")}
                    className="w-full bg-[#f0faf2] text-[#1a5c2e] py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] border border-[#c8eecb] hover:bg-[#1a5c2e] hover:text-white transition-all duration-300 shadow-sm"
                  >
                    Change Charity →
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#c0392b] text-xs mb-6 font-semibold">
                    You haven't selected a charity yet. Choose one to start
                    making an impact.
                  </p>
                  <button
                    onClick={() => navigate("/charities")}
                    className="w-full bg-[#1a5c2e] text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:bg-[#0d3319] transition-all duration-300 shadow-sm"
                  >
                    Select Charity →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-[#e2eee4] mt-10">
        <p className="text-center text-[#b8ccba] text-[10px] font-black uppercase tracking-[0.4em]">
          Verified Results Engine · Par & Give © 2026
        </p>
      </footer>
    </div>
  );
}
