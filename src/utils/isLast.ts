const isLast = <T = unknown>(items: T[], idx?: number): boolean => {
  if (items.length > 0) {
    return (items.length - 1) === idx;
  }

  return false;
};

export { isLast };
