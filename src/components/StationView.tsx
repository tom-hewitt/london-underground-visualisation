import { NonEmptyArray, Station, WeightedStationNode } from "@/data/types";
import { motion } from "motion/react";

export function StationView({
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
        <motion.circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          r={scale(node.weight) / 2 + outlineWidth}
          fill="#000000"
          animate={{ r: scale(node.weight) / 2 + outlineWidth }}
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
        <motion.circle
          key={node.name}
          cx={node.x}
          cy={node.y}
          fill="#FFFFFF"
          animate={{ r: scale(node.weight) / 2 }}
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
