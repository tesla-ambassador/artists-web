import { useGraphqlQuery } from "@/hooks/useGraphql";
import { ValueTypes } from "@/zeus";

const Picks: ValueTypes["ReleaseOutput"] = {
  id: true,
  title: true,
  release_info: {
    artists: {
      name: true,
      ownership: true,
      role: true,
    },
    cover_art: true,
    identity: {
      upc: true,
      reference_number: true,
      request_ref_no: true,
      request_upc: true,
    },
    label: true,
    primary_genre: true,
    release_description: true,
    release_type: true,
    secondary_genre: true,
    title_language: true,
    version: true,
  },
  licence: {
    digital_release_date: true,
    excluded_territories: true,
    legal_owner_of_release: {
      name: true,
      year: true,
    },
    legal_owner_of_work: {
      name: true,
      year: true,
    },
    licence_type: true,
    original_release_date: true,
    price_category: true,
  },

  status: true,
  distribution_platforms: true,
};

export const useReleaseById = (releaseId: string) => {
  // TODO: add pick option functionality
  const { data, error, isLoading, refetch } = useGraphqlQuery({
    getReleaseById: [{ releaseId: releaseId }, Picks],
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};
