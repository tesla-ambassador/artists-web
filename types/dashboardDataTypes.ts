export type dashboardStatsType = {
  id: number;
  icon: React.JSX.Element;
  stat: number;
  statTitle: string;
};

export type DashboardLists = {
  id: number;
  title?: string;
  plays: number;
  album?: string;
  artist?: string;
  coverArt?: string;
  artistImg?: string;
};