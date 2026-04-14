import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FakeLoginForm from "@/components/phishing/FakeLoginForm";

export default async function FakeLoginPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const target = await prisma.campaignTarget.findUnique({
    where: { token },
  });

  if (!target) {
    notFound();
  }

  return <FakeLoginForm token={token} />;
}
