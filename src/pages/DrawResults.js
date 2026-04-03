import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getLatestDraw } from "../services/api";

export default function DrawResults({ setToken, user }) {
  const [drawData, setDrawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getLatestDraw()
      .then(setDrawData)
      .finally(() => setLoading(false));
  }, []);

  const prizeBreakdown = drawData?.winners
    ? [5, 4, 3].map((match) => {
        const tier = drawData.winners.filter((w) => w.matchCount === match);
        return {
          match: `${match}-Number Match`,
          winners: tier.length,
          prize: tier.length
            ? `₹${tier[0].prize.toLocaleString()}${match < 5 ? " each" : ""}`
            : "₹0",
          status: tier.length ? "paid" : "rollover",
        };
      })
    : [];

  if (loading || !drawData) {
    return (
      <div className="min-h-screen bg-[#f8faf5] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#1a5c2e]/10 border-t-[#1a5c2e] animate-spin" />
        <p className="text-[#8a9e8d] text-xs font-bold uppercase tracking-widest">
          Verifying Results
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf5] relative">
      <Navbar setToken={setToken} user={user} />

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#f0faf2] border border-[#c8eecb] text-[#1a5c2e] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7eda5a] animate-pulse" />
            Official Monthly Draw
          </span>
          <h1 className="text-[#0a2212] text-4xl font-bold tracking-tight mt-5 mb-2">
            {drawData.month} Results
          </h1>
          <p className="text-[#8a9e8d] text-sm font-medium">
            Verified by the Par & Give Draw Engine · Published{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="bg-[#1a5c2e] rounded-[2rem] p-8 sm:p-10 mb-6 shadow-2xl shadow-[#1a5c2e]/20 relative overflow-hidden group">
          <div
            className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10">
            <p className="text-[#7eda5a] text-[10px] uppercase tracking-[0.25em] font-black text-center mb-8">
              Winning Combination
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
              {drawData.numbers.map((n, i) => (
                <div
                  key={`${n}-${i}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-mono font-bold text-xl sm:text-3xl text-white hover:bg-[#7eda5a] hover:border-[#7eda5a] hover:text-[#0a2212] transition-all duration-500 cursor-default shadow-inner">
                    {n}
                  </div>
                  <span className="text-white/20 text-[9px] font-black uppercase">
                    Ball {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e2eee4] rounded-[1.5rem] overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-5 border-b border-[#e2eee4] bg-[#f8faf5]/50">
            <h2 className="text-[#0a2212] font-bold text-base">
              Prize Breakdown
            </h2>
            <p className="text-[#8a9e8d] text-xs mt-0.5 font-medium">
              Total pool: ₹{drawData.totalPool?.toLocaleString() || "0"} across
              all tiers
            </p>
          </div>
          <div className="divide-y divide-[#e2eee4]">
            {prizeBreakdown.map((row) => (
              <div
                key={row.match}
                className="flex items-center justify-between px-6 py-5 hover:bg-[#fcfdfb] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7eda5a]" />
                  <div>
                    <p className="text-[#0a2212] text-sm font-bold group-hover:text-[#1a5c2e] transition-colors">
                      {row.match}
                    </p>
                    <p className="text-[#8a9e8d] text-[11px] font-medium uppercase tracking-tighter">
                      {row.winners === 0
                        ? "No winners"
                        : `${row.winners} verified winner${row.winners > 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#0a2212] text-sm font-black">
                    {row.prize}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${row.status === "paid" ? "text-[#1a5c2e]" : "text-[#c8962a]"}`}
                  >
                    {row.status === "rollover" ? "↑ Rollover" : row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e2eee4] rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between flex-wrap gap-4 border-l-4 border-l-[#7eda5a]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0faf2] border border-[#c8eecb] flex items-center justify-center text-[#1a5c2e]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div>
              <p className="text-[#8a9e8d] text-[10px] uppercase tracking-widest font-black">
                Next Draw Date
              </p>
              <p className="text-[#0a2212] font-bold text-sm">30 April 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#f0faf2] px-3 py-1.5 rounded-lg border border-[#c8eecb]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7eda5a] animate-pulse" />
            <span className="text-[#1a5c2e] text-[10px] font-black uppercase tracking-tight">
              Entries Open
            </span>
          </div>
        </div>

        <p className="text-center text-[#b8ccba] text-[10px] font-bold uppercase tracking-[0.3em] mt-12 opacity-60">
          Transparency Report · Par & Give © 2026
        </p>
      </div>

      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end group">
        <span className="mb-2 px-3 py-1.5 bg-[#0a2212] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
          View Past Draws
        </span>
        <button
          onClick={() => navigate("/draw-history")}
          className="w-14 h-14 bg-[#1a5c2e] text-[#7eda5a] rounded-full shadow-2xl shadow-[#1a5c2e]/40 flex items-center justify-center hover:bg-[#0d3319] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-[#7eda5a]/20"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8v4l3 3" />
            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
