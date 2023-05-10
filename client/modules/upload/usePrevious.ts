import { useEffect, useRef } from 'react';

/**
 * https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
 */

export default function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
