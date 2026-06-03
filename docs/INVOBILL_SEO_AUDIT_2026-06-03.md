# InvoBill SEO notes

**Date:** 2026-06-03  
**Live site:** `https://invobill.xyz`  
**Portfolio project page added:** `https://iamamitkumar.dev/projects/invobill`

---

## Current positioning observed

InvoBill is positioned as:

> India's most complete business platform for inventory, billing, accounting, team management, leads, GST/TDS compliance, and financial visibility.

Strong keyword themes already present on the live page:

- inventory management
- billing and invoicing
- GST-compliant invoices
- accounting and finance
- team attendance
- lead management / CRM
- expense management
- Indian SMBs
- GST and TDS compliance
- financial reports

---

## Issues observed on the live InvoBill site

### 1. `/sitemap.xml` returns 404

Observed response:

```txt
https://invobill.xyz/sitemap.xml → 404 Not Found
```

This should be fixed in the InvoBill app/repo. Add a real sitemap that includes at least:

- `/`
- `/pricing` if it exists
- `/features` if it exists
- `/docs` or documentation pages if public
- blog/use-case pages when added

### 2. No canonical tag observed in fetched homepage HTML

The fetched homepage metadata included title and description, but no canonical link was observed.

Recommended:

```html
<link rel="canonical" href="https://invobill.xyz" />
```

### 3. Homepage title is okay but can be sharper

Observed title:

```txt
Inventory & Billing Management
```

Recommended title:

```txt
InvoBill — GST Billing, Inventory & Accounting Software for Indian SMBs
```

### 4. Homepage meta description can be more keyword-specific

Observed description:

```txt
Complete multitenancy inventory, billing, attendance, and lead management system
```

Recommended description:

```txt
InvoBill is GST billing, inventory, accounting, attendance, CRM, lead management, and expense software for Indian SMBs with complete financial visibility.
```

### 5. Add structured data on `invobill.xyz`

Recommended schema types:

- `SoftwareApplication`
- `Organization`
- `FAQPage`
- `BreadcrumbList`

Minimum `SoftwareApplication` fields:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "InvoBill",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://invobill.xyz",
  "description": "GST billing, inventory, accounting, attendance, CRM, and lead management software for Indian SMBs.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR"
  }
}
```

### 6. Add landing pages for high-intent searches

The homepage is broad. To rank, InvoBill should add focused pages for:

- `/gst-billing-software`
- `/inventory-management-software`
- `/accounting-software-for-indian-businesses`
- `/crm-lead-management-software`
- `/attendance-management-software`
- `/expense-management-software`
- `/billing-software-for-smbs-india`

Each page should target one primary query and internally link back to the homepage/pricing.

---

## What was added on `iamamitkumar.dev`

To support discoverability from Amit Kumar's portfolio, the portfolio now includes:

- A live project card for InvoBill on the homepage.
- A dedicated SEO project page at `/projects/invobill`.
- `SoftwareApplication` structured data for InvoBill.
- Sitemap inclusion for `/projects/invobill`.
- Internal and external links to `https://invobill.xyz`.

This creates a crawlable branded backlink and project/entity page for InvoBill from the portfolio site.
