import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ArchiveTabContent from "./ArchiveTabContent";
import { DataTableDemo } from "./Experiments";
import { VideoArchiveTab } from "./Video_Archive";

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
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <PlusCircle /> Upload
          </Button>
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
