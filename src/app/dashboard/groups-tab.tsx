"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Globe, Plus, RefreshCw, Trash2, Target, Search, Download,
  LayoutGrid, List, CheckCircle, Clock, ChevronRight, Eye, X,
  Lightbulb, ExternalLink, ChevronDown,
  Users as UsersIcon,
} from "lucide-react";

type Group = {
  idGrup: string;
  namaGrup: string;
  source: "MANUAL" | "FETCH_ALL";
  photoUrl?: string | null;
  memberCount?: number | null;
  onlineCount?: number | null;
};

interface GroupsTabProps {
  groups: Group[];
  groupInput: string;
  setGroupInput: (v: string) => void;
  addGroup: (e: FormEvent<HTMLFormElement>) => void;
  fetchAllGroups: () => void;
  deleteAllGroups: () => void;
  deleteGroup: (id: string, name: string) => void;
}

export default function GroupsTab({
  groups, groupInput, setGroupInput, addGroup,
  fetchAllGroups, deleteAllGroups, deleteGroup,
}: GroupsTabProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("members");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [lastSyncTime, setLastSyncTime] = useState("");

  useEffect(() => {
    setLastSyncTime(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit", timeZoneName: "short",
      })
    );
  }, []);

  const filtered = useMemo(() => {
    let list = [...groups];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.namaGrup.toLowerCase().includes(q) || g.idGrup.toLowerCase().includes(q));
    }
    if (sortBy === "members") list.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
    else if (sortBy === "name") list.sort((a, b) => a.namaGrup.localeCompare(b.namaGrup));
    return list;
  }, [groups, search, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ─── card style (shared) ─── */
  const card = "bg-white rounded-2xl border border-[#F0E6D8] shadow-sm";

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div>
        <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-1 flex items-center gap-3">
          <UsersIcon className="w-8 h-8" /> Groups
        </h2>
        <p className="text-[13px] font-medium text-slate-500">
          Kelola daftar grup Telegram yang akan digunakan sebagai target pengiriman campaign Anda.
        </p>
      </div>

      {/* ── 3 Stats Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Groups", value: groups.length, sub: "Total grup dalam sistem", icon: <Globe className="w-5 h-5 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]" },
          { label: "Active Groups", value: groups.length, sub: "Grup aktif & siap digunakan", icon: <CheckCircle className="w-5 h-5 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]" },
          { label: "Last Sync", value: "Hari ini", sub: `${lastSyncTime} • Berhasil`, icon: <Clock className="w-5 h-5 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]", small: true },
        ].map((s, i) => (
          <div key={i} className={`${card} p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">{s.label}</p>
              <p className={`font-extrabold text-[var(--ink)] leading-tight ${s.small ? "text-lg" : "text-2xl"}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add Group  +  Quick Actions ── */}
      <div className="grid grid-cols-2 gap-4 items-stretch">
        {/* Add New Group */}
        <div className={`${card} p-5 flex flex-col`}>
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-5 h-5 text-[#9A5034]" />
            <h3 className="text-sm font-bold text-[var(--ink)]">Add New Group</h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Tambahkan grup Telegram ke dalam sistem untuk digunakan sebagai target campaign.</p>
          <form className="flex items-center gap-2" onSubmit={addGroup}>
            <input required value={groupInput} onChange={(e) => setGroupInput(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[#F0E6D8] bg-slate-50 px-3 py-2 text-sm focus:border-[#9A5034] focus:bg-white focus:outline-none"
              placeholder="Enter username, invite link, or group ID..." />
            <button type="submit"
              className="flex items-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white shadow-md shadow-[var(--accent-soft)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 shrink-0 whitespace-nowrap">
              <Plus className="mr-1 h-4 w-4" strokeWidth={2.5} /> Add Group
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1.5">@ username, t.me/groupname, atau group ID</p>
        </div>

        {/* Quick Actions */}
        <div className={`${card} p-5 flex flex-col`}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#9A5034]" />
            <h3 className="text-sm font-bold text-[var(--ink)]">Quick Actions</h3>
          </div>
          <div className="flex gap-3 flex-1">
            {[
              { label: "Import from Telegram", sub: "Import grup dari akun Anda", icon: <Download className="w-4 h-4 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]", action: fetchAllGroups, border: "border-[#F0E6D8]" },
              { label: "Sync Data", sub: "Perbarui data grup", icon: <RefreshCw className="w-4 h-4 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]", action: fetchAllGroups, border: "border-[#F0E6D8]" },
              { label: "Reset All", sub: "Hapus semua data", icon: <Trash2 className="w-4 h-4 text-[#B04C2E]" />, bg: "bg-[#FFF0E0]", action: deleteAllGroups, border: "border-[#F0E6D8]" },
            ].map((a, i) => (
              <button key={i} type="button" onClick={a.action}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border ${a.border} bg-white px-3 py-3 text-center transition-all hover:bg-slate-50 hover:-translate-y-0.5 flex-1`}>
                <div className={`w-9 h-9 ${a.bg} rounded-lg flex items-center justify-center shrink-0`}>{a.icon}</div>
                <div>
                  <span className="block text-xs font-bold text-[var(--ink)] leading-tight">{a.label}</span>
                  <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">{a.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Group Directory ── */}
      <div>
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[var(--ink)]">Group Directory</h3>
          <p className="text-[11px] text-slate-400 font-medium">Daftar semua grup yang tersedia dalam sistem Anda.</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#F0E6D8] bg-white pl-9 pr-3 py-2 text-sm focus:border-[#9A5034] focus:outline-none"
              placeholder="Search groups by name or username..." />
          </div>
          <div className="relative shrink-0">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-[#F0E6D8] bg-white pl-3 pr-7 py-2 text-xs font-semibold text-slate-600 cursor-pointer focus:outline-none">
              <option value="all">All Status</option><option value="active">Active</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative shrink-0">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-[#F0E6D8] bg-white pl-3 pr-7 py-2 text-xs font-semibold text-slate-600 cursor-pointer focus:outline-none">
              <option value="members">Sort by Members</option><option value="name">Sort by Name</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex rounded-xl border border-[#F0E6D8] overflow-hidden shrink-0">
            <button onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#9A5034] text-white" : "bg-white text-slate-400 hover:text-slate-600"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#9A5034] text-white" : "bg-white text-slate-400 hover:text-slate-600"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className={`${card} flex flex-col items-center justify-center py-20 text-slate-400`}>
            <Target className="mb-4 h-12 w-12 opacity-50 text-slate-300" />
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Belum Ada Grup Target</h3>
            <p className="text-sm font-medium max-w-sm text-center">Tambahkan grup pertama Anda untuk memulai pengiriman otomatis.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((g) => {
              const sel = selectedIds.has(g.idGrup);
              return (
                <div key={g.idGrup} className={`${card} p-4 transition-all hover:shadow-md hover:-translate-y-0.5`}>
                  <div className="flex items-start gap-2.5 mb-2">
                    <img src={g.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.namaGrup)}&background=random&color=fff&size=128`}
                      alt={g.namaGrup} className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover bg-slate-50 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="font-bold text-[var(--ink)] text-[13px] leading-tight line-clamp-2">{g.namaGrup}</h4>
                        <span className="shrink-0 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200 leading-none">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        {g.memberCount ? `${g.memberCount.toLocaleString("id-ID")} members` : `ID: ${g.idGrup}`}
                        {g.onlineCount ? ` • ${g.onlineCount.toLocaleString("id-ID")} online` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-2.5">
                    <Clock className="w-3 h-3 shrink-0" /> Last sync: Hari ini, {lastSyncTime}
                  </p>
                  <div className="flex gap-1.5">
                    <button onClick={() => deleteGroup(g.idGrup, g.namaGrup)}
                      className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 whitespace-nowrap">
                      <X className="w-3 h-3 shrink-0" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((g) => {
              const sel = selectedIds.has(g.idGrup);
              return (
                <div key={g.idGrup} className={`${card} px-4 py-3 flex items-center gap-3 hover:shadow-md transition-all`}>
                  <img src={g.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.namaGrup)}&background=random&color=fff&size=128`}
                    alt={g.namaGrup} className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover bg-slate-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[var(--ink)] text-sm truncate">{g.namaGrup}</h4>
                      <span className="shrink-0 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">Active</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{g.memberCount ? `${g.memberCount.toLocaleString("id-ID")} members` : `ID: ${g.idGrup}`}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => deleteGroup(g.idGrup, g.namaGrup)}
                      className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 whitespace-nowrap">
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
