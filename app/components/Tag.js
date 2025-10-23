import { Tag, Icon } from '@blueprintjs/core';
import { mapColorToIntent } from '../helpers/helpers';
import { useAuth } from '../contexts/AuthContext';

const Tags = (props) => {
  const { hasRole } = useAuth();
  const { alert, tab, submitDeleteWhiteboard } = props;
  return (
    <Tag
      onRemove={true}
      intent={mapColorToIntent(alert.priority)}
      style={{ marginBottom: '5px', marginLeft: '5px' }}
      minimal={true}
    >
      <span>{alert.text}</span>
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
