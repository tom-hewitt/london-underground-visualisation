import { NumbatFileBuffer } from "@/data/tube/numbat/fetch";
import { LinkWeights } from "@/data/tube/numbat/process";
import {
  formatTimeInterval,
  NumbatDays,
  QUARTER_HOURS,
  TimeInterval,
} from "@/data/tube/numbat/types";
import { DayOfWeek } from "@/data/types";
import { read } from "xlsx";
import { AnimatedTubeMapVisualisation } from "./AnimatedTubeMapVisualisation";
import {
  parseLinkFrequencyData,
  parseLinkLoadData,
} from "@/data/tube/numbat/parse";

export async function AnimatedTubeMap({
  numbatData,
}: {
  numbatData: [string, [NumbatDays, NumbatFileBuffer][]][];
}) {
  // Only use latest year to reduce data size
  const [year, days] = numbatData[numbatData.length - 1];

  // Only use Friday data for animated map to reduce data size
  const [day, data] = days.find(([day, _]) => day === "TWT")!;

  const workbook = read(data, { type: "array" });

  const linkLoadData = parseLinkLoadData(workbook);

  const dayLoadData: Record<TimeInterval, LinkWeights> = {};

  const linkOrderData: LinkWeights = {};

  for (const [linkName, load] of Object.entries(linkLoadData)) {
    for (const [from, to] of QUARTER_HOURS) {
      const timeInterval = formatTimeInterval(from, to);

      if (!(timeInterval in dayLoadData)) {
        dayLoadData[timeInterval] = {};
      }

      dayLoadData[timeInterval][linkName] = load.quarterHours[timeInterval];

      linkOrderData[linkName] = load.order;
    }
  }

  const linkFrequencyData = parseLinkFrequencyData(workbook);

  const dayFrequencyData: Record<TimeInterval, LinkWeights> = {};

  for (const [linkName, frequency] of Object.entries(linkFrequencyData)) {
    for (const [from, to] of QUARTER_HOURS) {
      const timeInterval = formatTimeInterval(from, to);

      if (!(timeInterval in dayFrequencyData)) {
        dayFrequencyData[timeInterval] = {};
      }

      dayFrequencyData[timeInterval][linkName] =
        frequency.quarterHours[timeInterval];
    }
  }

  return (
    <AnimatedTubeMapVisualisation
      linkLoadData={dayLoadData}
      linkFrequencyData={dayFrequencyData}
      linkOrderData={linkOrderData}
      year={year}
    />
  );
}
