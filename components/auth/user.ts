"use server";
import { auth } from "@clerk/nextjs/server";

export const fetchUserId = async () => {
  const userId = (await auth()).userId;
  return userId;
};
