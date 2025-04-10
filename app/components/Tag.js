import { Tag, Icon } from '@blueprintjs/core';
import { mapColorToIntent } from '../helpers/helpers';

const Tags = (props) => {
  const { alert, tab, submitDeleteWhiteboard } = props;
  return (
    <Tag
      onRemove={true}
      intent={mapColorToIntent(alert.priority)}
      style={{ marginBottom: '5px', marginLeft: '5px' }}
      minimal={true}
    >
      <span>{alert.text}</span>
      <button>
        <Icon
          icon="small-cross"
          onClick={() => submitDeleteWhiteboard(alert._id, tab)}
        />
      </button>
    </Tag>
  );
};

export default Tags;
