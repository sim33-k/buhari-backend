import { createClient, SupabaseClient } from "@supabase/supabase-js";

class SupabaseDatabase {
    private static instance: SupabaseDatabase;
    public client: SupabaseClient;

    private constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in environment variables");
        }

        this.client = createClient(supabaseUrl, supabaseKey);
    }

    public static getInstance(): SupabaseDatabase {
        if (SupabaseDatabase.instance == null) {
            SupabaseDatabase.instance = new SupabaseDatabase();
        }

        return SupabaseDatabase.instance;
    }
}

export const supabase = SupabaseDatabase.getInstance().client;
