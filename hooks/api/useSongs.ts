import { useAppSelector } from "@/hooks";
import { useGraphqlQuery } from "@/hooks/useGraphql";
import { GraphQLTypes } from "@/zeus";

type Fields = (keyof GraphQLTypes["SongOutput"])[];

const useSongs = (fields: Fields) => {
  const user = useAppSelector((state) => state.auth.details);

  if (user) {
    const selectFields: Record<string, boolean> = { id: true };

    fields?.forEach((field) => {
      selectFields[field] = true;
    });

    const {
      data,
      isLoading,
      refetch,
      error: error_,
    } = useGraphqlQuery({
      getSongsByArtist: [
        { input: { artistId: user?.username, pageSize: 1000 } },
        {
          songs: selectFields,
        },
      ],
    });
    return {
      data,
      songs: data.getSongsByArtist?.songs,
      isLoading,
      refetch,
      error: error_,
    };
  } else {
    return {
      error: new Error("User not authenticated or found!"),
      isLoading: false,
    };
  }
};

export default useSongs;
