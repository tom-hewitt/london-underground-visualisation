import { fetchLinkLoadData } from "@/data/tube/numbat/fetch";
import { TubeMapVisualisation } from "@/components/TubeMapVisualisation";

export default async function Home() {
  const data = await fetchLinkLoadData();

  return <TubeMapVisualisation data={data} />;
}
