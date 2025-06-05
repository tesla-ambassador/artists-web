export interface SongInput {
  title: string;
  sub_title: string;
  genre: string;
  albums: Array<{ name: string }>;
  label: string;
  lyrics: string;
  management_group: string;
  artists: Array<{ name: string; ownership: string }>;
  collaborators: Array<{
    name: string;
    ownership: string;
    role: string;
  }>;
  publishing_id: string;
  publisher: Array<string>;
  release_date: string;
}
