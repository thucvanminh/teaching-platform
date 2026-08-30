import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private adminClient;
    private anonClient;
    constructor();
    get admin(): SupabaseClient;
    get anon(): SupabaseClient;
}
