const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'narrow',
});

export default (timestamp: string) => {
  const timeAgo = (Date.now() - new Date(timestamp + 'Z').getTime()) / 1000;
  if (timeAgo < 60) {
    return rtf.format(-Math.round(timeAgo), 'second');
  } else if (timeAgo < 3600) {
    return rtf.format(-Math.round(timeAgo / 60), 'minute');
  } else if (timeAgo < 86400) {
    return rtf.format(-Math.round(timeAgo / 3600), 'hour');
  } else if (timeAgo < 604800) {
    return rtf.format(-Math.round(timeAgo / 86400), 'day');
  } else if (timeAgo < 2592000) {
    return rtf.format(-Math.round(timeAgo / 604800), 'week');
  } else if (timeAgo < 31536000) {
    return rtf.format(-Math.round(timeAgo / 2592000), 'month');
  } else {
    return rtf.format(-Math.round(timeAgo / 31536000), 'year');
  }
};
