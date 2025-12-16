"use client";

import {
  offsetLinkLinesByWeight,
  weightLinkSections,
  weightNodesWithMaxLinkSectionWeight,
} from "@/data/process";
import {
  DayOfWeek,
  LinkReference,
  StationReference,
  WeightedLink,
  WeightedLinkSection,
  WeightedLinkWithFrequencies,
  WeightedStationNode,
} from "@/data/types";
import { useZoom } from "@/hooks/useZoom";
import { Fragment, useMemo, useState } from "react";
import { RiverThames } from "./RiverThames";
import { LinkView } from "./LinkView";
import {
  LINK_SECTIONS,
  STATION_LABELS,
  STATION_NODES,
  STATIONS,
} from "@/data/tube/network";
import { StationView } from "./StationView";
import { StationLabelView } from "./StationLabelView";
import { TimeInterval } from "@/data/tube/numbat/types";
import {
  addFrequenciesToWeightedLinks,
  LinkWeights,
  weightLinks,
} from "@/data/tube/numbat/process";
import { max, scaleLinear } from "d3";
import { useInterval } from "usehooks-ts";

export function AnimatedTubeMapVisualisation({
  linkLoadData,
  linkFrequencyData,
  year,
}: {
  linkLoadData: Record<TimeInterval, LinkWeights>;
  linkFrequencyData: Record<TimeInterval, LinkWeights>;
  year: string;
}) {
  const [minute, setMinute] = useState(0);

  const selectedQuarterHourIndex = Math.floor(minute / 15);

  const [isPlaying, setIsPlaying] = useState(false);

  useInterval(
    () => setMinute((minute) => (minute + 1) % (24 * 60)),
    isPlaying ? 200 : null
  );

  const quarterHours = useMemo(
    () =>
      Object.keys(linkLoadData)
        .sort()
        .map((q) => TimeInterval.assert(q)),
    [linkLoadData]
  );

  const quarterHourGraphs = useMemo(
    () =>
      quarterHours.map((quarterHour) =>
        prepareGraph(
          linkLoadData[quarterHour],
          linkFrequencyData[quarterHour],
          year
        )
      ),
    [linkLoadData, linkFrequencyData, year, quarterHours]
  );

  const { weightedLinks, weightedLinkSections, weightedNodes } = useMemo(
    () =>
      quarterHourGraphs[selectedQuarterHourIndex] ?? {
        weightedLinks: [],
        weightedLinkSections: {},
        weightedNodes: {},
      },
    [selectedQuarterHourIndex, quarterHourGraphs]
  );

  const maxNodeWeight = useMemo(
    () =>
      max(quarterHourGraphs, ({ weightedNodes }) =>
        max(Object.values(weightedNodes), (node) => node.weight)
      ) ?? 0,
    [weightedNodes]
  );

  const scale = useMemo(
    () => scaleLinear().domain([0, maxNodeWeight]).range([0, 8]),
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
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <label htmlFor="time-input">Time:</label>
          <button onClick={() => setIsPlaying((isPlaying) => !isPlaying)}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <input
            style={{ flexGrow: 1 }}
            id="time-input"
            type="range"
            value={minute}
            onChange={(e) => setMinute(parseInt(e.target.value))}
            min={0}
            max={24 * 60 - 1}
          />
          <p>{minute}</p>
        </div>
      </div>
      <AnimatedNetwork
        weightedLinks={weightedLinks}
        weightedLinkSections={weightedLinkSections}
        weightedNodes={weightedNodes}
        linkSizeScale={scale}
        nodeSizeScale={scale}
        minute={minute}
      />
    </div>
  );
}

function prepareGraph(
  loadData: LinkWeights,
  frequencyData: LinkWeights,
  year: string
): {
  weightedLinks: WeightedLinkWithFrequencies[];
  weightedLinkSections: Record<string, WeightedLinkSection>;
  weightedNodes: Record<string, WeightedStationNode>;
} {
  const weightedLinks = addFrequenciesToWeightedLinks(
    weightLinks(loadData, year),
    frequencyData,
    year
  );

  const weightedLinkSections = weightLinkSections(LINK_SECTIONS, weightedLinks);

  const weightedNodes = weightNodesWithMaxLinkSectionWeight(
    STATION_NODES,
    weightedLinkSections
  );

  return { weightedLinks, weightedLinkSections, weightedNodes };
}

function AnimatedNetwork({
  weightedLinks,
  weightedNodes,
  weightedLinkSections,
  linkSizeScale,
  nodeSizeScale,
  minute,
}: {
  weightedLinks: WeightedLinkWithFrequencies[];
  weightedNodes: Record<string, WeightedStationNode>;
  weightedLinkSections: Record<string, WeightedLinkSection>;
  linkSizeScale: (n: number) => number;
  nodeSizeScale: (n: number) => number;
  minute: number;
}) {
  const linkSectionOffsets = useMemo(
    () => offsetLinkLinesByWeight(weightedLinkSections, linkSizeScale),
    [weightedLinkSections, linkSizeScale]
  );

  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);

  const { zoomContainer, zoomTarget } = useZoom<SVGSVGElement, SVGGElement>();

  const quarterHour = Math.floor(minute / 15);

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
              <Fragment
                key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}`}
              >
                <LinkView
                  link={link}
                  line={line}
                  linkSectionOffsets={linkSectionOffsets}
                  weight={line.weight}
                  scale={linkSizeScale}
                  opacity={0.5}
                />
                {Array.from({ length: line.frequencies[0] }).map((_, i) => {
                  const minuteInQuarter = minute % 15;

                  const startMinute = (10 / line.frequencies[0]) * i;

                  const journeyLength = 5;

                  let pathLength = 0.2;

                  let pathOffset =
                    (minuteInQuarter - startMinute) / journeyLength -
                    pathLength / 2;

                  // Prevent wrapping
                  if (pathOffset < 0) {
                    if (pathOffset + pathLength >= 0) {
                      pathLength = pathLength + pathOffset;
                      pathOffset = 0;
                    } else {
                      pathLength = 0;
                      pathOffset = 0;
                    }
                  } else if (pathOffset > 1 - pathLength) {
                    if (pathOffset <= 1) {
                      pathLength = 1 - pathOffset;
                    } else {
                      return null;
                    }
                  }

                  return (
                    <LinkView
                      key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}-${quarterHour}-${i}`}
                      link={link}
                      line={line}
                      linkSectionOffsets={linkSectionOffsets}
                      weight={line.weight} // TODO: divide by frequency
                      scale={linkSizeScale}
                      pathLength={pathLength}
                      pathOffset={pathOffset}
                      transition={{ duration: 0.25, ease: "linear" }}
                    />
                  );
                })}
              </Fragment>
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
