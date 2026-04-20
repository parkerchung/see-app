"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";
import { PhishingCloseButton } from "./PhishingCloseButton";

// SECURITY: This component renders a realistic-looking login form for the
// phishing simulation. When submitted, it sends ONLY the tracking token to
// the server. The email and password field values are NEVER transmitted.

export default function FakeLoginForm({ token }: { token: string }) {
  const { loading, handleSubmit, handleClose } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
      <PhishingCloseButton onClose={handleClose} />
      <div className="w-full max-w-[440px] bg-white shadow-lg p-11">
        {/* Microsoft-style logo area */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="108"
            height="24"
            viewBox="0 0 108 24"
          >
            <rect width="10.5" height="10.5" fill="#f25022" />
            <rect x="11.5" width="10.5" height="10.5" fill="#7fba00" />
            <rect y="11.5" width="10.5" height="10.5" fill="#00a4ef" />
            <rect
              x="11.5"
              y="11.5"
              width="10.5"
              height="10.5"
              fill="#ffb900"
            />
            <text
              x="28"
              y="17"
              fill="#5e5e5e"
              fontSize="15"
              fontFamily="Segoe UI, Arial, sans-serif"
              fontWeight="600"
            >
              Microsoft
            </text>
          </svg>
        </div>

        <h1 className="text-2xl font-light text-[#1b1b1b] mb-4">登入</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="電子郵件、電話或 Skype"
              className="w-full px-3 py-2 border-b-2 border-[#0067b8] outline-none text-[15px] bg-[#f2f2f2]"
              autoComplete="off"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="密碼"
              className="w-full px-3 py-2 border-b border-[#767676] outline-none text-[15px] focus:border-b-2 focus:border-[#0067b8] bg-[#f2f2f2]"
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <a href="#" className="text-[13px] text-[#0067b8] hover:underline">
              忘記密碼？
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0067b8] text-white py-2.5 px-4 text-[15px] font-semibold hover:bg-[#005a9e] transition-colors disabled:opacity-50"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        <div className="mt-6 text-[13px] text-[#767676]">
          <span>沒有帳戶嗎？ </span>
          <a href="#" className="text-[#0067b8] hover:underline">
            建立帳戶！
          </a>
        </div>
      </div>
    </div>
  );
}
