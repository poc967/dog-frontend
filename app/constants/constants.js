export const DETAIL_CATEGORIES = [
  'Alerts',
  'Diet',
  'Behavior',
  'Friends',
  'Misc',
];
export const DOG_HEADER_TABS = [
  'Details',
  'Activity History',
  'Behavior Notes',
  'QR Code',
];

export const PRIORITIES = ['danger', 'good', 'info'];

const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const devices = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
};
