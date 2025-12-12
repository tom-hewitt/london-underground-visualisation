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
export function weightLinksWithLoad(
  data: Record<string, LinkLoad>,
  view: LoadView
): WeightedLink[] {
  return LINKS.map((link) => ({
    ...link,
    from: resolveStationNodeReference(link.from),
    to: resolveStationNodeReference(link.to),
    lines: link.lines.map((line) => {
      const linkLoads = linkNames(line, link.from, link.to).map((name) => {
        if (name in data) {
          if (view.type == "total") {
            return data[name].total;
          }
          return data[name].quarterHours[view.interval];
        } else {
          console.warn(`Missing load data for link: ${name}`);
          return 0;
        }
      });

      const totalLoad = sum(linkLoads);

      // Hack to split H&C and Circle load
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

export type LoadView =
  | { type: "total" }
  | { type: "interval"; interval: TimeInterval };

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
  to: StationNodeReference & { directions?: [string, string] }
): string[] {
  const { directions, abbreviation } = LINES[line.lineName];

  const fromDirections = from.directions ?? directions;
  const toDirections = to.directions ?? directions;
  return [
    `${from.nodeName}_${fromDirections[0]}>${to.nodeName}_${toDirections[0]}@${abbreviation}`,
    `${to.nodeName}_${toDirections[1]}>${from.nodeName}_${fromDirections[1]}@${abbreviation}`,
  ];
}
