export function formatToWIB(utcString: string) {
  const cleanUtcString = utcString.endsWith('Z') ? utcString : `${utcString}Z`;
  const date = new Date(cleanUtcString);

  const datePart = date.toLocaleDateString("en-US", {
    timeZone: "Asia/Jakarta",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} \n ${timePart}`;
}