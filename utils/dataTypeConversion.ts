import { primaryGenres } from "constants/Genre/primary";
import { secondaryGenres } from "constants/Genre/secondary";

export const ObjectToString = (obj: { label: string; value: string }[]) => {
  if (obj === undefined) return;
  // @ts-ignore
  if (!Array.isArray(obj)) return obj.value;
  // @ts-ignore

  return obj.map((item) => item.value).join(",");
};

export const StringToGenre = (str: string) => {
  if (str === undefined) return;
  const values = str.split(",");
  return values.map((value) => ({
    label: primaryGenres.find(genre => genre.value === value)?.label || secondaryGenres.find(genre => genre.value === value)?.label,
    value: value,
  }))[0];
};
