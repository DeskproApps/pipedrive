import { useEffect, useState } from "react";

type UseDebounce = <T>(
  value: T,
  delay: number,
) => {
  debouncedValue: T;
  setDebouncedValue: React.Dispatch<React.SetStateAction<T>>;
}

const useDebounce: UseDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, setDebouncedValue };
};

export { useDebounce };
