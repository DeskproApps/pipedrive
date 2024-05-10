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

export const msToTime = (ms: number) => {
  const mins = Math.floor((ms / 1000 / 60) % 60);
  const hrs = Math.floor(ms / 1000 / 3600);

  return (hrs < 10 ? `0${hrs}` : hrs) + ":" + (mins < 10 ? `0${mins}` : mins);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLast = (items: any[], idx?: number): boolean => {
  if (Array.isArray(items) && (items.length > 0)) {
    return (items.length - 1) === idx;
  }

  return false;
};

export const addBlankTargetToLinks = (htmlString?: string): string => {
  if (!htmlString) {
    return "-";
  }

  if (typeof DOMParser === 'undefined') {
    return htmlString;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const links = doc.getElementsByTagName('a');

  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
  }

  return doc.documentElement.outerHTML;
};
