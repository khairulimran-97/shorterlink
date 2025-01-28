export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id: string;
          original_url: string;
          short_id: string;
          created_at: string;
          clicks: number;
        };
        Insert: {
          id?: string;
          original_url: string;
          short_id: string;
          created_at?: string;
          clicks?: number;
        };
        Update: {
          id?: string;
          original_url?: string;
          short_id?: string;
          created_at?: string;
          clicks?: number;
        };
      };
      whatsapp_groups: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      whatsapp_numbers: {
        Row: {
          id: string;
          group_id: string;
          phone_number: string;
          country_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          phone_number: string;
          country_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          phone_number?: string;
          country_code?: string;
          created_at?: string;
        };
      };
    };
  };
}
