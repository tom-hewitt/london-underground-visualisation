"use client";

import {
  offsetLinkLinesByWeight,
  weightLinkSections,
  weightNodesWithMaxLinkSectionWeight,
} from "@/data/process";
import {
  DayOfWeek,
  LineReference,
  LinkReference,
  StationReference,
  WeightedLineReferenceWithFrequency,
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
  LINES,
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
  adjustWeightForFrequencies,
  adjustWeightsForFrequencies,
  LinkWeights,
  resolveLinks,
  weightLinks,
} from "@/data/tube/numbat/process";
import { max, scaleLinear } from "d3";
import { useInterval } from "usehooks-ts";

export function AnimatedTubeMapVisualisation({
  linkLoadData,
  linkFrequencyData,
  linkOrderData,
  year,
}: {
  linkLoadData: Record<TimeInterval, LinkWeights>;
  linkFrequencyData: Record<TimeInterval, LinkWeights>;
  linkOrderData: LinkWeights;
  year: string;
}) {
  const [minute, setMinute] = useState(0);

  const selectedQuarterHourIndex = Math.floor(minute / 15);

  const [isPlaying, setIsPlaying] = useState(false);

  const intervalDelayMs = 100;

  useInterval(
    () => setMinute((minute) => (minute + 0.25) % (24 * 60)),
    isPlaying ? intervalDelayMs : null
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
          linkOrderData,
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
          <p>
            {new Date(
              0,
              0,
              0,
              Math.floor(minute / 60),
              Math.floor(minute % 60)
            ).toLocaleTimeString("en-GB", { timeStyle: "short" })}
          </p>
        </div>
      </div>
      <AnimatedNetwork
        weightedLinks={weightedLinks}
        weightedLinkSections={weightedLinkSections}
        weightedNodes={weightedNodes}
        linkSizeScale={scale}
        nodeSizeScale={scale}
        minute={minute}
        intervalDelayMs={intervalDelayMs}
      />
    </div>
  );
}

function prepareGraph(
  loadData: LinkWeights,
  frequencyData: LinkWeights,
  linkOrders: LinkWeights,
  year: string
): {
  weightedLinks: WeightedLinkWithFrequencies[];
  weightedLinkSections: Record<string, WeightedLinkSection>;
  weightedNodes: Record<string, WeightedStationNode>;
} {
  const weightedLinks = resolveLinks(
    addFrequenciesToWeightedLinks(
      weightLinks(loadData, year),
      frequencyData,
      linkOrders,
      year
    )
  );

  const frequencyAdjustedLinks = adjustWeightsForFrequencies(weightedLinks);

  const weightedLinkSections = weightLinkSections(
    LINK_SECTIONS,
    frequencyAdjustedLinks
  );

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
  intervalDelayMs,
}: {
  weightedLinks: WeightedLinkWithFrequencies[];
  weightedNodes: Record<string, WeightedStationNode>;
  weightedLinkSections: Record<string, WeightedLinkSection>;
  linkSizeScale: (n: number) => number;
  nodeSizeScale: (n: number) => number;
  minute: number;
  intervalDelayMs: number;
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

            const directions =
              link.from.directions || LINES[line.lineName].directions;

            return (
              <Fragment
                key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}`}
              >
                <LinkView
                  link={link}
                  line={line}
                  linkSectionOffsets={linkSectionOffsets}
                  weight={adjustWeightForFrequencies(
                    line.weight,
                    line.frequencies
                  )}
                  scale={linkSizeScale}
                  opacity={0.5}
                  hovered={hovered}
                  setHovered={setHovered}
                  tooltip={
                    <>
                      Quarter Hour Frequencies: {line.frequencies[0]} services{" "}
                      {directions[0]}, {line.frequencies[1]} services{" "}
                      {directions[1]}
                    </>
                  }
                />
                {Array.from({ length: line.frequencies[0] }).map((_, i) => (
                  <AnimatedService
                    key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}-${quarterHour}-${i}-0`}
                    link={link}
                    line={line}
                    linkSectionOffsets={linkSectionOffsets}
                    linkSizeScale={linkSizeScale}
                    intervalDelayMs={intervalDelayMs}
                    minute={minute}
                    quarterHour={quarterHour}
                    i={i}
                    direction={0}
                  />
                ))}
                {Array.from({ length: line.frequencies[1] }).map((_, i) => (
                  <AnimatedService
                    key={`${link.from.nodeName}-${link.to.nodeName}-${line.lineName}-${quarterHour}-${i}-1`}
                    link={link}
                    line={line}
                    linkSectionOffsets={linkSectionOffsets}
                    linkSizeScale={linkSizeScale}
                    intervalDelayMs={intervalDelayMs}
                    minute={minute}
                    quarterHour={quarterHour}
                    i={i}
                    direction={1}
                  />
                ))}
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

function AnimatedService({
  link,
  line,
  linkSectionOffsets,
  linkSizeScale,
  minute,
  quarterHour,
  i,
  intervalDelayMs,
  direction,
}: {
  link: WeightedLinkWithFrequencies;
  line: WeightedLineReferenceWithFrequency;
  linkSectionOffsets: Record<string, Record<string, number>>;
  linkSizeScale: (n: number) => number;
  minute: number;
  quarterHour: number;
  i: number;
  intervalDelayMs: number;
  direction: 0 | 1;
}) {
  const minuteInQuarter = minute % 15;

  const journeyLength = 1;

  const startMinute =
    ((15 / (line.frequencies[direction] + 1)) * i +
      line.orders[direction] +
      LINE_OFFSETS[line.lineName]) %
    15;

  let pathLength = 0.2;

  let pathOffset =
    (minuteInQuarter - startMinute) / journeyLength - pathLength / 2;

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

  if (direction === 1) {
    pathOffset = 1 - pathOffset;
  }

  return (
    <LinkView
      link={link}
      line={line}
      linkSectionOffsets={linkSectionOffsets}
      weight={line.weight / line.frequencies[direction]}
      scale={linkSizeScale}
      pathLength={pathLength}
      pathOffset={pathOffset}
      transition={{
        duration: intervalDelayMs / 1000,
        ease: "linear",
      }}
      pointerEvents="none"
    />
  );
}

const LINE_OFFSETS: Record<string, number> = {
  Central: 0,
  Jubilee: 1,
  Victoria: 2,
  Northern: 3,
  Picadilly: 4,
  Bakerloo: 5,
  District: 6,
  Circle: 7,
  "H&C": 8,
  Metropolitan: 9,
  "Waterloo & City": 10,
  "Elizabeth Line": 11,
};
