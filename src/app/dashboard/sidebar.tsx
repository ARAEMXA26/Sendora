"use client";
import { useState } from "react";
import { LayoutDashboard, Users, MessageSquare, Clock, Settings, Shield, ShoppingBag, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

export type SidebarTab = "dashboard" | "groups" | "messages" | "logs" | "help" | "settings" | "admin" | "shop";

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isAdmin,
  isLicenseActive
}: { 
  activeTab: SidebarTab; 
  setActiveTab: (t: SidebarTab) => void; 
  isAdmin: boolean;
  isLicenseActive: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: { id: SidebarTab; label: string; icon: React.ElementType; disabled?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: false }, // always accessible — key input is here
    { id: "groups", label: "Groups", icon: Users, disabled: !isAdmin && !isLicenseActive },
    { id: "messages", label: "Messages", icon: MessageSquare, disabled: !isAdmin && !isLicenseActive },
    { id: "logs", label: "Logs", icon: Clock, disabled: !isAdmin && !isLicenseActive },
  ];

  if (!isAdmin) {
    tabs.push({ id: "help", label: "Help", icon: HelpCircle });
  }

  if (isAdmin) {
    tabs.push({ id: "admin", label: "Admin", icon: Shield });
  } else {
    tabs.push({ id: "shop", label: "Shop", icon: ShoppingBag });
  }

  tabs.push({ id: "settings", label: "Settings", icon: Settings });

  return (
    <aside className={`h-full bg-[#FCF8F3] border-r border-[#F0E6D8] flex flex-col py-6 relative transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-8 bg-white border border-[#F0E6D8] rounded-full p-1.5 text-slate-400 hover:text-[#9A5034] shadow-sm transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`mb-8 flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6 gap-3'}`}>
        <img 
          src="/logo-sendora.png" 
          alt="Sendora Logo" 
          className="h-8 w-8 object-contain shrink-0" 
        />
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="font-bold text-[#7A3F2E] text-xl leading-none">
              Sendora
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase whitespace-nowrap leading-none">
              AUTOMATION SUITE
            </p>
          </div>
        )}
      </div>

      <nav className={`flex-1 space-y-1 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              title={isCollapsed ? (isDisabled ? `${tab.label} (Locked)` : tab.label) : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg text-sm font-semibold transition-all ${
                isDisabled 
                  ? "opacity-50 grayscale cursor-not-allowed text-slate-400"
                  : isActive
                    ? "bg-[#FFF0E0] text-[#B04C2E] border-r-4 border-[#D96B40]"
                    : "text-slate-500 hover:bg-[#FFF8F0] hover:text-[#9A5034]"
              }`}
              style={isActive && !isDisabled ? { borderRightColor: '#D96B40', borderRightWidth: '3px' } : {}}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{tab.label}</span>
                  {isDisabled && <Shield className="w-3 h-3 text-slate-400" />}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
