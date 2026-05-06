import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials in environment.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const artifactsDir = "C:\\Users\\rafam\\.gemini\\antigravity\\brain\\ba855a05-5c93-4546-8a88-6614a17d28f8";
const files = [
    // CORRECTED MAPPING FOR 1-5:
    { file: 'media__1777951817861.png', col: 2 },
    { file: 'media__1777951817711.png', col: 3 },
    { file: 'media__1777951817751.png', col: 1 },
    { file: 'media__1777951817937.png', col: 5 },
    { file: 'media__1777951817896.png', col: 4 },

    // NEW MAPPING FOR 6-10:
    { file: 'media__1777952694920.png', col: 6 },
    { file: 'media__1777952694954.png', col: 7 },
    { file: 'media__1777952695010.png', col: 8 },
    { file: 'media__1777952695099.png', col: 9 },
    { file: 'media__1777952695133.png', col: 10 },
];

async function seed() {
    console.log("Starting seed...");

    for (const { file, col } of files) {
        const filePath = path.join(artifactsDir, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        const fileExt = file.split('.').pop();
        const fileName = `planta_coluna_${col}.${fileExt}`;
        const fileBuffer = fs.readFileSync(filePath);

        // 1. Upload to storage
        console.log(`Uploading ${fileName}...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('plans')
            .upload(fileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error(`Error uploading ${fileName}:`, uploadError.message);
            continue;
        }

        // 2. Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('plans')
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;
        console.log(`Uploaded to: ${publicUrl}`);

        // 3. Upsert into humanized_plans
        const { error: dbError } = await supabase
            .from('humanized_plans')
            .upsert({
                column_number: col,
                image_url: publicUrl,
            }, { onConflict: 'column_number' });

        if (dbError) {
            console.error(`Error saving db record for Col ${col}:`, dbError.message);
        } else {
            console.log(`Record saved for Column ${col}`);
        }
    }
}

seed().catch(console.error);
