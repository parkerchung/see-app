import nodemailer from "nodemailer";
import { prisma } from "./prisma";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      template: true,
      targets: { include: { employee: true } },
    },
  });

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status !== "DRAFT") throw new Error("Campaign already sent");

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "SENDING" },
  });

  const transport = createTransport();
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  let successCount = 0;

  for (const target of campaign.targets) {
    try {
      const trackingUrl = `${baseUrl}/api/track/click?token=${target.token}`;
      const pixelUrl = `${baseUrl}/api/track/pixel?token=${target.token}`;

      // Replace tracking URL placeholder and inject tracking pixel
      let html = campaign.template.htmlBody.replace(
        /\{\{trackingUrl\}\}/g,
        trackingUrl
      );
      html += `<img src="${pixelUrl}" width="1" height="1" style="display:none" alt="" />`;

      await transport.sendMail({
        from: process.env.SMTP_FROM,
        to: target.employee.email,
        subject: campaign.template.subject,
        html,
      });

      await prisma.trackingEvent.create({
        data: {
          campaignTargetId: target.id,
          eventType: "EMAIL_SENT",
        },
      });

      successCount++;

      // Small delay between sends to avoid rate limiting
      if (campaign.targets.indexOf(target) < campaign.targets.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      console.error(`Failed to send to ${target.employee.email}:`, err);
    }
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status: "SENT",
      sentAt: new Date(),
    },
  });

  transport.close();
  return { total: campaign.targets.length, sent: successCount };
}
