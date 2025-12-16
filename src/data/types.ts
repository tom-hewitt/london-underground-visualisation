import { type } from "arktype";

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
  name: string | string[];
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

export interface WeightedStationNode extends StationNode {
  weight: number;
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

/// A link made up of multiple visual sections between two station nodes.
export interface Link {
  lines: LineReference[];
  from: StationNodeReference & { directions?: [string, string] };
  to: StationNodeReference & { directions?: [string, string] };
  path?: LinkNodeReference[];
}

export interface WeightedLineReference extends LineReference {
  weight: number;
}

export interface WeightedLink extends Link {
  lines: WeightedLineReference[];
}

export interface WeightedLineReferenceWithFrequency
  extends WeightedLineReference {
  frequencies: [number, number];
}

export interface WeightedLinkWithFrequencies extends WeightedLink {
  lines: WeightedLineReferenceWithFrequency[];
}

export interface LinkReference {
  from: StationNodeReference;
  to: StationNodeReference;
  line: LineReference;
}

/// A point along a link that isn't a station node. The same link node can be reused by different links.
export interface LinkNode {
  x: number;
  y: number;
}

export interface LinkNodeReference {
  linkNodeName: string;
}

export interface LinkSection {
  lines: LineReference[];
}

export interface WeightedLinkSection extends LinkSection {
  from: StationNodeReference | LinkNodeReference;
  to: StationNodeReference | LinkNodeReference;
  lines: WeightedLineReference[];
}

export interface PathNode {
  x: number;
  y: number;
  cp1?: { x: number; y: number };
  cp2?: { x: number; y: number };
}

export type NonEmptyArray<T> = [T, ...T[]];

export const DayOfWeek = type(
  "'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'"
);

export type DayOfWeek = typeof DayOfWeek.infer;
