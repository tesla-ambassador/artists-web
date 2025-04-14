"use client";
import { formatReleaseDate } from "@/hooks/useful-functions";
import { Dot } from "lucide-react";
const videoData = [
  {
    id: 1,
    url: "/ziki-top-albums-demo/clb.jpeg",
    title: "Certified Lover Boy",
    alt: "Certified Lover Boy",
    artist: "Drake",
    releaseDate: "2024-08-19T14:23:11Z",
  },
  {
    id: 2,
    url: "/ziki-top-albums-demo/clb.jpeg",
    title: "Certified Lover Boy",
    alt: "Certified Lover Boy",
    artist: "Drake",
    releaseDate: "2024-08-19T14:23:11Z",
  },
  {
    id: 3,
    url: "/ziki-top-albums-demo/clb.jpeg",
    title: "Certified Lover Boy",
    alt: "Certified Lover Boy",
    artist: "Drake",
    releaseDate: "2024-08-19T14:23:11Z",
  },
  {
    id: 4,
    url: "/ziki-top-albums-demo/clb.jpeg",
    title: "Certified Lover Boy",
    alt: "Certified Lover Boy",
    artist: "Drake",
    releaseDate: "2024-08-19T14:23:11Z",
  },
];

export function VideoArchiveTab() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {videoData.map((data) => (
        <div key={data.id}>
          <VideoGrid
            url={"https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"}
            alt={data.alt}
            artist={data.artist}
            released={data.releaseDate}
            title={data.title}
          />
        </div>
      ))}
    </div>
  );
}

interface VideoGrid {
  url: string;
  alt: string;
  artist: string;
  title: string;
  released: string;
}

export function VideoGrid({ url, alt, artist, title, released }: VideoGrid) {
  return (
    <div className="w-full sm:max-w-[300px] md:max-w-none space-y-4 border-[1px] border-gray-300 rounded-lg overflow-hidden">
      <div>
        <img src={url} alt={alt} />
      </div>
      <div className="px-4 py-2">
        <h3>{title}</h3>
        <div className="flex items-center">
          <span>{artist}</span>
          <Dot />
          <span>{formatReleaseDate(new Date(released), "en")}</span>
        </div>
      </div>
    </div>
  );
}
