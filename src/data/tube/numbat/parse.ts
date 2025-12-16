import { type } from "arktype";
import {
  formatTimeInterval,
  LinkData,
  QUARTER_HOURS,
  TimeInterval,
} from "./types";
import { utils, WorkBook } from "xlsx";

export function parseLinkLoadData(
  workbook: WorkBook
): Record<string, LinkData> {
  const linkLoadsSheet = workbook.Sheets["Link_Loads"];

  const json = utils.sheet_to_json(linkLoadsSheet, { range: 2 });

  const links: Record<string, LinkData> = {};

  for (const row of json) {
    if (!row) {
      throw new Error("Missing row in link load data");
    }

    // Trim whitespace from keys
    const rowTrimmed = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim(), value])
    );

    const linkLoadRow = LinkDataSchema(rowTrimmed);

    if (linkLoadRow instanceof type.errors) {
      console.warn("Invalid link load row:", linkLoadRow.toString());
      continue;
    }

    const linkLoad = parseLinkData(linkLoadRow);

    links[linkLoad.link] = linkLoad;
  }

  return links;

  // return json.map(LinkLoadSheetSchema.assert).map(parseLinkLoad);
}

export function parseLinkFrequencyData(
  workbook: WorkBook
): Record<string, LinkData> {
  const linkFrequenciesSheet = workbook.Sheets["Link_Frequencies"];

  const json = utils.sheet_to_json(linkFrequenciesSheet, { range: 2 });

  const links: Record<string, LinkData> = {};

  for (const row of json) {
    if (!row) {
      throw new Error("Missing row in link frequency data");
    }

    // Trim whitespace from keys
    const rowTrimmed = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim(), value])
    );

    const linkFrequencyRow = LinkDataSchema(rowTrimmed);

    if (linkFrequencyRow instanceof type.errors) {
      console.warn("Invalid link frequency row:", linkFrequencyRow.toString());
      continue;
    }

    const linkFrequency = parseLinkData(linkFrequencyRow);

    links[linkFrequency.link] = linkFrequency;
  }

  return links;
}

const LinkDataSchema = type({
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
type LinkDataSchema = typeof LinkDataSchema.infer;

function parseLinkData(row: LinkDataSchema): LinkData {
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
