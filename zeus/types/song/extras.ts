import type { CollaboratorRole } from "./enums";

export type CopyrightOfArtwork = {
  name: string;
  year: number;
};

export type legalOwnerOfRelease = {
  name: string;
  year: number;
}

export type Collaborator = {
  name: string;
  role: CollaboratorRole;
  ownership: number;
}


export type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

export default {};