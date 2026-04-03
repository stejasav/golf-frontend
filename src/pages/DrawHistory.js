import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllDraws, getLatestDraw } from "../services/api";

export default function DrawHistory({ setToken, user }) {
  const [draws, setDraws] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getJackpot = (draw) => {
    const topTier = draw.winners?.find((w) => w.matchCount === 5);
    return topTier ? topTier.prize.toLocaleString() : "0";
  };

  useEffect(() => {
    Promise.all([getAllDraws(), getLatestDraw()])
      .then(([all, latestDraw]) => {
        setLatest(latestDraw);
        if (Array.isArray(all)) {
          setDraws(all.filter((d) => d._id !== latestDraw?._id));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <Navbar setToken={setToken} user={user} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#8a9e8d] hover:text-[#1a5c2e] text-xs font-bold uppercase tracking-widest mb-6 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Results
        </button>

        <header className="mb-10">
          <h1 className="text-[#0a2212] text-3xl font-black tracking-tight">
            Archive & History
          </h1>
          <p className="text-[#6b7b6e] text-sm mt-1">
            Explore all past winning combinations and prize distributions.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-[#1a5c2e]/10 border-t-[#1a5c2e] animate-spin" />
            <p className="text-[#8a9e8d] text-xs font-bold uppercase tracking-widest">
              Loading Archive
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {latest && (
              <section>
                <p className="text-[#1a5c2e] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Most Recent
                </p>
                <div className="bg-[#1a5c2e] rounded-[2rem] p-8 shadow-xl shadow-[#1a5c2e]/20 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-white text-2xl font-bold mb-1">
                        {latest.month}
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <p className="text-[#7eda5a] text-xs font-medium">
                          {latest.winners?.length || 0} Total Winners
                        </p>
                        <p className="text-white/40 text-xs font-medium">
                          Pool: ₹{latest.totalPool?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {latest.numbers.map((n, i) => (
                        <div
                          key={`${n}-${i}`}
                          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-mono font-bold text-lg"
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <p className="text-[#1a5c2e] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Previous Draws
              </p>
              <div className="grid gap-4">
                {draws.length > 0 ? (
                  draws.map((draw) => (
                    <div
                      key={draw._id}
                      className="bg-white p-6 rounded-2xl border border-[#e2eee4] shadow-sm hover:shadow-md hover:border-[#1a5c2e]/20 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#f0faf2] border border-[#c8eecb] flex items-center justify-center text-[#1a5c2e] font-bold text-sm">
                            {draw.month?.slice(0, 3).toUpperCase() || "DRW"}
                          </div>
                          <div>
                            <h3 className="text-[#0a2212] font-bold text-base">
                              {draw.month}
                            </h3>
                            <p className="text-[#8a9e8d] text-[11px] font-medium uppercase tracking-tighter">
                              {draw.winners?.length || 0} Verified Winners
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {draw.numbers.map((n, i) => (
                            <div
                              key={`${n}-${i}`}
                              className="w-9 h-9 rounded-full bg-[#f8faf5] border border-[#e2eee4] flex items-center justify-center text-[#1a5c2e] font-mono font-bold text-xs group-hover:border-[#7eda5a] transition-colors"
                            >
                              {n}
                            </div>
                          ))}
                        </div>
                        <div className="text-right sm:border-l border-[#e2eee4] sm:pl-6 min-w-[120px]">
                          <p className="text-[#0a2212] text-[10px] font-bold uppercase tracking-widest opacity-70">
                            Jackpot
                          </p>
                          <p className="text-[#1a5c2e] font-black text-sm">
                            ₹{getJackpot(draw)}
                          </p>
                          <p className="text-[#8a9e8d] text-[9px] font-medium mt-0.5">
                            Pool: ₹{draw.totalPool?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#d4e4d6]">
                    <div className="w-12 h-12 bg-[#f8faf5] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8a9e8d"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </div>
                    <p className="text-[#8a9e8d] text-sm font-medium">
                      No historical draws recorded yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        <footer className="mt-16 text-center">
          <p className="text-[#b8ccba] text-[10px] font-bold uppercase tracking-[0.4em]">
            Immutable Draw Records · Par & Give
          </p>
        </footer>
      </div>
    </div>
  );
}
