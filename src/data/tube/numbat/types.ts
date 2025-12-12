import { StationReference } from "@/data/types";
import { regex } from "arktype";
import { range } from "radash";

export interface LinkLoad {
  link: string;
  line: string;
  from: StationReference;
  to: StationReference;
  order: number;
  direction: string;
  total: number;
  early: number;
  amPeak: number;
  midday: number;
  pmPeak: number;
  evening: number;
  late: number;
  quarterHours: Record<TimeInterval, number>;
}

export const TimeInterval = regex("^\\d\\d\\d\\d-\\d\\d\\d\\d$");
export type TimeInterval = typeof TimeInterval.infer;

function zeroPad(n: number): `${bigint}${bigint}` {
  return `${BigInt(n) / BigInt(10)}${BigInt(n) % BigInt(10)}`;
}

export function formatTimeInterval(from: Date, to: Date): TimeInterval {
  return `${zeroPad(from.getHours())}${zeroPad(from.getMinutes())}-${zeroPad(
    to.getHours()
  )}${zeroPad(to.getMinutes())}`;
}

export const QUARTER_HOURS: [Date, Date][] = Array.from(
  range(0, 23).flatMap((hour) =>
    range(0, 45, (i) => i, 15).map((minute) => [
      new Date(0, 0, 0, hour, minute),
      new Date(0, 0, 0, hour, minute + 15),
    ])
  )
);
