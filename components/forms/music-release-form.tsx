"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Define the form schema using Zod
const formSchema = z.object({
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

type FormSchema = z.infer<typeof formSchema>;

// GraphQL Mutation
const CREATE_RELEASE = gql`
  mutation CreateRelease($input: CreateReleaseInput!) {
    createRelease(input: $input) {
      id
      title
      language
      genre
      secondaryGenre
      description
      features
      releaseType
      version
      label
      referenceNo
      upc
      releaseDate
      digitalReleaseDate
      licenseType
      publishingRegions
      budget
      artworkUrl
      songs {
        id
        title
        fileUrl
      }
      artistRoles {
        id
        artistRole
        artistRoleName
      }
      legalOwner {
        legalOwnerName
        legalOwnerYear
      }
      legalOwnerRelease {
        legalOwnerReleaseName
        legalOwnerReleaseYear
      }
      distributionPlatforms
    }
  }
`;

interface UploadedFile {
  type: string;
  url: string;
  key: string;
}

interface UploadResponse {
  files: UploadedFile[];
}

interface FileUploadResult {
  type: string;
  url: string;
  key: string;
}

// Define the steps of the form
const steps = [
  {
    id: "basic-info",
    name: "Basic Information",
    fields: [
      "title",
      "language",
      "genre",
      "secondaryGenre",
      "description",
      "releaseType",
      "version",
    ],
  },
  {
    id: "media-upload",
    name: "Media Upload",
    fields: ["songs", "art"],
  },
  {
    id: "artists",
    name: "Artists & Roles",
    fields: ["Roles"],
  },
  {
    id: "release-details",
    name: "Release Details",
    fields: [
      "lable",
      "referenceNo",
      "upc",
      "releaseDate",
      "digitalReleaseDate",
      "features",
    ],
  },
  {
    id: "legal-info",
    name: "Legal Information",
    fields: ["licenseType", "legalOwner", "legalOwnerRelease"],
  },
  {
    id: "distribution",
    name: "Distribution",
    fields: ["publishingRegions", "budget", "distributionPlatform"],
  },
];

const selectFields = ["primary_genre", "secondary_genre"];

// Language options
const languages = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Japanese", value: "japanese" },
  { label: "Korean", value: "korean" },
  { label: "Mandarin", value: "mandarin" },
  { label: "Other", value: "other" },
];

// Genre options
const genres = [
  { label: "Pop", value: "pop" },
  { label: "Rock", value: "rock" },
  { label: "Hip Hop", value: "hiphop" },
  { label: "R&B", value: "rnb" },
  { label: "Electronic", value: "electronic" },
  { label: "Jazz", value: "jazz" },
  { label: "Classical", value: "classical" },
  { label: "Country", value: "country" },
  { label: "Folk", value: "folk" },
  { label: "Other", value: "other" },
];

// Release type options
const releaseTypes = [
  { label: "Single", value: "single" },
  { label: "EP", value: "ep" },
  { label: "Album", value: "album" },
  { label: "Compilation", value: "compilation" },
  { label: "Remix", value: "remix" },
];

// Artist role options
const artistRoles = [
  { label: "Primary Artist", value: "primary" },
  { label: "Featured Artist", value: "featured" },
  { label: "Producer", value: "producer" },
  { label: "Songwriter", value: "songwriter" },
  { label: "Composer", value: "composer" },
  { label: "Arranger", value: "arranger" },
  { label: "Mixer", value: "mixer" },
  { label: "Mastering Engineer", value: "mastering" },
];

// License type options
const licenseTypes = [
  { label: "All Rights Reserved", value: "all_rights" },
  { label: "Creative Commons", value: "cc" },
  { label: "Public Domain", value: "public" },
  { label: "Royalty Free", value: "royalty_free" },
];

// Distribution platform options
const distributionPlatforms = [
  { label: "Spotify", value: "spotify" },
  { label: "Apple Music", value: "apple_music" },
  { label: "YouTube Music", value: "youtube_music" },
  { label: "Amazon Music", value: "amazon_music" },
  { label: "Tidal", value: "tidal" },
  { label: "Deezer", value: "deezer" },
  { label: "SoundCloud", value: "soundcloud" },
  { label: "Bandcamp", value: "bandcamp" },
];

export function MusicReleaseForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const [createRelease, { loading }] = useMutation(CREATE_RELEASE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const [files, setFiles] = useState<{
    songs: File[];
    art?: File;
  }>({ songs: [] });

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      language: "",
      genre: "",
      secondaryGenre: "",
      songs: [],
      description: "",
      features: "",
      releaseType: "",
      version: "",
      Roles: [{ artistRole: "", artistRoleName: "" }],
      lable: "",
      referenceNo: "",
      upc: "",
      releaseDate: new Date(),
      digitalReleaseDate: new Date(),
      licenseType: "",
      legalOwner: {
        legalOwnerName: "",
        legalOwnerYear: new Date().getFullYear().toString(),
      },
      legalOwnerRelease: {
        legalOwnerReleaseName: "",
        legalOwnerReleaseYear: new Date().getFullYear().toString(),
      },
      publishingRegions: "",
      budget: "",
      distributionPlatform: [],
    },
  });

  // Get the current step's fields
  const currentFields = steps[currentStep].fields;

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    const currentStepFields = steps[currentStep].fields;
    const formValues = form.getValues();

    // Check if all required fields in the current step are filled
    for (const field of currentStepFields) {
      if (field === "Roles") {
        const roles = formValues.Roles || [];
        if (
          roles.length === 0 ||
          roles.some((role) => !role.artistRole || !role.artistRoleName)
        ) {
          return false;
        }
      } else if (field === "songs" && currentStep === 1) {
        const songs = formValues.songs || [];
        if (songs.length === 0) {
          return false;
        }
      } else if (field === "distributionPlatform" && currentStep === 5) {
        const platforms = formValues.distributionPlatform || [];
        if (platforms.length === 0) {
          return false;
        }
      } else if (field === "legalOwner") {
        const legalOwner = formValues.legalOwner;
        if (!legalOwner?.legalOwnerName || !legalOwner?.legalOwnerYear) {
          return false;
        }
      } else if (field === "legalOwnerRelease") {
        const legalOwnerRelease = formValues.legalOwnerRelease;
        if (
          !legalOwnerRelease?.legalOwnerReleaseName ||
          !legalOwnerRelease?.legalOwnerReleaseYear
        ) {
          return false;
        }
      } else if (
        field === "title" ||
        field === "language" ||
        field === "genre" ||
        field === "description" ||
        field === "releaseType" ||
        field === "licenseType" ||
        field === "publishingRegions" ||
        field === "budget"
      ) {
        if (!formValues[field]) {
          return false;
        }
      }
    }

    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const uploadFiles = async (): Promise<{
    songUrls: string[];
    artworkUrl?: string;
  }> => {
    const formData = new FormData();

    // Add songs
    files.songs.forEach((song) => {
      formData.append("songs", song);
    });

    // Add artwork
    if (files.art) {
      formData.append("artwork", files.art);
    }

    formData.append("releaseId", "temp-" + Date.now());

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    const songUrls = result.files
      .filter((file: FileUploadResult) => file.type === "song")
      .map((file: FileUploadResult) => file.url);

    const artworkUrl = result.files.find(
      (file: FileUploadResult) => file.type === "artwork",
    )?.url;

    return { songUrls, artworkUrl };
  };

  // Handle form submission
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setErrors({});
    setIsUploading(true);

    try {
      // First upload the files
      const uploadFormData = new FormData();

      // Add songs
      formData.songs.forEach((song) => {
        uploadFormData.append("songs", song);
      });

      // Add artwork if present
      if (formData.art) {
        uploadFormData.append("artwork", formData.art);
      }

      // Upload files
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        console.error(uploadResponse);
        throw new Error("File upload failed");
      }

      const { files } = (await uploadResponse.json()) as UploadResponse;

      // Get song URLs and artwork URL from the upload response
      const songUrls = files
        .filter((file) => file.type === "song")
        .map((file) => file.url);

      const artworkUrl = files.find((file) => file.type === "artwork")?.url;

      // Create release with uploaded file URLs
      const { data } = await createRelease({
        variables: {
          input: {
            title: formData.title,
            language: formData.language,
            genre: formData.genre,
            secondaryGenre: formData.secondaryGenre,
            description: formData.description,
            features: formData.features,
            releaseType: formData.releaseType,
            version: formData.version,
            label: formData.lable,
            referenceNo: formData.referenceNo,
            upc: formData.upc,
            releaseDate: formData.releaseDate,
            digitalReleaseDate: formData.digitalReleaseDate,
            licenseType: formData.licenseType,
            publishingRegions: formData.publishingRegions,
            budget: formData.budget,
            artistRoles: formData.Roles,
            legalOwner: formData.legalOwner,
            legalOwnerRelease: formData.legalOwnerRelease,
            distributionPlatforms: formData.distributionPlatform,
            songFiles: songUrls,
            artworkFile: artworkUrl,
          },
        },
      });

      // Show success message
      alert("Release created successfully!");

      // Reset form
      form.reset();
      setFiles({ songs: [] });
      setCurrentStep(0);
    } catch (error) {
      console.error("Error creating release:", error);
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path.join(".")] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        alert("Error creating release. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection for songs
  const handleSongSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue("songs", files, { shouldValidate: true });
  };

  // Handle file selection for artwork
  const handleArtSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("art", file, { shouldValidate: true });
    }
  };

  // Add a new artist role
  const addArtistRole = () => {
    const currentRoles = form.getValues("Roles") || [];
    form.setValue("Roles", [
      ...currentRoles,
      { artistRole: "", artistRoleName: "" },
    ]);
  };

  // Remove an artist role
  const removeArtistRole = (index: number) => {
    const currentRoles = form.getValues("Roles") || [];
    if (currentRoles.length > 1) {
      form.setValue(
        "Roles",
        currentRoles.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-none">
      <CardHeader>
        <CardTitle>{steps[currentStep].name}</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}
        </CardDescription>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter release title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem
                              key={language.value}
                              value={language.value}
                            >
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex items-center gap-4 justify-between">
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryGenre"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Secondary Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre (Optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a description of your release"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select release type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {releaseTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Remix, Acoustic, Live"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2: Media Upload */}
            {currentStep === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="songs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Songs</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center justify-center w-full">
                          <label
                            htmlFor="song-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                MP3, WAV, FLAC (MAX. 50MB per file)
                              </p>
                            </div>
                            <input
                              id="song-upload"
                              type="file"
                              className="hidden"
                              accept=".mp3,.wav,.flac"
                              multiple
                              onChange={handleSongSelection}
                            />
                          </label>

                          {field.value.length > 0 && (
                            <div className="w-full mt-4">
                              <p className="text-sm font-medium mb-2">
                                Selected Files:
                              </p>
                              <ul className="space-y-2">
                                {Array.from(field.value).map((file, index) => (
                                  <li
                                    key={index}
                                    className="text-sm flex items-center justify-between bg-gray-100 p-2 rounded"
                                  >
                                    <span>{file.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                                      MB
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="art"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Cover Art (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center justify-center w-full">
                          <label
                            htmlFor="art-upload"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG (Recommended: 3000x3000px)
                              </p>
                            </div>
                            <input
                              id="art-upload"
                              type="file"
                              className="hidden"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleArtSelection}
                              {...fieldProps}
                            />
                          </label>

                          {value && (
                            <div className="w-full mt-4">
                              <p className="text-sm font-medium mb-2">
                                Selected Cover Art:
                              </p>
                              <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
                                <span className="text-sm">
                                  {(value as File).name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(
                                    (value as File).size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 3: Artists & Roles */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Artists & Roles</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 hover:bg-sky-500 text-white hover:text-white"
                    onClick={addArtistRole}
                  >
                    Add Artist
                  </Button>
                </div>

                {form.getValues().Roles.map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Artist {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArtistRole(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`Roles.${index}.artistRole`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {artistRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`Roles.${index}.artistRoleName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Artist Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter artist name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Release Details */}
            {currentStep === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="lable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter label name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referenceNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter reference number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="upc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPC/EAN (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter UPC or EAN code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Release Date</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="digitalReleaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Digital Release Date</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any special features or notes about this release"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 5: Legal Information */}
            {currentStep === 4 && (
              <>
                <FormField
                  control={form.control}
                  name="licenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {licenseTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Legal Owner Information</h4>

                  <FormField
                    control={form.control}
                    name="legalOwner.legalOwnerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Owner Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter legal owner name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalOwner.legalOwnerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Owner Year</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter year (e.g., 2023)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">
                    Legal Owner Release Information
                  </h4>

                  <FormField
                    control={form.control}
                    name="legalOwnerRelease.legalOwnerReleaseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Owner Release Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter legal owner release name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalOwnerRelease.legalOwnerReleaseYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Owner Release Year</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter year (e.g., 2023)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Step 6: Distribution */}
            {currentStep === 5 && (
              <>
                <FormField
                  control={form.control}
                  name="publishingRegions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publishing Regions</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select publishing regions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="north_america">
                            North America
                          </SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="africa">Africa</SelectItem>
                          <SelectItem value="south_america">
                            South America
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under_1000">
                            Under $1,000
                          </SelectItem>
                          <SelectItem value="1000_5000">
                            $1,000 - $5,000
                          </SelectItem>
                          <SelectItem value="5000_10000">
                            $5,000 - $10,000
                          </SelectItem>
                          <SelectItem value="10000_50000">
                            $10,000 - $50,000
                          </SelectItem>
                          <SelectItem value="over_50000">
                            Over $50,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distributionPlatform"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Distribution Platforms</FormLabel>
                        <FormDescription>
                          Select all platforms where you want to distribute your
                          music
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {distributionPlatforms.map((platform) => (
                          <FormItem
                            key={platform.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform.value)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValues,
                                      platform.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== platform.value,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {platform.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="bg-blue-500 hover:bg-sky-500 text-white hover:text-white"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                className="bg-blue-500 hover:bg-sky-500 text-white hover:text-white"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-sky-500"
                disabled={isUploading || !isCurrentStepValid()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
