import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/container";
import { DottedSeparator } from "@/components/separator";
import { Subheading } from "@/components/subheading";
import { SITE_URL } from "@/lib/site";

const PROJECT_URL = `${SITE_URL}/projects/invobill`;
const LIVE_URL = "https://invobill.xyz";
const DESCRIPTION =
  "InvoBill is a business management platform for Indian SMBs: inventory, GST billing, accounting, attendance, CRM, and financial reporting in one system.";

const modules = [
  {
    title: "Inventory management",
    description:
      "Multi-warehouse stock tracking, low-stock alerts, SKU management, barcode workflows, and real-time inventory valuation.",
  },
  {
    title: "GST billing and invoicing",
    description:
      "GST-compliant invoices with CGST, SGST, IGST calculations, payment tracking, and automated reminders.",
  },
  {
    title: "Accounting and finance",
    description:
      "Double-entry bookkeeping, chart of accounts, trial balance, balance sheet, P&L, cash flow, expenses, GST, and TDS visibility.",
  },
  {
    title: "Team and attendance",
    description:
      "Employee attendance, shifts, leave management, location-aware tracking, and team operations in the same business system.",
  },
  {
    title: "CRM and leads",
    description:
      "Lead tracking, activity logging, pipeline visibility, conversion analytics, and follow-up management for sales teams.",
  },
  {
    title: "Reports and visibility",
    description:
      "Real-time revenue, expenses, net profit, pending invoices, stock alerts, financial statements, and business activity reporting.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute: "InvoBill — GST Billing & Inventory Platform for Indian SMBs",
  },
  description: DESCRIPTION,
  keywords: [
    "InvoBill",
    "inventory billing software India",
    "GST billing software",
    "business management platform India",
    "inventory management software",
    "accounting software for Indian SMBs",
    "CRM and lead management software",
    "attendance management software",
    "GST and TDS compliant billing",
  ],
  alternates: {
    canonical: PROJECT_URL,
  },
  openGraph: {
    title:
      "InvoBill — Inventory, GST Billing & Accounting Platform for Indian SMBs",
    description: DESCRIPTION,
    url: PROJECT_URL,
    type: "website",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "InvoBill — Inventory, GST Billing & Accounting Platform for Indian SMBs",
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

export default function InvoBillProjectPage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${PROJECT_URL}/#software`,
    name: "InvoBill",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: LIVE_URL,
    sameAs: [LIVE_URL],
    description: DESCRIPTION,
    creator: { "@id": `${SITE_URL}/#person` },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description:
        "Live business management platform with a free trial and subscription pricing.",
    },
    featureList: modules.map((module) => module.title),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "InvoBill",
        item: PROJECT_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Container>
        <article className="py-12 md:py-16">
          <Subheading>Live project</Subheading>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            InvoBill — inventory, GST billing, accounting, attendance, and CRM
            for Indian SMBs
          </h1>
          <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-relaxed">
            InvoBill is a live business management platform built for Indian
            businesses that want inventory, invoicing, accounting, team
            attendance, expenses, and lead management in one operational system
            instead of five disconnected tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary rounded-md px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Visit invobill.xyz
            </Link>
            <Link
              href="/agents"
              className="rounded-md border border-neutral-200 px-4 py-2 font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Build with me
            </Link>
          </div>

          <DottedSeparator className="my-12" />

          <section>
            <h2 className="text-foreground text-xl font-semibold">
              What InvoBill does
            </h2>
            <p className="text-foreground/70 mt-3 max-w-2xl leading-relaxed">
              The product is positioned as a complete business suite for Indian
              SMBs: 100% GST and TDS aware, with financial visibility across
              revenue, expenses, net profit, pending payments, and stock
              movement.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <section
                  key={module.title}
                  className="rounded-lg border border-neutral-200/70 p-4 dark:border-neutral-800"
                >
                  <h3 className="text-foreground font-medium">
                    {module.title}
                  </h3>
                  <p className="text-foreground/70 mt-2 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </section>
              ))}
            </div>
          </section>

          <DottedSeparator className="my-12" />

          <section>
            <h2 className="text-foreground text-xl font-semibold">
              Why it matters
            </h2>
            <div className="text-foreground/70 mt-4 space-y-4 leading-relaxed">
              <p>
                Most small businesses in India still run operations across Excel
                sheets, billing tools, WhatsApp follow-ups, attendance trackers,
                and accounting software. InvoBill brings those workflows into a
                single system so owners can see stock, invoices, expenses,
                leads, team activity, and financial reports together.
              </p>
              <p>
                This makes it a practical SaaS product for businesses that need
                GST-compliant billing, inventory control, CRM, team management,
                and complete financial visibility without stitching together a
                custom stack.
              </p>
            </div>
          </section>
        </article>
      </Container>
    </>
  );
}
