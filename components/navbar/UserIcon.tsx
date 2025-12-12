import { currentUser } from "@clerk/nextjs/server";
import UserIconClient from "./UserIconClient";

export default async function UserIcon() {
  const user = await currentUser();
  return <UserIconClient imageUrl={user?.imageUrl ?? null} />;
}
