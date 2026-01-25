import { useState, useEffect } from "react";

/**
 * Trả về giá trị được debounce sau delay ms.
 * @param {*} value - Giá trị cần debounce
 * @param {number} delay - Thời gian chờ (ms)
 * @returns {*} - Giá trị debounced
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
