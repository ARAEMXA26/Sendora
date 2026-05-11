"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
}: ConfirmModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      timeout = setTimeout(() => setShow(false), 200); // Wait for exit animation
      document.body.style.overflow = "unset";
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl transition-all duration-200 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="title-font text-xl text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-colors ${
              variant === "danger"
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 shadow-lg"
                : "bg-teal-500 hover:bg-teal-600 shadow-teal-500/20 shadow-lg"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
