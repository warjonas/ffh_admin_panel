import { getSession } from '@auth0/nextjs-auth0';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ pdf: { maxFileSize: '4MB' } })
    .onUploadError(async ({ error }) => {
      console.log('Upload error', error.cause);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete.');

      console.log('file url', file.url);

      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
