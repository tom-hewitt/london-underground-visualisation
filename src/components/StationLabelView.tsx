import { Alignment, WeightedStationNode } from "@/data/types";
import { cabin } from "@/fonts";
import { motion } from "motion/react";

export function StationLabelView({
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
        <motion.text
          key={i}
          className={cabin.className}
          fill="#2E2B81"
          fontSize={fontSize}
          fontWeight={hovered ? 800 : 600}
          {...alignment}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ x, y, fontWeight: hovered ? 800 : 600 }}
        >
          {text}
        </motion.text>
      ))}
    </>
  );
}
