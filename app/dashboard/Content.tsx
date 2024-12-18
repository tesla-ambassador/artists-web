import React from "react";
import {
  Music2,
  Headphones,
  SquarePlay,
  Disc3,
  Heart,
  UsersRound,
} from "lucide-react";
import { numberWithCommas, compactNumbers } from "@/hooks/useful-functions";
import { SalesChart, RevenueDistributionChart } from "./Charts";
import { ArtistTopFiveSongs, ZikiArtistList, ZikiTopFiveSongs } from "./Lists";

// I didn't know whether it was good practice to put some of the dashboard data here... I mean it's not global so why not.

// Because I don't want you peons breaking my code, I will define the types for each constants.
type dashboardStatsType = {
  id: number;
  icon: React.JSX.Element;
  stat: number;
  statTitle: string;
};

const dashboardStats: dashboardStatsType[] = [
  {
    id: 1,
    icon: <Music2 size={32} />,
    stat: 300,
    statTitle: "Total Songs",
  },
  {
    id: 2,
    icon: <Headphones size={32} />,
    stat: 4000000,
    statTitle: "Number of Plays",
  },
  {
    id: 3,
    icon: <Disc3 size={32} fill="black" />,
    stat: 10,
    statTitle: "Total Albums",
  },
  {
    id: 4,
    icon: <Heart size={32} fill="#FFFFFF" stroke="false" />,
    stat: 30000000,
    statTitle: "Total Followers",
  },
];

export default function DashboardContent() {
  return (
    <div>
      <DashboardHeader />
      <DashboardMain />
      <DashboardFooter />
    </div>
  );
}

// Dashboard Layout... Don't ask why I went through this, I know what happens when shit starts failing.
function DashboardHeader() {
  return (
    <div>
      <h1 className="font-slate-900 text-3xl">Overview</h1>
      <DashboardStats />
    </div>
  );
}

function DashboardMain() {
  return (
    <div className="mt-32 sm:mt-16">
      <h2 className="font-slate-900 text-3xl">Analytics</h2>
      <DashboardCharts />
      <div className="w-full mt-16 sm:mt-8">
        <ArtistTopFiveSongs />
      </div>
    </div>
  );
}

function DashboardFooter() {
  return (
    <div className="mt-32 sm:mt-16">
      <h2 className="font-slate-900 text-3xl">Ziki Stats</h2>
      <div className="w-full mt-16 sm:mt-8 flex flex-col lg:flex-row lg:justify-between">
        <ZikiArtistList />
        <ZikiTopFiveSongs />
      </div>
    </div>
  );
}

// Minor Dashboard Components. Cause it's pointless creating tsx files for them,
// Like who the fuck wants to scroll through the file explorer.
function DashboardStats() {
  return (
    <div className="w-full mt-16 sm:mt-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {dashboardStats.map((data) => (
        <div
          key={data.id}
          className="flex mx-auto w-full justify-between items-center px-4 py-2 rounded-t-lg relative bg-gradient-to-r from-blue-500 to-cyan-400"
        >
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-3xl text-white">
              {compactNumbers(data.stat)}
            </span>
            <span className="text-gray-100">{data.statTitle}</span>
          </div>
          <div className="text-white">{data.icon}</div>
        </div>
      ))}
    </div>
  );
}

function DashboardCharts() {
  return (
    <div className="w-full mt-16 sm:mt-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
        <SalesChart />
        <RevenueDistributionChart />
      </div>
    </div>
  );
}
