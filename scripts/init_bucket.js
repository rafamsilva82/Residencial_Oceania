import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function setup() {
        console.log("Checking buckets...");
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) {
            console.error("List error:", listError);
            return;
        }

        let plansBucket = buckets.find(b => b.name === 'plans');

        if (!plansBucket) {
            console.log("Creating 'plans' bucket...");
            const { data, error } = await supabase.storage.createBucket('plans', { public: true });
            if (error) {
                console.error("Create error:", error);
            } else {
                console.log("Bucket created:", data);
            }
        } else {
            console.log("Bucket 'plans' already exists.");
        }
    }

    setup();
}
