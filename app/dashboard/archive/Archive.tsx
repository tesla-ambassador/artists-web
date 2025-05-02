import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ArchiveTabContent from "./ArchiveTabContent";
import { DataTableDemo } from "./Experiments";
import { VideoArchiveTab } from "./Video_Archive";
import { UploadForm } from "@/components/forms/upload-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Archive() {
  return (
    <Tabs defaultValue="Songs">
      <div className="w-full flex items-center justify-between">
        <TabsList>
          <TabsTrigger
            value="Songs"
            className="data-[state=active]:bg-gradient-to-r from-blue-500 to-cyan-500 data-[state=active]:text-white"
          >
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="Releases"
            className="data-[state=active]:bg-gradient-to-r from-blue-500 to-cyan-500 data-[state=active]:text-white"
          >
            Releases
          </TabsTrigger>
          <TabsTrigger
            value="Videos"
            className="data-[state=active]:bg-gradient-to-r from-blue-500 to-cyan-500 data-[state=active]:text-white"
          >
            Videos
          </TabsTrigger>
        </TabsList>

        <div>
          <UploadButton />
        </div>
      </div>
      <div className="mt-16 sm:mt-8">
        <TabsContent value="Songs">
          <ArchiveTabContent
            title="Songs"
            desc="An archive of your songs"
            children={<DataTableDemo />}
          />
        </TabsContent>
        <TabsContent value="Releases">
          <ArchiveTabContent
            title="Releases"
            desc="An archive of your Releases"
            children={<DataTableDemo />}
          />
        </TabsContent>
        <TabsContent value="Videos">
          <ArchiveTabContent
            title="Videos"
            desc="An archive of your Videos"
            children={<VideoArchiveTab />}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function UploadButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <PlusCircle /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Upload Content</DialogTitle>
          <DialogDescription className="sr-only">
            Upload your content here. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <UploadForm />
      </DialogContent>
    </Dialog>
  );
}
