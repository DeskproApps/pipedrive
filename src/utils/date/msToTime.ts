const msToTime = (ms: number) => {
  const mins = Math.floor((ms / 1000 / 60) % 60);
  const hrs = Math.floor(ms / 1000 / 3600);

  return (hrs < 10 ? `0${hrs}` : hrs) + ":" + (mins < 10 ? `0${mins}` : mins);
};

export { msToTime };
