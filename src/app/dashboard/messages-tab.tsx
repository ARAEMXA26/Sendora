"use client";
import { FormEvent, useState } from "react";
import {
  MessageSquare, Plus, Image, Hourglass, ChevronDown, ChevronUp,
  Clock, Calendar, PenLine, Trash2, FileText, Send, RefreshCw,
  UsersRound, CheckCircle, Search, ChevronRight, X,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Group = {
  idGrup: string;
  namaGrup: string;
  source: "MANUAL" | "FETCH_ALL";
  photoUrl?: string | null;
  memberCount?: number | null;
  onlineCount?: number | null;
};

type Message = {
  idTeks: string;
  isiPesan: string;
  mediaUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deliveryMode?: string;
  msgTarget?: string | null;
  scheduleDate?: string | null;
  scheduleTime?: string | null;
  intervalNum?: number | null;
  intervalUnit?: string | null;
  sendCount?: number | null;
  status?: string;
};

interface MessagesTabProps {
  groups: Group[];
  messages: Message[];
  messageInput: string;
  setMessageInput: (v: string) => void;
  mediaUrl: string | null;
  setMediaUrl: (v: string | null) => void;
  isUploading: boolean;
  handleMediaUpload: (file: File) => void;
  deliveryMode: "NOW" | "SCHEDULE" | "REPEAT";
  setDeliveryMode: (v: "NOW" | "SCHEDULE" | "REPEAT") => void;
  msgTarget: string[];
  setMsgTarget: (v: string[]) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  scheduleDate: string;
  setScheduleDate: (v: string) => void;
  scheduleTime: string;
  setScheduleTime: (v: string) => void;
  intervalNum: string;
  setIntervalNum: (v: string) => void;
  intervalUnit: string;
  setIntervalUnit: (v: string) => void;
  sendCount: string;
  setSendCount: (v: string | ((s: string) => string)) => void;
  saveConfigMode: (e: FormEvent<HTMLFormElement>) => void;
  deleteMessage: (id: string) => void;
  deleteAllMessages: () => void;
  isEditing: boolean;
  editingMessageId: string | null;
  setIsEditing: (v: boolean) => void;
  setEditingMessageId: (v: string | null) => void;
}

export default function MessagesTab({
  groups, messages, messageInput, setMessageInput,
  mediaUrl, setMediaUrl, isUploading, handleMediaUpload,
  deliveryMode, setDeliveryMode, msgTarget, setMsgTarget,
  dropdownOpen, setDropdownOpen,
  scheduleDate, setScheduleDate, scheduleTime, setScheduleTime,
  intervalNum, setIntervalNum, intervalUnit, setIntervalUnit,
  sendCount, setSendCount, saveConfigMode,
  deleteMessage, deleteAllMessages,
  isEditing, editingMessageId, setIsEditing, setEditingMessageId,
}: MessagesTabProps) {
  const [groupSearch, setGroupSearch] = useState("");
  const card = "bg-white rounded-2xl border border-[#F0E6D8] shadow-sm";

  const mediaCount = messages.filter((m) => !!m.mediaUrl).length;
  const modeLabel = deliveryMode === "NOW" ? "Kirim Sekarang" : deliveryMode === "SCHEDULE" ? "Jadwalkan" : "Kirim Berulang";

  const filteredGroups = groups.filter((g) =>
    g.namaGrup.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const handleResetForm = () => {
    setMessageInput("");
    setMediaUrl(null);
    setMsgTarget([]);
    setDeliveryMode("REPEAT");
    setIntervalNum("2");
    setIntervalUnit("Jam");
    setSendCount("5");
    setIsEditing(false);
    setEditingMessageId(null);
    toast.success("Form berhasil di-reset");
  };

  const handleEditMessage = (msg: Message) => {
    setMessageInput(msg.isiPesan || "");
    setMediaUrl(msg.mediaUrl || null);
    setDeliveryMode((msg.deliveryMode as "NOW" | "SCHEDULE" | "REPEAT") || "REPEAT");
    if (msg.msgTarget) {
      if (msg.msgTarget === "ALL_GROUPS") {
        setMsgTarget(["ALL_GROUPS"]);
      } else {
        setMsgTarget(msg.msgTarget.split(","));
      }
    } else {
      setMsgTarget([]);
    }
    setScheduleDate(msg.scheduleDate || "");
    setScheduleTime(msg.scheduleTime || "");
    setIntervalNum(msg.intervalNum ? String(msg.intervalNum) : "2");
    setIntervalUnit(msg.intervalUnit || "Jam");
    setSendCount(msg.sendCount ? String(msg.sendCount) : "5");
    setIsEditing(true);
    setEditingMessageId(msg.idTeks);
    toast.success("Pesan dimuat ke form untuk diedit");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-1 flex items-center gap-3">
          <MessageSquare className="w-8 h-8" /> Messages
        </h2>
        <p className="text-[13px] font-medium text-slate-500">
          Buat, atur, dan kelola pesan teks atau media yang akan dikirim secara otomatis.
        </p>
      </div>

      {/* 2 Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${card} p-4 flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#B04C2E]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">Total Pesan</p>
            <p className="text-2xl font-extrabold text-[var(--ink)] leading-tight">{messages.length}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">pesan tersimpan</p>
          </div>
        </div>
        <div className={`${card} p-4 flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0">
            <Image className="w-5 h-5 text-[#B04C2E]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">Media Terlampir</p>
            <p className="text-2xl font-extrabold text-[var(--ink)] leading-tight">{mediaCount}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">file media</p>
          </div>
        </div>
      </div>

      {/* Buat Pesan + Pilih Grup Tujuan */}
      <div className="grid grid-cols-5 gap-4 items-stretch">
        {/* Buat Pesan — 3 cols */}
        <div className={`${card} p-5 col-span-3 flex flex-col ${isEditing ? 'ring-2 ring-[#B04C2E]/30' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--ink)]">{isEditing ? '✏️ Edit Pesan' : 'Buat Pesan'}</h3>
            {isEditing && (
              <span className="text-[10px] font-bold text-[#B04C2E] bg-[#FFF0E0] px-2.5 py-1 rounded-full border border-[#F0E6D8] animate-pulse">Sedang mengedit...</span>
            )}
          </div>
          <form className="flex flex-col gap-4 flex-1" onSubmit={saveConfigMode}>
            {/* Row: Upload + Textarea */}
            <div className="grid grid-cols-2 gap-4">
              {/* Upload Media */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">1. Upload Media</label>
                <div
                  className="relative rounded-xl border-2 border-dashed border-[#F0E6D8] bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center min-h-[140px] hover:border-[#9A5034]/40 transition-colors"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleMediaUpload(e.dataTransfer.files[0]); }}
                >
                  {!mediaUrl && !isUploading && (
                    <input type="file" accept="image/*,video/*"
                      onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  )}
                  {isUploading ? (
                    <div className="flex flex-col items-center text-slate-400 py-2">
                      <Hourglass className="h-6 w-6 animate-spin mb-2" />
                      <span className="text-xs font-semibold">Mengunggah...</span>
                    </div>
                  ) : mediaUrl ? (
                    <div className="w-full flex flex-col items-center gap-2 z-30">
                      {mediaUrl.match(/\.(mp4|webm|mkv|mov)$/i) ? (
                        <video src={mediaUrl} controls className="max-h-20 rounded-lg shadow-sm" />
                      ) : (
                        <img src={mediaUrl} className="max-h-20 object-contain rounded-lg shadow-sm" alt="Media" />
                      )}
                      <button type="button" onClick={() => setMediaUrl(null)} className="rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-100">Hapus Media</button>
                    </div>
                  ) : (
                    <div className="pointer-events-none flex flex-col items-center">
                      <div className="bg-white shadow-sm p-2.5 rounded-xl mb-2 border border-slate-100">
                        <Image className="h-5 w-5 text-slate-400" strokeWidth={2} />
                      </div>
                      <span className="text-[12px] font-bold text-slate-600 block">Upload Foto / Video</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Klik atau drag file ke sini</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Tulis Pesan */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">2. Tulis Pesan</label>
                <div className="relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 pb-6 text-[13px] focus:border-[#9A5034] focus:outline-none placeholder:text-slate-400 min-h-[140px]"
                    placeholder="Tulis pesan..."
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] font-medium text-slate-400">{messageInput.length}/1000</span>
                </div>
              </div>
            </div>

            {/* 3. Mode Pengiriman */}
            <div>
              <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">3. Mode Pengiriman</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-[#F0E6D8]">
                {(["NOW", "SCHEDULE", "REPEAT"] as const).map((mode) => (
                  <button key={mode} type="button" onClick={() => setDeliveryMode(mode)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-[12px] font-bold transition-all ${
                      deliveryMode === mode
                        ? "bg-white text-[var(--accent)] shadow-sm border border-[#F0E6D8]"
                        : "text-slate-500 hover:text-slate-700 border border-transparent"
                    }`}>
                    <div className={`w-4 h-4 shrink-0 rounded-full border-[1.5px] flex items-center justify-center ${deliveryMode === mode ? "border-[var(--accent)]" : "border-slate-400"}`}>
                      {deliveryMode === mode && <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />}
                    </div>
                    {mode === "NOW" ? "Kirim Sekarang" : mode === "SCHEDULE" ? "Jadwalkan" : "Kirim Berulang"}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Pengaturan Pengiriman (REPEAT / SCHEDULE) */}
            {deliveryMode !== "NOW" && (
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">
                  4. Pengaturan Pengiriman
                </label>
                {deliveryMode === "SCHEDULE" && (
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 text-[13px] font-semibold text-slate-600 focus:border-[#9A5034] focus:outline-none" />
                    </div>
                    <div className="relative flex-1">
                      <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 text-[13px] font-semibold text-slate-600 focus:border-[#9A5034] focus:outline-none" />
                    </div>
                  </div>
                )}
                {deliveryMode === "REPEAT" && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Kirim Setiap</span>
                      <div className="flex gap-2">
                        <input type="number" min="1" value={intervalNum} onChange={(e) => setIntervalNum(e.target.value)}
                          className="w-20 rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 text-[13px] font-bold text-slate-600 text-center focus:border-[#9A5034] focus:outline-none" />
                        <div className="relative flex-1">
                          <select value={intervalUnit} onChange={(e) => setIntervalUnit(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 pr-8 text-[13px] font-semibold text-slate-600 focus:border-[#9A5034] focus:outline-none">
                            <option value="Menit">Menit</option><option value="Jam">Jam</option><option value="Hari">Hari</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Jumlah Pengiriman</span>
                      <div className="relative">
                        <input type="number" min="1" value={sendCount} onChange={(e) => setSendCount(e.target.value)}
                          className="w-full rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 pr-8 text-[13px] font-bold text-slate-600 focus:border-[#9A5034] focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0">
                          <button type="button" onClick={() => setSendCount((s: string) => String(parseInt(s||"0")+1))} className="p-0.5 text-slate-400 hover:text-slate-600"><ChevronUp className="w-3 h-3" strokeWidth={3} /></button>
                          <button type="button" onClick={() => setSendCount((s: string) => String(Math.max(1, parseInt(s||"0")-1)))} className="p-0.5 text-slate-400 hover:text-slate-600"><ChevronDown className="w-3 h-3" strokeWidth={3} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-auto pt-3 border-t border-[#F0E6D8]">
              <button type="button" onClick={handleResetForm}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#F0E6D8] bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 flex-1">
                <RefreshCw className="w-4 h-4" /> Reset Form
              </button>
              <button type="submit"
                className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex-[2] ${isEditing ? 'bg-emerald-600 shadow-emerald-200' : 'bg-[var(--accent)] shadow-[var(--accent-soft)]'}`}>
                <Send className="w-4 h-4" /> {isEditing ? 'Update Pesan' : 'Simpan Pesan'}
              </button>
            </div>
          </form>
        </div>

        {/* Pilih Grup Tujuan — 2 cols */}
        <div className={`${card} p-5 col-span-2 flex flex-col`}>
          <h3 className="text-base font-bold text-[var(--ink)] mb-1">Pilih Grup Tujuan</h3>
          <p className="text-[11px] text-slate-400 mb-3">Pilih grup Telegram yang akan menerima pesan ini.</p>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={groupSearch} onChange={(e) => setGroupSearch(e.target.value)}
              className="w-full rounded-xl border border-[#F0E6D8] bg-white pl-9 pr-3 py-2 text-sm focus:border-[#9A5034] focus:outline-none"
              placeholder="Cari grup..." />
          </div>

          {/* Group list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0 max-h-[300px] pr-1">
            {filteredGroups.map((g) => {
              const isSelected = msgTarget.includes(g.idGrup) || msgTarget.includes("ALL_GROUPS");
              return (
                <label key={g.idGrup}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all border ${
                    isSelected ? "border-[#B04C2E]/30 bg-[#FFF8F3]" : "border-[#F0E6D8] hover:bg-slate-50"
                  }`}>
                  <input type="checkbox" checked={isSelected}
                    onChange={(e) => {
                      let next = [...msgTarget].filter(t => t !== "ALL_GROUPS");
                      if (e.target.checked) next.push(g.idGrup);
                      else next = next.filter(t => t !== g.idGrup);
                      setMsgTarget(next);
                    }}
                    className="w-4 h-4 rounded border-slate-300 accent-[#9A5034] cursor-pointer shrink-0" />
                  <img src={g.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.namaGrup)}&background=random&color=fff&size=64`}
                    alt={g.namaGrup} className="w-9 h-9 rounded-full ring-2 ring-slate-100 object-cover bg-slate-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[var(--ink)] truncate">{g.namaGrup}</p>
                    <p className="text-[10px] text-slate-400">{g.memberCount ? `${g.memberCount.toLocaleString("id-ID")} members` : `ID: ${g.idGrup}`}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </label>
              );
            })}
          </div>

          {/* Select All / Clear */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0E6D8]">
            <button type="button" onClick={() => setMsgTarget(["ALL_GROUPS"])}
              className="flex-1 rounded-xl border border-[#9A5034] text-[#9A5034] py-2 text-xs font-bold hover:bg-[#FFF0E0] transition-colors">
              Select All
            </button>
            <button type="button" onClick={() => setMsgTarget([])}
              className="flex-1 rounded-xl border border-[#F0E6D8] text-slate-600 py-2 text-xs font-bold hover:bg-slate-50 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* List Teks */}
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between p-5 border-b border-[#F0E6D8]">
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">List Teks</h3>
            <p className="text-[11px] text-slate-400">Daftar pesan yang sudah ditambahkan beserta media dan grup tujuan.</p>
          </div>
          <button onClick={deleteAllMessages} className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
          </button>
        </div>

        <div className="divide-y divide-[#F0E6D8]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mb-3 opacity-30 text-slate-300" />
              <p className="font-semibold text-sm">Belum ada teks atau draf pesan.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.idTeks} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                {/* Media preview */}
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {msg.mediaUrl ? (
                    msg.mediaUrl.match(/\.(mp4|webm|mkv|mov)$/i) ? (
                      <video src={msg.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={msg.mediaUrl} className="w-full h-full object-cover" alt="" />
                    )
                  ) : (
                    <FileText className="w-4 h-4 text-slate-300" />
                  )}
                </div>

                {/* Text preview + date */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{msg.isiPesan || "(media only)"}</p>
                  <p className="text-[10px] text-slate-400">
                    {msg.mediaUrl ? "Gambar" : "Teks"} • {msg.createdAt ? new Date(msg.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  </p>
                </div>

                {/* Mode badge */}
                <span className="shrink-0 text-[10px] font-bold text-[#B04C2E] bg-[#FFF0E0] px-2.5 py-1 rounded-full border border-[#F0E6D8] whitespace-nowrap">
                  {msg.deliveryMode === "NOW" ? "Kirim Sekarang" : msg.deliveryMode === "SCHEDULE" ? "Terjadwal" : "Kirim Berulang"}
                </span>

                {/* Status */}
                <span className="shrink-0 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">Aktif</span>

                {/* Target count */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium shrink-0">
                  <UsersRound className="w-3.5 h-3.5" />
                  {msg.msgTarget && msg.msgTarget !== "ALL_GROUPS" ? msg.msgTarget.split(",").length + " grup dipilih" : "Semua grup"}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => handleEditMessage(msg)}
                    className={`p-2 rounded-lg transition-all ${editingMessageId === msg.idTeks ? 'text-[#9A5034] bg-[#FFF0E0]' : 'text-slate-400 hover:text-[#9A5034] hover:bg-[#FFF0E0]'}`} title="Edit">
                    <PenLine className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMessage(msg.idTeks)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
