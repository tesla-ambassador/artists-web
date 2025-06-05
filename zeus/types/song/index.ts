import { ExplicitLyrics, LicenceType, PriceCategory, ReleaseType } from './enums';
import type { ExpandTypes } from "../helpers/expand-types"
import { Collaborator, CopyrightOfArtwork, Nullable, legalOwnerOfRelease } from './extras';

type RequiredSongInput = {
  title: string,
  genre: string,
  language_of_the_lyrics: string,
  explicit_lyrics: ExplicitLyrics,
  collaborators: Collaborator[],
  unavailable_countries: []
  publishing_id: string,
  publisher: string,
  territories: [],
  digital_release_date: string,
  original_release_date: string,
  albums: Album[],
  licence_type: LicenceType,
  price_category: PriceCategory,
  total_albums: number,
}

type OptionalSongInput = {
  audio_path: string,
  sub_title: string,
  duration: number,
  lyrics: string,
  copyright_of_artwork: CopyrightOfArtwork,
  legal_owner_of_release: legalOwnerOfRelease,
  album_art: string,
  management_group: string,
  label: string,
  secondary_genre: string,
  remix_or_version: string,
  available_separately: true,
  start_point_time: number,
  owner_of_the_phonogram: string,
  isrc_code: string,
  iswc_code: string,
  release_type: ReleaseType,
}

export type SongInput = ExpandTypes<RequiredSongInput & Nullable<OptionalSongInput>>
export * from './enums'
export * from './extras'