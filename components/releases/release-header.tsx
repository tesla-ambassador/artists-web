"use client";

import React from "react";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import { Input } from "../ui/input";
import { archiveData, releaseData } from "@/data/archive-data";
import { useReleaseStore } from "@/providers/releases-provider";

import {
  Delete,
  Edit,
  Disc3,
  AudioLines,
  Disc,
  Disc2,
  LucideIcon,
  Filter,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Checkbox } from "../ui/checkbox";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@radix-ui/react-select";

const sampleReleases = [
  {
    id: 1,
    type: "Song",
    name: "Race My Mind",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: 2,
    type: "Album",
    name: "Certified Lover Boy",
    icon: Disc,
    color: "bg-amber-500",
  },
  {
    id: 3,
    type: "EP",
    name: "Scary Hours",
    icon: Disc2,
    color: "bg-blue-500",
  },
  {
    id: 4,
    type: "Remix",
    name: "Girls Need Love",
    icon: Disc3,
    color: "bg-purple-500",
  },
  {
    id: 5,
    type: "Song",
    name: "Middle Child",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: 6,
    type: "Ep",
    name: "Section 8.0",
    icon: Disc2,
    color: "bg-blue-500",
  },
  {
    id: 7,
    type: "Album",
    name: "Iceman",
    icon: Disc,
    color: "bg-amber-500",
  },

  {
    id: 8,
    type: "EP",
    name: "Revenge",
    icon: Disc2,
    color: "bg-blue-500",
  },
  {
    id: 9,
    type: "Remix",
    name: "Sere",
    icon: Disc3,
    color: "bg-purple-500",
  },
  {
    id: 10,
    type: "Song",
    name: "4X4",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: 11,
    type: "Ep",
    name: "Mathers",
    icon: Disc2,
    color: "bg-blue-500",
  },
  {
    id: 12,
    type: "Album",
    name: "Astroworld",
    icon: Disc,
    color: "bg-amber-500",
  },

  {
    id: 13,
    type: "Song",
    name: "Slow Motion",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: 14,
    type: "Remix",
    name: "F*ckin Problems",
    icon: Disc3,
    color: "bg-purple-500",
  },
  {
    id: 15,
    type: "Song",
    name: "Winter Wonderland",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: 16,
    type: "Album",
    name: "Purpose",
    icon: Disc,
    color: "bg-amber-500",
  },
  {
    id: 17,
    type: "Album",
    name: "Creed II",
    icon: Disc,
    color: "bg-amber-500",
  },
];

export function ReleaseHeader() {
  return (
    <div className="w-full flex items-center justify-between">
      <h1 className="font-slate-900 text-3xl">Releases</h1>
      <div>
        <AddReleases />
      </div>
    </div>
  );
}

export function ReleaseBody() {
  const { releases } = useReleaseStore((state) => state);
  const [search, setSearch] = React.useState<string>("");
  return (
    <div className="w-full">
      <div className="py-8 flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Filter className="size-5 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Album</DropdownMenuItem>
            <DropdownMenuItem>Song</DropdownMenuItem>
            <DropdownMenuItem>EP</DropdownMenuItem>
            <DropdownMenuItem>Remix</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {releases.length === 0 ? (
        <div className="mt-8 flex items-center justify-center w-full h-full">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">You have no releases yet.</h1>
            <p className="text-lg">
              Click{" "}
              <span className="text-blue-500">&quot;Add Releases&quot;</span> to
              add a release
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-4">
          {releases.map((release) => (
            <ReleaseCard
              key={release.id}
              color={release.color}
              type={release.type}
              title={release.name}
              icon={release.icon}
              imgUrl={release.releaseArt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReleaseCard {
  color: string;
  title: string;
  type: string;
  icon: LucideIcon;
  imgUrl: string;
}

export function ReleaseCard({ color, title, type, icon, imgUrl }: ReleaseCard) {
  const Icon = icon;
  return (
    <div className="w-full flex items-center h-fit rounded-md border-gray-100 border-2 overflow-hidden">
      <div
        className={`relative size-20 sm:w-24 flex items-center justify-center`}
      >
        <img
          src={imgUrl}
          alt="Release Art"
          className="object-cover object-center absolute"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-black opacity-45" />
        {Icon && <Icon className="text-gray-100 size-8 relative z-10" />}
      </div>
      <div className="w-full flex items-start justify-between px-3 bg-white">
        <div className="space-y-4">
          <h2 className="text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{type}</span>
            <div className={`${color} rounded-full size-2`} />
          </div>
        </div>
        <div>
          <ReleaseCardActionButton />
        </div>
      </div>
    </div>
  );
}

const releaseActions = [
  {
    id: 1,
    icon: Delete,
    name: "Remove",
  },
  {
    id: 2,
    icon: Edit,
    name: "Edit",
  },
];

export function ReleaseCardActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="size-5 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {releaseActions.map((item) => (
          <DropdownMenuItem key={item.id} className="flex items-center gap-4">
            <item.icon className="size-8" />
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Adding Releases.
const ReleaseSchema = z.object({
  id: z.string(),
  type: z.string(),
  releaseArt: z.string(),
  name: z.string(),
  icon: z.custom<LucideIcon>((val) => {
    // You can add custom validation logic here if needed
    return typeof val === "function" || typeof val === "object";
  }),
  color: z.string(),
});

const ReleasesArraySchema = z.array(ReleaseSchema);

const FormSchema = z.object({
  releases: z.array(ReleaseSchema),
});

export function AddReleases() {
  const { addRelease } = useReleaseStore((state) => state);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      releases: [],
    },
  });

  const onSubmit = (items: z.infer<typeof FormSchema>) => {
    addRelease(items.releases);
    console.log(items);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          Add Release
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Select work to release</DialogTitle>
          <DialogDescription className="sr-only">
            This is work from the archive to be released.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="releases"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Existing Archives</FormLabel>
                    <FormDescription>
                      Select the work you want to release
                    </FormDescription>
                  </div>
                  {archiveData.map((archive) => (
                    <FormField
                      key={archive.id}
                      control={form.control}
                      name="releases"
                      render={({ field }) => (
                        <FormItem
                          key={archive.id}
                          className="flex gap-3 items-center w-full"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some(
                                (item) => item.id === archive.id
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, archive])
                                  : field.onChange(
                                      field.value.filter(
                                        (value) => value.id !== archive.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="sr-only">
                            {archive.name}
                          </FormLabel>
                          <div className="w-full">
                            <ReleaseCard
                              icon={archive.icon}
                              color={archive.color}
                              title={archive.name}
                              type={archive.type}
                              imgUrl={archive.releaseArt}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </FormItem>
              )}
            />
            <Button className="w-full mt-3" type="submit">
              Add Releases
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
