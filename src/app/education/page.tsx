import { ShieldAlert, Eye, Link2, Mail, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EducationPage({
  searchParams,
}: {
  searchParams: Promise<{ tid?: string }>;
}) {
  const { tid } = await searchParams;

  // If a template ID is provided, render that template
  if (tid) {
    const template = await prisma.educationTemplate.findUnique({
      where: { id: tid },
      select: { htmlBody: true },
    });

    if (template) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          <div
            className="max-w-3xl mx-auto px-6 py-16"
            dangerouslySetInnerHTML={{ __html: template.htmlBody }}
          />
        </div>
      );
    }
  }

  // Default education page
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
            <ShieldAlert className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            這是一次社交工程演練
          </h1>
          <p className="text-lg text-gray-600">
            您剛才參與了一次釣魚郵件模擬測試。請不要擔心，這只是一次安全意識訓練。
          </p>
        </div>

        {/* What happened */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            發生了什麼事？
          </h2>
          <p className="text-gray-600 leading-relaxed">
            您收到了一封看似來自公司內部的信件，並點擊了信中的連結，進入了一個模擬的登入頁面。
            在真實的釣魚攻擊中，攻擊者會利用這個假登入頁面竊取您的帳號密碼，
            進而存取公司機密資料、發送惡意信件、或進行財務詐騙。
          </p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            如何辨識釣魚郵件？
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">檢查寄件者地址</h3>
                <p className="text-gray-600 text-sm">
                  仔細查看寄件者的電子郵件地址。釣魚信件常使用與公司相似但不完全相同的網域名稱，
                  例如把 company.com 改為 c0mpany.com 或 company-support.com。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">懸停查看連結</h3>
                <p className="text-gray-600 text-sm">
                  在點擊任何連結之前，將滑鼠懸停在連結上方查看實際的網址。
                  如果網址看起來可疑或與預期不符，請不要點擊。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">注意緊急語氣</h3>
                <p className="text-gray-600 text-sm">
                  釣魚信件通常會使用緊急、威脅性的語言，例如「您的帳號即將被鎖定」、
                  「偵測到異常活動」等。遇到這類信件請保持冷靜，先向 IT 部門確認。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">確認登入頁面網址</h3>
                <p className="text-gray-600 text-sm">
                  在任何頁面輸入帳號密碼之前，請確認瀏覽器網址列顯示的是公司官方網址。
                  正規的 Microsoft 登入頁面網址應為 login.microsoftonline.com。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What to do */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            下次遇到可疑信件該怎麼辦？
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>不要點擊信件中的任何連結或附件</li>
            <li>不要回覆該信件或提供任何個人資訊</li>
            <li>向 IT 資訊安全部門回報該可疑信件</li>
            <li>如果已經點擊了連結，請立即更改您的密碼</li>
            <li>開啟帳號的雙重驗證（MFA）以增加安全性</li>
          </ol>
        </div>

        <div className="text-center text-sm text-gray-400">
          此頁面為社交工程演練教育宣導頁面 · 由 IT 資訊安全部門提供
        </div>
      </div>
    </div>
  );
}
