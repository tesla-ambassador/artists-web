import { useAppSelector } from "@/hooks";
import { useGraphqlMutation, useGraphqlQuery } from "@/hooks/useGraphql";
import { ValueTypes } from "@/zeus";

export const useRelease = () => {
  const { mutate, data, error, isLoading } = useGraphqlMutation();
  const userDetails = useAppSelector((state) => state.auth.details);
  const {
    data: { getReleasesByArtist },
  } = useGraphqlQuery({
    getReleasesByArtist: [
      { input: { artistId: userDetails?.username || "" } },
      { releases: { id: true, title: true } },
    ],
  });

  const addRelease = async ({
    songs,
    ...input
  }: ValueTypes["ReleaseInput"] & { songs: { id: string }[] }) => {
    const response = await mutate({ putRelease: [{ input }, { id: true }] });

    if (!response.data?.putRelease) throw new Error("Failed to add release!");

    await mutate({
      addSongToRelease: [
        {
          songIds: songs.map((song) => song.id),
          releaseId: response.data.putRelease.id!,
        },
        { success: true },
      ],
    });

    return response.data?.putRelease;
  };

  const editRelease = async (
    id: string,
    {
      songs,
      ...input
    }: ValueTypes["ReleaseInput"] & { songs: { id: string }[] },
    originalSongs?: { id: string }[],
  ) => {
    const response = await mutate({
      updateRelease: [{ input: { id, ...input } }, { id: true }],
    });

    if (!response.data?.updateRelease)
      throw new Error("Failed to add release!");

    await mutate({
      deleteSongFromRelease: [
        { releaseId: id, songIds: originalSongs?.map((song) => song.id) },
        { success: true },
      ],
    });
    await mutate({
      addSongToRelease: [
        { songIds: songs.map((song) => song.id), releaseId: id },
        { success: true },
      ],
    });

    return response.data?.updateRelease;
  };

  return {
    add: { data, error, isLoading },
    releases: getReleasesByArtist?.releases,
    addRelease,
    editRelease,
    isLoading,
  };
};
