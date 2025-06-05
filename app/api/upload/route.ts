import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFiles = [];

    // Handle song files
    const songs = formData.getAll('songs');
    for (const song of songs) {
      if (song instanceof File) {
        const fileExtension = song.name.split('.').pop();
        const key = `songs/${uuidv4()}.${fileExtension}`;
        
        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: key,
          Body: Buffer.from(await song.arrayBuffer()),
          ContentType: song.type,
        }));

        uploadedFiles.push({
          type: 'song',
          url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`,
          key,
        });
      }
    }

    // Handle artwork file
    const artwork = formData.get('artwork');
    if (artwork instanceof File) {
      const fileExtension = artwork.name.split('.').pop();
      const key = `artwork/${uuidv4()}.${fileExtension}`;
      
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
        Key: key,
        Body: Buffer.from(await artwork.arrayBuffer()),
        ContentType: artwork.type,
      }));

      uploadedFiles.push({
        type: 'artwork',
        url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`,
        key,
      });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}