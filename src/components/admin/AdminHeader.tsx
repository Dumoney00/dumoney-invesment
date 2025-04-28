
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-30 flex h-16 items-center gap-4 px-4">
      <div className="flex flex-1 items-center gap-4">
        {!isMobile && (
          <div className="relative max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search transactions, users..."
              className="rounded-full bg-gray-800 pl-8 pr-4 py-2 text-sm w-80 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <nav className="flex items-center gap-4">
        <button className="relative rounded-full bg-gray-800 p-2 text-gray-300 hover:text-amber-400 transition-colors">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-medium text-white">
              {notifications}
            </span>
          )}
        </button>
        
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-semibold">AD</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-300">Admin</div>
            <div className="text-xs text-gray-500">Super Admin</div>
          </div>
        </div>
      </nav>
    </header>
  );
};
