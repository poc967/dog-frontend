import { HTMLTable } from '@blueprintjs/core';
import styled from 'styled-components';
import { Icon } from '@blueprintjs/core';
import { getLocalTime } from '../helpers/helpers';

const Table = styled(HTMLTable)`
  width: 100%;
`;

const ActivityHistory = (props) => {
  let activityHistory = props.activityHistory.message;

  return (
    <Table className="bp5-html-table">
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
          ? activityHistory
              .sort((a, b) => b.time - a.time)
              .map((activity, index) => (
                <tr key={index}>
                  <td>{getLocalTime(activity.time)}</td>
                  <td>
                    {activity.activity == 'move' ? (
                      <div>
                        <span>{activity.previous_location.name + ' '}</span>
                        <Icon
                          icon="arrow-right"
                          intent={
                            activity.location.name == 'Kennel'
                              ? 'danger'
                              : 'success'
                          }
                        />
                        <span>{' ' + activity.location.name}</span>
                      </div>
                    ) : (
                      <span>{`${activity.activity} - ${activity.location.name}`}</span>
                    )}
                  </td>
                  {/* <td>{activity.location}</td> */}
                  <td>
                    {activity.friends.map((friend) => friend.name).join(', ')}
                  </td>
                </tr>
              ))
          : null}
      </tbody>
    </Table>
  );
};

export default ActivityHistory;
