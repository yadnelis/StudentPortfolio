import { useEffect, useState } from "react";

export const useDelayedTrigger = (visible: boolean, delay: number) => {
  const [trigger, setTrigger] = useState(false);
  const [_delayedVisible, setVisible] = useState(false);

  const triggerVisible = async () => {
    setTimeout(() => {
      setTrigger((prev) => !prev);
    }, delay);
  };

  useEffect(() => {
    if (visible) {
      triggerVisible();
    } else {
      setVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setVisible(true);
    }
  }, [trigger]);

  return [_delayedVisible];
};
