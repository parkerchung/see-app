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

  // Seed built-in phishing templates (skip existing by slug)
  const phishingTemplates = [
    { name: "Microsoft 登入", slug: "microsoft", builtIn: true },
    { name: "Facebook 登入", slug: "facebook", builtIn: true },
    { name: "Instagram 登入", slug: "instagram", builtIn: true },
    { name: "玉山銀行 網路銀行", slug: "esun-bank", builtIn: true },
    { name: "中國醫藥大學 掛號查詢", slug: "cmu-hospital", builtIn: true },
    { name: "台中銀行 網路銀行", slug: "taichung-bank", builtIn: true },
  ];

  for (const pt of phishingTemplates) {
    const exists = await prisma.phishingTemplate.findUnique({ where: { slug: pt.slug } });
    if (!exists) {
      await prisma.phishingTemplate.create({ data: pt });
      console.log(`Phishing template created: ${pt.name}`);
    }
  }

  // Seed email templates (skip existing by name)
  const emailTemplates = [
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
    {
      name: "玉山銀行 - 帳戶異常通知",
      subject: "[玉山銀行] 您的帳戶偵測到異常交易，請立即確認",
      htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5;">
  <div style="background: #00695c; padding: 20px 30px; text-align: left;">
    <span style="color: white; font-size: 20px; font-weight: bold;">玉山銀行</span>
    <span style="color: rgba(255,255,255,0.7); font-size: 13px; margin-left: 8px;">E.SUN BANK</span>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #333; font-size: 18px; margin: 0 0 20px;">帳戶安全通知</h2>
    <p style="color: #333; line-height: 1.8;">親愛的客戶您好，</p>
    <p style="color: #333; line-height: 1.8;">我們偵測到您的玉山銀行帳戶有一筆<strong>異常交易紀錄</strong>，為保障您的資金安全，請盡速登入網路銀行確認交易明細。</p>
    <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #333; font-size: 14px;"><strong>異常交易資訊：</strong></p>
      <ul style="color: #555; font-size: 14px; margin: 10px 0 0; padding-left: 20px;">
        <li>時間：2026/04/17 02:15:33</li>
        <li>金額：NT$ 28,500</li>
        <li>類型：跨行轉帳</li>
        <li>狀態：待確認</li>
      </ul>
    </div>
    <p style="color: #333; line-height: 1.8;">若此交易非您本人操作，請立即登入處理：</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="{{trackingUrl}}" style="background-color: #00695c; color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">立即登入確認</a>
    </div>
    <p style="color: #999; font-size: 12px; line-height: 1.6; border-top: 1px solid #eee; padding-top: 15px; margin-top: 25px;">
      此為系統自動通知信，請勿直接回覆。<br>
      如有疑問請撥打 24 小時客服專線：(02) 2182-1313<br>
      玉山商業銀行 版權所有
    </p>
  </div>
</body>
</html>`,
    },
    {
      name: "中國醫藥大學 - 門診預約提醒",
      subject: "[中國醫藥大學附設醫院] 您的門診預約需要確認",
      htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5;">
  <div style="background: #005b96; padding: 20px 30px; text-align: left;">
    <span style="color: white; font-size: 18px; font-weight: bold;">中國醫藥大學附設醫院</span>
    <div style="color: rgba(255,255,255,0.7); font-size: 12px; margin-top: 4px;">China Medical University Hospital</div>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #005b96; font-size: 18px; margin: 0 0 20px;">門診預約確認通知</h2>
    <p style="color: #333; line-height: 1.8;">親愛的病友您好，</p>
    <p style="color: #333; line-height: 1.8;">您有一筆門診預約即將到期，因健保署配合看診人次調整，請於 <strong>看診前一日</strong> 完成線上報到確認，否則預約將自動取消。</p>
    <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; font-size: 14px; color: #333;">
        <tr><td style="padding: 5px 0; color: #666;">看診日期</td><td style="padding: 5px 0; font-weight: bold;">2026/04/21（一）</td></tr>
        <tr><td style="padding: 5px 0; color: #666;">門診時段</td><td style="padding: 5px 0; font-weight: bold;">上午診 09:00-12:00</td></tr>
        <tr><td style="padding: 5px 0; color: #666;">科別</td><td style="padding: 5px 0; font-weight: bold;">家庭醫學科</td></tr>
        <tr><td style="padding: 5px 0; color: #666;">看診序號</td><td style="padding: 5px 0; font-weight: bold;">32 號</td></tr>
      </table>
    </div>
    <p style="color: #333; line-height: 1.8;">請點擊下方按鈕完成報到確認：</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="{{trackingUrl}}" style="background-color: #005b96; color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">確認報到</a>
    </div>
    <p style="color: #999; font-size: 12px; line-height: 1.6; border-top: 1px solid #eee; padding-top: 15px; margin-top: 25px;">
      此為系統自動通知，請勿直接回覆。<br>
      掛號諮詢專線：(04) 2205-2121 轉 1131<br>
      中國醫藥大學附設醫院 關心您的健康
    </p>
  </div>
</body>
</html>`,
    },
    {
      name: "台中銀行 - 信用卡消費通知",
      subject: "[台中銀行] 信用卡異常消費通知，請立即確認",
      htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5;">
  <div style="background: #c8102e; padding: 20px 30px; text-align: left;">
    <span style="color: white; font-size: 20px; font-weight: bold;">台中銀行</span>
    <span style="color: rgba(255,255,255,0.7); font-size: 13px; margin-left: 8px;">Taichung Bank</span>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #333; font-size: 18px; margin: 0 0 20px;">信用卡安全通知</h2>
    <p style="color: #333; line-height: 1.8;">親愛的持卡人您好，</p>
    <p style="color: #333; line-height: 1.8;">本行信用卡安全監控系統偵測到您的信用卡有一筆<strong>可疑消費</strong>，為保障您的權益，已暫時凍結該筆交易。請您盡速登入確認是否為本人消費。</p>
    <div style="background: #fce4ec; border-left: 4px solid #c8102e; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #333; font-size: 14px;"><strong>交易資訊：</strong></p>
      <ul style="color: #555; font-size: 14px; margin: 10px 0 0; padding-left: 20px;">
        <li>卡號末四碼：**** 8921</li>
        <li>消費時間：2026/04/17 01:33:07</li>
        <li>消費金額：NT$ 15,800</li>
        <li>消費地點：線上購物（海外）</li>
      </ul>
    </div>
    <p style="color: #d32f2f; font-size: 14px; font-weight: 500;">⚠ 若未於 24 小時內確認，此筆交易將自動放行。</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="{{trackingUrl}}" style="background-color: #c8102e; color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 500;">立即確認交易</a>
    </div>
    <p style="color: #999; font-size: 12px; line-height: 1.6; border-top: 1px solid #eee; padding-top: 15px; margin-top: 25px;">
      此為系統自動通知信，請勿直接回覆。<br>
      信用卡掛失及爭議款項專線：(04) 2223-6021<br>
      台中商業銀行 版權所有
    </p>
  </div>
</body>
</html>`,
    },
  ];

  for (const tpl of emailTemplates) {
    const exists = await prisma.emailTemplate.findFirst({ where: { name: tpl.name } });
    if (!exists) {
      await prisma.emailTemplate.create({ data: tpl });
      console.log(`Email template created: ${tpl.name}`);
    }
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
