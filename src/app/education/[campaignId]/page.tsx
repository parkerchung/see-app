import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CustomEducationPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { educationHtml: true },
  });

  if (!campaign?.educationHtml) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div
        className="max-w-3xl mx-auto px-6 py-16"
        dangerouslySetInnerHTML={{ __html: campaign.educationHtml }}
      />
    </div>
  );
}
