import { X } from 'lucide-react';
import { normalizePriority } from '../helpers/helpers';
import { useAuth } from '../contexts/AuthContext';

const PRIORITY_CLASSES = {
  red:   'bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300',
  green: 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300',
  blue:  'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300',
};

function pillClasses(priority) {
  const p = normalizePriority(priority || 'blue');
  return PRIORITY_CLASSES[p] || PRIORITY_CLASSES.blue;
}

const Tags = (props) => {
  const { hasRole } = useAuth();
  const { alert, tab, submitDeleteWhiteboard, allDogs } = props;

  const displayText =
    tab === 'Friends'
      ? alert.name || alert.text || 'Unknown Friend'
      : alert.text;

  const showImage = tab === 'Friends' && alert.imageUrl;
  const priority = alert.priority || alert.level1 || 'blue';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${pillClasses(priority)}`}
    >
      {showImage && (
        <img
          src={alert.imageUrl}
          alt={alert.name}
          className="w-5 h-5 rounded-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <span>{displayText}</span>
      {hasRole('admin') && (
        <button
          onClick={() => submitDeleteWhiteboard(alert._id, tab)}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default Tags;
