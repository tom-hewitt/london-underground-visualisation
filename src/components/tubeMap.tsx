"use client";

import {
  getStationNode,
  LINES,
  linkNames,
  LINKS,
  resolveStationNodeReference,
  STATION_NODES,
} from "@/data/map";
import { Link, LinkLoad, StationNode } from "@/data/types";
import { max, path, scaleLinear, sum } from "d3";
import { useMemo } from "react";

function StationNodeView({
  node,
  width = 4.6,
  height = 4.6,
  outlineWidth = 0.6,
}: {
  node: StationNode;
  width?: number;
  height?: number;
  outlineWidth?: number;
}) {
  const direction = useMemo(() => {
    // Get all links going to this station node
    const linksTo = LINKS.filter(
      (link) => resolveStationNodeReference(link.to).name === node.name
    );

    // Get the previous node for each link to this station node
    const previousNodes = linksTo.map((link) => {
      const lastPathNode = link.path?.[link.path.length - 1];
      if (lastPathNode) {
        return lastPathNode;
      }
      return getStationNode(link.from);
    });

    // Get all links going from this station node
    const linksFrom = LINKS.filter(
      (link) => resolveStationNodeReference(link.from).name === node.name
    );

    // Get the next nodes for each link from this station node
    const nextNodes = linksFrom.map((link) => {
      const firstPathNode = link.path?.[0];
      if (firstPathNode) {
        return firstPathNode;
      }
      return getStationNode(link.to);
    });

    // Work out the directions of all links
    const [directionsTo, directionsFrom] = [previousNodes, nextNodes].map(
      (nodes) =>
        nodes.map((prevNode) => {
          const dx = node.x - prevNode.x;
          const dy = node.y - prevNode.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          return { x: dx / length, y: dy / length };
        })
    );

    // Find the average direction by summing and normalising
    const directionSum = [
      ...directionsTo,
      ...directionsFrom.map(({ x, y }) => ({ x: -x, y: -y })),
    ].reduce((acc, dir) => ({ x: acc.x + dir.x, y: acc.y + dir.y }), {
      x: 0,
      y: 0,
    });
    const length = Math.sqrt(
      directionSum.x * directionSum.x + directionSum.y * directionSum.y
    );
    if (length === 0) {
      console.log({ node, previousNodes, directionsTo, directionsFrom });
      return { x: 0, y: 0 };
    }

    return {
      x: directionSum.x / length,
      y: directionSum.y / length,
    };
  }, [node]);

  const x1 = node.x - (width / 2) * direction.y;
  const y1 = node.y - (width / 2) * -direction.x;
  const x2 = node.x + (width / 2) * direction.y;
  const y2 = node.y + (width / 2) * -direction.x;

  return node.interchange ? (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeWidth={height + outlineWidth * 2}
        strokeLinecap="round"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="white"
        strokeWidth={height}
        strokeLinecap="round"
      />
    </>
  ) : null;
}

function LinkView({ link, width = 2 }: { link: Link; width?: number }) {
  const linkPath = useMemo(() => {
    const linkPath = path();

    const fromNode = getStationNode(link.from);
    const toNode = getStationNode(link.to);
    const pathNodes = link.path ?? [];

    linkPath.moveTo(fromNode.x, fromNode.y);

    for (const node of pathNodes) {
      linkPath.lineTo(node.x, node.y);
    }

    linkPath.lineTo(toNode.x, toNode.y);

    return linkPath.toString();
  }, [link]);

  const colour = useMemo(() => LINES[link.line.name].colour, [link.line]);

  return (
    <path
      d={linkPath}
      stroke={colour}
      strokeWidth={width}
      strokeLinejoin="round"
      fill="none"
    />
  );
}

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

  const linkWidthScale = useMemo(() => {
    const maxTotal = max(totalLinkLoads.map(([, total]) => total)) ?? 0;
    return scaleLinear().domain([0, maxTotal]).range([1, 10]);
  }, [totalLinkLoads]);

  const totalStationLoads: [StationNode, [number, number]][] = useMemo(() => {
    return Object.values(STATION_NODES).map((node) => [
      node,
      [
        sum(
          totalLinkLoads.filter(
            ([link]) => resolveStationNodeReference(link.to).name === node.name
          ),
          ([, load]) => load
        ),
        sum(
          totalLinkLoads.filter(
            ([link]) =>
              resolveStationNodeReference(link.from).name === node.name
          ),
          ([, load]) => load
        ),
      ],
    ]);
  }, [totalLinkLoads]);

  return (
    <svg viewBox="0 0 945 670" width={945} height={670}>
      {totalLinkLoads.map(([link, totalLoad]) => (
        <LinkView
          key={`${link.from.name}-${link.to.name}`}
          link={link}
          width={linkWidthScale(totalLoad)}
        />
      ))}
      {totalStationLoads.map(([node, loads]) => (
        <StationNodeView
          key={node.name}
          node={node}
          width={linkWidthScale(max(loads) ?? 0)}
        />
      ))}
    </svg>
  );
}
