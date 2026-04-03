import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ setToken, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // Desktop Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Sidebar
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false); // Sidebar Profile Toggle
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Draw Results", path: "/draw-results" },
    { label: "Charities", path: "/charities" },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset mobile states on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileProfileOpen(false);
  }, [location.pathname]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "PG";

  const isPro = user?.subscriptionStatus === "active";

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-white border-b border-[#e2eee4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#1a5c2e]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#1a5c2e] flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="#7eda5a" />
                  <path
                    d="M12 2v4M12 18v4M2 12h4M18 12h4"
                    stroke="#7eda5a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[#0a2212] font-black tracking-tight text-lg">
                Par & Give
              </span>
            </Link>
          </div>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  location.pathname === link.path
                    ? "text-[#1a5c2e]"
                    : "text-[#6b7b6e] hover:text-[#1a5c2e]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* --- DESKTOP PROFILE DROPDOWN --- */}
          <div
            className="relative hidden md:flex items-center"
            ref={dropdownRef}
          >
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#f8faf5] border border-transparent hover:border-[#e2eee4] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a5c2e] flex items-center justify-center shrink-0">
                <span className="text-[#7eda5a] text-[10px] font-black uppercase">
                  {initials}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[#0a2212] text-xs font-black leading-none">
                  {user?.name || "Member"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`w-1 h-1 rounded-full ${isPro ? "bg-[#7eda5a]" : "bg-amber-500"}`}
                  />
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest ${isPro ? "text-[#1a5c2e]" : "text-amber-700"}`}
                  >
                    {isPro ? "Pro" : "Free"}
                  </span>
                </div>
              </div>
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-[#e2eee4] rounded-2xl shadow-xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-4 border-b border-[#e2eee4] bg-[#f8faf5]">
                  <p className="text-[#0a2212] text-sm font-black">
                    {user?.name}
                  </p>
                  <p className="text-[#8a9e8d] text-[10px] font-bold uppercase truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <DropdownLink
                    to="/profile"
                    icon={<UserIcon />}
                    label="Profile"
                  />
                  <DropdownLink
                    to="/subscription"
                    icon={<CardIcon />}
                    label="Subscription"
                    badge={!isPro && "Upgrade"}
                  />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-[#0a2212]/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 border-b border-[#e2eee4] flex items-center justify-between">
            <span className="text-[#0a2212] font-black tracking-tight italic">
              Par & Give
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 bg-[#f8faf5] rounded-full text-[#1a5c2e]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-[#8a9e8d] text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-2">
              Main Menu
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${
                  location.pathname === link.path
                    ? "text-white shadow-lg shadow-[#1a5c2e]/20"
                    : "text-[#3d5a42]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* --- MOBILE PROFILE SECTION (BOTTOM) --- */}
          <div className="p-4 border-t border-[#e2eee4] bg-[#fcfdfb]">
            <div className="space-y-1">
              {mobileProfileOpen && (
                <div className="mb-2 space-y-1 animate-in slide-in-from-bottom-2 duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#3d5a42] hover:bg-[#f0faf2]"
                  >
                    <UserIcon /> Profile
                  </Link>
                  <Link
                    to="/subscription"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#3d5a42] hover:bg-[#f0faf2]"
                  >
                    <CardIcon /> Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50"
                  >
                    <LogoutIcon /> Sign Out
                  </button>
                </div>
              )}

              <button
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${mobileProfileOpen ? "bg-[#f0faf2] ring-1 ring-[#e2eee4]" : "hover:bg-[#f8faf5]"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a5c2e] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#7eda5a] text-xs font-black uppercase">
                    {initials}
                  </span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[#0a2212] text-sm font-black leading-none">
                    {user?.name || "Tejasav"}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isPro ? "bg-[#7eda5a]" : "bg-amber-500"}`}
                    />
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${isPro ? "text-[#1a5c2e]" : "text-amber-700"}`}
                    >
                      {isPro ? "PRO" : "GUEST"}
                    </span>
                  </div>
                </div>
                <svg
                  className={`text-[#a8bfab] transition-transform duration-300 ${mobileProfileOpen ? "rotate-180" : ""}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helpers
function DropdownLink({ to, icon, label, badge }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#3d5a42] hover:bg-[#f8faf5] transition-colors"
    >
      {icon} {label}
      {badge && (
        <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-md bg-[#7eda5a]/20 text-[#1a5c2e] border border-[#7eda5a]/30">
          {badge}
        </span>
      )}
    </Link>
  );
}

const UserIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const CardIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
