const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

/**
 * Generates a signed upload URL for client-side uploads
 * @param {string} type - 'audio' or 'image'
 * @param {string} originalFileName - file name with extension (e.g., "song.mp3")
 * @returns {object} { signedUrl, filePath }
 */
const generateSignedUploadUrl = async (type = 'audio', originalFileName = 'upload.mp3') => {
  const bucket = type === 'image' ? 'images' : 'songs';
  const filePath = `${type}/${uuidv4()}-${originalFileName}`;

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUploadUrl(filePath, 300); // Expires in 5 minutes

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    filePath,
  };
};

module.exports = {
  generateSignedUploadUrl,
};
