import {
  Line,
  LineReference,
  Link,
  LinkNode,
  LinkSection,
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
  { name: "Oxford Circus", nlc: 669, asc: "OXCu", interchange: true },
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

  { name: "Bayswater", nlc: 517, asc: "BAYu" },
  { name: "Notting Hill Gate", nlc: 663, asc: "NHGu", interchange: true },
  { name: "Holland Park", nlc: 605, asc: "HST" },
  { name: "Earl's Court", nlc: 562, asc: "ECTu", interchange: true },
  { name: "Gloucester Road", nlc: 583, asc: "GRDu" },
  { name: "South Kensington", nlc: 708, asc: "SKNu", interchange: true },
  { name: "Sloane Square", nlc: 702, asc: "SSQu" },
  { name: "Victoria LU", nlc: 741, asc: "VICu", interchange: true },
  { name: "St James's Park", nlc: 695, asc: "SJPu" },
  { name: "Westminster", nlc: 761, asc: "WMSu", interchange: true },

  { name: "London Bridge LU", nlc: 635, asc: "LONu", interchange: true },
  { name: "Southwark", nlc: 784, asc: "SWKu", interchange: true },
  { name: "Green Park", nlc: 590, asc: "GPKu", interchange: true },

  { name: "Queensway", nlc: 681, asc: "QWYu" },
  { name: "Lancaster Gate", nlc: 629, asc: "LANu" },
  { name: "Marble Arch", nlc: 640, asc: "MARu" },
  { name: "Bond Street", nlc: 524, asc: "BDSu", interchange: true },
  { name: "Tottenham Court Road", nlc: 728, asc: "TCRu", interchange: true },
  { name: "Holborn", nlc: 607, asc: "HOLu", interchange: true },
  { name: "Chancery Lane", nlc: 541, asc: "CYLu" },
  { name: "St Paul's", nlc: 697, asc: "STPu", interchange: true },

  { name: "Liverpool Street LU", nlc: 634, asc: "LSTu", interchange: true },
  { name: "Aldgate", nlc: 502, asc: "ALDu" },
  { name: "Moorgate", nlc: 645, asc: "MGTu", interchange: true },
  { name: "Barbican", nlc: 501, asc: "BARu", interchange: true },
  { name: "Farringdon", nlc: 577, asc: "FARu", interchange: true },
  {
    name: "King's Cross St. Pancras",
    nlc: 625,
    asc: "KXXu",
    interchange: true,
  },
  { name: "Euston Square", nlc: 575, asc: "ESQu", interchange: true },
  { name: "Great Portland Street", nlc: 588, asc: "GPSu" },
  { name: "Edgware Road", nlc: 569, asc: "ERDu", interchange: true },

  { name: "Oval", nlc: 668, asc: "OVLu", interchange: true },
  { name: "Battersea Power Station", nlc: 832, asc: "BPSu" },
  { name: "Nine Elms", nlc: 831, asc: "NIEu" },
  { name: "Kennington", nlc: 616, asc: "KENu", interchange: true },
  { name: "Leicester Square", nlc: 631, asc: "LSQu", interchange: true },
  { name: "Goodge Street", nlc: 586, asc: "GSTu" },
  { name: "Warren Street", nlc: 745, asc: "WSTu", interchange: true },
  { name: "Euston LU", nlc: 574, asc: "EUSu", interchange: true },
  { name: "Borough", nlc: 525, asc: "BORu" },
  { name: "Old Street", nlc: 665, asc: "OLDu" },
  { name: "Angel", nlc: 507, asc: "ANGu" },

  { name: "Bank and Monument", nlc: 513, asc: "BNKu", interchange: true },

  { name: "Vauxhall", nlc: 777, asc: "VUXu", interchange: true },
  { name: "Pimlico", nlc: 776, asc: "PIMu" },

  { name: "Knightsbridge", nlc: 626, asc: "KNBu" },
  { name: "Hyde Park Corner", nlc: 614, asc: "HPCu" },
  { name: "Covent Garden", nlc: 553, asc: "COVu" },
  { name: "Russell Square", nlc: 694, asc: "RSQu" },
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
  CHXu_BAK: {
    name: "CHXu_BAK",
    station: { nlc: 718 },
    x: 502.4,
    y: 453.4,
  },
  PICu_BAK: {
    name: "PICu_BAK",
    station: { nlc: 674 },
    x: 481.3,
    y: 432.2,
  },
  RPKu_BAK: {
    name: "RPKu_BAK",
    station: { nlc: 685 },
    x: 447.7,
    y: 376.5,
  },
  BSTu_BAK: {
    name: "BSTu_BAK",
    station: { nlc: 511 },
    x: 429.2,
    y: 357.9,
  },
  MYBu_BAK: {
    name: "MYBu_BAK",
    station: { nlc: 641 },
    x: 399.8,
    y: 341.1,
  },
  ERBu_BAK: {
    name: "ERBu_BAK",
    station: { nlc: 774 },
    x: 365.5,
    y: 341.2,
  },
  PADu_BAK: {
    name: "PADu_BAK",
    station: { nlc: 670 },
    x: 342.8,
    y: 341.2,
  },

  // Central
  QWYu_CEN: {
    name: "QWYu_CEN",
    station: { nlc: 681 },
    x: 382.1,
    y: 419.4,
  },
  LANu_CEN: {
    name: "LANu_CEN",
    station: { nlc: 629 },
    x: 401,
    y: 415.5,
  },
  MARu_CEN: {
    name: "MARu_CEN",
    station: { nlc: 640 },
    x: 409.6,
    y: 407,
  },
  BDSu_CEN: {
    name: "BDSu_CEN",
    station: { nlc: 524 },
    x: 435.3,
    y: 400.1,
  },
  OXCu_CEN: {
    name: "OXCu_CEN",
    station: { nlc: 669 },
    x: 461.9,
    y: 400.1,
  },
  TCRu_CEN: {
    name: "TCRu_CEN",
    station: { nlc: 728 },
    x: 496.4,
    y: 400.1,
  },
  HOLu_CEN: {
    name: "HOLu_CEN",
    station: { nlc: 607 },
    x: 527.2,
    y: 400.1,
  },
  CYLu_CEN: {
    name: "CYLu_CEN",
    station: { nlc: 541 },
    x: 553.1,
    y: 406.5,
  },

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
  ERDu_DIS: {
    name: "ERDu_DIS",
    station: { nlc: 569 },
    x: 382.7,
    y: 347.6,
  },
  PADu_DIS: {
    name: "PADu_DIS",
    station: { nlc: 670 },
    x: 358.1,
    y: 356.425,
  },
  BAYu_DIS: {
    name: "BAYu_DIS",
    station: { nlc: 517 },
    x: 355.3,
    y: 391.25,
  },
  NHGu_DIS: {
    name: "NHGu_DIS",
    station: { nlc: 663 },
    x: 355.3,
    y: 419.5,
  },
  HSTu_DIS: {
    name: "HSTu_DIS",
    station: { nlc: 605 },
    x: 355.3,
    y: 443.75,
  },
  GRDu_DIS: {
    name: "GRDu_DIS",
    station: { nlc: 583 },
    x: 372.4,
    y: 479.6,
  },
  ECTu_DIS: {
    name: "ECTu_DIS",
    station: { nlc: 562 },
    x: 348.4,
    y: 479.6,
  },
  SKNu_DIS: {
    name: "SKNu_DIS",
    station: { nlc: 708 },
    x: 387.5,
    y: 479.6,
  },
  SSQu_DIS: {
    name: "SSQu_DIS",
    station: { nlc: 702 },
    x: 414.65,
    y: 479.6,
  },
  VICu_DIS: {
    name: "VICu_DIS",
    station: { nlc: 741 },
    x: 434.4,
    y: 479.6,
  },
  SJPu_DIS: {
    name: "SJPu_DIS",
    station: { nlc: 695 },
    x: 454.45,
    y: 479.6,
  },

  // H&C
  BSTu_HAM: {
    name: "BSTu_HAM",
    station: { nlc: 511 },
    x: 438.9,
    y: 348.7,
  },
  PADu_HAM: {
    name: "PADu_HAM",
    station: { nlc: 670 },
    x: 349.2,
    y: 347.6,
  },

  // Jubilee
  LONu_JUB: {
    name: "LONu_JUB",
    station: { nlc: 635 },
    x: 602.3,
    y: 480.7,
  },
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
  GPKu_JUB: {
    name: "GPKu_JUB",
    station: { nlc: 590 },
    x: 441.5,
    y: 432.2,
  },
  BDSu_JUB: {
    name: "BDSu_JUB",
    station: { nlc: 524 },
    x: 429.3,
    y: 393.7,
  },

  // Metropolitan
  ALDu_MET: {
    name: "ALDu_MET",
    station: { nlc: 502 },
    x: 657.7,
    y: 413.8,
  },
  MGTu_MET: {
    name: "MGTu_MET",
    station: { nlc: 645 },
    x: 592.2,
    y: 387.2,
  },
  LSTu_MET: {
    name: "LSTu_MET",
    station: { nlc: 634 },
    x: 611.6,
    y: 390.3,
  },
  BARu_MET: {
    name: "BARu_MET",
    station: { nlc: 501 },
    x: 579,
    y: 374.2,
  },
  FARu_MET: {
    name: "FARu_MET",
    station: { nlc: 577 },
    x: 566.1,
    y: 361.2,
  },
  KXXu_MET: {
    name: "KXXu_MET",
    station: { nlc: 625 },
    x: 543.6,
    y: 348.7,
  },
  ESQu_MET: {
    name: "ESQu_MET",
    station: { nlc: 575 },
    x: 490.5,
    y: 348.7,
  },
  GPSu_MET: {
    name: "GPSu_MET",
    station: { nlc: 588 },
    x: 458.15,
    y: 348.7,
  },

  // Northern
  OVLu_NOR: {
    name: "OVLu_NOR",
    station: { nlc: 668 },
    x: 490,
    y: 602.5,
  },
  BPSu_NOR: {
    name: "BPSu_NOR",
    station: { nlc: 832 },
    x: 411.6,
    y: 571.6,
  },
  NIEu_NOR: {
    name: "NIEu_NOR",
    station: { nlc: 831 },
    x: 429.4,
    y: 571.6,
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
  LSQu_NOR: {
    name: "LSQu_NOR",
    station: { nlc: 631 },
    x: 502.5,
    y: 424.8,
  },
  TCRu_NOR: {
    name: "TCRu_NOR",
    station: { nlc: 728 },
    x: 502.5,
    y: 394.1,
  },
  GSTu_NOR: {
    name: "GSTu_NOR",
    station: { nlc: 586 },
    x: 502.5,
    y: 385,
  },
  WSTu_NOR: {
    name: "WSTu_NOR",
    station: { nlc: 745 },
    x: 502.5,
    y: 359,
  },
  EUSu_NORx: {
    name: "EUSu_NORx",
    station: { nlc: 574 },
    x: 514.4,
    y: 325.4,
  },
  BORu_NOR: {
    name: "BORu_NOR",
    station: { nlc: 525 },
    x: 567.4,
    y: 531.8,
  },
  OLDu_NOR: {
    name: "OLDu_NOR",
    station: { nlc: 665 },
    x: 602.5,
    y: 354.2,
  },
  ANGu_NOR: {
    name: "ANGu_NOR",
    station: { nlc: 507 },
    x: 576.2,
    y: 344.3,
  },
  KXXu_NOR: {
    name: "KXXu_NOR",
    station: { nlc: 625 },
    x: 553.3,
    y: 339.2,
  },

  // Picadilly
  ECTu_PIC: {
    name: "ECTu_PIC",
    station: { nlc: 562 },
    x: 348.4,
    y: 473.8,
  },
  GRDu_PIC: {
    name: "GRDu_PIC",
    station: { nlc: 583 },
    x: 372.4,
    y: 473.8,
  },
  SKNu_PIC: {
    name: "SKNu_PIC",
    station: { nlc: 708 },
    x: 387.6,
    y: 473.8,
  },
  KNBu_PIC: {
    name: "KNBu_PIC",
    station: { nlc: 626 },
    x: 410.1,
    y: 457.4,
  },
  HPCu_PIC: {
    name: "HPCu_PIC",
    station: { nlc: 614 },
    x: 430.3,
    y: 437.2,
  },
  COVu_PIC: {
    name: "COVu_PIC",
    station: { nlc: 553 },
    x: 514.6,
    y: 412.7,
  },
  RSQu_PIC: {
    name: "RSQu_PIC",
    station: { nlc: 694 },
    x: 552.9,
    y: 361.3,
  },

  // Victoria
  VUXu_VIC: {
    name: "VUXu_VIC",
    station: { nlc: 777 },
    x: 447.1,
    y: 579.1,
  },
  PIMu_VIC: {
    name: "PIMu_VIC",
    station: { nlc: 776 },
    x: 441.5,
    y: 520.8,
  },
  VICu_VIC: {
    name: "VICu_VIC",
    station: { nlc: 741 },
    x: 441.6,
    y: 473.3,
  },
  EUSu_VIC: {
    name: "EUSu_VIC",
    station: { nlc: 574 },
    x: 526.7,
    y: 338.6,
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
  NHGu_CEN: "NHGu_DIS",
  OXCu_BAK: "OXCu_CEN",
  BSTu_JUB: "BSTu_BAK",
  CHXu_NOR: "CHXu_BAK",
  LONu_NOR: "LONu_JUB",
  GPKu_VIC: "GPKu_JUB",
  OXCu_VIC: "OXCu_CEN",
  WSTu_VIC: "WSTu_NOR",
  KXXu_VIC: "KXXu_NOR",
  GPKu_PIC: "GPKu_JUB",
  PICu_PIC: "PICu_BAK",
  LSQu_PIC: "LSQu_NOR",
  HOLu_PIC: "HOLu_CEN",
  KXXu_PIC: "KXXu_NOR",
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
  Picadilly: {
    name: "Picadilly",
    abbreviation: "PIC",
    directions: ["EB", "WB"],
    colour: "#2E2B81",
  },
  Victoria: {
    name: "Victoria",
    abbreviation: "VIC",
    directions: ["NB", "SB"],
    colour: "#009CDB",
  },
  "Waterloo & City": {
    name: "Waterloo & City",
    abbreviation: "WAC",
    directions: ["EB", "WB"],
    colour: "#7CC5AF",
  },
};

export const LINK_NODES: Record<string, LinkNode> = {
  // Bakerloo
  "ELEu_BAK-LAMu_BAK-0": { x: 509.5, y: 572.5 },
  "EMB-CHX": { x: 509.5, y: 460.5 },
  "PIC-OXC": { x: 461.7, y: 412 },
  "OXC-RPK": { x: 461.7, y: 390.5 },
  "BST-MYB": { x: 412.5, y: 341.1 },

  // Central
  "QWY-LAN": { x: 397, y: 419.4 },
  "MAR-BDS": { x: 416.5, y: 400.1 },
  "HOL-CYL": { x: 546.5, y: 400.1 },
  "CYL-STP": { x: 566, y: 419.4 },
  "STP-BNK": { x: 584.5, y: 419.4 },

  // Circle
  "KXX-FAR": { x: 553.5, y: 348.7 },
  "PAD-BAY": { x: 355.3, y: 356.425 },
  "HST-GRD": { x: 355.3, y: 479.6 },

  // District
  "CST-BNK": { x: 594, y: 436.5 },
  "TEM-BLF": { x: 551.5, y: 479.6 },

  // Jubilee
  "LON-SWK-0": { x: 593.5, y: 481 },
  "LON-SWK-1": { x: 551, y: 523.9 },
  "SWKu_JUB-WLOu_JUB-0": { x: 495.3, y: 523.9 },
  "WLOu_JUB-WMSu_JUB-0": { x: 495.4, y: 486 },
  "GPK-BDS": { x: 429.3, y: 419.5 },

  // Northern
  "OVLu_NOR-KENu_NOR-0": { x: 492.8, y: 599.9 },
  "OVLu_NOR-KENu_NORx-1": { x: 492.8, y: 593.25 },
  "OVLu_NOR-KENu_NORx-2": { x: 498.5, y: 587.8 },
  "OVLu_NOR-KENu_NORb-1": { x: 499, y: 599.9 },
  "NIE-KEN-0": { x: 458, y: 571.6 },
  "NIE-KEN-1": { x: 474, y: 587.8 },
  "WST-EUS-0": { x: 502.5, y: 352.5 },
  "WST-EUS-1": { x: 514.4, y: 341 },
  "BOR-LON": { x: 602.6, y: 496.5 },
  "OLD-ANG": { x: 602.5, y: 344.3 },
  "ANG-KXX": { x: 553.3, y: 344.3 },

  "THL-AL-0": { x: 659, y: 436.5 },
  "THL-AL-1": { x: 659, y: 418.5 },

  "ALEu-LSTu_MET": { x: 671, y: 403 },
  "AL-LSTu": { x: 657.7, y: 390.3 },

  "MGT-LST": { x: 595.5, y: 390.3 }, // TODO: this doesn't work if LST-MGT - some weird alphabetic stuff going on

  // Picadilly
  "SKN-KNB": { x: 393.5, y: 473.8 },
  "HPC-GPK": { x: 436, y: 432.1 },
  "PIC-LSQ": { x: 495, y: 432.2 },
  "HOL-RSQ": { x: 553, y: 374 },

  // Victoria
  "VUX-PIM": { x: 441.5, y: 573.5 },
  "GPK-OXC": { x: 441.6, y: 420 },
  "WST-EUS": { x: 523.5, y: 338.6 },

  // Waterloo & City
  "WLO-BNK-0": { x: 550.5, y: 511.6 },
  "WLO-BNK-1": { x: 584.5, y: 476 },
};

export const LINK_SECTIONS: Record<string, LinkSection> = {
  "ALEu_DIS-ALEu-LSTu_MET": {
    lines: [{ lineName: "H&C" }, { lineName: "District" }],
  },
  "AL-LSTu-LSTu_MET": {
    lines: [
      { lineName: "H&C" },
      { lineName: "Circle" },
      { lineName: "Metropolitan" },
    ],
  },
  "AL-LSTu-ALDu_MET": {
    lines: [{ lineName: "Metropolitan" }, { lineName: "Circle" }],
  },
  "THL-AL-0-THLu_DIS": {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
  },
  "THL-AL-0-THL-AL-1": {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
  },
  "BNKu_WAC-STP-BNK": {
    lines: [{ lineName: "Central" }, { lineName: "Waterloo & City" }],
  },
  "HST-GRD-HSTu_DIS": {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
  },
  "GRDu_DIS-HST-GRD": {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
  },
};

export const LINKS: Link[] = [
  // Bakerloo
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "ELEu_BAK" },
    to: { nodeName: "LAMu_BAK" },
    path: [{ linkNodeName: "ELEu_BAK-LAMu_BAK-0" }],
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
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "EMBu_BAK" },
    to: { nodeName: "CHXu_BAK" },
    path: [{ linkNodeName: "EMB-CHX" }],
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "CHXu_BAK" },
    to: { nodeName: "PICu_BAK" },
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "PICu_BAK" },
    to: { nodeName: "OXCu_BAK" },
    path: [{ linkNodeName: "PIC-OXC" }],
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "OXCu_BAK" },
    to: { nodeName: "RPKu_BAK" },
    path: [{ linkNodeName: "OXC-RPK" }],
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "RPKu_BAK" },
    to: { nodeName: "BSTu_BAK" },
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "BSTu_BAK" },
    to: { nodeName: "MYBu_BAK" },
    path: [{ linkNodeName: "BST-MYB" }],
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "MYBu_BAK" },
    to: { nodeName: "ERBu_BAK" },
  },
  {
    lines: [{ lineName: "Bakerloo" }],
    from: { nodeName: "ERBu_BAK" },
    to: { nodeName: "PADu_BAK" },
  },

  // Jubilee
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "LONu_JUB" },
    to: { nodeName: "SWKu_JUB" },
    path: [{ linkNodeName: "LON-SWK-0" }, { linkNodeName: "LON-SWK-1" }],
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "SWKu_JUB" },
    to: { nodeName: "WLOu_JUB" },
    path: [{ linkNodeName: "SWKu_JUB-WLOu_JUB-0" }],
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "WLOu_JUB" },
    to: { nodeName: "WMSu_JUB" },
    path: [{ linkNodeName: "WLOu_JUB-WMSu_JUB-0" }],
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "WMSu_JUB" },
    to: { nodeName: "GPKu_JUB" },
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "GPKu_JUB" },
    to: { nodeName: "BDSu_JUB" },
    path: [{ linkNodeName: "GPK-BDS" }],
  },
  {
    lines: [{ lineName: "Jubilee" }],
    from: { nodeName: "BDSu_JUB" },
    to: { nodeName: "BSTu_JUB" },
  },

  // Picadilly
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "ECTu_PIC" },
    to: { nodeName: "GRDu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "GRDu_PIC" },
    to: { nodeName: "SKNu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "SKNu_PIC" },
    to: { nodeName: "KNBu_PIC" },
    path: [{ linkNodeName: "SKN-KNB" }],
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "KNBu_PIC" },
    to: { nodeName: "HPCu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "HPCu_PIC" },
    to: { nodeName: "GPKu_PIC" },
    path: [{ linkNodeName: "HPC-GPK" }],
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "GPKu_PIC" },
    to: { nodeName: "PICu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "PICu_PIC" },
    to: { nodeName: "LSQu_PIC" },
    path: [{ linkNodeName: "PIC-LSQ" }],
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "LSQu_PIC" },
    to: { nodeName: "COVu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "COVu_PIC" },
    to: { nodeName: "HOLu_PIC" },
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "HOLu_PIC" },
    to: { nodeName: "RSQu_PIC" },
    path: [{ linkNodeName: "HOL-RSQ" }],
  },
  {
    lines: [{ lineName: "Picadilly" }],
    from: { nodeName: "RSQu_PIC" },
    to: { nodeName: "KXXu_PIC" },
  },

  // Victoria
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "VUXu_VIC" },
    to: { nodeName: "PIMu_VIC" },
    path: [{ linkNodeName: "VUX-PIM" }],
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "PIMu_VIC" },
    to: { nodeName: "VICu_VIC" },
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "VICu_VIC" },
    to: { nodeName: "GPKu_VIC" },
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "GPKu_VIC" },
    to: { nodeName: "OXCu_VIC" },
    path: [{ linkNodeName: "GPK-OXC" }],
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "OXCu_VIC" },
    to: { nodeName: "WSTu_VIC" },
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "WSTu_VIC" },
    to: { nodeName: "EUSu_VIC" },
    path: [{ linkNodeName: "WST-EUS" }],
  },
  {
    lines: [{ lineName: "Victoria" }],
    from: { nodeName: "EUSu_VIC" },
    to: { nodeName: "KXXu_VIC" },
  },

  // Northern
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORx" },
    path: [
      { linkNodeName: "OVLu_NOR-KENu_NOR-0" },
      { linkNodeName: "OVLu_NOR-KENu_NORx-1" },
      { linkNodeName: "OVLu_NOR-KENu_NORx-2" },
    ],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "OVLu_NOR" },
    to: { nodeName: "KENu_NORb" },
    path: [
      { linkNodeName: "OVLu_NOR-KENu_NOR-0" },
      { linkNodeName: "OVLu_NOR-KENu_NORb-1" },
    ],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "BPSu_NOR" },
    to: { nodeName: "NIEu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "NIEu_NOR" },
    to: { nodeName: "KENu_NORx" },
    path: [
      { linkNodeName: "NIE-KEN-0" },
      { linkNodeName: "NIE-KEN-1" },
      { linkNodeName: "OVLu_NOR-KENu_NORx-2" },
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
    from: { nodeName: "EMBu_NOR" },
    to: { nodeName: "CHXu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "CHXu_NOR" },
    to: { nodeName: "LSQu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "LSQu_NOR" },
    to: { nodeName: "TCRu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "TCRu_NOR" },
    to: { nodeName: "GSTu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "GSTu_NOR" },
    to: { nodeName: "WSTu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "WSTu_NOR" },
    to: { nodeName: "EUSu_NORx" },
    path: [{ linkNodeName: "WST-EUS-0" }, { linkNodeName: "WST-EUS-1" }],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "ELEu_NOR" },
    to: { nodeName: "BORu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "BORu_NOR" },
    to: { nodeName: "LONu_NOR" },
    path: [{ linkNodeName: "BOR-LON" }],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "LONu_NOR" },
    to: { nodeName: "BNKu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "BNKu_NOR" },
    to: { nodeName: "MGTu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "MGTu_NOR" },
    to: { nodeName: "OLDu_NOR" },
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "OLDu_NOR" },
    to: { nodeName: "ANGu_NOR" },
    path: [{ linkNodeName: "OLD-ANG" }],
  },
  {
    lines: [{ lineName: "Northern" }],
    from: { nodeName: "ANGu_NOR" },
    to: { nodeName: "KXXu_NOR" },
    path: [{ linkNodeName: "ANG-KXX" }],
  },

  // Central
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "NHGu_CEN" },
    to: { nodeName: "QWYu_CEN" },
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "QWYu_CEN" },
    to: { nodeName: "LANu_CEN" },
    path: [{ linkNodeName: "QWY-LAN" }],
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "LANu_CEN" },
    to: { nodeName: "MARu_CEN" },
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "MARu_CEN" },
    to: { nodeName: "BDSu_CEN" },
    path: [{ linkNodeName: "MAR-BDS" }],
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "BDSu_CEN" },
    to: { nodeName: "OXCu_CEN" },
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "OXCu_CEN" },
    to: { nodeName: "TCRu_CEN" },
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "TCRu_CEN" },
    to: { nodeName: "HOLu_CEN" },
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "HOLu_CEN" },
    to: { nodeName: "CYLu_CEN" },
    path: [{ linkNodeName: "HOL-CYL" }],
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "CYLu_CEN" },
    to: { nodeName: "STPu_CEN" },
    path: [{ linkNodeName: "CYL-STP" }],
  },
  {
    lines: [{ lineName: "Central" }],
    from: { nodeName: "STPu_CEN" },
    to: { nodeName: "BNKu_CEN" },
    path: [{ linkNodeName: "STP-BNK" }],
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
      { linkNodeName: "WLO-BNK-0" },
      { linkNodeName: "WLO-BNK-1" },
      { linkNodeName: "STP-BNK" },
    ],
  },

  // Circle
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "WMSu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "EMBu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "EMBu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "TEMu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "TEMu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "BLFu_DIS", directions: ["EB", "WB"] },
    path: [{ linkNodeName: "TEM-BLF" }],
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
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
    path: [{ linkNodeName: "CST-BNK" }],
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "BNKu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "THLu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }],
    from: { nodeName: "THLu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "ALDu_MET", directions: ["NB", "SB"] },
    path: [{ linkNodeName: "THL-AL-0" }, { linkNodeName: "THL-AL-1" }],
  },

  {
    lines: [{ lineName: "H&C" }],
    from: { nodeName: "ALEu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    path: [{ linkNodeName: "ALEu-LSTu_MET" }, { linkNodeName: "AL-LSTu" }],
  },
  {
    lines: [
      { lineName: "H&C" },
      { lineName: "Circle" },
      { lineName: "Metropolitan" },
    ],
    from: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "MGTu_MET", directions: ["NB", "SB"] },
    path: [{ linkNodeName: "MGT-LST" }],
  },
  {
    lines: [
      { lineName: "Metropolitan" },
      { lineName: "Circle" },
      { lineName: "H&C" },
    ],
    from: { nodeName: "MGTu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "BARu_MET", directions: ["NB", "SB"] },
  },
  {
    lines: [
      { lineName: "H&C" },
      { lineName: "Circle" },
      { lineName: "Metropolitan" },
    ],
    from: { nodeName: "BARu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "FARu_MET", directions: ["NB", "SB"] },
  },
  {
    lines: [
      { lineName: "H&C" },
      { lineName: "Circle" },
      { lineName: "Metropolitan" },
    ],
    from: { nodeName: "FARu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "KXXu_MET", directions: ["NB", "SB"] },
    path: [{ linkNodeName: "KXX-FAR" }],
  },
  {
    lines: [
      { lineName: "Metropolitan" },
      { lineName: "Circle" },
      { lineName: "H&C" },
    ],
    from: { nodeName: "KXXu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "ESQu_MET", directions: ["NB", "SB"] },
  },
  {
    lines: [
      { lineName: "H&C" },
      { lineName: "Circle" },
      { lineName: "Metropolitan" },
    ],
    from: { nodeName: "ESQu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "GPSu_MET", directions: ["NB", "SB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "H&C" }],
    from: { nodeName: "GPSu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "BSTu_HAM", directions: ["WB", "EB"] },
  },
  {
    lines: [{ lineName: "H&C" }, { lineName: "Circle" }],
    from: { nodeName: "BSTu_HAM", directions: ["WB", "EB"] },
    to: { nodeName: "ERDu_DIS", directions: ["WB", "EB"] },
  },
  {
    lines: [{ lineName: "H&C" }, { lineName: "Circle" }],
    from: { nodeName: "ERDu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "PADu_HAM", directions: ["WB", "EB"] },
  },

  {
    lines: [{ lineName: "Circle" }], // TODO: Displayed as district and circle on map but no district data exists?
    from: { nodeName: "ERDu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "PADu_DIS", directions: ["WB", "EB"] },
  },
  {
    lines: [{ lineName: "Circle" }],
    from: { nodeName: "HSTu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "GRDu_DIS", directions: ["EB", "WB"] },
    path: [{ linkNodeName: "HST-GRD" }],
  },

  {
    lines: [{ lineName: "Metropolitan" }, { lineName: "Circle" }],
    from: { nodeName: "ALDu_MET", directions: ["NB", "SB"] },
    to: { nodeName: "LSTu_MET", directions: ["NB", "SB"] },
    path: [{ linkNodeName: "AL-LSTu" }],
  },

  // District
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "PADu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "BAYu_DIS", directions: ["WB", "EB"] },
    path: [{ linkNodeName: "PAD-BAY" }],
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "BAYu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "NHGu_DIS", directions: ["WB", "EB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "NHGu_DIS", directions: ["WB", "EB"] },
    to: { nodeName: "HSTu_DIS", directions: ["WB", "EB"] },
  },
  {
    lines: [{ lineName: "District" }],
    from: { nodeName: "ECTu_DIS" },
    to: { nodeName: "HSTu_DIS" },
    path: [{ linkNodeName: "HST-GRD" }],
  },
  {
    lines: [{ lineName: "District" }],
    from: { nodeName: "ECTu_DIS" },
    to: { nodeName: "GRDu_DIS" },
    path: [{ linkNodeName: "HST-GRD" }],
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "GRDu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "SKNu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "SKNu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "SSQu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "SSQu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "VICu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "Circle" }, { lineName: "District" }],
    from: { nodeName: "VICu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "SJPu_DIS", directions: ["EB", "WB"] },
  },
  {
    lines: [{ lineName: "District" }, { lineName: "Circle" }],
    from: { nodeName: "SJPu_DIS", directions: ["EB", "WB"] },
    to: { nodeName: "WMSu_DIS", directions: ["EB", "WB"] },
  },

  {
    lines: [{ lineName: "District" }],
    from: { nodeName: "THLu_DIS" },
    to: { nodeName: "ALEu_DIS" },
    path: [
      { linkNodeName: "THL-AL-0" },
      { linkNodeName: "THL-AL-1" },
      { linkNodeName: "ALEu-LSTu_MET" },
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
