"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [features, setFeatures] = useState("");
  const [songart, setSongArt] = useState<File | null>(null);
  const [youTubeLink, setYouTubeLink] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if file is a .wav file
      if (selectedFile.type !== "audio/wav") {
        toast({
          title: "Invalid file type",
          description: "Please upload a .wav file",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSongArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "image/png") {
        toast({
          title: "Invalid file type",
          description: "Please upload a .png or .jpg file",
          variant: "destructive",
        });
        return;
      }

      setSongArt(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && category !== "Video") {
      toast({
        title: "No file selected",
        description: "Please select a .wav file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Here you would typically handle the actual upload
    // For example with FormData and fetch to your API
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Upload successful",
        description: `${title} has been uploaded successfully.`,
      });

      // Reset form
      setFile(null);
      setSongArt(null);
      setTitle("");
      setFeatures("");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Content</CardTitle>
        <CardDescription>
          Upload your audio content in .wav format
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Features</Label>
            <Textarea
              id="features"
              placeholder="Any Features...(Comma Separated)"
              value={features}
              className="min-h-[100px] resize-none"
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>

          <div className="sm:flex sm:gap-4 sm:items-end sm:flex-between w-full">
            <div className="space-y-2 w-full">
              <Label
                htmlFor="title"
                className={
                  category === "Video" ? "text-black" : "text-gray-500"
                }
              >
                YouTube Link
              </Label>
              <Input
                id="title"
                placeholder="Enter a title for your content"
                value={youTubeLink}
                onChange={(e) => setYouTubeLink(e.target.value)}
                disabled={category === "Video" ? false : true}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(e) => {
                  setCategory(e);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent id="category">
                  <SelectGroup>
                    <SelectItem value="Song">Song</SelectItem>
                    <SelectItem value="Release">Release</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex w-full justify-between gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="songArt"
                className={
                  category === "Video" ? "text-gray-500" : "text-black"
                }
              >
                Song Art (.jpg)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="songArt"
                  type="file"
                  accept="image/png"
                  className="cursor-pointer"
                  onChange={handleSongArtChange}
                  required
                  disabled={category === "Video" ? true : false}
                />
              </div>
              {songart && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected file: {songart.name} (
                  {(songart.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="upload"
                className={
                  category === "Video" ? "text-gray-500" : "text-black"
                }
              >
                Upload (.wav)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="upload"
                  type="file"
                  accept=".wav,audio/wav"
                  className="cursor-pointer"
                  onChange={handleFileChange}
                  required
                  disabled={category === "Video" ? true : false}
                />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected file: {file.name} (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {category === "Video" ? (
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-sky-500"
            >
              {"Upload Link"}
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-sky-500"
              disabled={isUploading || !file}
            >
              {isUploading ? "Uploading..." : "Upload Content"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
