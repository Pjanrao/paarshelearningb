import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Search, Loader2, ArrowRight, User, GraduationCap, BookOpen, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  link: string;
}

export default function Topbar({ role }: { role: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "Student": return <User className="text-blue-500" size={16} />;
      case "Teacher": return <GraduationCap className="text-green-500" size={16} />;
      case "Course": return <BookOpen className="text-orange-500" size={16} />;
      case "Blog": return <FileText className="text-purple-500" size={16} />;
      default: return <Search size={16} />;
    }
  };

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Clear Redux state
    dispatch(logout());

    // Redirect to home or sign-in
    router.push("/signin");
  };

  return (
    <div className="h-16 
                 bg-white
                 border-b border-gray-100
                 sticky top-0 z-40
                 flex items-center justify-between px-4 sm:px-8">

      {/* Logo */}
      <div className="flex items-center shrink-0">
        <Image
          src="/images/logo/logo-wide.webp"
          alt="Paarsh E-Learning"
          width={200}
          height={50}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-lg ml-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={16} />}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (query.trim().length >= 2) && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Search Results</p>
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.link}
                      onClick={() => setShowResults(false)}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                          {getIcon(result.type)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-none mb-1">{result.title}</p>
                          <p className="text-[10px] text-gray-500">{result.type} • {result.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              ) : !loading ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="text-gray-300" size={20} />
                  </div>
                  <p className="text-sm font-bold text-gray-800">No results found</p>
                  <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex items-center shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C4276] hover:bg-[#1e2e54] text-white rounded-full text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
