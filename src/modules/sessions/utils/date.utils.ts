export const convertDateToISODate = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export const convertDateToHourMinute = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(11, 16);

export const capitalizeFirstLetter = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

export const convertToUtcIso = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString(); // -> "2025-08-10T07:30:00.000Z"
