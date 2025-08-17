export const mergeDateTime = (date: string, time: string): Date => {
  const dateObj = new Date(date);
  const [timePart, modifier] = time.split(' ');
  let [hoursRaw, minutesRaw] = (timePart ?? '00:00').split(':');
  let hours = Number(hoursRaw);
  let minutes = Number(minutesRaw);

  hours = isNaN(hours) ? 0 : hours;
  minutes = isNaN(minutes) ? 0 : minutes;

  if (modifier?.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier?.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  dateObj.setHours(hours ?? 0);
  dateObj.setMinutes(minutes ?? 0);
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);

  return dateObj;
};