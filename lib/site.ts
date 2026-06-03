/** Canonical production hostname and URL (no trailing slash). */
export const SITE_HOST = "iamamitkumar.dev" as const;
export const SITE_URL = `https://${SITE_HOST}` as const;

/** Where prospects can book a 20-minute discovery call. */
export const AGENTS_DISCOVERY_CALL_URL =
  "https://cal.com/growthperclick/discovery-call" as const;

/** Public URL for the agent OS playbook. Leave empty until published —
 *  the Proof section hides the "Read the full playbook" link automatically
 *  when this is empty. */
export const AGENTS_PLAYBOOK_URL = "" as const;

export const AGENTS_CONTACT_EMAIL = "hi@iamamitkumar.dev" as const;

export const X_URL = "https://x.com/growthperclick" as const;
export const SUBSTACK_URL = "https://substack.com/@growthperclick" as const;
export const SUBSTACK_SUBSCRIBE_URL =
  "https://substack.com/@growthperclick?utm_source=iamamitkumar.dev&utm_medium=blog&utm_campaign=substack_subscribe" as const;
export const MEDIUM_URL = "https://medium.com/@dev.amitkumar" as const;
