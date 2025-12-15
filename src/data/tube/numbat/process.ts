import {
  LineReference,
  StationNodeReference,
  WeightedLink,
} from "@/data/types";
import { LINES, LINKS, STATION_NODE_ALIASES } from "../network";
import { LinkLoad, TimeInterval } from "./types";
import { sum } from "d3";

/**
 * Weights each link's lines by their total load from the provided data.
 * @param data A mapping of link names to their load data.
 * @returns An array of weighted links.
 */
export function weightLinks(
  data: LinkWeights,
  year: string = "2024"
): WeightedLink[] {
  return LINKS.map((link) => ({
    ...link,
    from: resolveStationNodeReference(link.from),
    to: resolveStationNodeReference(link.to),
    lines: link.lines.map((line) => {
      const linkLoads = linkNames(line, link.from, link.to, year).map(
        (name) => {
          if (name in data) {
            return data[name];
          } else {
            console.warn(`Missing load data for link: ${name}`);
            return 0;
          }
        }
      );

      const totalLoad = sum(linkLoads);

      // HACK: split H&C and Circle load
      if (
        link.lines.some((l) => l.lineName === "H&C") &&
        link.lines.some((l) => l.lineName === "Circle")
      ) {
        return { ...line, weight: totalLoad / 2 };
      }

      return { ...line, weight: totalLoad };
    }),
  }));
}

export type LinkWeights = Record<string, number>;

export function resolveStationNodeReference(
  reference: StationNodeReference
): StationNodeReference {
  return {
    nodeName: STATION_NODE_ALIASES[reference.nodeName] ?? reference.nodeName,
  };
}

function linkNames(
  line: LineReference,
  from: StationNodeReference & { directions?: [string, string] },
  to: StationNodeReference & { directions?: [string, string] },
  year: string = "2024"
): string[] {
  // HACK: special case for missing Edgeware Road node in dataset
  if (from.nodeName === "ERDu_DISa" || from.nodeName === "ERDu_DISb") {
    from = { ...from, nodeName: "ERDu_DIS" };
  }
  if (to.nodeName === "ERDu_DISa" || to.nodeName === "ERDu_DISb") {
    to = { ...to, nodeName: "ERDu_DIS" };
  }

  // HACK: Kennington Northern line updates
  if (year < "2023") {
    // Oval->Kennington needs special care because it has two possible links
    // Send all Oval->Kennington traffic via KENu_NORb
    if (
      (from.nodeName === "KENu_NORx" && to.nodeName != "OVLu_NOR") ||
      from.nodeName === "KENu_NORb"
    ) {
      from = { ...from, nodeName: "KENu_NOR" };
    }
    if (
      (to.nodeName === "KENu_NORx" && from.nodeName != "OVLu_NOR") ||
      to.nodeName === "KENu_NORb"
    ) {
      to = { ...to, nodeName: "KENu_NOR" };
    }
  }

  const { directions, abbreviation } = LINES[line.lineName];

  const fromDirections = from.directions ?? directions;
  const toDirections = to.directions ?? directions;
  return [
    `${from.nodeName}_${fromDirections[0]}>${to.nodeName}_${toDirections[0]}@${abbreviation}`,
    `${to.nodeName}_${toDirections[1]}>${from.nodeName}_${fromDirections[1]}@${abbreviation}`,
  ];
}
