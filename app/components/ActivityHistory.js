import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
`;

const ActivityHistory = (props) => {
  let activityHistory = props.dog.activity_history;
  return (
    <Table className="bp5-html-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Activity</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {activityHistory.map((activity, index) => (
          <tr key={index}>
            <td>{activity.time}</td>
            <td>{activity.type}</td>
            <td>{activity.location}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ActivityHistory;
