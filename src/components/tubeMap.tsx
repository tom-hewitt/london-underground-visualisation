"use client";

import { cabin } from "@/fonts";
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
import { cumsum, max, path, scaleLinear, select, sum, zoom } from "d3";
import { zip } from "radash";
import { useEffect, useMemo, useRef, useState } from "react";

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
                  console.warn(`Missing load data for link: ${name}`);
                  return { total: 0 };
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
          .map(
            ([, links]) =>
              max(links, ([, lineLoads]) => sum(Object.values(lineLoads))) ?? 0
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

  // Calculate the order of the lines for each link section
  const linkSectionOrders = useMemo(() => {
    const sections = structuredClone(LINK_SECTIONS);

    for (const [linkName, link] of Object.entries(LINKS)) {
      let previousNode = resolveStationNodeReference(link.from).nodeName;

      for (const nodeName of [
        ...(link.path ?? []).map((n) => n.linkNodeName),
        resolveStationNodeReference(link.to).nodeName,
      ]) {
        const sectionKey = [previousNode, nodeName]
          .sort((a, b) => a.localeCompare(b))
          .join("-");

        if (!(sectionKey in sections)) {
          sections[sectionKey] = { lines: link.lines }; // Fallback to link lines if not defined in LINK_SECTIONS
        }

        previousNode = nodeName;
      }
    }

    return sections;
  }, []);

  // Calculate the offset for each line at each link node
  const linkSectionOffsets = useMemo(() => {
    const offsets: Record<string, Record<string, number>> = {};

    for (const [linkSectionName, lineLoads] of Object.entries(
      linkSectionLoads
    )) {
      if (offsets[linkSectionName] === undefined) {
        offsets[linkSectionName] = {};
      }

      const lines = linkSectionOrders[linkSectionName].lines;

      const loads = lines.map(({ lineName }) => lineLoads[lineName]);
      const cumulativeLoads = [...cumsum(loads)];
      const totalLoad = cumulativeLoads[cumulativeLoads.length - 1];
      const lineOffsets = zip(loads, cumulativeLoads).map(
        ([load, cumLoad]) =>
          widthScale(cumLoad) - widthScale(load) / 2 - widthScale(totalLoad) / 2
      );

      for (const [{ lineName }, lineOffset] of zip(lines, lineOffsets)) {
        offsets[linkSectionName][lineName] = lineOffset;
      }
    }

    return offsets;
  }, [linkSectionLoads, linkSectionOrders, widthScale]);

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        if (gRef.current) {
          select(gRef.current).attr("transform", event.transform);
        }
      });

    select(svgRef.current).call(zoomBehavior);
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 945 670" width={945} height={670}>
      <g ref={gRef}>
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

          const name = Array.isArray(label.name)
            ? label.name.join(" ")
            : label.name;

          const key = `${label.station.nlc}-${name}`;

          if ("node" in label.position) {
            let node = stationNodeLinks[label.position.node.nodeName];

            return (
              <StationLabelView
                key={key}
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
                key={key}
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
      </g>
    </svg>
  );
}

type HoveredItem =
  | { type: "link"; link: LinkReference }
  | { type: "station"; station: StationReference; element: "node" | "label" };

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

function dot(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return a.x * b.x + a.y * b.y;
}

