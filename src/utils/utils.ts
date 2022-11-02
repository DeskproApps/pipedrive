export const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const msToTime = (s: number) => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  return hrs + ":" + mins;
};

export const getHoursEvery30Minutes = () => {
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
