import { read, utils } from "xlsx";
import { type } from "arktype";
import {
  formatTimeInterval,
  LinkLoad,
  QUARTER_HOURS,
  TimeInterval,
} from "./types";
import { readFile } from "fs/promises";

export async function fetchLinkLoadData(): Promise<Record<string, LinkLoad>> {
  const data = await fetchNumbatFileBuffer(
    "NUMBAT/NUMBAT%202024/NBT24FRI_outputs.xlsx"
  );

  const workbook = read(data, { type: "array" });

  const linkLoadsSheet = workbook.Sheets["Link_Loads"];

  const json = utils.sheet_to_json(linkLoadsSheet, { range: 2 });

  const links: Record<string, LinkLoad> = {};

  for (const row of json) {
    const linkLoadRow = LinkLoadSheetSchema(row);

    if (linkLoadRow instanceof type.errors) {
      continue;
    }

    const linkLoad = parseLinkLoad(linkLoadRow);

    links[linkLoad.link] = linkLoad;
  }

  return links;

  // return json.map(LinkLoadSheetSchema.assert).map(parseLinkLoad);
}

type NumbatFileBuffer = Buffer | ArrayBuffer;

async function fetchNumbatFileBuffer(name: string): Promise<NumbatFileBuffer> {
  // Allow using a local file for development
  if (process.env.DATA_SOURCE === "fs") {
    return await readFile(name);
  }

  const response = await fetch(`https://crowding.data.tfl.gov.uk/${name}`);

  return await response.arrayBuffer();
}

const LinkLoadSheetSchema = type({
  Link: "string",
  Line: "string",
  Dir: "string",
  Order: "number",
  "From Station": "string",
  "From NLC": "number",
  "From ASC": "string",
  "To NLC": "number",
  "To ASC": "string",
  "To Station": "string",
  Total: "number",
  Early: "number",
  "AM Peak": "number",
  Midday: "number",
  "PM Peak": "number",
  Evening: "number",
  Late: "number",
}).and(type.Record(TimeInterval, "number"));
type LinkLoadSheetSchema = typeof LinkLoadSheetSchema.infer;

function parseLinkLoad(row: LinkLoadSheetSchema): LinkLoad {
  return {
    link: row["Link"],
    line: row["Line"],
    direction: row["Dir"],
    order: row["Order"],
    from: {
      nlc: row["From NLC"],
    },
    to: {
      nlc: row["To NLC"],
    },
    total: row["Total"],
    early: row["Early"],
    amPeak: row["AM Peak"],
    midday: row["Midday"],
    pmPeak: row["PM Peak"],
    evening: row["Evening"],
    late: row["Late"],
    quarterHours: Object.fromEntries(
      QUARTER_HOURS.map(([from, to]) => formatTimeInterval(from, to)).map(
        (interval) => [interval, row[interval]]
      )
    ),
  };
}
