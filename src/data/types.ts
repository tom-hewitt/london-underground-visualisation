import { regex } from "arktype";
import { range } from "radash";

export interface Station {
  name: string;
  displayName?: string;
  nlc: number;
  asc: string;
}

export interface StationReference {
  nlc: number;
}

/// Represents a specific station node on the map. A station can have multiple nodes, e.g. Paddington.
export interface StationNode {
  name: string;
  station: StationReference;
  interchange?: boolean;
  x: number;
  y: number;
}

export interface StationNodeReference {
  name: string;
}

export interface Line {
  name: string;
  abbreviation: string;
  directions: [string, string];
  colour: string;
}

export interface LineReference {
  name: string;
}

export interface Link {
  line: LineReference;
  from: StationNodeReference;
  to: StationNodeReference;
  path?: PathNode[];
}

export interface PathNode {
  x: number;
  y: number;
}

export interface LinkLoad {
  link: string;
  line: string;
  from: StationReference;
  to: StationReference;
  order: number;
  direction: string;
  total: number;
  early: number;
  amPeak: number;
  midday: number;
  pmPeak: number;
  evening: number;
  late: number;
  quarterHours: Record<string, number>;
}

export const TimeInterval = regex("^\\d{2}\\d{2}-\\d{2}\\d{2}$");
export type TimeInterval = typeof TimeInterval.infer;

export function formatTimeInterval(from: Date, to: Date): TimeInterval {
  return `${BigInt(from.getHours())}${BigInt(from.getMinutes())}-${BigInt(
    to.getHours()
  )}${BigInt(to.getMinutes())}`;
}

export const QUARTER_HOURS = range(0, 24).flatMap((hour) =>
  range(0, 60, (i) => i, 15).map((minute) =>
    formatTimeInterval(
      new Date(0, 0, 0, hour, minute),
      new Date(0, 0, 0, hour, minute + 15)
    )
  )
);
