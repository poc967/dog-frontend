import { HTMLTable } from '@blueprintjs/core';
import styled from 'styled-components';

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
          <th>Location</th>
          <th>Friends</th>
        </tr>
      </thead>
      <tbody>
        {activityHistory.map((activity, index) => (
          <tr key={index}>
            <td>{activity.time}</td>
            <td>{activity.type}</td>
            <td>{activity.location}</td>
            <td>{activity.friends.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ActivityHistory;
