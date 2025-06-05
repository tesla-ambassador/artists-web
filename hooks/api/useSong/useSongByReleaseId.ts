import { useAppSelector } from "@/hooks";
import { useGraphqlQuery } from "@/hooks/useGraphql";
import { ValueTypes } from "@/zeus";

const Picks: ValueTypes["PaginatedSongsOutput"] = {
  songs: {
    id: true,
    title: true,
    artists: {
      name: true,
      ownership: true,
      role: true,
    },
    audio_path: true,
    available_separately: true,
    duration: true,
    explicit_lyrics: true,
    is_instrumental: true,
    isrc_code: true,
    iswc_code: true,
    language_of_the_lyrics: true,
    legal_owner_of_release: {
      name: true,
      year: true,
    },
    licence_type: true,
    lyrics: true,
    new_isrc_code: true,
    notes: true,
    secondary_genre: true,
    primary_genre: true,
    remix_or_version: true,
  },
};

export const useSongByReleaseId = (id?: string) => {
  const user = useAppSelector((user) => user.auth.details);
  const { data, error, isLoading, refetch } = useGraphqlQuery(
    { getSongsOfRelease: [{ releaseId: "", artistId: "" }, Picks] },
    { fetchOnMount: false },
  );

  const get = (_id?: string) => {
    if (!id && !_id) throw new Error("ID is required!");

    if (!user?.id) throw new Error("User not authenticated or found!");

    refetch({
      getSongsOfRelease: [
        { releaseId: (_id || id)!, artistId: user.username },
        Picks,
      ],
    });
  };

  return {
    data: data?.getSongsOfRelease?.songs as ValueTypes["SongOutput"][],
    error,
    isLoading,
    refetch,
    get,
  };
};
