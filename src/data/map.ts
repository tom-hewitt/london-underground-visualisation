import {
  Line,
  Link,
  Station,
  StationNode,
  StationNodeReference,
} from "./types";

export const STATIONS: Station[] = [
  {
    name: "Elephant & Castle LU",
    displayName: "Elephant & Castle",
    nlc: 570,
    asc: "ELEu",
  },
  { name: "Lambeth North", nlc: 628, asc: "LAMu" },
  { name: "Waterloo LU", displayName: "Waterloo", nlc: 747, asc: "WLOu" },
  { name: "Embankment", nlc: 542, asc: "EMBu" },
  {
    name: "Charing Cross LU",
    displayName: "Charing Cross",
    nlc: 718,
    asc: "CHXu",
  },
  { name: "Piccadilly Circus", nlc: 674, asc: "PICu" },
  { name: "Oxford Circus", nlc: 669, asc: "OXCu" },
  { name: "Regent's Park", nlc: 685, asc: "RPKu" },
  { name: "Baker Street", nlc: 511, asc: "BSTu" },
  { name: "Marylebone LU", displayName: "Marylebone", nlc: 641, asc: "MYBu" },
  {
    name: "Edgware Road (Bak)",
    displayName: "Edgware Road",
    nlc: 774,
    asc: "ERBu",
  },
  { name: "Paddington TfL", nlc: 670, asc: "PADu" },
  { name: "Warwick Avenue", nlc: 746, asc: "WARu" },
  { name: "Maida Vale", nlc: 637, asc: "MDVu" },
  { name: "Kilburn Park", nlc: 623, asc: "KPKu" },
  { name: "Queen's Park", nlc: 680, asc: "QPKu" },
  { name: "Kensal Green", nlc: 617, asc: "KGNu" },
  { name: "Willesden Junction", nlc: 766, asc: "WJNu" },
  { name: "Harlesden", nlc: 596, asc: "HARu" },
  { name: "Stonebridge Park", nlc: 717, asc: "SPKu" },
  { name: "Wembley Central", nlc: 751, asc: "WEMu" },
  { name: "North Wembley", nlc: 659, asc: "NWBu" },
  { name: "South Kenton", nlc: 709, asc: "SKTu" },
  { name: "Kenton", nlc: 620, asc: "KETu" },
  { name: "Harrow & Wealdstone", nlc: 597, asc: "HAWu" },

  { name: "Oval", nlc: 668, asc: "OVLu" },

  { name: "Bank and Monument", nlc: 513, asc: "BNKu" },
];

export const STATION_NODES: Record<string, StationNode> = {
  // Bakerloo
  ELEu_BAK: {
    name: "ELEu_BAK",
    station: { nlc: 570 },
    interchange: true,
    x: 518.1,
    y: 581,
  },
  LAMu_BAK: {
    name: "LAMu_BAK",
    station: { nlc: 628 },
    x: 509.5,
    y: 552,
  },
  WLOu_BAK: {
    name: "WLOu_BAK",
    station: { nlc: 747 },
    interchange: true,
    x: 509.5,
    y: 511.5,
  },
  EMBu_BAK: {
    name: "EMBu_BAK",
    station: { nlc: 542 },
    interchange: true,
    x: 509.5,
    y: 479.6,
  },

  // District
  WMSu_DIS: {
    name: "WMSu_DIS",
    station: { nlc: 761 },
    interchange: true,
    x: 482,
    y: 479.2,
  },

  // Jubilee
  SWKu_JUB: {
    name: "SWKu_JUB",
    station: { nlc: 704 },
    interchange: true,
    x: 531.5,
    y: 523.9,
  },
  WLOu_JUB: {
    name: "WLOu_JUB",
    station: { nlc: 747 },
    interchange: true,
    x: 495.3,
    y: 511.5,
  },
  WMSu_JUB: {
    name: "WMSu_JUB",
    station: { nlc: 761 },
    interchange: true,
    x: 482,
    y: 472.5,
  },

  // Northern
  OVLu_NOR: {
    name: "OVLu_NOR",
    station: { nlc: 668 },
    interchange: true,
    x: 490,
    y: 602.5,
  },
  KENu_NORx: {
    name: "KENu_NORx",
    station: { nlc: 571 },
    interchange: true,
    x: 502.6,
    y: 581.1,
  },
  KENu_NORb: {
    name: "KENu_NORb",
    station: { nlc: 571 },
    interchange: true,
    x: 510,
    y: 589.3,
  },
  WLOu_NOR: {
    name: "WLOu_NOR",
    station: { nlc: 747 },
    interchange: true,
    x: 502.5,
    y: 511.5,
  },
  EMBu_NOR: {
    name: "EMBu_NOR",
    station: { nlc: 542 },
    interchange: true,
    x: 502.5,
    y: 472.5,
  },

  // Waterloo & City
  BNKu_WAC: {
    name: "BNKu_WAC",
    station: { nlc: 558 },
    interchange: true,
    x: 591.7,
    y: 413.8,
  },
};

