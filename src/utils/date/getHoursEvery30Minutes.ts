const getHoursEvery30Minutes = () => {
  let i = 0;

  const arr = [];

  while (i <= 1440) {
    arr.push(i);
    i += 15;
  }

  arr.pop();

  return arr.map((e) => {
    const hour = Math.floor(e / 60).toString();
    const minutes = (e % 60).toString();
    return `${hour.length === 1 ? `0${hour}` : hour}:${
      minutes.length === 1 ? `0${minutes}` : minutes
    }`;
  });
};

export { getHoursEvery30Minutes };