function cross(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return a.x * b.y - a.y * b.x;
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

function negate(v: { x: number; y: number }): { x: number; y: number } {
  return { x: -v.x, y: -v.y };
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
  const debugPath = useMemo(() => {
    const linkPath = path();

    const fromNode = getStationNode(link.from);
    const toNode = getStationNode(link.to);

    const pathNodes =
      link.path?.map((nodeRef) => {
        const linkNode = LINK_NODES[nodeRef.linkNodeName];
        return { name: nodeRef.linkNodeName, x: linkNode.x, y: linkNode.y };
      }) ?? [];

    linkPath.moveTo(fromNode.x, fromNode.y);

    for (let i = 0; i < pathNodes.length; i++) {
      const corner = pathNodes[i];
      linkPath.lineTo(corner.x, corner.y);
    }

    linkPath.lineTo(toNode.x, toNode.y);

    return linkPath.toString();
  }, [link]);

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

    const startOffset = getOffset(fromNode, nextNode, linkSectionOffsets, line);

    const startNormal = getNormal(fromNode, nextNode);

    linkPath.moveTo(
      fromNode.x - startNormal.x * startOffset,
      fromNode.y - startNormal.y * startOffset
    );

    let previousNode: { name: string; x: number; y: number } = fromNode;
    let previousOffset = startOffset;

    for (let i = 0; i < pathNodes.length; i++) {
      const corner = pathNodes[i];
      nextNode = pathNodes[i + 1] ?? toNode;

      const nextOffset = getOffset(corner, nextNode, linkSectionOffsets, line);

      // Vector from corner to next node (B -> C)
      const dirToNext = normalise(subtract(nextNode, corner));

      // Vector from corner to previous node (B -> A)
      // which is effectively A -> B (incoming direction).
      // To match the formula B -> A, we need to negate it or calculate B -> A.
      const dirToPrev = normalise(subtract(previousNode, corner));

      // The cross product gives us the sine of the angle with sign indicating direction
      const crossProd = cross(dirToPrev, dirToNext);

      let offsetCorner: { x: number; y: number };

      if (Math.abs(crossProd) < 1e-4) {
        const normal = { x: -dirToNext.y, y: dirToNext.x };
        offsetCorner = {
          x: corner.x - normal.x * nextOffset,
          y: corner.y - normal.y * nextOffset,
        };
      } else {
        // Calculate vectors u and v
        // u is along B->A (dirToPrev), scaled by nextOffset / -denominator
        // v is along B->C (dirToNext), scaled by previousOffset / -denominator
        // We use -denominator because of the coordinate system / derivation.

        const uVec = multiply(dirToPrev, nextOffset / crossProd);
        const vVec = multiply(dirToNext, previousOffset / crossProd);

        // D = B + u + v
        const offset = add(uVec, vVec);
        offsetCorner = add(corner, offset);
      }

      linkPath.lineTo(offsetCorner.x, offsetCorner.y);

      previousNode = corner;
      previousOffset = nextOffset;
    }

    // Offset at the end is the offset of the last section
    const endOffset = getOffset(previousNode, toNode, linkSectionOffsets, line);
    const endNormal = getNormal(previousNode, toNode);

    linkPath.lineTo(
      toNode.x - endNormal.x * endOffset,
      toNode.y - endNormal.y * endOffset
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
        // strokeWidth={1}
        strokeLinejoin="round"
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {/* <path
        d={debugPath}
        stroke="#FF00FF"
        strokeWidth={0.2}
        strokeLinejoin="round"
        fill="none"
      /> */}
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

  const [firstNode, ...otherNodes] = nodes.sort(([a], [b]) => a.x - b.x);

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
    scale(max(links, ([, lineLoads]) => sum(Object.values(lineLoads))) ?? 0),
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
  name: string | string[];
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

    const total =
      max(links, ([, lineLoads]) => sum(Object.values(lineLoads))) ?? 0;

    switch (alignment.textAnchor) {
      case "start":
        x = stationNode.x + Math.max(scale(total) / 2, 2);
        if (alignment.dominantBaseline === "middle") {
          x += 1;
        } else {
          x += 0.4;
        }
        break;
      case "end":
        x = stationNode.x - Math.max(scale(total) / 2, 2);
        if (alignment.dominantBaseline === "middle") {
          x -= 1;
        } else {
          x -= 0.4;
        }
        break;
      case "middle":
        x = stationNode.x;
        break;
    }

    switch (alignment.dominantBaseline) {
      case "text-before-edge":
        y = stationNode.y + Math.max(scale(total) / 2, 2);
        if (alignment.textAnchor === "middle") {
          y += 1;
        } else {
          y += 0.4;
        }
        break;
      case "text-after-edge":
        y = stationNode.y - Math.max(scale(total) / 2, 2);
        if (alignment.textAnchor === "middle") {
          y -= 1;
        } else {
          y -= 0.4;
        }
        break;
      case "middle":
        y = stationNode.y;
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
