import { getTeamMembers } from "@/lib/api/team";
import { TimClient } from "./TimClient";

export default async function TimPage() {
  const team = await getTeamMembers();
  return <TimClient initialTeam={team} />;
}
