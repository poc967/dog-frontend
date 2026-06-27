import Image from 'next/image';
import { PawPrint } from 'lucide-react';

// Picks a consistent soft color based on the dog's name
const PALETTE = [
  'bg-amber-100 text-amber-500 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-blue-100 text-blue-500 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-purple-100 text-purple-500 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-rose-100 text-rose-500 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-orange-100 text-orange-500 dark:bg-orange-900/40 dark:text-orange-400',
  'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400',
  'bg-indigo-100 text-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-400',
];

function nameToColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * DogAvatar — shows the dog photo if available, otherwise a colored
 * placeholder with a paw icon sized proportionally to the container.
 *
 * Props:
 *   imageUrl  — the dog's photo URL (optional)
 *   name      — used for alt text and to pick a placeholder color
 *   size      — pixel dimension (width = height), default 115
 *   className — extra classes applied to both the image and the placeholder
 *   onClick   — optional click handler (only wired up when imageUrl exists)
 */
export default function DogAvatar({
  imageUrl,
  name = '',
  size = 115,
  className = '',
  onClick,
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        width={size}
        height={size}
        className={`rounded object-cover ${onClick ? 'cursor-pointer' : ''} ${className}`}
        alt={`Photo of ${name}`}
        onClick={onClick}
      />
    );
  }

  const iconSize = Math.round(size * 0.42);

  return (
    <div
      className={`rounded flex items-center justify-center flex-shrink-0 ${nameToColor(name)} ${className}`}
      style={{ width: size, height: size }}
      aria-label={`No photo for ${name}`}
    >
      <PawPrint style={{ width: iconSize, height: iconSize }} />
    </div>
  );
}
