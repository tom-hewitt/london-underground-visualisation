"use client";

import {
  getStationNode,
  LINES,
  LINK_NODES,
  LINK_SECTIONS,
  linkNames,
  LINKS,
  resolveStationNodeReference,
  STATION_LABELS,
  STATION_NODES,
  STATIONS,
} from "@/data/map";
import {
  Alignment,
  LineReference,
  Link,
  LinkLoad,
  LinkReference,
  NonEmptyArray,
  Station,
  StationNode,
  StationReference,
} from "@/data/types";
import { cumsum, max, path, scaleLinear, sum } from "d3";
import { zip } from "radash";
import { useMemo, useState } from "react";

export function TubeMapVisualisation({
  data,
}: {
  data: Record<string, LinkLoad>;
}) {
  const totalLinkLoads: [Link, Record<string, number>][] = useMemo(
    () =>
      LINKS.map((link) => [
        link,
        Object.fromEntries(
          link.lines.map((line) => {
            const linkLoads = linkNames(line, link.from, link.to).map(
              (name) => {
                if (name in data) {
                  return data[name];
                } else {
                  throw new Error(`Missing load data for link: ${name}`);
                }
              }
            );
            let totalLoad = sum(linkLoads, (d) => d.total);
            // Hack to split H&C and Circle load
            if (
              link.lines.some((l) => l.lineName === "H&C") &&
              link.lines.some((l) => l.lineName === "Circle")
            ) {
              totalLoad = totalLoad / 2;
            }
            return [line.lineName, totalLoad];
          })
        ),
      ]),
    [data]
  );

  // Maps station nodes to the links connected to it and their total loads
  const stationNodeLinks: Record<
    string,
    [StationNode, [Link, Record<string, number>][]]
  > = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(STATION_NODES).map(([_, node]) => [
          node.name,
          [
            node,
            totalLinkLoads.filter(
              ([link]) =>
                resolveStationNodeReference(link.to).nodeName === node.name ||
                resolveStationNodeReference(link.from).nodeName === node.name
            ),
          ],
        ])
      ),
    [totalLinkLoads]
  );

  const widthScale = useMemo(() => {
    const maxNodeTotal =
      max(
        Object.values(stationNodeLinks)
          .map(([, links]) =>
            sum(links, ([, lineLoads]) => sum(Object.values(lineLoads)))
          )
          .flat()
      ) ?? 0;
    return scaleLinear().domain([0, maxNodeTotal]).range([0, 10]);
  }, [totalLinkLoads]);

  // Calculate the loads for each line along each link section (between two station or link nodes)
  const linkSectionLoads = useMemo(() => {
    const sectionLoads: Record<string, Record<string, number>> = {};

    for (const [link, lineLoads] of totalLinkLoads) {
      const pathNodes = link.path ?? [];

      let previousNode = resolveStationNodeReference(link.from).nodeName;

      for (const nodeName of [
        ...pathNodes.map((n) => n.linkNodeName),
        resolveStationNodeReference(link.to).nodeName,
      ]) {
        // The canonical name for a section link is sorted alphabetically
        const sectionKey = [previousNode, nodeName]
          .sort((a, b) => a.localeCompare(b))
          .join("-");

        if (!(sectionKey in sectionLoads)) {
          sectionLoads[sectionKey] = {};
        }

        for (const [lineName, load] of Object.entries(lineLoads)) {
          if (sectionLoads[sectionKey][lineName] === undefined) {
            sectionLoads[sectionKey][lineName] = 0;
          }
          sectionLoads[sectionKey][lineName] += load;
        }

        previousNode = nodeName;
      }
    }

    return sectionLoads;
  }, [totalLinkLoads, widthScale]);

  // Calculate the offset for each line at each link node
  const linkSectionOffsets = useMemo(() => {
    const offsets: Record<string, Record<string, number>> = {};

    for (const [linkSectionName, lineLoads] of Object.entries(
      linkSectionLoads
    )) {
      if (offsets[linkSectionName] === undefined) {
        offsets[linkSectionName] = {};
      }

      const lines =
        LINK_SECTIONS[linkSectionName]?.lines.map(({ lineName }) => lineName) ??
        Object.keys(lineLoads);

      const loads = lines.map((lineName) => lineLoads[lineName]);
      const cumulativeLoads = [...cumsum(loads)];
      const totalLoad = cumulativeLoads[cumulativeLoads.length - 1];
      const lineOffsets = zip(loads, cumulativeLoads).map(
        ([load, cumLoad]) =>
          widthScale(cumLoad) - widthScale(load) / 2 - widthScale(totalLoad) / 2
      );

      for (const [lineName, lineOffset] of zip(lines, lineOffsets)) {
        offsets[linkSectionName][lineName] = lineOffset;
      }
    }

    return offsets;
  }, [linkSectionLoads, widthScale]);

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  return (
    <svg viewBox="0 0 945 670" width={945} height={670}>
      {Object.values(totalLinkLoads).map(([link, lineLoads]) => {
        const widths = Object.values(lineLoads).map(widthScale);
        const totalWidth = sum(widths);
        let currentPos = -totalWidth / 2;

        const offsets = widths.map((width) => {
          const offset = currentPos + width / 2;
          currentPos += width;
          return offset;
        });

        return zip(Object.entries(lineLoads), offsets).map(
          ([[lineName, lineLoad], offset]) => {
            const hovered =
              hoveredItem?.type === "link" &&
              hoveredItem.link.from.nodeName === link.from.nodeName &&
              hoveredItem.link.to.nodeName === link.to.nodeName &&
              hoveredItem.link.line.lineName === lineName;
            const setHovered = (hovered: boolean) => {
              if (hovered) {
                setHoveredItem({
                  type: "link",
                  link: { ...link, line: { lineName } },
                });
              } else if (
                hoveredItem?.type === "link" &&
                hoveredItem.link.from.nodeName === link.from.nodeName &&
                hoveredItem.link.to.nodeName === link.to.nodeName &&
                hoveredItem.link.line.lineName === lineName
              ) {
                setHoveredItem(null);
              }
            };

            return (
              <LinkView
                key={`${link.from.nodeName}-${link.to.nodeName}-${lineName}`}
                link={link}
                line={{ lineName }}
                linkSectionOffsets={linkSectionOffsets}
                width={widthScale(lineLoad)}
                hovered={hovered}
                setHovered={setHovered}
              />
            );
          }
        );
      })}
      {STATIONS.map((station) => {
        const nodes = Object.values(stationNodeLinks).filter(
          ([node]) => node.station.nlc === station.nlc
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
            scale={widthScale}
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

        if ("node" in label.position) {
          let node = stationNodeLinks[label.position.node.nodeName];

          return (
            <StationLabelView
              key={label.name}
              name={label.name}
              position={{ node }}
              alignment={label.alignment}
              scale={widthScale}
              hovered={hovered}
              setHovered={setHovered}
            />
          );
        } else {
          return (
            <StationLabelView
              key={label.name}
              name={label.name}
              position={label.position}
              alignment={label.alignment}
              scale={widthScale}
              hovered={hovered}
              setHovered={setHovered}
            />
          );
        }
      })}
    </svg>
  );
}

