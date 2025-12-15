"use client";

import { cabin } from "@/fonts";
import {
  LINES,
  LINK_NODES,
  LINK_SECTIONS,
  STATION_LABELS,
  STATION_NODES,
  STATIONS,
} from "@/data/tube/network";
import {
  Alignment,
  LineReference,
  Link,
  LinkReference,
  NonEmptyArray,
  Station,
  StationReference,
  WeightedLink,
  WeightedLinkSection,
  WeightedStationNode,
} from "@/data/types";
import { cumsum, max, pairs, scaleLinear } from "d3";
import { zip } from "radash";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { LinkWeights, weightLinks } from "@/data/tube/numbat/process";
import {
  weightLinkSections,
  weightNodesWithMaxLinkSectionWeight,
} from "@/data/process";
import { OffsetPath } from "./OffsetPath";
import { useZoom } from "@/hooks/useZoom";

export function YearlyTubeMapVisualisation({
  dataPerYear,
}: {
  dataPerYear: Record<string, LinkWeights>;
}) {
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);

  const years = useMemo(() => Object.keys(dataPerYear).sort(), [dataPerYear]);

  const yearlyGraphs = useMemo(
    () => years.map((year) => prepareGraph(dataPerYear[year], year)),
    [dataPerYear, years]
  );

  const { weightedLinks, weightedLinkSections, weightedNodes } = useMemo(
    () => yearlyGraphs[selectedYearIndex],
    [selectedYearIndex, yearlyGraphs, years]
  );

  const maxNodeWeight = useMemo(
    () =>
      max(yearlyGraphs, ({ weightedNodes }) =>
        max(Object.values(weightedNodes), (node) => node.weight)
      ) ?? 0,
    [weightedNodes]
  );

  const scale = useMemo(
    () => scaleLinear().domain([0, maxNodeWeight]).range([0, 10]),
    [maxNodeWeight]
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          padding: "16px",
        }}
      >
        <h1 className={cabin.className} style={{ fontWeight: 800 }}>
          Tube Map Visualisation
        </h1>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <label htmlFor="year-input">Year:</label>
          <input
            id="year-input"
            type="range"
            value={selectedYearIndex}
            onChange={(e) => setSelectedYearIndex(parseInt(e.target.value))}
            min={0}
            max={years.length - 1}
          />
          <p>{years[selectedYearIndex]}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexGrow: 1 }}>
        <WeightedNetworkVisualisation
          weightedLinks={weightedLinks}
          weightedNodes={weightedNodes}
          weightedLinkSections={weightedLinkSections}
          linkSizeScale={scale}
          nodeSizeScale={scale}
        />
      </div>
    </div>
  );
}

function prepareGraph(
  data: LinkWeights,
  year: string
): {
  weightedLinks: WeightedLink[];
  weightedLinkSections: Record<string, WeightedLinkSection>;
  weightedNodes: Record<string, WeightedStationNode>;
} {
  const weightedLinks = weightLinks(data, year);

  const weightedLinkSections = weightLinkSections(LINK_SECTIONS, weightedLinks);

  const weightedNodes = weightNodesWithMaxLinkSectionWeight(
    STATION_NODES,
    weightedLinkSections
  );

  return { weightedLinks, weightedLinkSections, weightedNodes };
}

type View = "total" | "time-of-day";

function Interval({ interval }: { interval: [Date, Date] }) {
  const locale: Intl.LocalesArgument = "en-GB";

  const options: Intl.DateTimeFormatOptions = {
    timeStyle: "short",
  };

  const [from, to] = interval.map((date) =>
    date.toLocaleTimeString(locale, options)
  );

  return `${from}-${to}`;
}

