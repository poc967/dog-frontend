import { HTMLTable } from '@blueprintjs/core';
import styled from 'styled-components';
import { Icon } from '@blueprintjs/core';

const Table = styled(HTMLTable)`
  width: 100%;
`;

const ActivityHistory = (props) => {
  let activityHistory = props.dog.activity_history;
  return (
    <Table className="bp5-html-table" striped={true}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Activity</th>
          {/* <th>Location</th> */}
          <th>Friends</th>
        </tr>
      </thead>
      <tbody>
        {activityHistory
          .sort((a, b) => b.time - a.time)
          .map((activity, index) => (
            <tr key={index}>
              <td>{activity.time}</td>
              <td>
                {activity.type == 'move' ? (
                  <div>
                    <span>{activity.prevLocation + ' '}</span>
                    <Icon
                      icon="arrow-right"
                      intent={
                        activity.location == 'Kennel' ? 'danger' : 'success'
                      }
                    />
                    <span>{' ' + activity.location}</span>
                  </div>
                ) : (
                  activity.type
                )}
              </td>
              {/* <td>{activity.location}</td> */}
              <td>{activity.friends.join(', ')}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default ActivityHistory;
