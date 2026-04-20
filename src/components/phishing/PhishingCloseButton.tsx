"use client";

export function PhishingCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="關閉"
      className="fixed top-3 right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-md border border-gray-200 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="2" y1="2" x2="12" y2="12" />
        <line x1="12" y1="2" x2="2" y2="12" />
      </svg>
    </button>
  );
}
