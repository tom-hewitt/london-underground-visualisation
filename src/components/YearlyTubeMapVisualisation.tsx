"use client";

import { cabin } from "@/fonts";
import {
  LINES,
  LINK_SECTIONS,
  STATION_LABELS,
  STATION_NODES,
  STATIONS,
} from "@/data/tube/network";
import {
  LinkReference,
  StationReference,
  WeightedLink,
  WeightedLinkSection,
  WeightedStationNode,
} from "@/data/types";
import { max, scaleLinear } from "d3";
import { useMemo, useState } from "react";
import {
  LinkWeights,
  resolveLinks,
  weightLinks,
} from "@/data/tube/numbat/process";
import {
  offsetLinkLinesByWeight,
  weightLinkSections,
  weightNodesWithMaxLinkSectionWeight,
} from "@/data/process";
import { useZoom } from "@/hooks/useZoom";
import { RiverThames } from "./RiverThames";
import { LinkView } from "./LinkView";
import { StationView } from "./StationView";
import { StationLabelView } from "./StationLabelView";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          padding: "16px",
        }}
      >
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
  const weightedLinks = resolveLinks(weightLinks(data, year));

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
  const linkSectionOffsets = useMemo(
    () => offsetLinkLinesByWeight(weightedLinkSections, linkSizeScale),
    [weightedLinkSections, linkSizeScale]
  );

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  const { zoomContainer, zoomTarget } = useZoom<SVGSVGElement, SVGGElement>();

  return (
    <svg {...zoomContainer} style={{ flexGrow: 1 }} viewBox="0 0 945 670">
      <g {...zoomTarget}>
        <RiverThames />
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
                tooltip={
                  <>
                    <div
                      style={{
                        width: "10px",
                        backgroundColor: LINES[line.lineName].colour,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <strong>
                          {
                            STATIONS.filter(
                              ({ nlc }) =>
                                nlc ===
                                STATION_NODES[link.from.nodeName].station.nlc
                            )[0].name
                          }
                        </strong>
                        {" to "}
                        <strong>
                          {
                            STATIONS.filter(
                              ({ nlc }) =>
                                nlc ===
                                STATION_NODES[link.to.nodeName].station.nlc
                            )[0].name
                          }
                        </strong>
                      </div>
                      <span>{line.lineName}</span>
                    </div>
                    <div style={{ width: "8px" }} />
                    {Math.round(line.weight).toLocaleString()} passengers
                  </>
                }
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
