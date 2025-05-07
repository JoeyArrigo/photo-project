import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.API_EXTERNAL_URL;
const supabaseKey = process.env.ANON_KEY;


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface PhotoRecord {
  id?: string;
  file_name: string;
  description: string;
  file_path?: string;
}

/**
 * Store a photo description in the database
 */
export async function storePhotoDescription(
  fileName: string, 
  description: string,
  filePath?: string
): Promise<PhotoRecord> {
  const photoData: PhotoRecord = {
    file_name: fileName,
    description: description,
    file_path: filePath
  };

  console.log('photoData', photoData)

  const { data, error } = await supabase
    .from('photos')
    .insert(photoData)
    .select()
    .single();

  if (error) {
    console.error('Error storing photo description:', error);
    throw new Error('Failed to store photo description');
  }

  return data;
}

/**
 * Get all photo descriptions
 */
export async function getAllPhotoDescriptions(): Promise<PhotoRecord[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*');

  console.log('data', data)

  if (error) {
    console.error('Error fetching photo descriptions:', error);
    throw new Error('Failed to fetch photo descriptions');
  }

  return data || [];
}

/**
 * Get a specific photo description by ID
 */
export async function getPhotoDescription(id: string): Promise<PhotoRecord | null> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching photo description:', error);
    throw new Error('Failed to fetch photo description');
  }

  return data;
}
