// The following data is sample data that I'm passing to components cause I'm in developer mode.
import { dashboardStatsType, DashboardLists } from "@/types/dashboardDataTypes";

// Data to go into the lists... When I implement a global provider, I won't have to do some of these things.
// But this looks like it doesn't really need a global provider so It might just remain as is in the final rollout.

// I have to define types for you noobs... Check the types folder
const artistTopFiveSongsData: DashboardLists[] = [
  {
    id: 1,
    title: "Huntin Wabitz",
    plays: 150000000,
    album: "Might Delete Later",
    coverArt: "/album-art-demo/might-delete-later.jpeg",
  },
  {
    id: 2,
    title: "Premeditated Murder",
    plays: 13200000,
    album: "Friday Night Lights",
    coverArt: "/album-art-demo/friday-night-lights.jpeg",
  },
  {
    id: 3,
    title: "No Role Modelz",
    plays: 2300000000,
    album: "2014 Forest Hills Drive",
    coverArt: "/album-art-demo/2014-forest-hillz.jpeg",
  },
  {
    id: 4,
    title: "She knows",
    plays: 432000000,
    album: "Born Sinner",
    coverArt: "/album-art-demo/born-sinner.jpeg",
  },
  {
    id: 5,
    title: "Pride is the Devil",
    plays: 121000000,
    album: "The Off Season",
    coverArt: "/album-art-demo/the-off-season.jpeg",
  },
];

const topZikiArtists: DashboardLists[] = [
  {
    id: 1,
    artist: "J.Cole",
    plays: 46000000,
    artistImg: "/artist-img-demo/cole.jpeg",
  },
  {
    id: 2,
    artist: "Kendrick",
    plays: 76000000,
    artistImg: "/artist-img-demo/kendrick.jpeg",
  },
  {
    id: 3,
    artist: "Drake",
    plays: 73000000,
    artistImg: "/artist-img-demo/drake.jpeg",
  },
  {
    id: 4,
    artist: "Kanye West",
    plays: 66040000,
    artistImg: "/artist-img-demo/kanye.jpeg",
  },
  {
    id: 5,
    artist: "Eminem",
    plays: 66360400,
    artistImg: "/artist-img-demo/eminem.jpeg",
  },
];

const zikiTopFiveSongsData: DashboardLists[] = [
  {
    id: 1,
    title: "Not like Us",
    plays: 936000000,
    coverArt: "/ziki-top-albums-demo/gnx.jpeg",
  },
  {
    id: 2,
    title: "No Role Modelz",
    plays: 2223000000,
    coverArt: "/ziki-top-albums-demo/fhd.jpeg",
  },
  {
    id: 3,
    title: "Knife Talk",
    plays: 783000000,
    coverArt: "/ziki-top-albums-demo/clb.jpeg",
  },
  {
    id: 4,
    title: "Homecoming",
    plays: 1230400000,
    coverArt: "/ziki-top-albums-demo/graduation.jpeg",
  },
  {
    id: 5,
    title: "Godzilla",
    plays: 1023000000,
    coverArt: "/ziki-top-albums-demo/mtbmb.jpeg",
  },
];

export { artistTopFiveSongsData, zikiTopFiveSongsData, topZikiArtists };
