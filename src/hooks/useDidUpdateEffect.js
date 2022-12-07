import { useEffect, useState } from 'react';

export function useDidUpdateEffect(fn, inputs) {
  const [didMountState, setDidMountState] = useState(false);

  useEffect(() => {
    if (didMountState) {
      return fn();
    }
    setDidMountState(true);
  }, inputs);
}
