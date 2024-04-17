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
  '3xl': '2000px',
};

export const devices = {
  xs: `(max-width: ${breakpoints.xs})`,
  sm: `(max-width: ${breakpoints.sm})`,
  md: `(max-width: ${breakpoints.md})`,
  lg: `(max-width: ${breakpoints.lg})`,
  xl: `(max-width: ${breakpoints.xl})`,
  '2xl': `(max-width: ${breakpoints['2xl']})`,
  '3xl': `(max-width: ${breakpoints['3xl']})`,
};
