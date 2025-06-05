import { useGraphqlMutation } from "./useGraphql";

const useStorage = <T extends "image" | "audio">(type: T) => {
  const { mutate } = useGraphqlMutation();
  const upload = async (file: File) => {
    if (type === "image") {
      return new Promise<string>(async (resolve, reject) => {
        const res = await mutate({
          createImgUploadUrl: {
            result: { id: true, uploadURL: true },
            result_info: true,
            success: true,
            errors: true,
            messages: true,
          },
        });

        const uploadUrl = res.data?.createImgUploadUrl?.result?.uploadURL;

        const form = new FormData();
        form.append("file", file);

        if (uploadUrl) {
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: form,
          }).then((response) => response.json());
          if (response.success) {
            resolve(response.result.id);
          } else {
            reject("Could not upload image...");
          }
        } else {
          reject("Failed to fetch upload url...");
        }
      });
    } else if (type === "audio") {
      // Handle audio type

      return undefined as T extends "audio" ? undefined : never;
    } else {
      throw new Error("Invalid upload type");
    }
  };

  return { upload };
};

export default useStorage;
