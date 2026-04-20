"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";
import { PhishingCloseButton } from "./PhishingCloseButton";

export default function InstagramLogin({ token }: { token: string }) {
  const { loading, handleSubmit, handleClose } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <PhishingCloseButton onClose={handleClose} />
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-[935px] w-full px-4">
        {/* Left side - branding */}
        <div className="hidden lg:block lg:flex-1 text-center">
          <div className="mb-4">
            <svg viewBox="0 0 51 51" className="w-[52px] h-[52px] inline-block">
              <defs>
                <radialGradient id="ig-grad1" cx="25%" cy="106%" r="150%">
                  <stop offset="0%" stopColor="#ffd600" />
                  <stop offset="25%" stopColor="#ff7a00" />
                  <stop offset="50%" stopColor="#ff0069" />
                  <stop offset="75%" stopColor="#d300c5" />
                  <stop offset="100%" stopColor="#7638fa" />
                </radialGradient>
              </defs>
              <rect x="2" y="2" width="47" height="47" rx="12" fill="url(#ig-grad1)" />
              <circle cx="25.5" cy="25.5" r="11" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="37" cy="14" r="2.5" fill="white" />
            </svg>
          </div>
          <h1 className="text-[#262626] text-[28px] leading-tight font-semibold">
            查看<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]">摯友</span>每天的精彩時刻。
          </h1>
        </div>

        {/* Right side - login form */}
        <div className="w-full max-w-[350px]">
          <div className="bg-white border border-[#dbdbdb] rounded-sm p-10 mb-3">
            {/* Instagram text logo */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-normal" style={{ fontFamily: "'Segoe Script', 'Dancing Script', cursive" }}>
                Instagram
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="手機號碼、用戶名稱或電子郵件地址"
                  className="w-full px-2 py-2.5 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] text-[12px] outline-none focus:border-[#a8a8a8]"
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="密碼"
                  className="w-full px-2 py-2.5 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] text-[12px] outline-none focus:border-[#a8a8a8]"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0095f6] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#1877f2] transition-colors disabled:opacity-50"
              >
                {loading ? "登入中..." : "登入"}
              </button>
            </form>

            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-[#dbdbdb]" />
              <span className="px-4 text-[13px] text-[#737373] font-semibold">或</span>
              <div className="flex-1 h-px bg-[#dbdbdb]" />
            </div>

            <div className="text-center">
              <a href="#" className="text-[#385185] text-sm font-semibold">
                使用 Facebook 帳號登入
              </a>
            </div>

            <div className="text-center mt-4">
              <a href="#" className="text-[12px] text-[#00376b]">
                忘記密碼？
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#dbdbdb] rounded-sm p-5 text-center text-sm">
            <span className="text-[#262626]">沒有帳號嗎？</span>{" "}
            <a href="#" className="text-[#0095f6] font-semibold">
              建立新帳號
            </a>
          </div>

          {/* Footer */}
          <div className="mt-5 text-center text-[12px] text-[#737373]">
            <p>Meta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
