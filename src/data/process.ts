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
 * Weights each station node by the maximum total weight of any link section connected to it.
 * @param nodes The station nodes to weight.
 * @param weightedLinks The weighted links between the nodes.
 * @returns The weighted station nodes.
 */
export function weightNodesWithMaxLinkSectionWeight(
  nodes: Record<string, StationNode>,
  weightedLinkSections: Record<string, WeightedLinkSection>
): Record<string, WeightedStationNode> {
  return addWeightsToNodes(nodes, (node) =>
    maxLinkSectionWeight(node, weightedLinkSections)
  );
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
          from: previousNode,
          to: currentNode,
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

function maxLinkSectionWeight(
  node: StationNode,
  weightedLinkSections: Record<string, WeightedLinkSection>
): number {
  return (
    max(
      Object.values(weightedLinkSections).filter(
        (link) =>
          ("nodeName" in link.to && link.to.nodeName === node.name) ||
          ("nodeName" in link.from && link.from.nodeName === node.name)
      ),
      (link) => sum(link.lines, (line) => line.weight)
    ) ?? 0
  );
}
