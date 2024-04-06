export const convertTime = (time) => {
  let hours = time.split(":")[0];
  let minutes = time.split(":")[1];
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return hours + ":" + minutes + " " + ampm;
};

export const dayOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
