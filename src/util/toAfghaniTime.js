const toAfghaniTime = (utcDate) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kabul",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(utcDate));
};

export default toAfghaniTime;
