"use client";

import { useState, useEffect, use, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Save, Trash2, Settings2 } from "lucide-react";
import Link from "next/link";
import Container from "@/components/container";
import { Subheading } from "@/components/subheading";
import { DottedSeparator } from "@/components/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast-container";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { csrfFetch } from "@/lib/csrf-client";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { session } = useAuth();
  const { toasts, addToast, dismiss } = useToast();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">(
    "split",
  );
  const initialValuesRef = useRef<string>("");

  useEffect(() => {
    if (id && session) {
      fetch(`/api/admin/posts/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setExcerpt(data.excerpt || "");
            setContent(data.content || "");
            setStatus(data.status || "draft");
            setCoverImage(data.coverImage || "");
            setMetaTitle(data.metaTitle || "");
            setMetaDescription(data.metaDescription || "");
            if (data.tags) {
              try {
                const parsed = JSON.parse(data.tags);
                setTags(Array.isArray(parsed) ? parsed.join(", ") : data.tags);
              } catch {
                setTags(data.tags);
              }
            }
            initialValuesRef.current = JSON.stringify({
              title: data.title,
              slug: data.slug,
              content: data.content,
              excerpt: data.excerpt,
            });
          }
          setInitialFetchDone(true);
        })
        .catch(() => setInitialFetchDone(true));
    }
  }, [id, session]);

  useEffect(() => {
    if (!initialFetchDone) return;
    const current = JSON.stringify({ title, slug, content, excerpt });
    setIsDirty(current !== initialValuesRef.current);
  }, [title, slug, content, excerpt, initialFetchDone]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty || !initialFetchDone) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          `editor-draft-${id}`,
          JSON.stringify({
            title,
            slug,
            excerpt,
            content,
            status,
            tags,
            coverImage,
            metaTitle,
            metaDescription,
          }),
        );
      } catch (e) {
        console.error("Autosave failed:", e);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    excerpt,
    content,
    status,
    tags,
    coverImage,
    metaTitle,
    metaDescription,
    isDirty,
    initialFetchDone,
    id,
  ]);

  if (!session) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await csrfFetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status,
          tags: tags
            ? tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          coverImage: coverImage || undefined,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
        }),
      });
      if (res.ok) {
        localStorage.removeItem(`editor-draft-${id}`);
        setIsDirty(false);
        initialValuesRef.current = JSON.stringify({
          title,
          slug,
          content,
          excerpt,
        });
        addToast("Post updated", "success");
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to update", "error");
      }
    } catch {
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    setIsDeleting(true);
    try {
      const res = await csrfFetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        localStorage.removeItem(`editor-draft-${id}`);
        addToast("Post deleted", "success");
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 500);
      } else {
        addToast("Failed to delete", "error");
      }
    } catch {
      addToast("Network error", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!initialFetchDone)
    return (
      <Container className="pt-4">
        <p className="text-foreground/40 font-mono text-xs tracking-widest uppercase">
          Loading...
        </p>
      </Container>
    );

  return (
    <Container className="pt-4 pb-24">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="flex items-start justify-between">
        <div>
          <Subheading>Edit post</Subheading>
          <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <p className="text-foreground font-medium">{title || "Untitled"}</p>
            {isDirty && (
              <>
                <div className="hidden size-1 rounded-full bg-amber-400 md:block" />
                <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                  Unsaved
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMeta(!showMeta)}
            className={`font-mono text-[10px] tracking-widest uppercase transition-colors ${
              showMeta
                ? "text-foreground"
                : "text-foreground/40 hover:text-foreground"
            }`}
          >
            <Settings2 className="mr-1 inline h-3 w-3" />
            SEO
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="font-mono text-[10px] tracking-widest text-red-500/70 uppercase transition-colors hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="mr-1 inline h-3 w-3" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title || !slug || !content}
            className="bg-foreground text-background cursor-pointer px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            <Save className="mr-1.5 inline h-3 w-3" />
            {loading
              ? "Saving..."
              : status === "published"
                ? "Update"
                : "Save draft"}
          </button>
        </div>
      </div>

      <DottedSeparator className="my-4" />

      {showMeta && (
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/40 font-mono text-xs tracking-wide uppercase">
              Meta title (max 70)
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={70}
              className="bg-card/30 border-border text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-primary w-full border px-3 py-2 text-sm transition-colors focus:ring-1 focus:outline-none"
              placeholder="Custom SEO title..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/40 font-mono text-xs tracking-wide uppercase">
              Cover image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="bg-card/30 border-border text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-primary w-full border px-3 py-2 text-sm transition-colors focus:ring-1 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/40 font-mono text-xs tracking-wide uppercase">
              Meta description (max 160)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              className="bg-card/30 border-border text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-primary h-16 w-full resize-none border px-3 py-2 text-sm transition-colors focus:ring-1 focus:outline-none"
              placeholder="Custom SEO description..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/40 font-mono text-xs tracking-wide uppercase">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-card/30 border-border text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-primary w-full border px-3 py-2 text-sm transition-colors focus:ring-1 focus:outline-none"
              placeholder="ai-agents, saas, next.js"
            />
          </div>
          <DottedSeparator className="my-2" />
        </div>
      )}

      <div className="grid h-[calc(100vh-14rem)] grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-full flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              className="bg-card/30 border-border text-foreground border px-2 py-1 text-xs focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="border-border flex items-center overflow-hidden border">
              {(["write", "split", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs transition-colors ${
                    viewMode === mode
                      ? "bg-foreground text-background"
                      : "text-foreground/40 hover:text-foreground"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-foreground placeholder:text-foreground/30 w-full border-none bg-transparent text-2xl font-bold focus:outline-none"
          />
          <input
            type="text"
            placeholder="slug-url-identifier"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="text-foreground/40 placeholder:text-foreground/20 w-full border-none bg-transparent font-mono text-[10px] tracking-widest uppercase focus:outline-none"
          />
          <textarea
            placeholder="Brief excerpt (optional)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="bg-card/30 border-border text-foreground placeholder:text-foreground/30 focus:border-primary focus:ring-primary h-20 w-full resize-none border p-3 text-sm transition-colors focus:ring-1 focus:outline-none"
          />
          {(viewMode === "write" || viewMode === "split") && (
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your content here..."
            />
          )}
        </div>

        {(viewMode === "preview" || viewMode === "split") && (
          <div className="border-border relative hidden h-full flex-col overflow-hidden border lg:flex">
            <div className="border-border flex items-center justify-between border-b p-3">
              <span className="text-foreground/40 font-mono text-[10px] tracking-widest uppercase">
                Preview
              </span>
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-p:text-muted-foreground prose-code:font-mono prose-img:rounded-lg max-w-none">
                <h2>{title || "Untitled"}</h2>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
