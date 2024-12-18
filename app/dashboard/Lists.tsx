import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { numberWithCommas } from "@/hooks/useful-functions";
import {
  artistTopFiveSongsData,
  zikiTopFiveSongsData,
  topZikiArtists,
} from "../data/dashboardDataSample";

export function ArtistTopFiveSongs() {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-blue-600">My Top Streams</CardTitle>
        <CardDescription>Your most streamed songs</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/0 text-lg">
              <TableHead className="hidden sm:table-cell">Rank</TableHead>
              <TableHead className="hidden sm:table-cell">Song</TableHead>
              <TableHead className="hidden sm:table-cell md:hidden lg:table-cell">
                Plays
              </TableHead>
              <TableHead className="hidden xl:table-cell">Album</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artistTopFiveSongsData
              .sort((x, y) => y.plays - x.plays)
              .map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell className="flex gap-3 items-center">
                    <div className="w-[50px] h-[50px] rounded-md overflow-hidden">
                      <img
                        src={data.coverArt}
                        alt="Cover art"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md">{data.title}</span>
                      <span className="sm:hidden text-gray-500 md:table-cell lg:hidden">
                        {numberWithCommas(data.plays)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell md:hidden lg:table-cell">
                    {numberWithCommas(data.plays)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {data.album}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ZikiArtistList() {
  return (
    <Card className="border-0 w-full">
      <CardHeader>
        <CardTitle className="text-blue-600">Top Ziki Artists</CardTitle>
        <CardDescription>The top ziki artists this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/100 text-lg">
              <TableHead>Rank</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="hidden xl:table-cell">Listeners</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topZikiArtists
              .sort((x, y) => y.plays - x.plays)
              .map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell className="flex gap-3 items-center">
                    <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
                      <img
                        src={data.artistImg}
                        alt="Artist"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span>{data.artist}</span>
                      <span className="xl:hidden text-gray-500">
                        {numberWithCommas(data.plays)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {numberWithCommas(data.plays)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ZikiTopFiveSongs() {
  return (
    <Card className="border-0 w-full">
      <CardHeader>
        <CardTitle className="text-blue-600">Ziki Top Songs</CardTitle>
        <CardDescription>Most streamed songs on Ziki</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/0 text-lg">
              <TableHead className="hidden sm:table-cell">Rank</TableHead>
              <TableHead className="hidden sm:table-cell">Song</TableHead>
              <TableHead className="hidden sm:table-cell md:hidden xl:table-cell">
                Plays
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zikiTopFiveSongsData
              .sort((x, y) => y.plays - x.plays)
              .map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell className="flex gap-3 items-center">
                    <div className="w-[50px] h-[50px] rounded-md overflow-hidden">
                      <img
                        src={data.coverArt}
                        alt="Cover art"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md">{data.title}</span>
                      <span className="sm:hidden text-gray-500 md:table-cell xl:hidden">
                        {numberWithCommas(data.plays)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell md:hidden xl:table-cell">
                    {numberWithCommas(data.plays)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