export const STATION_NODE_ALIASES: Record<string, string> = {
  EMBu_DIS: "EMBu_BAK",
  ELEu_NOR: "ELEu_BAK",
  WLOu_WAC: "WLOu_BAK",
};

export function resolveStationNodeReference(
  reference: StationNodeReference
): StationNodeReference {
  return { name: STATION_NODE_ALIASES[reference.name] ?? reference.name };
}

export function getStationNode(reference: StationNodeReference): StationNode {
  return STATION_NODES[resolveStationNodeReference(reference).name];
}

export const LINES: Record<string, Line> = {
  Bakerloo: {
    name: "Bakerloo",
    abbreviation: "BAK",
    directions: ["NB", "SB"],
    colour: "#AB571E",
  },
  District: {
    name: "District",
    abbreviation: "DIS",
    directions: ["EB", "WB"],
    colour: "#007336",
  },
  Northern: {
    name: "Northern",
    abbreviation: "NOR",
    directions: ["NB", "SB"],
    colour: "#000000",
  },
  Jubilee: {
    name: "Jubilee",
    abbreviation: "JUB",
    directions: ["NB", "SB"],
    colour: "#82898F",
  },
  "Waterloo & City": {
    name: "Waterloo & City",
    abbreviation: "WAC",
    directions: ["EB", "WB"],
    colour: "#7CC5AF",
  },
};

export const LINKS: Link[] = [
  // Bakerloo
  {
    line: { name: "Bakerloo" },
    from: { name: "ELEu_BAK" },
    to: { name: "LAMu_BAK" },
    path: [
      { x: 511.8, y: 574.7 },
      { x: 509.5, y: 569.3 },
    ],
  },
  {
    line: { name: "Bakerloo" },
    from: { name: "LAMu_BAK" },
    to: { name: "WLOu_BAK" },
  },
  {
    line: { name: "Bakerloo" },
    from: { name: "WLOu_BAK" },
    to: { name: "EMBu_BAK" },
  },

  // Jubilee
  {
    line: { name: "Jubilee" },
    from: { name: "SWKu_JUB" },
    to: { name: "WLOu_JUB" },
    path: [
      { x: 502.9, y: 523.9 },
      { x: 495.3, y: 516.3 },
    ],
  },
  {
    line: { name: "Jubilee" },
    from: { name: "WLOu_JUB" },
    to: { name: "WMSu_JUB" },
    path: [
      { x: 495.4, y: 488.9 },
      { x: 493.1, y: 483.5 },
    ],
  },

  // Northern
  {
    line: { name: "Northern" },
    from: { name: "OVLu_NOR" },
    to: { name: "KENu_NORx" },
    path: [
      { x: 492.8, y: 596.7 },
      { x: 495.1, y: 590.9 },
    ],
  },
  {
    line: { name: "Northern" },
    from: { name: "OVLu_NOR" },
    to: { name: "KENu_NORb" },
    path: [
      { x: 495.9, y: 599.9 },
      { x: 501.7, y: 597.6 },
    ],
  },
  {
    line: { name: "Northern" },
    from: { name: "KENu_NORb" },
    to: { name: "ELEu_NOR" },
  },
  {
    line: { name: "Northern" },
    from: { name: "KENu_NORx" },
    to: { name: "WLOu_NOR" },
  },
  {
    line: { name: "Northern" },
    from: { name: "WLOu_NOR" },
    to: { name: "EMBu_NOR" },
  },

  // District
  {
    line: { name: "District" },
    from: { name: "WMSu_DIS" },
    to: { name: "EMBu_DIS" },
  },

  // Waterloo & City
  {
    line: { name: "Waterloo & City" },
    from: { name: "WLOu_WAC" },
    to: { name: "BNKu_WAC" },
    path: [
      { x: 547.7, y: 511.6 },
      { x: 553.1, y: 509.3 },
      { x: 583.6, y: 478.8 },
      { x: 585.9, y: 473.4 },
      { x: 585.9, y: 422.7 },
      { x: 588.2, y: 417.3 },
    ],
  },
];

export function linkNames(link: Link): string[] {
  const line = LINES[link.line.name];

  const [forwardDirection, backwardDirection] = line.directions;

  return [
    `${link.from.name}_${forwardDirection}>${link.to.name}_${forwardDirection}@${line.abbreviation}`,
    `${link.to.name}_${backwardDirection}>${link.from.name}_${backwardDirection}@${line.abbreviation}`,
  ];
}
