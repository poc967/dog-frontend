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
