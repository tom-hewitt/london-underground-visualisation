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
  const load: Partial<Record<DayOfWeek, Record<TimeInterval, LinkWeights>>> =
    {};
  const frequency: Partial<
    Record<DayOfWeek, Record<TimeInterval, LinkWeights>>
  > = {};

  // Only use latest year to reduce data size
  const [year, days] = numbatData[numbatData.length - 1];

  for (const [day, data] of days) {
    const workbook = read(data, { type: "array" });

    const linkLoadData = parseLinkLoadData(workbook);

    const dayLoadData: Record<TimeInterval, LinkWeights> = {};

    for (const [linkName, load] of Object.entries(linkLoadData)) {
      for (const [from, to] of QUARTER_HOURS) {
        const timeInterval = formatTimeInterval(from, to);

        if (!(timeInterval in dayLoadData)) {
          dayLoadData[timeInterval] = {};
        }

        dayLoadData[timeInterval][linkName] = load.quarterHours[timeInterval];
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

    switch (day) {
      case "MON":
        load.Monday = dayLoadData;
        frequency.Monday = dayFrequencyData;
        break;
      case "MTT":
        load.Monday = dayLoadData;
        frequency.Monday = dayFrequencyData;
        load.Tuesday = dayLoadData;
        frequency.Tuesday = dayFrequencyData;
        load.Wednesday = dayLoadData;
        frequency.Wednesday = dayFrequencyData;
        load.Thursday = dayLoadData;
        frequency.Thursday = dayFrequencyData;
        break;
      case "TWT":
        load.Tuesday = dayLoadData;
        frequency.Tuesday = dayFrequencyData;
        load.Wednesday = dayLoadData;
        frequency.Wednesday = dayFrequencyData;
        load.Thursday = dayLoadData;
        frequency.Thursday = dayFrequencyData;
        break;
      case "FRI":
        load.Friday = dayLoadData;
        frequency.Friday = dayFrequencyData;
        break;
      case "SAT":
        load.Saturday = dayLoadData;
        frequency.Saturday = dayFrequencyData;
        break;
      case "SUN":
        load.Sunday = dayLoadData;
        frequency.Sunday = dayFrequencyData;
        break;
    }
  }

  return (
    <AnimatedTubeMapVisualisation
      linkLoadData={load}
      linkFrequencyData={frequency}
      year={year}
    />
  );
}
