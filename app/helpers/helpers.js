export function normalizePriority(priority) {
  const normalized = (priority || '').toLowerCase();

  switch (normalized) {
    case 'good':
      return 'green';
    case 'info':
      return 'blue';
    case 'danger':
      return 'red';
    default:
      return normalized;
  }
}

export function mapColorToIntent(priority) {
  switch (normalizePriority(priority)) {
    case 'red':
      return 'danger';
    case 'green':
      return 'success';
    case 'blue':
      return 'primary';
    default:
      break;
  }
}

export function mapColorToVariant(priority) {
  switch (normalizePriority(priority)) {
    case 'red':
      return 'danger';
    case 'green':
      return 'success';
    case 'blue':
      return 'info';
    default:
      return 'secondary';
  }
}

export function mapRoleToVariant(role) {
  switch (role) {
    case 'admin':
      return 'success';
    case 'staff':
      return 'info';
    case 'volunteer':
      return 'warning';
    default:
      return 'secondary';
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

export function formatElapsed(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '';
  const d = Math.floor(totalMinutes / 1440);
  const h = Math.floor((totalMinutes % 1440) / 60);
  const m = totalMinutes % 60;
  if (d > 0) {
    const parts = [`${d}d`];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    return parts.join(' ');
  }
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
