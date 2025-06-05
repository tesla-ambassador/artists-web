import { nanoid } from "nanoid";

const getUsername = (email: string) => {
  const randomId = nanoid(5);
  let username = email.toLowerCase().trim().split("@")[0];
  return `${username}_${randomId}`;
};

export default getUsername;
