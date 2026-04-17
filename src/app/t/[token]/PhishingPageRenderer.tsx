"use client";

import { getPhishingComponent } from "@/components/phishing";
import { usePhishingSubmit } from "@/components/phishing/usePhishingSubmit";

interface Props {
  token: string;
  slug: string;
  builtIn: boolean;
  htmlBody: string | null;
}

export default function PhishingPageRenderer({ token, slug, builtIn, htmlBody }: Props) {
  // Built-in template: render the corresponding React component
  if (builtIn) {
    const Component = getPhishingComponent(slug);
    if (Component) {
      return <Component token={token} />;
    }
  }

  // Custom HTML template (future feature)
  if (htmlBody) {
    return <CustomHtmlPhishing token={token} htmlBody={htmlBody} />;
  }

  // Fallback to Microsoft
  const Fallback = getPhishingComponent("microsoft")!;
  return <Fallback token={token} />;
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
