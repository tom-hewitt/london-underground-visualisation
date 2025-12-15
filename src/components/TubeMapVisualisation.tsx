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
