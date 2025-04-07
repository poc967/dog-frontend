export function mapColorToIntent(priority) {
  switch (priority) {
    case 'danger':
      return 'danger';
    case 'good':
      return 'success';
    case 'info':
      return 'primary';
    default:
      break;
  }
}

export function mapLevelToColor(level) {
  switch (level) {
    case 'green':
      return '#43A047';
    case 'yellow':
      return '#FDD835';
    case 'red':
      return '#F4511E';
    case 'blue':
      return '#1E88E5';
    case 'purple':
      return '#5E35B1';
    default:
      return '#90A4AE';
  }
}

export function toSnakeCase(string) {
  let lowered = string.toLowerCase();
  return lowered.replace(' ', '_');
}

export function getLocalDate(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${month + 1}/${day}/${year}`;
}

export function getLocalTime(timestamp) {
  const date = new Date(timestamp);

  // Extract the local time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, 0);

  // Determine AM/PM and adjust hours
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  hours = String(hours);

  // Format the local time as a string in 12-hour format
  const localTime = `${hours}:${minutes} ${ampm}`;

  return localTime;
}
