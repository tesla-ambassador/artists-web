import { ReleaseType } from "@/zeus";

const ReleaseTypeMap = [
  {
    default: true,
    value: ReleaseType.SINGLE,
    label: "Single",
  },
  {
    value: ReleaseType.ALBUM,
    label: "Album",
  },
  {
    value: ReleaseType.EP,
    label: "EP",
  },
  {
    value: ReleaseType.COMPILATION,
    label: "Compilation",
  },
];

export type TReleaseType = (typeof ReleaseTypeMap)[number];

export default ReleaseTypeMap;
