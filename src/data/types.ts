import { regex } from "arktype";
import { range } from "radash";

export interface Station {
  name: string;
  nlc: number;
  asc: string;
  interchange?: boolean;
}

export interface StationReference {
  nlc: number;
}

export interface StationLabel {
  name: string;
  station: StationReference;
  position: StationLabelPosition;
  alignment: Alignment;
}

export type StationLabelPosition =
  | {
      x: number;
      y: number;
    }
  | {
      node: StationNodeReference;
    };

export interface Alignment {
  textAnchor: "start" | "middle" | "end";
  dominantBaseline: "text-before-edge" | "middle" | "text-after-edge";
}

/// Represents a specific station node on the map. A station can have multiple nodes, e.g. Paddington.
export interface StationNode {
  name: string;
  station: StationReference;
  x: number;
  y: number;
}

export interface StationNodeReference {
  nodeName: string;
}

export interface Line {
  name: string;
  abbreviation: string;
  directions: [string, string];
  colour: string;
}

export interface LineReference {
  lineName: string;
}

export interface Link {
  line: LineReference;
  from: StationNodeReference & { directions?: [string, string] };
  to: StationNodeReference & { directions?: [string, string] };
  path?: PathNode[];
}

export interface LinkReference {
  from: StationNodeReference;
  to: StationNodeReference;
  line: LineReference;
}

export interface PathNode {
  x: number;
  y: number;
  cp1?: { x: number; y: number };
  cp2?: { x: number; y: number };
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

export type NonEmptyArray<T> = [T, ...T[]];
