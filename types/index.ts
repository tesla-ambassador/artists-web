export interface Release {
  id: string;
  title: string;
  language: string;
  genre: string;
  secondaryGenre?: string;
  description: string;
  features?: string;
  releaseType: string;
  version?: string;
  label?: string;
  referenceNo?: string;
  upc?: string;
  releaseDate: Date;
  digitalReleaseDate: Date;
  licenseType: string;
  publishingRegions: string;
  budget: string;
  artworkUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  songs: Song[];
  artistRoles: ArtistRole[];
  legalOwners: LegalOwner[];
  distributionPlatforms: DistributionPlatform[];
}

export interface Song {
  id: string;
  title: string;
  fileUrl: string;
  duration?: number;
  fileSize?: number;
  mimeType?: string;
  releaseId: string;
  createdAt: Date;
}

export interface ArtistRole {
  id: string;
  artistRole: string;
  artistRoleName: string;
  releaseId: string;
}

export interface LegalOwner {
  id: string;
  type: "owner" | "release";
  name: string;
  year: string;
  releaseId: string;
}

export interface DistributionPlatform {
  id: string;
  platform: string;
  releaseId: string;
}

export interface FileUploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
}
