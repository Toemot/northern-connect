export type Database = {
  public: {
    Tables: {
      organization: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string | null;
          city: string;
          province: string;
          phone: string | null;
          email: string | null;
          website: string | null;
          latitude: number | null;
          longitude: number | null;
          photo_url: string | null;
          registration_status: 'pending' | 'approved' | 'rejected' | 'flagged';
          is_indigenous_org: boolean;
          indigenous_consent_on_file: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organization"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["organization"]["Insert"]>;
      };
      listing: {
        Row: {
          id: string;
          organization_id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          eligibility_notes: string | null;
          languages_served: string[];
          hours: Record<string, unknown> | null;
          photo_url: string | null;
          last_verified_at: string | null;
          verified_by: string | null;
          status: "active" | "inactive" | "draft" | "needs_review";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listing"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["listing"]["Insert"]>;
      };
      category: {
        Row: {
          id: string;
          name: string;
          slug: string;
          layer: "services" | "community_life";
          icon_emoji: string | null;
          display_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["category"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["category"]["Insert"]>;
      };
      event: {
        Row: {
          id: string;
          organization_id: string | null;
          title: string;
          description: string | null;
          start_datetime: string;
          end_datetime: string | null;
          location_name: string | null;
          address: string | null;
          is_free: boolean;
          recurrence: "one_time" | "weekly" | "biweekly" | "monthly" | "annual";
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["event"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["event"]["Insert"]>;
      };
      agency_user: {
        Row: {
          id: string;
          organization_id: string;
          display_name: string;
          role: "admin" | "editor";
        };
        Insert: Omit<Database["public"]["Tables"]["agency_user"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["agency_user"]["Insert"]>;
      };
      indigenous_consent: {
        Row: {
          id: string;
          organization_id: string;
          consent_type: "listing" | "event" | "cultural";
          consenting_authority: string;
          consent_date: string;
          review_date: string | null;
          consent_document_ref: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["indigenous_consent"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["indigenous_consent"]["Insert"]>;
      };
    };
  };
};

// Convenience row types
export type Organization = Database["public"]["Tables"]["organization"]["Row"];
export type Listing = Database["public"]["Tables"]["listing"]["Row"];
export type Category = Database["public"]["Tables"]["category"]["Row"];
export type Event = Database["public"]["Tables"]["event"]["Row"];
export type AgencyUser = Database["public"]["Tables"]["agency_user"]["Row"];
export type IndigenousConsent = Database["public"]["Tables"]["indigenous_consent"]["Row"];

// Listing joined with organization and category (for display)
export type ListingWithDetails = Listing & {
  organization: Pick<Organization, "id" | "name" | "phone" | "email" | "website" | "address" | "city" | "latitude" | "longitude" | "photo_url">;
  category: Pick<Category, "id" | "name" | "slug" | "icon_emoji" | "layer"> | null;
};
