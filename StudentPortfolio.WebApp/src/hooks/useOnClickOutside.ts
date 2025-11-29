import { useWindowEvent } from "@mantine/hooks";
import type { RefObject } from "react";

export const useOnClickOutsideElement = (
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void
) => {
  useWindowEvent("click", (e: PointerEvent) => {
    const coords = ref.current?.getBoundingClientRect();
    if (coords) {
      const x0 = coords.x;
      const x1 = coords.x + coords.width;
      const y0 = coords.y;
      const y1 = coords.y + coords.height;

      if (e.x < x0 || e.x > x1 || e.y < y0 || e.y > y1) onClickOutside();
    }
  });
};
