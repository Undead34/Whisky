import { dbGetLots, dbGetTargets } from "@/app/lib/firebase/firestore";
import TableTargets from "./table-targets";

export default async function TargetsUsers() {
  const lots = await dbGetLots();
  const targets = await dbGetTargets();
  
  return (
    <TableTargets lots={lots} targets={targets} />
  );
}
