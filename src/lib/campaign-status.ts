import { prisma } from "./prisma";

/**
 * Check if all targets in a campaign have responded (opened, clicked, or submitted).
 * If so, mark the campaign as COMPLETED.
 */
export async function checkCampaignCompletion(campaignTargetId: string) {
  const target = await prisma.campaignTarget.findUnique({
    where: { id: campaignTargetId },
    select: { campaignId: true },
  });
  if (!target) return;

  const campaign = await prisma.campaign.findUnique({
    where: { id: target.campaignId },
    select: { status: true },
  });
  if (!campaign || campaign.status !== "SENT") return;

  const totalTargets = await prisma.campaignTarget.count({
    where: { campaignId: target.campaignId },
  });

  // Count targets that have at least one response event (opened, clicked, or submitted)
  const respondedTargets = await prisma.campaignTarget.count({
    where: {
      campaignId: target.campaignId,
      events: {
        some: {
          eventType: { in: ["EMAIL_OPENED", "LINK_CLICKED", "CREDENTIALS_SUBMITTED"] },
        },
      },
    },
  });

  if (respondedTargets >= totalTargets) {
    await prisma.campaign.update({
      where: { id: target.campaignId },
      data: { status: "COMPLETED" },
    });
  }
}
