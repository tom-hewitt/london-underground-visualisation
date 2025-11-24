import { loadLinkLoadData } from "@/data/numbat";
import { TubeMapVisualisation } from "../components/tubeMap";

export default async function Home() {
  const data = await loadLinkLoadData();

  return <TubeMapVisualisation data={data} />;
}
