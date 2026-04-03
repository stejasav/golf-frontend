import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCharities, selectCharity } from "../services/api";

const CATEGORY_COLORS = {
  Environment: { bg: "#f0faf2", border: "#c8eecb", text: "#1a5c2e" },
  Health: { bg: "#fef3c7", border: "#fde68a", text: "#92400e" },
  Education: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
  Community: { bg: "#fdf4ff", border: "#e9d5ff", text: "#6b21a8" },
  Youth: { bg: "#fff7ed", border: "#fed7aa", text: "#9a3412" },
};

function CharityCard({ charity, onSelect }) {
  const category = charity.category || "Community";
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Community;

  return (
    <div className="bg-white border border-[#e2eee4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#a8d8ae] transition-all duration-200 group flex flex-col">
      <div className="h-36 bg-[#1a5c2e] relative overflow-hidden flex items-end p-5">
        {charity.imageUrl ? (
          <img
            src={charity.imageUrl}
            alt={charity.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}
        <span
          className="relative z-10 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
          style={{
            background: colors.bg,
            color: colors.text,
            borderColor: colors.border,
          }}
        >
          {category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-[#0a2212] font-bold text-base mb-2 leading-snug">
          {charity.name}
        </h2>
        <p className="text-[#6b7b6e] text-sm leading-relaxed line-clamp-3 flex-1">
          {charity.description ||
            "Dedicated to providing sustainable solutions and immediate relief to communities in need worldwide."}
        </p>

        {(charity.raised || charity.members) && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#e2eee4]">
            {charity.raised && (
              <div>
                <p className="text-[#1a5c2e] font-bold text-sm">
                  ₹{Number(charity.raised).toLocaleString()}
                </p>
                <p className="text-[#8a9e8d] text-[10px] uppercase tracking-wider">
                  Raised
                </p>
              </div>
            )}
            {charity.raised && charity.members && (
              <div className="w-px h-6 bg-[#e2eee4]" />
            )}
            {charity.members && (
              <div>
                <p className="text-[#1a5c2e] font-bold text-sm">
                  {charity.members}
                </p>
                <p className="text-[#8a9e8d] text-[10px] uppercase tracking-wider">
                  Supporters
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onSelect(charity)}
          className="mt-5 w-full bg-[#f0faf2] hover:bg-[#1a5c2e] text-[#1a5c2e] hover:text-white border border-[#c8eecb] hover:border-[#1a5c2e] font-semibold py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.99]"
        >
          Support this Cause
        </button>
      </div>
    </div>
  );
}

export default function Charities({ token, setToken, user }) {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCharities()
      .then((data) => setCharities(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = async () => {
    try {
      await selectCharity(token, { charityId: selected._id, percentage: 10 });
      setSelected(null);
      navigate("/dashboard");
    } catch {
      alert("Failed to select charity. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <Navbar setToken={setToken} user={user} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-[#1a5c2e] text-[10px] font-bold uppercase tracking-[0.2em]">
              Philanthropy
            </span>
            <h1 className="text-[#0a2212] text-3xl font-bold tracking-tight mt-2">
              Choose Your Impact
            </h1>
            <p className="text-[#6b7b6e] text-sm mt-2 max-w-md leading-relaxed">
              A portion of your membership goes directly to the cause you care
              most about — every single month.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8bfab]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search charities…"
              className="w-full bg-white border border-[#d4e4d6] rounded-xl pl-9 pr-4 py-3 text-[#0a2212] text-sm placeholder:text-[#c2d4c4] focus:outline-none focus:border-[#2d7a3a] focus:ring-4 focus:ring-[#2d7a3a]/10 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#1a5c2e] border-t-transparent animate-spin" />
            <p className="text-[#8a9e8d] text-sm">Loading charities…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-14 h-14 rounded-2xl bg-[#f0faf2] flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7eda5a"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p className="text-[#0a2212] font-semibold text-sm">
              No charities found
            </p>
            <p className="text-[#8a9e8d] text-xs mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#8a9e8d] text-xs mb-6">
              Showing {filtered.length} partner
              {filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c) => (
                <CharityCard key={c._id} charity={c} onSelect={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-[#0a2212]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0a2212] font-bold text-lg mb-1">
              {selected.name}
            </h3>
            <p className="text-[#6b7b6e] text-sm mb-6 leading-relaxed">
              Set this as your active charity? A minimum of 10% of your
              subscription will be donated each month.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 border border-[#e2eee4] text-[#6b7b6e] font-semibold py-3 rounded-xl text-sm hover:bg-[#f8faf5] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-[#1a5c2e] hover:bg-[#0d3319] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#1a5c2e]/15"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
