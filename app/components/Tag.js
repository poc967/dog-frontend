import { Tag, Icon } from '@blueprintjs/core';
import { mapColorToIntent } from '../helpers/helpers';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const DogImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  vertical-align: middle;
`;

const TagContent = styled.div`
  display: flex;
  align-items: center;
`;

const Tags = (props) => {
  const { hasRole } = useAuth();
  const { alert, tab, submitDeleteWhiteboard, allDogs } = props;
  
  // For friends, the data structure is different - friends are stored as full objects
  const displayText = tab === 'Friends' ? 
    (alert.name ? alert.name : alert.text || 'Unknown Friend') : 
    alert.text;
  
  const showImage = tab === 'Friends' && alert.imageUrl;
  
  return (
    <Tag
      onRemove={true}
      intent={mapColorToIntent(alert.priority || alert.level1 || 'info')}
      style={{ marginBottom: '5px', marginLeft: '5px' }}
      minimal={true}
    >
      <TagContent>
        {showImage && (
          <DogImage 
            src={alert.imageUrl} 
            alt={alert.name}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <span>{displayText}</span>
      </TagContent>
      {hasRole('admin') ? (
        <button>
          <Icon
            icon="small-cross"
            onClick={() => submitDeleteWhiteboard(alert._id, tab)}
          />
        </button>
      ) : null}
    </Tag>
  );
};

export default Tags;
