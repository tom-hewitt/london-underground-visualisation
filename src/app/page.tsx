import {
  fetchAllNumbatData,
  parseLinkLoadData,
} from "@/data/tube/numbat/fetch";
import { YearlyTubeMapVisualisation } from "@/components/TubeMapVisualisation";
import { LinkWeights } from "@/data/tube/numbat/process";
import { read } from "xlsx";

export default async function Home() {
  "use cache";

  const dataPerYear: Record<string, LinkWeights> = {};

  for (const [year, days] of await fetchAllNumbatData()) {
    const dataPerDay: Record<string, number[]> = {};

    for (const [_, data] of days) {
      const workbook = read(data, { type: "array" });

      const linkLoadData = parseLinkLoadData(workbook);

      for (const [linkName, load] of Object.entries(linkLoadData)) {
        if (!(linkName in dataPerDay)) {
          dataPerDay[linkName] = [];
        }
        dataPerDay[linkName].push(load.total);
      }
    }

    const averagedData: LinkWeights = Object.fromEntries(
      Object.entries(dataPerDay).map(([linkName, loads]) => [
        linkName,
        loads.reduce((a, b) => a + b, 0) / loads.length,
      ])
    );

    dataPerYear[year] = averagedData;
  }

  return <YearlyTubeMapVisualisation dataPerYear={dataPerYear} />;
}
