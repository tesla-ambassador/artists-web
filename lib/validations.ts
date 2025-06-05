import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  genre: z.string().min(1, "Genre is required"),
  secondaryGenre: z.string().optional(),
  songs: z.array(z.instanceof(File)).min(1, "At least one song is required"),
  art: z.instanceof(File).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.string().optional(),
  releaseType: z.string().min(1, "Release type is required"),
  version: z.string().optional(),
  Roles: z
    .array(
      z.object({
        artistRole: z.string().min(1, "Artist role is required"),
        artistRoleName: z.string().min(1, "Artist name is required"),
      }),
    )
    .min(1, "At least one artist role is required"),
  lable: z.string().optional(),
  referenceNo: z.string().optional(),
  upc: z.string().optional(),
  releaseDate: z.date({
    required_error: "Release date is required",
  }),
  digitalReleaseDate: z.date({
    required_error: "Digital release date is required",
  }),
  licenseType: z.string().min(1, "License type is required"),
  legalOwner: z.object({
    legalOwnerName: z.string().min(1, "Legal owner name is required"),
    legalOwnerYear: z.string().min(4, "Valid year is required"),
  }),
  legalOwnerRelease: z.object({
    legalOwnerReleaseName: z
      .string()
      .min(1, "Legal owner release name is required"),
    legalOwnerReleaseYear: z.string().min(4, "Valid year is required"),
  }),
  publishingRegions: z.string().min(1, "Publishing regions are required"),
  budget: z.string().min(1, "Budget is required"),
  distributionPlatform: z
    .array(z.string())
    .min(1, "At least one distribution platform is required"),
});

export type FormSchema = z.infer<typeof formSchema>;
