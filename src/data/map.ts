import {
  Line,
  Link,
  Station,
  StationLabel,
  StationNode,
  StationNodeReference,
} from "./types";

export const STATIONS: Station[] = [
  {
    name: "Elephant & Castle LU",
    nlc: 570,
    asc: "ELEu",
    interchange: true,
  },
  { name: "Lambeth North", nlc: 628, asc: "LAMu" },
  {
    name: "Waterloo LU",
    nlc: 747,
    asc: "WLOu",
    interchange: true,
  },
  { name: "Embankment", nlc: 542, asc: "EMBu", interchange: true },
  {
    name: "Charing Cross LU",
    nlc: 718,
    asc: "CHXu",
  },
  { name: "Piccadilly Circus", nlc: 674, asc: "PICu" },
  { name: "Oxford Circus", nlc: 669, asc: "OXCu" },
  { name: "Regent's Park", nlc: 685, asc: "RPKu" },
  { name: "Baker Street", nlc: 511, asc: "BSTu" },
  { name: "Marylebone LU", nlc: 641, asc: "MYBu" },
  {
    name: "Edgware Road (Bak)",
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

  { name: "Westminster", nlc: 761, asc: "WMSu", interchange: true },

  { name: "Southwark", nlc: 784, asc: "SWKu", interchange: true },

  { name: "Oval", nlc: 668, asc: "OVLu", interchange: true },
  { name: "Kennington", nlc: 616, asc: "KENu", interchange: true },

  { name: "Bank and Monument", nlc: 513, asc: "BNKu", interchange: true },
];

export const STATION_LABELS: StationLabel[] = [
  {
    name: "Oval",
    station: { nlc: 668 },
    position: {
      node: { nodeName: "OVLu_NOR" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Kennington",
    station: { nlc: 616 },
    position: {
      node: { nodeName: "KENu_NORx" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Elephant & Castle",
    station: { nlc: 570 },
    position: {
      node: { nodeName: "ELEu_BAK" },
    },
    alignment: {
      textAnchor: "start",
      dominantBaseline: "text-before-edge",
    },
  },
  {
    name: "Lambeth North",
    station: { nlc: 628 },
    position: {
      node: { nodeName: "LAMu_BAK" },
    },
    alignment: {
      textAnchor: "start",
      dominantBaseline: "middle",
    },
  },
  {
    name: "Waterloo",
    station: { nlc: 747 },
    position: {
      node: { nodeName: "WLOu_JUB" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "middle",
    },
  },
  {
    name: "Embankment",
    station: { nlc: 542 },
    position: {
      node: { nodeName: "EMBu_BAK" },
    },
    alignment: {
      textAnchor: "start",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Westminster",
    station: { nlc: 761 },
    position: {
      node: { nodeName: "WMSu_JUB" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "middle",
    },
  },
];

export const STATION_NODES: Record<string, StationNode> = {
  // Bakerloo
  ELEu_BAK: {
    name: "ELEu_BAK",
    station: { nlc: 570 },
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
    x: 509.5,
    y: 511.5,
  },
  EMBu_BAK: {
    name: "EMBu_BAK",
    station: { nlc: 542 },
    x: 509.5,
    y: 479.6,
  },

  // District
  WMSu_DIS: {
    name: "WMSu_DIS",
    station: { nlc: 761 },
    x: 482,
    y: 479.2,
  },

  // Jubilee
  SWKu_JUB: {
    name: "SWKu_JUB",
    station: { nlc: 704 },
    x: 531.5,
    y: 523.9,
  },
  WLOu_JUB: {
    name: "WLOu_JUB",
    station: { nlc: 747 },
    x: 495.3,
    y: 511.5,
  },
  WMSu_JUB: {
    name: "WMSu_JUB",
    station: { nlc: 761 },
    x: 482,
    y: 472.5,
  },

  // Northern
  OVLu_NOR: {
    name: "OVLu_NOR",
    station: { nlc: 668 },
    x: 490,
    y: 602.5,
  },
  KENu_NORx: {
    name: "KENu_NORx",
    station: { nlc: 616 },
    x: 502.6,
    y: 581.1,
  },
  KENu_NORb: {
    name: "KENu_NORb",
    station: { nlc: 616 },
    x: 510,
    y: 589.3,
  },
  WLOu_NOR: {
    name: "WLOu_NOR",
    station: { nlc: 747 },
    x: 502.5,
    y: 511.5,
  },
  EMBu_NOR: {
    name: "EMBu_NOR",
    station: { nlc: 542 },
    x: 502.5,
    y: 472.5,
  },

  // Waterloo & City
  BNKu_WAC: {
    name: "BNKu_WAC",
    station: { nlc: 513 },
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
  return {
    nodeName: STATION_NODE_ALIASES[reference.nodeName] ?? reference.nodeName,
  };
}

export function getStationNode(reference: StationNodeReference): StationNode {
  return STATION_NODES[resolveStationNodeReference(reference).nodeName];
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
    line: { lineName: "Bakerloo" },
    from: { nodeName: "ELEu_BAK" },
    to: { nodeName: "LAMu_BAK" },
    path: [
      { x: 511.8, y: 574.7 },
      { x: 509.5, y: 569.3 },
    ],
  },
  {
    line: { lineName: "Bakerloo" },
    from: { nodeName: "LAMu_BAK" },
    to: { nodeName: "WLOu_BAK" },
  },
  {
    line: { lineName: "Bakerloo" },
    from: { nodeName: "WLOu_BAK" },
    to: { nodeName: "EMBu_BAK" },
  },

  // Jubilee
  {
    line: { lineName: "Jubilee" },
    from: { nodeName: "SWKu_JUB" },
    to: { nodeName: "WLOu_JUB" },
    path: [
      {
        x: 502.9,
        y: 523.9,
        cp1: { x: 502.9, y: 523.9 },
        cp2: { x: 498.7, y: 423.9 },
      },
      { x: 495.3, y: 516.3, cp1: { x: 495.3, y: 520.5 } },
    ],
  },
  {
    line: { lineName: "Jubilee" },
    from: { nodeName: "WLOu_JUB" },
    to: { nodeName: "WMSu_JUB" },
    path: [
      { x: 495.4, y: 488.9 },
      { x: 493.1, y: 483.5 },
    ],
  },

  // Northern
  {
    line: { lineName: "Northern" },
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORx" },
    path: [
      { x: 492.8, y: 596.7 },
      { x: 495.1, y: 590.9 },
    ],
  },
  {
    line: { lineName: "Northern" },
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORb" },
    path: [
      { x: 495.9, y: 599.9 },
      { x: 501.7, y: 597.6 },
    ],
  },
  {
    line: { lineName: "Northern" },
    from: { nodeName: "KENu_NORb" },
    to: { nodeName: "ELEu_NOR" },
  },
  {
    line: { lineName: "Northern" },
    from: { nodeName: "KENu_NORx" },
    to: { nodeName: "WLOu_NOR" },
  },
  {
    line: { lineName: "Northern" },
    from: { nodeName: "WLOu_NOR" },
    to: { nodeName: "EMBu_NOR" },
  },

  // District
  {
    line: { lineName: "District" },
    from: { nodeName: "WMSu_DIS" },
    to: { nodeName: "EMBu_DIS" },
  },

  // Waterloo & City
  {
    line: { lineName: "Waterloo & City" },
    from: { nodeName: "WLOu_WAC" },
    to: { nodeName: "BNKu_WAC" },
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
  const line = LINES[link.line.lineName];

  const [forwardDirection, backwardDirection] = line.directions;

  return [
    `${link.from.nodeName}_${forwardDirection}>${link.to.nodeName}_${forwardDirection}@${line.abbreviation}`,
    `${link.to.nodeName}_${backwardDirection}>${link.from.nodeName}_${backwardDirection}@${line.abbreviation}`,
  ];
}
