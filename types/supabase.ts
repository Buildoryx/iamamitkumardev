export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      post: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          coverImage: string | null;
          status: string;
          tags: string | null;
          metaTitle: string | null;
          metaDescription: string | null;
          authorId: string;
          publishedAt: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          coverImage?: string | null;
          status?: string;
          tags?: string | null;
          metaTitle?: string | null;
          metaDescription?: string | null;
          authorId: string;
          publishedAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          coverImage?: string | null;
          status?: string;
          tags?: string | null;
          metaTitle?: string | null;
          metaDescription?: string | null;
          authorId?: string;
          publishedAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: number;
          email: string;
          source: string | null;
          ip: string | null;
          user_agent: string | null;
          is_active: boolean;
          subscribed_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          email: string;
          source?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          email?: string;
          source?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          id: number;
          name: string;
          email: string;
          subject: string;
          message: string;
          source: string | null;
          ip: string | null;
          userAgent: string | null;
          createdAt: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          source?: string | null;
          ip?: string | null;
          userAgent?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          source?: string | null;
          ip?: string | null;
          userAgent?: string | null;
          createdAt?: string;
        };
        Relationships: [];
      };
      agent_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          role: "founder" | "operator" | "engineer" | "other" | null;
          agent_type:
            | "personal"
            | "business_intelligence"
            | "ops_workflow"
            | "not_sure";
          description: string;
          stage: "idea" | "prototyping" | "in_production";
          timeline: "this_month" | "one_to_two_months" | "exploring";
          referral: string | null;
          source: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          ip: string | null;
          user_agent: string | null;
          status: "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string | null;
          role?: "founder" | "operator" | "engineer" | "other" | null;
          agent_type:
            | "personal"
            | "business_intelligence"
            | "ops_workflow"
            | "not_sure";
          description: string;
          stage: "idea" | "prototyping" | "in_production";
          timeline: "this_month" | "one_to_two_months" | "exploring";
          referral?: string | null;
          source?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          status?: "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string | null;
          role?: "founder" | "operator" | "engineer" | "other" | null;
          agent_type?:
            | "personal"
            | "business_intelligence"
            | "ops_workflow"
            | "not_sure";
          description?: string;
          stage?: "idea" | "prototyping" | "in_production";
          timeline?: "this_month" | "one_to_two_months" | "exploring";
          referral?: string | null;
          source?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ip?: string | null;
          user_agent?: string | null;
          status?: "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