function WeightedNetworkVisualisation({
  weightedLinks,
  weightedNodes,
  weightedLinkSections,
  linkSizeScale,
  nodeSizeScale,
}: {
  weightedLinks: WeightedLink[];
  weightedNodes: Record<string, WeightedStationNode>;
  weightedLinkSections: Record<string, WeightedLinkSection>;
  linkSizeScale: (n: number) => number;
  nodeSizeScale: (n: number) => number;
}) {
  // Calculate the offset for each line at each link node
  const linkSectionOffsets = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(weightedLinkSections).map(([sectionId, section]) => {
          const cumulativeWeights = [
            ...cumsum(section.lines, (line) => line.weight),
          ];
          const totalLoad =
            cumulativeWeights[cumulativeWeights.length - 1] ?? 0;

          return [
            sectionId,
            Object.fromEntries(
              zip(section.lines, cumulativeWeights).map(
                ([line, cumulativeWeight]) => [
                  line.lineName,

                  linkSizeScale(cumulativeWeight) -
                    linkSizeScale(line.weight) / 2 -
                    linkSizeScale(totalLoad) / 2,
                ]
              )
            ),
          ];
        })
      ),
    [weightLinkSections, linkSizeScale]
  );

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  const { zoomContainer, zoomTarget } = useZoom<SVGSVGElement, SVGGElement>();

  return (
    <svg {...zoomContainer} style={{ flexGrow: 1 }} viewBox="0 0 945 670">
      <g {...zoomTarget}>
        <RiverThames />
        {weightedLinks.map((link) => {
          return link.lines.map((line) => {
            const hovered =
              hoveredItem?.type === "link" &&
              hoveredItem.link.from.nodeName === link.from.nodeName &&
              hoveredItem.link.to.nodeName === link.to.nodeName &&
              hoveredItem.link.line.lineName === line.lineName;
            const setHovered = (hovered: boolean) => {
              if (hovered) {
                setHoveredItem({
                  type: "link",
                  link: { ...link, line },
                });
              } else if (
                hoveredItem?.type === "link" &&
                hoveredItem.link.from.nodeName === link.from.nodeName &&
                hoveredItem.link.to.nodeName === link.to.nodeName &&
                hoveredItem.link.line.lineName === line.lineName
              ) {
                setHoveredItem(null);
              }
            };

            return (
              <LinkView
                key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}`}
                link={link}
                line={line}
                linkSectionOffsets={linkSectionOffsets}
                weight={line.weight}
                scale={linkSizeScale}
                hovered={hovered}
                setHovered={setHovered}
              />
            );
          });
        })}
        {STATIONS.map((station) => {
          const nodes = Object.values(weightedNodes).filter(
            (node) => node.station.nlc === station.nlc
          );

          const hovered =
            hoveredItem?.type === "station" &&
            hoveredItem.station.nlc === station.nlc;
          const setHovered = (hovered: boolean) => {
            if (hovered) {
              setHoveredItem({
                type: "station",
                station: { nlc: station.nlc },
                element: "node",
              });
            } else if (
              hoveredItem?.type === "station" &&
              hoveredItem.station.nlc === station.nlc &&
              hoveredItem.element === "node"
            ) {
              setHoveredItem(null);
            }
          };

          return (
            <StationView
              key={station.nlc}
              station={station}
              nodes={nodes}
              scale={nodeSizeScale}
              hovered={hovered}
              setHovered={setHovered}
            />
          );
        })}
        {STATION_LABELS.map((label) => {
          const hovered =
            hoveredItem?.type === "station" &&
            hoveredItem.station.nlc === label.station.nlc;
          const setHovered = (hovered: boolean) => {
            if (hovered) {
              setHoveredItem({
                type: "station",
                station: { nlc: label.station.nlc },
                element: "label",
              });
            } else if (
              hoveredItem?.type === "station" &&
              hoveredItem.station.nlc === label.station.nlc &&
              hoveredItem.element === "label"
            ) {
              setHoveredItem(null);
            }
          };

          const name = Array.isArray(label.name)
            ? label.name.join(" ")
            : label.name;

          const key = `${label.station.nlc}-${name}`;

          if ("node" in label.position) {
            let node = weightedNodes[label.position.node.nodeName];

            return (
              <StationLabelView
                key={key}
                name={label.name}
                position={{ node }}
                alignment={label.alignment}
                scale={linkSizeScale}
                hovered={hovered}
                setHovered={setHovered}
              />
            );
          } else {
            return (
              <StationLabelView
                key={key}
                name={label.name}
                position={label.position}
                alignment={label.alignment}
                scale={linkSizeScale}
                hovered={hovered}
                setHovered={setHovered}
              />
            );
          }
        })}
      </g>
    </svg>
  );
}

type HoveredItem =
  | { type: "link"; link: LinkReference }
  | { type: "station"; station: StationReference; element: "node" | "label" };

// TODO: use dashed stroke with dash gaps proportional to gaps between services, dash length proportional to num carriages, width proportional to load per carriage
function LinkView({
  link,
  line,
  linkSectionOffsets,
  weight,
  scale,
  outlineWidth = 0.6,
  hovered,
  setHovered,
}: {
  link: Link;
  line: LineReference;
  linkSectionOffsets: Record<string, Record<string, number>>;
  weight: number;
  scale: (n: number) => number;
  outlineWidth?: number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const width = scale(weight);

  const nodes = useMemo(
    () => [
      STATION_NODES[link.from.nodeName],
      ...(link.path?.map(({ linkNodeName }) => ({
        name: linkNodeName,
        ...LINK_NODES[linkNodeName],
      })) ?? []),
      STATION_NODES[link.to.nodeName],
    ],
    [link]
  );

  const sectionOffsets = useMemo(
    () =>
      pairs(nodes).map(([a, b]) => getOffset(a, b, linkSectionOffsets, line)),
    [nodes, linkSectionOffsets, line]
  );

  const colour = useMemo(() => LINES[line.lineName].colour, [line]);

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <>
      {hovered ? (
        <OffsetPath
          nodes={nodes}
          sectionOffsets={sectionOffsets}
          stroke="#000000"
          strokeWidth={width + outlineWidth * 2}
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      <OffsetPath
        nodes={nodes}
        sectionOffsets={sectionOffsets}
        stroke={colour}
        strokeWidth={width}
        strokeLinejoin="round"
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(event) =>
          setMousePosition({ x: event.pageX, y: event.pageY })
        }
      />
      {hovered && mousePosition
        ? createPortal(
            <div
              className={cabin.className}
              style={{
                position: "absolute",
                zIndex: 100,
                left: mousePosition ? mousePosition.x + 10 : 0,
                top: mousePosition ? mousePosition.y + 10 : 0,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                border: "2px solid black",
                gap: "4px",
                paddingRight: "4px",
              }}
            >
              <div style={{ width: "10px", backgroundColor: colour }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <strong>
                    {
                      STATIONS.filter(
                        ({ nlc }) =>
                          nlc === STATION_NODES[link.from.nodeName].station.nlc
                      )[0].name
                    }
                  </strong>
                  {" to "}
                  <strong>
                    {
                      STATIONS.filter(
                        ({ nlc }) =>
                          nlc === STATION_NODES[link.to.nodeName].station.nlc
                      )[0].name
                    }
                  </strong>
                </div>
                <span>{line.lineName}</span>
              </div>
              <div style={{ width: "8px" }} />
              {Math.round(weight).toLocaleString()} passengers
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function getOffset(
  a: { name: string },
  b: { name: string },
  linkSectionOffsets: Record<string, Record<string, number>>,
  line: LineReference
): number {
  if (a.name.localeCompare(b.name) < 0) {
    const sectionKey = [a.name, b.name].join("-");
    const offset = linkSectionOffsets[sectionKey]?.[line.lineName] ?? 0;
    return offset;
  } else {
    const sectionKey = [b.name, a.name].join("-");
    const offset = linkSectionOffsets[sectionKey]?.[line.lineName] ?? 0;
    return -offset;
  }
}

function StationView({
  station,
  nodes,
  scale,
  hovered,
  setHovered,
}: {
  station: Station;
  nodes: WeightedStationNode[];
  scale: (n: number) => number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  const [firstNode, ...otherNodes] = nodes.sort((a, b) => a.x - b.x);

  return (
    <InterchangeStation
      nodes={[firstNode, ...otherNodes]}
      scale={scale}
      hovered={hovered}
      setHovered={setHovered}
    />
  );
}

function InterchangeStation({
  nodes,
  outlineWidth = 0.6,
  joinWidth = 0.6,
  scale,
  hovered,
  setHovered,
}: {
  nodes: NonEmptyArray<WeightedStationNode>;
  outlineWidth?: number;
  joinWidth?: number;
  scale: (n: number) => number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];

  if (hovered) {
    outlineWidth *= 1.5;
  }

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {nodes.map((node) => (
        <circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          r={scale(node.weight) / 2 + outlineWidth}
          fill="#000000"
        />
      ))}
      <line
        x1={firstNode.x}
        y1={firstNode.y}
        x2={lastNode.x}
        y2={lastNode.y}
        stroke="#000000"
        strokeWidth={joinWidth + outlineWidth * 2}
      />
      {nodes.map((node) => (
        <circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          r={scale(node.weight) / 2}
          fill="#FFFFFF"
        />
      ))}
      <line
        x1={firstNode.x}
        y1={firstNode.y}
        x2={lastNode.x}
        y2={lastNode.y}
        stroke="#FFFFFF"
        strokeWidth={joinWidth}
      />
    </g>
  );
}

function StationLabelView({
  name,
  position,
  alignment,
  scale,
  hovered,
  setHovered,
  fontSize = 4.69,
}: {
  name: string | string[];
  position:
    | {
        node: WeightedStationNode;
      }
    | {
        x: number;
        y: number;
      };
  alignment: Alignment;
  scale: (n: number) => number;
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
  fontSize?: number;
}) {
  let x: number;
  let y: number;

  if ("node" in position) {
    switch (alignment.textAnchor) {
      case "start":
        x = position.node.x + Math.max(scale(position.node.weight) / 2, 2);
        if (alignment.dominantBaseline === "middle") {
          x += 1;
        } else {
          x += 0.4;
        }
        break;
      case "end":
        x = position.node.x - Math.max(scale(position.node.weight) / 2, 2);
        if (alignment.dominantBaseline === "middle") {
          x -= 1;
        } else {
          x -= 0.4;
        }
        break;
      case "middle":
        x = position.node.x;
        break;
    }

    switch (alignment.dominantBaseline) {
      case "text-before-edge":
        y = position.node.y + Math.max(scale(position.node.weight) / 2, 2);
        if (alignment.textAnchor === "middle") {
          y += 1;
        } else {
          y += 0.4;
        }
        break;
      case "text-after-edge":
        y = position.node.y - Math.max(scale(position.node.weight) / 2, 2);
        if (alignment.textAnchor === "middle") {
          y -= 1;
        } else {
          y -= 0.4;
        }
        break;
      case "middle":
        y = position.node.y;
        break;
    }
  } else {
    x = position.x;
    y = position.y;
  }

  const lines = Array.isArray(name) ? name : [name];

  let linePositions: { text: string; x: number; y: number }[];

  switch (alignment.dominantBaseline) {
    case "text-before-edge":
      linePositions = lines.map((text, i) => ({
        text,
        x,
        y: y + i * fontSize,
      }));
      break;
    case "text-after-edge":
      linePositions = lines
        .slice()
        .reverse()
        .map((text, i) => ({
          text,
          x,
          y: y - i * fontSize,
        }));
      break;
    case "middle":
      linePositions = lines.map((text, i) => ({
        text,
        x,
        y: y + (i - (lines.length - 1) / 2) * fontSize,
      }));
      break;
  }

  return (
    <>
      {linePositions.map(({ text, x, y }, i) => (
        <text
          key={i}
          className={cabin.className}
          fill="#2E2B81"
          x={x}
          y={y}
          fontSize={fontSize}
          fontWeight={hovered ? 800 : 600}
          {...alignment}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {text}
        </text>
      ))}
    </>
  );
}

function RiverThames() {
  return (
    <>
      <svg
        x={29.8}
        y={368.5}
        viewBox="0 0 986 243"
        width={986}
        height={243}
        fill="none"
        opacity={0.4}
      >
        <path
          d="M83.6 234.43V199.03C83.6 196.13 84.8 193.53 86.7 191.63C88.6 189.73 102.4 175.83 103.4 174.93L107.1 178.63C105.2 180.53 91.4 194.33 90.4 195.33C89.4 196.33 88.8 197.63 88.8 199.13V234.33"
          fill="#D4EDFC"
        />
        <path
          d="M103.3 175.13C103.9 174.53 124 154.53 126.9 151.53C128.8 149.63 131.4 148.53 134.3 148.53H180.3H182H226.8C229.7 148.53 232.3 149.73 234.2 151.53C236.1 153.43 272.4 189.63 273.4 190.63C274.4 191.63 275.7 192.23 277.2 192.23H411.6C413.8 192.23 415.5 190.43 415.5 188.33V135.03C415.5 129.23 420.2 124.63 425.9 124.63H514.5C515.6 124.63 516.6 124.13 517.3 123.43L545.2 96.23L546.2 95.23C548.2 93.23 550.9 92.03 553.8 92.03H675.3C681.3 92.03 686.2 96.93 686.2 102.93V172.53C686.2 174.33 687.6 175.73 689.4 175.73H737.9C739.7 175.73 741.2 174.23 741.2 172.43V107.53C741.2 101.23 746.3 96.03 752.7 96.03H804.6C811.6 96.03 817.2 101.73 817.2 108.63V162.43C817.2 164.03 818.5 165.23 820 165.23H886V174.33H822C814.7 174.33 808.7 168.43 808.7 161.03V107.33C808.7 105.33 807.1 103.63 805 103.63H752.1C750.3 103.63 748.8 105.13 748.8 106.93V171.83C748.8 178.13 743.7 183.33 737.3 183.33H689.2C683.2 183.33 678.3 178.43 678.3 172.43V102.53C678.3 100.23 676.4 98.33 674.2 98.33H553.6C552.5 98.33 551.5 98.83 550.8 99.53L521.9 127.83C519.9 129.83 517.2 131.03 514.3 131.03L426 131.13C423.7 131.13 421.8 133.03 421.8 135.33V187.03C421.8 192.83 417.1 197.43 411.4 197.43H276.8C273.9 197.43 271.3 196.23 269.4 194.33C267.5 192.43 231.2 156.13 230.2 155.23C229.2 154.23 227.9 153.63 226.4 153.63L181.9 153.73H180L134.3 153.63C132.8 153.63 131.5 154.23 130.5 155.23C129.5 156.23 108.7 177.03 106.8 178.83"
          fill="#D4EDFC"
        />
        <path
          d="M124.5 161.23C126.4 159.33 129.5 156.13 130.5 155.13C131.5 154.13 132.8 153.53 134.3 153.53H178.1H182L226.5 153.43C228 153.43 229.3 154.03 230.3 155.03C231.3 156.03 267.6 192.33 269.5 194.13C271.4 196.03 274 197.23 276.9 197.23H411.5C417.2 197.23 421.9 192.53 421.9 186.83V135.13C421.9 132.83 423.8 130.93 426.1 130.93L514.4 130.83C517.3 130.83 520 129.63 522 127.63L550.9 99.43C551.6 98.73 552.7 98.23 553.7 98.23H674.3C676.6 98.23 678.4 100.13 678.4 102.43V172.33C678.4 178.33 683.3 183.23 689.3 183.23H737.4C743.7 183.23 748.9 178.03 748.9 171.73V106.83C748.9 105.03 750.4 103.53 752.2 103.53H805.1C807.1 103.53 808.8 105.13 808.8 107.23V160.93C808.8 168.23 814.8 174.23 822.1 174.23H886"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M119.9 158.53C120.9 157.53 125 153.43 126.9 151.53C128.8 149.63 131.4 148.53 134.3 148.53H179.2H182.1H226.9C229.8 148.53 232.4 149.73 234.3 151.53C236.2 153.43 272.5 189.63 273.4 190.63C274.4 191.63 275.7 192.23 277.2 192.23H411.6C413.8 192.23 415.5 190.43 415.5 188.33V135.03C415.5 129.23 420.2 124.63 425.9 124.63H514.5C515.6 124.63 516.6 124.13 517.3 123.43L545.2 96.23L546.2 95.23C548.2 93.23 550.9 92.03 553.8 92.03H675.3C681.3 92.03 686.2 96.93 686.2 102.93V172.53C686.2 174.33 687.6 175.73 689.4 175.73H737.9C739.7 175.73 741.2 174.23 741.2 172.43V107.53C741.2 101.23 746.3 96.03 752.7 96.03H804.6C811.6 96.03 817.2 101.73 817.2 108.63V162.43C817.2 164.03 818.5 165.23 820 165.23H886"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M119.9 158.53C118.9 159.53 88.6 189.93 86.7 191.73C84.8 193.63 83.6 196.23 83.6 199.13V234.53"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M124.5 161.23C122.6 163.13 91.3 194.43 90.3 195.43C89.3 196.43 88.7 197.73 88.7 199.23V227.33"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M83.5999 223.93V233.63C83.5999 235.83 81.7999 237.53 79.7 237.53H0.199951V242.63H78.2999C84.0999 242.63 88.7 239.43 88.7 233.63V223.83L83.5999 223.93Z"
          fill="#D4EDFC"
        />
        <path
          d="M88.8 223.73V233.73C88.8 239.43 84.1 242.73 78.4 242.73H0"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M83.6 223.83V233.63C83.6 235.83 81.8 237.53 79.7 237.53H0"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M985.6 0.130005H946C939 0.130005 933.4 5.83001 933.4 12.73V162.33C933.4 163.93 932.1 165.13 930.6 165.13H878.7V174.23H929.6C936.9 174.23 942.9 168.33 942.9 160.93V13.73C942.9 11.73 944.5 10.03 946.6 10.03H985.7L985.6 0.130005Z"
          fill="#D4EDFC"
        />
        <path
          d="M878.7 174.23H929.5C936.8 174.23 942.8 168.33 942.8 160.93V13.73C942.8 11.73 944.4 10.03 946.5 10.03H985.8"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
        <path
          d="M985.6 0.130005H945.9C938.9 0.130005 933.3 5.83001 933.3 12.73V162.33C933.3 163.93 932 165.13 930.5 165.13H878.7"
          stroke="#009FE3"
          strokeWidth="0.26"
        />
      </svg>
      <text
        className={cabin.className}
        fill="#00A7E7"
        x={654.32}
        y={460.83}
        fontSize={4.69}
        dominantBaseline="text-before-edge"
        opacity={0.6}
      >
        River Thames
      </text>
    </>
  );
}
