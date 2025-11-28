import { select, zoom } from "d3";
import { Ref, useEffect, useRef } from "react";

export function useZoom<Container extends Element, Target extends Element>(): {
  zoomContainer: { ref: Ref<Container> };
  zoomTarget: { ref: Ref<Target> };
} {
  const containerRef = useRef<Container>(null);
  const targetRef = useRef<Target>(null);

  useEffect(() => {
    if (!containerRef.current || !targetRef.current) return;

    const zoomBehavior = zoom<Container, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        if (targetRef.current) {
          select(targetRef.current).attr("transform", event.transform);
        }
      });

    select(containerRef.current).call(zoomBehavior);
  }, []);

  return {
    zoomContainer: { ref: containerRef },
    zoomTarget: { ref: targetRef },
  };
}
