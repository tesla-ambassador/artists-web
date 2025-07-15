import { Releases } from "@/app/dashboard/archive/Experiments";
import { Disc3, AudioLines, Disc, Disc2 } from "lucide-react";

const archiveData: Releases[] = [
  {
    id: "m5gr84i9",
    name: "Certified Lover Boy",
    releaseArt: "/ziki-top-albums-demo/clb.jpeg",
    type: "Album",
    icon: Disc,
    color: "bg-amber-500",
  },
  {
    id: "3u1reuv4",
    name: "K.O.D",
    releaseArt: "/album-art-demo/kod.jpeg",
    type: "Remix",
    icon: Disc3,
    color: "bg-purple-500",
  },
  {
    id: "derv1ws0",
    name: "MTBMB",
    releaseArt: "/ziki-top-albums-demo/mtbmb.jpeg",
    type: "EP",
    icon: Disc2,
    color: "bg-blue-500",
  },
  {
    id: "5kma53ae",
    name: "Might Delete Later",
    releaseArt: "/album-art-demo/might-delete-later.jpeg",
    type: "Song",
    icon: AudioLines,
    color: "bg-red-500",
  },
  {
    id: "bhqecj4p",
    name: "Graduation",
    releaseArt: "/ziki-top-albums-demo/graduation.jpeg",
    type: "Album",
    icon: Disc,
    color: "bg-amber-500",
  },
];

const releaseData: Releases[] = [];

export { archiveData, releaseData };
