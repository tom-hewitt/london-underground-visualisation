import { max, pairs, sum } from "d3";
import {
  LinkNodeReference,
  LinkSection,
  StationNode,
  StationNodeReference,
  WeightedLink,
  WeightedLinkSection,
  WeightedStationNode,
} from "./types";

/**
 * Weights each station node by the maximum total weight of any link connected to it.
 * @param nodes The station nodes to weight.
 * @param weightedLinks The weighted links between the nodes.
 * @returns The weighted station nodes.
 */
export function weightNodesWithMaxLinkWeight(
  nodes: Record<string, StationNode>,
  weightedLinks: WeightedLink[]
): Record<string, WeightedStationNode> {
  return addWeightsToNodes(nodes, (node) => maxLinkWeight(node, weightedLinks));
}

/**
 * Weights each link section by combining all links that use it.
 */
export function weightLinkSections(
  sections: Record<string, LinkSection>,
  weightedLinks: WeightedLink[]
): Record<string, WeightedLinkSection> {
  const weightedSections: Record<string, WeightedLinkSection> = {};

  for (const link of weightedLinks) {
    const pathNodes = link.path ?? [];

    for (const [previousNode, currentNode] of pairs([
      link.from,
      ...pathNodes,
      link.to,
    ])) {
      const sectionId = linkSectionId(previousNode, currentNode);

      const weightedLines =
        sections[sectionId]?.lines.map(
          (line) =>
            link.lines.find((l) => l.lineName === line.lineName) ?? {
              ...line,
              weight: 0,
            }
        ) ?? link.lines;

      if (!(sectionId in weightedSections)) {
        weightedSections[sectionId] = {
          lines: structuredClone(weightedLines), // Deep copy since weights may be mutated by future links
        };
      } else {
        for (const line of weightedLines) {
          const existingLine = weightedSections[sectionId].lines.find(
            (l) => l.lineName === line.lineName
          );
          if (existingLine) {
            existingLine.weight += line.weight;
          } else {
            weightedSections[sectionId].lines.push(line);
          }
        }
      }
    }
  }

  return weightedSections;
}

function linkSectionId(
  from: StationNodeReference | LinkNodeReference,
  to: StationNodeReference | LinkNodeReference
): string {
  return [pathNodeName(from), pathNodeName(to)]
    .sort((a, b) => a.localeCompare(b))
    .join("-");
}

function pathNodeName(node: StationNodeReference | LinkNodeReference) {
  if ("nodeName" in node) {
    return node.nodeName;
  } else {
    return node.linkNodeName;
  }
}

function addWeightsToNodes(
  nodes: Record<string, StationNode>,
  weightFunction: (node: StationNode) => number
) {
  return Object.fromEntries(
    Object.entries(nodes).map(([_, node]) => [
      node.name,
      {
        ...node,
        weight: weightFunction(node),
      },
    ])
  );
}

function maxLinkWeight(
  node: StationNode,
  weightedLinks: WeightedLink[]
): number {
  return (
    max(
      weightedLinks.filter(
        (link) =>
          link.to.nodeName === node.name || link.from.nodeName === node.name
      ),
      (link) => sum(link.lines, (line) => line.weight)
    ) ?? 0
  );
}
