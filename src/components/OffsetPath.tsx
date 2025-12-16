import { pairs, path } from "d3";
import { motion, SVGMotionProps } from "motion/react";
import { zip } from "radash";
import { useMemo } from "react";

export function OffsetPath({
  nodes,
  sectionOffsets,
  ...props
}: {
  nodes: Vector2D[];
  sectionOffsets: number[];
} & Omit<SVGMotionProps<SVGPathElement>, "d">) {
  if (nodes.length < 2) {
    return null;
  }

  const lines: OffsetLine2D[] = useMemo(
    () =>
      zip(pairs(nodes), sectionOffsets).map(([[from, to], offset]) => ({
        from,
        to,
        offset,
      })),
    [nodes, sectionOffsets]
  );

  if (sectionOffsets.length !== lines.length) {
    throw new Error("sectionOffsets length must match number of lines");
  }

  const pathString = useMemo(() => {
    const pathBuilder = path();

    const startLine = lines[0];
    const startNormal = normal(startLine);

    pathBuilder.moveTo(
      startLine.from.x - startNormal.x * startLine.offset,
      startLine.from.y - startNormal.y * startLine.offset
    );

    for (const [previousLine, nextLine] of pairs(lines)) {
      const corner = previousLine.to; // === nextLine.from

      // Vector from corner to next node (B -> C)
      const dirToNext = normalise(subtract(nextLine.to, corner));

      // Vector from corner to previous node (B -> A)
      // which is effectively A -> B (incoming direction).
      // To match the formula B -> A, we need to negate it or calculate B -> A.
      const dirToPrev = normalise(subtract(previousLine.from, corner));

      // The cross product gives us the sine of the angle with sign indicating direction
      const crossProd = cross(dirToPrev, dirToNext);

      let offsetCorner: { x: number; y: number };

      if (Math.abs(crossProd) < 1e-4) {
        const normal = { x: -dirToNext.y, y: dirToNext.x };
        offsetCorner = {
          x: corner.x - normal.x * nextLine.offset,
          y: corner.y - normal.y * nextLine.offset,
        };
      } else {
        // Calculate vectors u and v
        // u is along B->A (dirToPrev), scaled by nextOffset / crossProd
        // v is along B->C (dirToNext), scaled by previousOffset / crossProd
        // We use crossProd because of the coordinate system / derivation.

        const uVec = multiply(dirToPrev, nextLine.offset / crossProd);
        const vVec = multiply(dirToNext, previousLine.offset / crossProd);

        // D = B + u + v
        const offset = add(uVec, vVec);
        offsetCorner = add(corner, offset);
      }

      pathBuilder.lineTo(offsetCorner.x, offsetCorner.y);
    }

    const endLine = lines[lines.length - 1];
    const endNormal = normal(endLine);

    pathBuilder.lineTo(
      endLine.to.x - endNormal.x * endLine.offset,
      endLine.to.y - endNormal.y * endLine.offset
    );

    return pathBuilder.toString();
  }, [lines]);

  return <motion.path d={pathString} {...props} />;
}

export interface Vector2D {
  x: number;
  y: number;
}

function cross(a: Vector2D, b: Vector2D): number {
  return a.x * b.y - a.y * b.x;
}

function add(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar };
}

function normalise(v: Vector2D): Vector2D {
  const len = length(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function length(a: Vector2D): number {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

export interface Line2D {
  from: Vector2D;
  to: Vector2D;
}

export interface OffsetLine2D extends Line2D {
  offset: number;
}

const normal = (line: Line2D): Vector2D => {
  const dx = line.to.x - line.from.x;
  const dy = line.to.y - line.from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: -dy / len, y: dx / len };
};
