"use client";

import {
  LINES,
  LINK_NODES,
  STATION_NODES,
  STATIONS,
} from "@/data/tube/network";
import { LineReference, Link } from "@/data/types";
import { useMemo, useState } from "react";
import { OffsetPath } from "./OffsetPath";
import { createPortal } from "react-dom";
import { cabin } from "@/fonts";
import { pairs } from "d3";
import { Transition } from "motion";

// TODO: use dashed stroke with dash gaps proportional to gaps between services, dash length proportional to num carriages, width proportional to load per carriage
export function LinkView({
  link,
  line,
  linkSectionOffsets,
  weight,
  scale,
  outlineWidth = 0.6,
  hovered,
  setHovered = () => {},
  pathLength,
  pathOffset,
  opacity = 1,
  transition,
  pointerEvents = "auto",
  tooltip = null,
}: {
  link: Link;
  line: LineReference;
  linkSectionOffsets: Record<string, Record<string, number>>;
  weight: number;
  scale: (n: number) => number;
  outlineWidth?: number;
  hovered?: boolean;
  setHovered?: (hovered: boolean) => void;
  pathLength?: number;
  pathOffset?: number;
  opacity?: number;
  transition?: Transition;
  pointerEvents?: "auto" | "none";
  tooltip?: React.ReactNode | null;
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
          opacity={opacity}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      <OffsetPath
        nodes={nodes}
        sectionOffsets={sectionOffsets}
        stroke={colour}
        strokeLinejoin="round"
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(event) =>
          setMousePosition({ x: event.pageX, y: event.pageY })
        }
        initial={{ strokeWidth: width, pathLength, pathOffset }}
        animate={{ strokeWidth: width, pathLength, pathOffset }}
        opacity={opacity}
        transition={transition}
        style={{ pointerEvents }}
      />
      {hovered && mousePosition && tooltip
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
              {tooltip}
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
