import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tracker from "@/components/Tracker";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return <Tracker userName={session?.user?.name || session?.user?.email || ""} />;
}
