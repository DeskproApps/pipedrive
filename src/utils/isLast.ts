// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLast = (items: any[], idx?: number): boolean => {
  if (Array.isArray(items) && (items.length > 0)) {
    return (items.length - 1) === idx;
  }

  return false;
};

export { isLast };
