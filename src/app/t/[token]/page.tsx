import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PhishingPageRenderer from "./PhishingPageRenderer";

export default async function FakeLoginPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const target = await prisma.campaignTarget.findUnique({
    where: { token },
    include: {
      campaign: {
        include: {
          phishingTemplate: { select: { slug: true, builtIn: true, htmlBody: true } },
        },
      },
    },
  });

  if (!target) {
    notFound();
  }

  const slug = target.campaign.phishingTemplate?.slug ?? "microsoft";
  const builtIn = target.campaign.phishingTemplate?.builtIn ?? true;
  const htmlBody = target.campaign.phishingTemplate?.htmlBody ?? null;

  return (
    <PhishingPageRenderer
      token={token}
      slug={slug}
      builtIn={builtIn}
      htmlBody={htmlBody}
    />
  );
}
