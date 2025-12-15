import { read, utils, WorkBook } from "xlsx";
import { type } from "arktype";
import {
  formatTimeInterval,
  LinkLoad,
  QUARTER_HOURS,
  TimeInterval,
} from "./types";
import { readFile } from "fs/promises";

export async function fetchAllNumbatData(): Promise<
  [string, [string, NumbatFileBuffer][]][]
> {
  const years = {
    "2016": {
      MTT: "NUMBAT/NUMBAT%202016/NBT16MTT_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202016/NBT16SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202016/NBT16SUN_Outputs.xlsx",
    },
    "2017": {
      MTT: "NUMBAT/NUMBAT%202017/NBT17MTT_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202017/NBT17SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202017/NBT17SUN_Outputs.xlsx",
    },
    "2018": {
      MTT: "NUMBAT/NUMBAT%202018/NBT18MTT_Outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202018/NBT18FRI_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202018/NBT18SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202018/NBT18SUN_Outputs.xlsx",
    },
    "2019": {
      MTT: "NUMBAT/NUMBAT%202019/NBT19MTT_Outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202019/NBT19FRI_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202019/NBT19SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202019/NBT19SUN_Outputs.xlsx",
    },
    "2020": {
      MTT: "NUMBAT/NUMBAT%202020/NBT20MTT_Outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202020/NBT20FRI_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202020/NBT20SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202020/NBT20SUN_Outputs.xlsx",
    },
    "2021": {
      MTT: "NUMBAT/NUMBAT%202021/NBT21MTT_Outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202021/NBT21FRI_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202021/NBT21SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202021/NBT21SUN_Outputs.xlsx",
    },
    "2022": {
      MON: "NUMBAT/NUMBAT%202022/NBT22MON_Outputs.xlsx",
      TWT: "NUMBAT/NUMBAT%202022/NBT22TWT_Outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202022/NBT22FRI_Outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202022/NBT22SAT_Outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202022/NBT22SUN_Outputs.xlsx",
    },
    "2023": {
      MON: "NUMBAT/NUMBAT%202023/NBT23MON_outputs.xlsx",
      TWT: "NUMBAT/NUMBAT%202023/NBT23TWT_outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202023/NBT23FRI_outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202023/NBT23SAT_outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202023/NBT23SUN_outputs.xlsx",
    },
    "2024": {
      MON: "NUMBAT/NUMBAT%202024/NBT24MON_outputs.xlsx",
      TWT: "NUMBAT/NUMBAT%202024/NBT24TWT_outputs.xlsx",
      FRI: "NUMBAT/NUMBAT%202024/NBT24FRI_outputs.xlsx",
      SAT: "NUMBAT/NUMBAT%202024/NBT24SAT_outputs.xlsx",
      SUN: "NUMBAT/NUMBAT%202024/NBT24SUN_outputs.xlsx",
    },
  } as const;

  return Promise.all(
    Object.entries(years).map(async ([year, days]) => [
      year,
      await Promise.all(
        Object.entries(days).map(async ([day, path]) => [
          day,
          await fetchNumbatFileBuffer(path),
        ])
      ),
    ])
  );
}

export async function fetchNumbatWorkbook(path: string): Promise<WorkBook> {
  try {
    const data = await fetchNumbatFileBuffer(path);

    return read(data, { type: "array" });
  } catch (e) {
    console.error(`Failed to fetch Numbat workbook at path: ${path}`, e);
    throw e;
  }
}

export function parseLinkLoadData(
  workbook: WorkBook
): Record<string, LinkLoad> {
  const linkLoadsSheet = workbook.Sheets["Link_Loads"];

  const json = utils.sheet_to_json(linkLoadsSheet, { range: 2 });

  const links: Record<string, LinkLoad> = {};

  for (const row of json) {
    if (!row) {
      throw new Error("Missing row in link load data");
    }

    // Trim whitespace from keys
    const rowTrimmed = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim(), value])
    );

    const linkLoadRow = LinkLoadSheetSchema(rowTrimmed);

    if (linkLoadRow instanceof type.errors) {
      console.warn("Invalid link load row:", linkLoadRow.toString());
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
  "use cache";

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
