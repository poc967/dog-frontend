import { Badge } from '@/app/components/ui/badge';
import { X } from 'lucide-react';
import { mapColorToVariant } from '../helpers/helpers';
import { useAuth } from '../contexts/AuthContext';

const Tags = (props) => {
  const { hasRole } = useAuth();
  const { alert, tab, submitDeleteWhiteboard, allDogs } = props;
  
  // For friends, the data structure is different - friends are stored as full objects
  const displayText = tab === 'Friends' ? 
    (alert.name ? alert.name : alert.text || 'Unknown Friend') : 
    alert.text;
  
  const showImage = tab === 'Friends' && alert.imageUrl;
  
  return (
    <Badge
      variant={mapColorToVariant(alert.priority || alert.level1 || 'info')}
      className="mb-1 ml-1 gap-1.5 py-1 px-2.5"
    >
      <span className="flex items-center gap-1.5">
        {showImage && (
          <img 
            src={alert.imageUrl} 
            alt={alert.name}
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <span>{displayText}</span>
      </span>
      {hasRole('admin') ? (
        <button
          onClick={() => submitDeleteWhiteboard(alert._id, tab)}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </Badge>
  );
};

export default Tags;
