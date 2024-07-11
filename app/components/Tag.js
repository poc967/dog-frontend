import { Tag, Icon } from '@blueprintjs/core';
import { mapColorToIntent } from '../helpers/helpers';

const Tags = (props) => {
  const { alert } = props;
  return (
    <Tag
      onRemove={true}
      intent={mapColorToIntent(alert.priority)}
      style={{ marginBottom: '5px', marginLeft: '5px' }}
      minimal={true}
    >
      <span className="bp5-monospace-text">{alert.text}</span>
      <button>
        <Icon icon="small-cross" />
      </button>
    </Tag>
  );
};

export default Tags;