type HoveredItem =
  | { type: "link"; link: LinkReference }
  | { type: "station"; station: StationReference; element: "node" | "label" };

// Helper to calculate normal vector (perpendicular)
const getNormal = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: -dy / len, y: dx / len };
};

function length(a: { x: number; y: number }): number {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function calculateNormalAndOffset(
  a: { name: string; x: number; y: number },
  b: { name: string; x: number; y: number },
  linkSectionOffsets: Record<string, Record<string, number>>,
  line: LineReference
): [{ x: number; y: number }, number] {
  const sortedNodes = [a, b].sort((a, b) => a.name.localeCompare(b.name));

  const normal = getNormal(sortedNodes[0], sortedNodes[1]);

  const sectionKey = sortedNodes.map(({ name }) => name).join("-");

  const offset = linkSectionOffsets[sectionKey]?.[line.lineName] ?? 0;

  return [normal, offset];
}

function alongSegment(
  from: { x: number; y: number },
  to: { x: number; y: number },
  distance: number
): { x: number; y: number } {
  const bearing = Math.atan2(to.y - from.y, to.x - from.x);

  return {
    x: from.x + Math.cos(bearing) * distance,
    y: from.y + Math.sin(bearing) * distance,
  };
}

function dot(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return a.x * b.x + a.y * b.y;
}

function add(
  a: { x: number; y: number },
  b: { x: number; y: number }
): { x: number; y: number } {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(
  a: { x: number; y: number },
  b: { x: number; y: number }
): { x: number; y: number } {
  return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(
  v: { x: number; y: number },
  scalar: number
): { x: number; y: number } {
  return { x: v.x * scalar, y: v.y * scalar };
}

function normalise(v: { x: number; y: number }): { x: number; y: number } {
  const len = length(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function LinkView({
  link,
  line,
  linkSectionOffsets,
  width = 2,
  outlineWidth = 0.6,
  radius = 10,
  hovered,
  setHovered,
}: {
  link: Link;
  line: LineReference;
  linkSectionOffsets: Record<string, Record<string, number>>;
  width?: number;
  outlineWidth?: number;
  radius?: number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const linkPath = useMemo(() => {
    const linkPath = path();

    const fromNode = getStationNode(link.from);
    const toNode = getStationNode(link.to);

    const pathNodes =
      link.path?.map((nodeRef) => {
        const linkNode = LINK_NODES[nodeRef.linkNodeName];
        return { name: nodeRef.linkNodeName, x: linkNode.x, y: linkNode.y };
      }) ?? [];

    let nextNode = pathNodes[0] ?? toNode;

    // Offset at the start is the offset of the first section
    const [startNormal, startOffset] = calculateNormalAndOffset(
      fromNode,
      nextNode,
      linkSectionOffsets,
      line
    );

    linkPath.moveTo(
      fromNode.x + startNormal.x * startOffset,
      fromNode.y + startNormal.y * startOffset
    );

    let previousNode: { name: string; x: number; y: number } = fromNode;

    for (let i = 0; i < pathNodes.length; i++) {
      const corner = pathNodes[i];
      nextNode = pathNodes[i + 1] ?? toNode;

      // Offset of each path node is the largest offset of the two sections it connects
      const [previousNormal, previousOffset] = calculateNormalAndOffset(
        previousNode,
        corner,
        linkSectionOffsets,
        line
      );
      const [nextNormal, nextOffset] = calculateNormalAndOffset(
        corner,
        nextNode,
        linkSectionOffsets,
        line
      );

      const offsetCorner = add(
        corner,
        add(
          multiply(previousNormal, previousOffset),
          multiply(nextNormal, nextOffset)
        )
      );

      linkPath.lineTo(offsetCorner.x, offsetCorner.y);

      previousNode = corner;
    }

    // Offset at the end is the offset of the last section
    const [endNormal, endOffset] = calculateNormalAndOffset(
      previousNode,
      toNode,
      linkSectionOffsets,
      line
    );

    linkPath.lineTo(
      toNode.x + endNormal.x * endOffset,
      toNode.y + endNormal.y * endOffset
    );

    return linkPath.toString();
  }, [link, linkSectionOffsets, line]);

  const colour = useMemo(() => LINES[line.lineName].colour, [line]);

  return (
    <>
      {hovered ? (
        <path
          d={linkPath}
          stroke="#000000"
          strokeWidth={width + outlineWidth * 2}
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      <path
        d={linkPath}
        stroke={colour}
        strokeWidth={width}
        strokeLinejoin="round"
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </>
  );
}

function StationView({
  station,
  nodes,
  scale,
  hovered,
  setHovered,
}: {
  station: Station;
  nodes: [StationNode, [Link, Record<string, number>][]][];
  scale: (n: number) => number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  const [firstNode, ...otherNodes] = nodes;

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
  joinWidth = 1.2,
  scale,
  hovered,
  setHovered,
}: {
  nodes: NonEmptyArray<[StationNode, [Link, Record<string, number>][]]>;
  outlineWidth?: number;
  joinWidth?: number;
  scale: (n: number) => number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const [firstNode] = nodes[0];
  const [lastNode] = nodes[nodes.length - 1];

  if (hovered) {
    outlineWidth *= 1.5;
  }

  const nodeWidths: [StationNode, number][] = nodes.map(([node, links]) => [
    node,
    scale(sum(links, ([, lineLoads]) => sum(Object.values(lineLoads)))),
  ]);

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {nodeWidths.map(([node, width]) => (
        <circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          r={width / 2 + outlineWidth}
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
      {nodeWidths.map(([node, width]) => (
        <circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          r={width / 2}
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
  name: string;
  position:
    | {
        node: [StationNode, [Link, Record<string, number>][]];
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
    let [stationNode, links] = position.node;

    const total = sum(links, ([, lineLoads]) => sum(Object.values(lineLoads)));

    switch (alignment.textAnchor) {
      case "start":
        x = stationNode.x + scale(total) / 2 + 2;
        break;
      case "end":
        x = stationNode.x - scale(total) / 2 - 2;
        break;
      case "middle":
        x = stationNode.x;
        break;
    }

    switch (alignment.dominantBaseline) {
      case "text-before-edge":
        y = stationNode.y + scale(total) / 2;
        break;
      case "text-after-edge":
        y = stationNode.y - scale(total) / 2;
        break;
      case "middle":
        y = stationNode.y;
        break;
    }
  } else {
    x = position.x;
    y = position.y;
  }

  return (
    <text
      x={x}
      y={y}
      fontSize={fontSize}
      fontWeight={hovered ? "bold" : "normal"}
      {...alignment}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {name}
    </text>
  );
}
