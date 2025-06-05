import {
  ExplicitLyrics,
  GraphQLTypes,
  LicenceType,
  PriceCategory,
  Role,
  ValueTypes,
} from "@/zeus";
import { ReleaseType } from "@/zeus";

export interface LoginProps {
  username: string;
  password: string;
}

export interface RegisterProps extends LoginProps {
  name: string;
  email: string;
  country_code: { label: string; value: string };
  phone: string;
  tnc: boolean;
}

export interface SonoRegiststationProps {
  email: string;
  phone_number: string;
  artiste_usernames: string;
  picture: string;
  country: string;
}

export interface UploadDetailsProps {
  title: string;
  sub_title: string;
  audio_path?: string;
  primary_genre: { label: string; value: string };
  secondary_genre: { label: string; value: string };
  albums: Array<{ label: string; value: GraphQLTypes["AlbumOutput"] }>;
  label: string;
  is_instrumental?: boolean;
  lyrics: string;
  lyrics_transcriptions?: string;
  language_of_the_lyrics: { label: string; value: string };
  secondary_language_of_the_lyrics: { label: string; value: string };
  album_art: string;
  start_point_time: number;
  explicit_lyrics: ExplicitLyrics;
  phonogram_owner: string;
  isrc_code: string;
  iswc_code: string;
  qc_status: string;
  remix_type: string;
  release_type: { label: string; value: ReleaseType };
  notes: string;
  duration: number;
  licence_type: LicenceType;
  price_category: PriceCategory;
}

type collaborators = {
  [key in `collaborators[${number}]`]: string;
};

export interface UploadCollaboratorsProps extends collaborators {
  management_group: string;
  copyright_of_artwork: ValueTypes["ArtworkCopyrightOutput"];
  legal_owner_of_release: ValueTypes["ReleaseOwnerOutput"];
  artists: Array<{
    name: string;
    ownership: number;
    role: { label: string; value: Role; message?: String };
  }>;
}

export interface UploadPublishProps {
  digital_release_date: string;
  original_release_date: string;
  publishing_id: string;
  publisher: { label: string; value: string };
  available_separately: boolean;
}

export type SongUploadForm = UploadDetailsProps &
  UploadCollaboratorsProps &
  UploadPublishProps;

export interface AlbumInputProps {
  release_date: string;
  song?: { id: boolean };
  songs: GraphQLTypes["SongInput"][] | string[];
  title: string;
}

export interface UserProfileFormProps {
  name: string;
  bio: string;
  picture?: string;
  phone_number: string;
  phone_number_verified?: string;
  email: string;
  email_verified?: string;
  address?: string;
  based_region?: string;
  based_country?: string;
  locale?: { label: string; value: string };
  website?: string;
  timezone?: { label: string; value: string };
  updated_at?: string;
  is_artist?: string;
  country?: { label: string; value: string };
  country_code: { label: string; value: string };
  email_alerts?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  role?: Array<{ label: string; value: Role }>;
  influencers?: Array<{ label: string; value: string }>;
  genre?: Array<{ label: string; value: string }>;
}

export interface UserPasswordChange {
  current_password: string;
  new_password: string;
  confirm_password: string;
  isLogout: boolean;
}
