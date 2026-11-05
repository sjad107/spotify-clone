"use client";

import { usePanel } from "./panel-provider";

export default function PanelToast() {
  const { toast } = usePanel();
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-0 bottom-6 z-50 flex justify-center"
    >
      {toast && (
        <span className="rounded-lg bg-[#3d91f4] px-4 py-3 text-sm font-bold text-white shadow-lg">
          {toast}
        </span>
      )}
    </div>
  );
}
