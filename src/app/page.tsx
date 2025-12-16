import { AnimatedTubeMap } from "@/components/AnimatedTubeMap";
import { YearlyTubeMap } from "@/components/YearlyTubeMap";
import { fetchAllNumbatData } from "@/data/tube/numbat/fetch";
import { cacheLife } from "next/cache";

export default async function Home() {
  "use cache";
  cacheLife("max");

  const numbatData = await fetchAllNumbatData();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: "100px",
        paddingRight: "100px",
      }}
    >
      <YearlyTubeMap numbatData={numbatData} />
      <AnimatedTubeMap numbatData={numbatData} />
    </div>
  );
}
