"use client";

import {
  getStationNode,
  LINES,
  linkNames,
  LINKS,
  resolveStationNodeReference,
  STATION_LABELS,
  STATION_NODES,
  STATIONS,
} from "@/data/map";
import {
  Alignment,
  Link,
  LinkLoad,
  LinkReference,
  NonEmptyArray,
  Station,
  StationLabel,
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
  const totalLinkLoads: [Link, number][] = useMemo(
    () =>
      LINKS.map((link) => {
        const linkLoads = linkNames(link).map((name) => data[name]);
        const totalLoad = sum(linkLoads, (d) => d.total);
        return [link, totalLoad];
      }),
    [data]
  );

  // Maps station nodes to the links connected to it and their total loads
  const stationNodeLinks: Record<string, [StationNode, [Link, number][]]> =
    useMemo(
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

  const adjacentLinks: Record<
    string,
    Record<string, [Link, number][]>
  > = useMemo(() => {
    const adjacentLinks: Record<string, Record<string, [Link, number][]>> = {};

    for (const [link, totalLoad] of totalLinkLoads) {
      const from = resolveStationNodeReference(link.from);
      const to = resolveStationNodeReference(link.to);

      if (!adjacentLinks[from.nodeName]) {
        adjacentLinks[from.nodeName] = {};
      }
      if (!adjacentLinks[from.nodeName][to.nodeName]) {
        adjacentLinks[from.nodeName][to.nodeName] = [];
      }
      adjacentLinks[from.nodeName][to.nodeName].push([link, totalLoad]);
    }

    return adjacentLinks;
  }, [totalLinkLoads]);

  const widthScale = useMemo(() => {
    const maxNodeTotal =
      max(
        Object.values(stationNodeLinks)
          .map(([, links]) => sum(links.map(([, w]) => w)))
          .flat()
      ) ?? 0;
    return scaleLinear().domain([0, maxNodeTotal]).range([1, 10]);
  }, [stationNodeLinks]);

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  return (
    <svg viewBox="0 0 945 670" width={945} height={670}>
      {Object.entries(adjacentLinks).map(([, toNodes]) =>
        Object.entries(toNodes).map(([, links]) => {
          const widths = links.map(([, load]) => widthScale(load));
          const totalWidth = sum(widths);
          let currentPos = -totalWidth / 2;

          const offsets = widths.map((width) => {
            const offset = currentPos + width / 2;
            currentPos += width;
            return offset;
          });

          return zip(links, offsets).map(([[link, totalLoad], offset]) => {
            const hovered =
              hoveredItem?.type === "link" &&
              hoveredItem.link.from.nodeName === link.from.nodeName &&
              hoveredItem.link.to.nodeName === link.to.nodeName &&
              hoveredItem.link.line.lineName === link.line.lineName;
            const setHovered = (hovered: boolean) => {
              if (hovered) {
                setHoveredItem({ type: "link", link });
              } else if (
                hoveredItem?.type === "link" &&
                hoveredItem.link.from.nodeName === link.from.nodeName &&
                hoveredItem.link.to.nodeName === link.to.nodeName &&
                hoveredItem.link.line.lineName === link.line.lineName
              ) {
                setHoveredItem(null);
              }
            };

            return (
              <LinkView
                key={`${link.from.nodeName}-${link.to.nodeName}-${link.line.lineName}`}
                link={link}
                width={widthScale(totalLoad)}
                offset={offset}
                hovered={hovered}
                setHovered={setHovered}
              />
            );
          });
        })
      )}
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

function LinkView({
  link,
  width = 2,
  offset = 0,
  outlineWidth = 0.6,
  hovered,
  setHovered,
}: {
  link: Link;
  width?: number;
  offset?: number;
  outlineWidth?: number;
  hovered?: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const linkPath = useMemo(() => {
    const linkPath = path();

    const fromNode = getStationNode(link.from);
    const toNode = getStationNode(link.to);
    const pathNodes = link.path ?? [];

    // Helper to shift a point by a normal vector
    const shift = (
      p: { x: number; y: number },
      normal: { x: number; y: number }
    ) => ({
      x: p.x + normal.x * offset,
      y: p.y + normal.y * offset,
    });

    let currentPoint = { x: fromNode.x, y: fromNode.y };

    // 1. Move to Start Point
    // Determine start direction to calculate normal
    let startTarget =
      pathNodes.length > 0 ? pathNodes[0].cp1 ?? pathNodes[0] : toNode;

    // Handle zero-length control points if necessary
    if (
      startTarget.x === currentPoint.x &&
      startTarget.y === currentPoint.y &&
      pathNodes.length > 0
    ) {
      startTarget = pathNodes[0].cp2 ?? pathNodes[0];
    }

    const startNormal = getNormal(currentPoint, startTarget);
    const startShifted = shift(currentPoint, startNormal);
    linkPath.moveTo(startShifted.x, startShifted.y);

    for (const node of pathNodes) {
      if ("cp1" in node || "cp2" in node) {
        const cp1 = node.cp1 ?? { x: node.x, y: node.y };
        const cp2 = node.cp2 ?? { x: node.x, y: node.y };

        // Calculate normals for the curve
        const segStartNormal = getNormal(currentPoint, cp1);
        const segEndNormal = getNormal(cp2, node);

        // Fallback if start normal is zero length
        const effectiveStartNormal =
          segStartNormal.x === 0 && segStartNormal.y === 0
            ? startNormal
            : segStartNormal;

        const cp1Shifted = shift(cp1, effectiveStartNormal);
        const cp2Shifted = shift(cp2, segEndNormal);
        const endShifted = shift(node, segEndNormal);

        linkPath.bezierCurveTo(
          cp1Shifted.x,
          cp1Shifted.y,
          cp2Shifted.x,
          cp2Shifted.y,
          endShifted.x,
          endShifted.y
        );
      } else {
        // Straight line segment
        const normal = getNormal(currentPoint, node);
        const endShifted = shift(node, normal);
        linkPath.lineTo(endShifted.x, endShifted.y);
      }
      currentPoint = node;
    }

    // 3. Final Line to Destination
    const finalNormal = getNormal(currentPoint, toNode);
    const finalShifted = shift(toNode, finalNormal);
    linkPath.lineTo(finalShifted.x, finalShifted.y);

    return linkPath.toString();
  }, [link, offset]);

  const colour = useMemo(() => LINES[link.line.lineName].colour, [link.line]);

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
  nodes: [StationNode, [Link, number][]][];
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
  nodes: NonEmptyArray<[StationNode, [Link, number][]]>;
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
    scale(sum(links.map(([, width]) => width))),
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
        node: [StationNode, [Link, number][]];
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

    const total = sum(links.map(([, w]) => w));

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
