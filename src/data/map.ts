import {
  Line,
  LineReference,
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

  { name: "Temple", nlc: 724, asc: "TEMu" },
  { name: "Blackfriars LU", nlc: 521, asc: "BLFu", interchange: true },
  { name: "Mansion House", nlc: 639, asc: "MANu" },
  { name: "Cannon Street LU", nlc: 536, asc: "CSTu", interchange: true },
  { name: "Tower Hill", nlc: 731, asc: "THLu", interchange: true },
  { name: "Aldgate East", nlc: 503, asc: "ALEu" },

  { name: "Westminster", nlc: 761, asc: "WMSu", interchange: true },

  { name: "Southwark", nlc: 784, asc: "SWKu", interchange: true },

  { name: "St Paul's", nlc: 697, asc: "STPu", interchange: true },
  { name: "Liverpool Street LU", nlc: 634, asc: "LSTu", interchange: true },
  { name: "Aldgate", nlc: 502, asc: "ALDu" },
  { name: "Moorgate", nlc: 645, asc: "MGTu", interchange: true },

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
    name: "Southwark",
    station: { nlc: 784 },
    position: {
      node: { nodeName: "SWKu_JUB" },
    },
    alignment: {
      textAnchor: "middle",
      dominantBaseline: "text-before-edge",
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
  {
    name: "Temple",
    station: { nlc: 724 },
    position: {
      node: { nodeName: "TEMu_DIS" },
    },
    alignment: {
      textAnchor: "middle",
      dominantBaseline: "text-before-edge",
    },
  },
  {
    name: "Blackfriars",
    station: { nlc: 521 },
    position: {
      node: { nodeName: "BLFu_DIS" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Mansion House",
    station: { nlc: 639 },
    position: {
      node: { nodeName: "MANu_DIS" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Cannon Street",
    station: { nlc: 536 },
    position: {
      node: { nodeName: "CSTu_DIS" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Monument",
    station: { nlc: 513 },
    position: {
      node: { nodeName: "BNKu_DIS" },
    },
    alignment: {
      textAnchor: "middle",
      dominantBaseline: "text-before-edge",
    },
  },
  {
    name: "Tower Hill",
    station: { nlc: 731 },
    position: {
      node: { nodeName: "THLu_DIS" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-before-edge",
    },
  },
  {
    name: "Aldgate East",
    station: { nlc: 503 },
    position: {
      node: { nodeName: "ALEu_DIS" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "Aldgate",
    station: { nlc: 502 },
    position: {
      node: { nodeName: "ALDu_MET" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "middle",
    },
  },
  {
    name: "Moorgate",
    station: { nlc: 645 },
    position: {
      node: { nodeName: "MGTu_MET" },
    },
    alignment: {
      textAnchor: "end",
      dominantBaseline: "middle",
    },
  },
  {
    name: "Bank",
    station: { nlc: 513 },
    position: {
      node: { nodeName: "BNKu_NOR" },
    },
    alignment: {
      textAnchor: "start",
      dominantBaseline: "text-after-edge",
    },
  },
  {
    name: "St Paul's",
    station: { nlc: 697 },
    position: {
      node: { nodeName: "STPu_CEN" },
    },
    alignment: {
      textAnchor: "middle",
      dominantBaseline: "text-before-edge",
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

  // Central
  STPu_CEN: {
    name: "STPu_CEN",
    station: { nlc: 697 },
    x: 573.3,
    y: 419.4,
  },

  // District
  WMSu_DIS: {
    name: "WMSu_DIS",
    station: { nlc: 761 },
    x: 482,
    y: 479.2,
  },
  TEMu_DIS: {
    name: "TEMu_DIS",
    station: { nlc: 724 },
    x: 540.75,
    y: 479.6,
  },
  BLFu_DIS: {
    name: "BLFu_DIS",
    station: { nlc: 521 },
    x: 563.9,
    y: 466.15,
  },
  MANu_DIS: {
    name: "MANu_DIS",
    station: { nlc: 639 },
    x: 571.35,
    y: 458.91,
  },
  CSTu_DIS: {
    name: "CSTu_DIS",
    station: { nlc: 536 },
    x: 579.4,
    y: 450.9,
  },
  BNKu_DIS: {
    name: "BNKu_DIS",
    station: { nlc: 513 },
    x: 613,
    y: 436.6,
  },
  THLu_DIS: {
    name: "THLu_DIS",
    station: { nlc: 731 },
    x: 646.2,
    y: 436.5,
  },
  ALEu_DIS: {
    name: "ALEu_DIS",
    station: { nlc: 503 },
    x: 679.29,
    y: 396.67,
  },

  // Jubilee
  SWKu_JUB: {
    name: "SWKu_JUB",
    station: { nlc: 784 },
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

  // Metropolitan
  ALDu_MET: {
    name: "ALDu_MET",
    station: { nlc: 502 },
    x: 659,
    y: 413.8,
  },
  MGTu_MET: {
    name: "MGTu_MET",
    station: { nlc: 645 },
    x: 592.2,
    y: 387.2,
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
  BNKu_NOR: {
    name: "BNKu_NOR",
    station: { nlc: 513 },
    x: 602.5,
    y: 425.9,
  },
  MGTu_NOR: {
    name: "MGTu_NOR",
    station: { nlc: 645 },
    x: 602.5,
    y: 377,
  },

  // Metropolitan
  LSTu_MET: {
    name: "LSTu_MET",
    station: { nlc: 634 },
    x: 611.6,
    y: 390.3,
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
  ALEu_MET: "ALEu_DIS",
  BNKu_CEN: "BNKu_WAC",
  LSTu_CEN: "LSTu_MET",
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
  Central: {
    name: "Central",
    abbreviation: "CEN",
    directions: ["EB", "WB"],
    colour: "#D91A15",
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
  Metropolitan: {
    name: "Metropolitan",
    abbreviation: "MET",
    directions: ["NB", "SB"],
    colour: "#8C1A4F",
  },
  // H&C and Circle are treated as one line in the dataset
  "H&C": {
    name: "H&C",
    abbreviation: "HAM",
    directions: ["IR", "OR"],
    colour: "#EEA0B3",
  },
  Circle: {
    name: "Circle",
    abbreviation: "HAM",
    directions: ["IR", "OR"],
    colour: "#FFD300",
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
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "ELEu_BAK" },
    to: { nodeName: "LAMu_BAK" },
    path: [
      { x: 511.8, y: 574.7 },
      {
        x: 509.5,
        y: 569.3,
        cp1: { x: 510.6, y: 573.5 },
        cp2: { x: 509.5, y: 571 },
      },
    ],
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "LAMu_BAK" },
    to: { nodeName: "WLOu_BAK" },
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "WLOu_BAK" },
    to: { nodeName: "EMBu_BAK" },
  },

  // Jubilee
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "SWKu_JUB" },
    to: { nodeName: "WLOu_JUB" },
    path: [
      {
        x: 502.9,
        y: 523.9,
      },
      {
        x: 495.3,
        y: 516.3,
        cp1: { x: 498.7, y: 523.9 },
        cp2: { x: 495.3, y: 520.5 },
      },
    ],
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "WLOu_JUB" },
    to: { nodeName: "WMSu_JUB" },
    path: [
      { x: 495.4, y: 488.9 },
      {
        x: 493.1,
        y: 483.5,
        cp1: { x: 495.4, y: 487.2 },
        cp2: { x: 494.3, y: 484.7 },
      },
    ],
  },

  // Northern
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORx" },
    path: [
      {
        x: 492.8,
        y: 596.7,
        cp1: { x: 491.7, y: 600.9 },
        cp2: { x: 492.8, y: 598.4 },
      },
      {
        x: 495.1,
        y: 590.9,
        cp1: { x: 492.8, y: 595 },
        cp2: { x: 493.8, y: 592.1 },
      },
    ],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORb" },
    path: [
      {
        x: 495.9,
        y: 599.9,
        cp1: { x: 491.7, y: 600.9 },
        cp2: { x: 494.1, y: 599.9 },
      },
      {
        x: 501.7,
        y: 597.6,
        cp1: { x: 498, y: 599.9 },
        cp2: { x: 500.5, y: 598.8 },
      },
    ],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "KENu_NORb" },
    to: { nodeName: "ELEu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "KENu_NORx" },
    to: { nodeName: "WLOu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "WLOu_NOR" },
    to: { nodeName: "EMBu_NOR" },
  },

  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "BNKu_NOR" },
    to: { nodeName: "MGTu_NOR" },
  },

  // Central
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "STPu_CEN" },
    to: { nodeName: "BNKu_CEN" },
    path: [
      { x: 581, y: 419.4 },
      {
        x: 586.4,
        y: 417.1,
        cp1: { x: 582.7, y: 419.4 },
        cp2: { x: 585.2, y: 418.3 },
      },
    ],
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "BNKu_CEN" },
    to: { nodeName: "LSTu_CEN" },
  },

  // Waterloo & City
  {
    lines: [{ lineName: "Waterloo & City" }],
    from: { nodeName: "WLOu_WAC" },
    to: { nodeName: "BNKu_WAC" },
    path: [
      { x: 547.7, y: 511.6 },
      {
        x: 553.1,
        y: 509.3,
        cp1: { x: 549.4, y: 511.6 },
        cp2: { x: 551.9, y: 510.5 },
      },
      { x: 583.6, y: 478.8 },
      {
        x: 585.9,
        y: 473.4,
        cp1: { x: 584.9, y: 477.6 },
        cp2: { x: 585.9, y: 475.2 },
      },
      { x: 585.9, y: 422.7 },
      {
        x: 588.2,
        y: 417.3,
        cp1: { x: 585.9, y: 421 },
        cp2: { x: 587, y: 418.5 },
      },
    ],
  },

  // Circle
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "WMSu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "EMBu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "EMBu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "TEMu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "TEMu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "BLFu_DIS", directions: ["EB", "WB"] },
    path: [
      { x: 547.8, y: 479.6 },
      {
        x: 553.3,
        y: 477.3,
        cp1: { x: 550, y: 479.6 },
        cp2: { x: 551.9, y: 478.7 },
      },
    ],
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "BLFu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "MANu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "MANu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "CSTu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "CSTu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "BNKu_DIS", directions: ["EB", "WB"] },
    path: [
      { x: 591.7, y: 438.6 },
      {
        x: 595.5,
        y: 436.5,
        cp1: { x: 592.7, y: 437.6 },
        cp2: { x: 594.1, y: 436.5 },
      },
    ],
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "BNKu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "THLu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }],
    from: { nodeName: "THLu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "ALDu_MET", directions: ["NB", "SB"] },
    path: [
      { x: 653.4, y: 436.5 },
      {
        x: 659,
        y: 432,
        cp1: { x: 659, y: 436.5 },
        cp2: { x: 659, y: 433.5 },
      },
    ],
  },

  {
    lines: [{ lineName: "H&C" }],
    from: { nodeName: "ALEu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    path: [
      { x: 676, y: 400.5 },
      {
        x: 671.4,
        y: 402.7,
        cp1: { x: 674.7, y: 401.9 },
        cp2: { x: 673.7, y: 402.7 },
      },
      {
        x: 666.7,
        y: 400.5,
        cp1: { x: 669.2, y: 402.7 },
        cp2: { x: 668, y: 401.8 },
      },
      { x: 659.4, y: 393.2 },
      {
        x: 652.9,
        y: 390.3,
        cp1: { x: 657.5, y: 391.3 },
        cp2: { x: 655, y: 390.3 },
      },
    ],
  },
  {
    lines: [
      { lineName: "Metropolitan" },
      { lineName: "Circle" },
      { lineName: "H&C" },
    ],
    from: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "MGTu_MET", directions: ["NB", "SB"] },
    path: [
      { x: 598.4, y: 390.3 },
      {
        x: 592.9,
        y: 388,
        cp1: { x: 596.2, y: 390.3 },
        cp2: { x: 594.3, y: 389.4 },
      },
    ],
  },

  {
    lines: [{ lineName: "Metropolitan" }, { lineName: "Circle" }],
    from: { nodeName: "ALDu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    path: [
      { x: 658.8, y: 398.1 },
      {
        x: 656.5,
        y: 392.6,
        cp1: { x: 658.8, y: 395.9 },
        cp2: { x: 657.9, y: 394 },
      },
      {
        x: 651,
        y: 390.3,
        cp1: { x: 655.1, y: 391.2 },
        cp2: { x: 653.1, y: 390.3 },
      },
    ],
  },

  {
    lines: [{ lineName: "District" }],
    from: { nodeName: "THLu_DIS" },
    to: { nodeName: "ALEu_DIS" },
    path: [
      { x: 651.9, y: 436.4 },
      {
        x: 659,
        y: 433.5,
        cp1: { x: 654.6, y: 436.4 },
        cp2: { x: 657.1, y: 435.4 },
      },
      {
        x: 661.9,
        y: 426.4,
        cp1: { x: 660.9, y: 431.6 },
        cp2: { x: 661.9, y: 429.1 },
      },
      { x: 661.9, y: 417.2 },
      {
        x: 664.2,
        y: 411.7,
        cp1: { x: 661.9, y: 415.2 },
        cp2: { x: 662.7, y: 413.2 },
      },
    ],
  },
];

export function linkNames(
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
