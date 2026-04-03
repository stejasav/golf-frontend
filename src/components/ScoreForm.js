import { useState } from "react";
import { addScore } from "../services/api";

export default function ScoreForm({ token, refresh }) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    const num = Number(value.trim());
    if (!value.trim() || isNaN(num) || num < 1 || num > 45) {
      setError("Score must be between 1 and 45.");
      return;
    }
    try {
      setLoading(true);
      const response = await addScore(token, { value: num, date });
      if (response && (response.msg === "Score added" || response._id)) {
        setValue("");
        setDate(new Date().toISOString().split("T")[0]);
        setSuccess(true);
        if (refresh) refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response?.msg || "Failed to submit score.");
      }
    } catch {
      setError("Server connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreNum = Number(value);
  const scoreQuality =
    !value || isNaN(scoreNum)
      ? null
      : scoreNum >= 36
        ? {
            label: "Excellent",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
          }
        : scoreNum >= 28
          ? {
              label: "Good",
              color: "text-green-700",
              bg: "bg-green-50",
              border: "border-green-200",
            }
          : scoreNum >= 20
            ? {
                label: "Average",
                color: "text-amber-700",
                bg: "bg-amber-50",
                border: "border-amber-200",
              }
            : {
                label: "Below Par",
                color: "text-orange-700",
                bg: "bg-orange-50",
                border: "border-orange-200",
              };

  return (
    <div
      className={`bg-white border transition-all duration-500 rounded-2xl overflow-hidden ${
        success
          ? "border-emerald-500 shadow-lg shadow-emerald-50"
          : "border-slate-200 shadow-sm"
      }`}
    >
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-emerald-950 font-bold text-base tracking-tight">
          Log a Round
        </h3>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Stableford format · Range 1–45
        </p>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-2">
            Stableford Score
          </label>
          <input
            type="number"
            min="1"
            max="45"
            disabled={loading}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="00"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-emerald-950 text-3xl font-bold text-center focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all placeholder:text-slate-300 disabled:opacity-50"
          />
          {scoreQuality && (
            <div
              className={`mt-3 mx-auto w-fit px-4 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${scoreQuality.color} ${scoreQuality.bg} ${scoreQuality.border}`}
            >
              {scoreQuality.label}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-2">
            Date Played
          </label>
          <input
            type="date"
            disabled={loading}
            value={date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-emerald-950 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
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
            <p className="text-red-700 text-xs font-bold leading-tight">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-emerald-700 shrink-0"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-emerald-800 text-xs font-bold">
              Round successfully logged!
            </p>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full bg-emerald-900 hover:bg-emerald-950 text-emerald-50 font-bold py-4 rounded-xl transition-all duration-300 shadow-md shadow-emerald-900/10 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-40 text-sm tracking-widest uppercase"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin w-4 h-4 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="45"
                  strokeDashoffset="15"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Archive Round"
          )}
        </button>

        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
          Verification Required for Payout Eligibility
        </p>
      </div>
    </div>
  );
}
