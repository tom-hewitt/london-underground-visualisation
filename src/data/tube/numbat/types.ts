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
  quarterHours: Record<string, number>;
}

export const TimeInterval = regex("^\\d{2}\\d{2}-\\d{2}\\d{2}$");
export type TimeInterval = typeof TimeInterval.infer;

export function formatTimeInterval(from: Date, to: Date): TimeInterval {
  return `${BigInt(from.getHours())}${BigInt(from.getMinutes())}-${BigInt(
    to.getHours()
  )}${BigInt(to.getMinutes())}`;
}

export const QUARTER_HOURS = range(0, 24).flatMap((hour) =>
  range(0, 60, (i) => i, 15).map((minute) =>
    formatTimeInterval(
      new Date(0, 0, 0, hour, minute),
      new Date(0, 0, 0, hour, minute + 15)
    )
  )
);
