import { Tag, Icon } from '@blueprintjs/core';
import { mapColorToIntent } from '../helpers/helpers';

const Tags = (props) => {
  const { alert } = props;
  return (
    <Tag
      removable={true}
      intent={mapColorToIntent(alert.priority)}
      style={{ marginBottom: '5px', marginLeft: '5px' }}
      minimal={true}
    >
      <span className="bp5-monospace-text">{alert.data}</span>
      <button>
        <Icon icon="small-cross" />
      </button>
    </Tag>
  );
};

export default Tags;
