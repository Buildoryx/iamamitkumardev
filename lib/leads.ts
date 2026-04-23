import { getSupabaseAdmin } from "./supabase";

export async function listContactInquiries(limit = 50) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching contact inquiries:", error);
    return [];
  }
  return data || [];
}

export async function listNewsletterSubscribers(limit = 50) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
  return data || [];
}
