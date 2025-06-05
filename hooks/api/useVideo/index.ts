import { useGraphqlQuery } from "@/hooks/useGraphql";
import { Upload, UploadOptions } from "tus-js-client";

const useVideo = () => {
  const { refetch } = useGraphqlQuery(
    {
      getVideoUploadUrl: [{ bytes: 0 }, { uploadUrl: true, streamId: true }],
    },
    { fetchOnMount: false },
  );

  const upload = async (file: File, options?: UploadOptions) => {
    const streamId = await new Promise<string | undefined>(
      async (resolve, reject) => {
        const result = await refetch({
          getVideoUploadUrl: [
            { bytes: file.size },
            { uploadUrl: true, streamId: true },
          ],
        });
        const uploadUrl = result?.getVideoUploadUrl?.uploadUrl;

        if (!uploadUrl) throw new Error("Upload URL not found");

        const uploadInstance = new Upload(file, {
          ...options,
          uploadUrl,
          onSuccess: () => {
            options?.onSuccess?.();
            resolve(result?.getVideoUploadUrl?.streamId);
          },
        });
        uploadInstance.start();
      },
    );

    return streamId;
  };

  return {
    upload,
  };
};

export default useVideo;
