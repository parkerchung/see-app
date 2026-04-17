import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@see.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "管理員",
      },
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  // Seed built-in phishing templates
  const phishingTemplateCount = await prisma.phishingTemplate.count();
  if (phishingTemplateCount === 0) {
    await prisma.phishingTemplate.createMany({
      data: [
        {
          name: "Microsoft 登入",
          slug: "microsoft",
          builtIn: true,
        },
        {
          name: "Facebook 登入",
          slug: "facebook",
          builtIn: true,
        },
        {
          name: "Instagram 登入",
          slug: "instagram",
          builtIn: true,
        },
        {
          name: "玉山銀行 網路銀行",
          slug: "esun-bank",
          builtIn: true,
        },
        {
          name: "中國醫藥大學 掛號查詢",
          slug: "cmu-hospital",
          builtIn: true,
        },
        {
          name: "台中銀行 網路銀行",
          slug: "taichung-bank",
          builtIn: true,
        },
      ],
    });
    console.log("Built-in phishing templates created.");
  }

  const templateCount = await prisma.emailTemplate.count();
  if (templateCount === 0) {
    await prisma.emailTemplate.createMany({
      data: [
        {
          name: "密碼重設通知",
          subject: "[緊急] 您的帳號密碼即將到期，請立即重新設定",
          htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f3f2f1; padding: 20px; text-align: center;">
    <h2 style="color: #333;">帳號安全通知</h2>
  </div>
  <div style="padding: 20px; border: 1px solid #e0e0e0;">
    <p>親愛的同仁您好，</p>
    <p>系統偵測到您的帳號密碼即將於 <strong>3 天內到期</strong>。為確保您能正常使用公司系統，請立即更新您的密碼。</p>
    <p>如未在期限內完成更新，您的帳號將被暫時鎖定。</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{trackingUrl}}" style="background-color: #0078d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">立即更新密碼</a>
    </div>
    <p style="color: #666; font-size: 12px;">此為系統自動發送，請勿直接回覆本信件。</p>
  </div>
</body>
</html>`,
        },
        {
          name: "IT 安全警告",
          subject: "[重要] 偵測到異常登入活動，請確認您的帳號安全",
          htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #d83b01; padding: 20px; text-align: center;">
    <h2 style="color: white;">安全警告</h2>
  </div>
  <div style="padding: 20px; border: 1px solid #e0e0e0;">
    <p>親愛的同仁您好，</p>
    <p>我們偵測到您的帳號在 <strong>不明地點</strong> 有異常登入嘗試：</p>
    <ul>
      <li>時間：今日 03:42 AM</li>
      <li>位置：越南 胡志明市</li>
      <li>裝置：未知裝置</li>
    </ul>
    <p>如果這不是您本人的操作，請立即驗證您的帳號以保護帳號安全。</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{trackingUrl}}" style="background-color: #d83b01; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">驗證我的帳號</a>
    </div>
    <p style="color: #666; font-size: 12px;">IT 資訊安全部門</p>
  </div>
</body>
</html>`,
        },
        {
          name: "HR 文件簽署通知",
          subject: "請簽署：年度員工滿意度調查表",
          htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #107c10; padding: 20px; text-align: center;">
    <h2 style="color: white;">人力資源部通知</h2>
  </div>
  <div style="padding: 20px; border: 1px solid #e0e0e0;">
    <p>親愛的同仁您好，</p>
    <p>年度員工滿意度調查現已開放填寫。請於 <strong>本週五前</strong> 完成填寫。</p>
    <p>本調查為匿名進行，您的意見將有助於改善公司工作環境。</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{trackingUrl}}" style="background-color: #107c10; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">開始填寫調查</a>
    </div>
    <p style="color: #666; font-size: 12px;">人力資源部</p>
  </div>
</body>
</html>`,
        },
      ],
    });
    console.log("Default email templates created.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
