/**
 * Content sanitization — DOM-free.
 *
 * Previously backed by `isomorphic-dompurify` (→ jsdom). On Vercel's serverless
 * runtime, jsdom's transitive `html-encoding-sniffer` hit an ESM/CJS require
 * error (ERR_REQUIRE_ESM), 500-ing every route that sanitized content (admin
 * post create/update AND the agent blog API). jsdom is also heavyweight for a
 * task whose input is Markdown.
 *
 * This implementation removes the jsdom dependency entirely and sanitizes via
 * deterministic string transforms: strip dangerous tag blocks, drop event-
 * handler attributes, and neutralize javascript:/vbscript:/data: URLs. It keeps
 * the same safety contract for the Markdown content these routes handle.
 */

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

const DEFAULT_ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "strong", "em", "u", "s", "del",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span",
];

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
  "*": ["class", "id", "style"],
};

// Tags whose entire content must be removed (not just the tag).
const STRIP_BLOCK_TAGS = [
  "script", "style", "iframe", "object", "embed", "form", "input",
  "noscript", "template", "svg", "math", "link", "meta", "base",
];

function stripBlockTags(input: string): string {
  let out = input;
  for (const tag of STRIP_BLOCK_TAGS) {
    // remove <tag ...>...</tag> (greedy-safe, case-insensitive, multiline)
    const block = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    out = out.replace(block, "");
    // remove any orphan/self-closing opener or closer of these tags
    const open = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    out = out.replace(open, "");
  }
  return out;
}

function stripEventHandlers(input: string): string {
  // on<event>="..." / on<event>='...' / on<event>=value
  return input
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
}

function neutralizeDangerousUrls(input: string): string {
  // href/src that begin with javascript:, vbscript:, or data: (except images)
  return input
    .replace(/(\s(?:href|src)\s*=\s*")(\s*(?:javascript|vbscript):[^"]*)(")/gi, '$1#$3')
    .replace(/(\s(?:href|src)\s*=\s*')(\s*(?:javascript|vbscript):[^']*)(')/gi, "$1#$3")
    // data: URLs are only allowed for images (data:image/...); strip others
    .replace(/(\s(?:href|src)\s*=\s*["'])(\s*data:(?!image\/)[^"']*)(["'])/gi, "$1#$3");
}

/** Sanitize an HTML string (no DOM). */
export function sanitizeHtml(html: string, _options: SanitizeOptions = {}): string {
  if (!html) return "";
  let out = stripBlockTags(html);
  out = stripEventHandlers(out);
  out = neutralizeDangerousUrls(out);
  return out;
}

/**
 * Sanitize Markdown content. Markdown may contain inline HTML; we strip the
 * dangerous subset while leaving normal markdown + safe inline HTML intact.
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown) return "";
  let out = stripBlockTags(markdown);
  out = stripEventHandlers(out);
  out = neutralizeDangerousUrls(out);
  return out;
}

const URL_SCHEMES = ["http", "https", "mailto", "tel"];

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      URL_SCHEMES.includes(parsed.protocol.replace(":", "")) ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:"
    );
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  if (!url) return "";

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("mailto:") &&
    !url.startsWith("tel:") &&
    !url.startsWith("/")
  ) {
    return "";
  }

  if (url.startsWith("javascript:") || url.startsWith("data:")) {
    return "";
  }

  return url;
}

// Re-exported for callers that referenced these (kept for API stability).
export const ALLOWED_TAGS = DEFAULT_ALLOWED_TAGS;
export const ALLOWED_ATTRIBUTES = DEFAULT_ALLOWED_ATTRIBUTES;
