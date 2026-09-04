const toAfghaniDate = (utcDate) => {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kabul", // Afghanistan Standard Time
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(utcDate));
};

export default toAfghaniDate;
