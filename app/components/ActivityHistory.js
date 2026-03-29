import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import { ArrowRight } from 'lucide-react';
import { getLocalTime } from '../helpers/helpers';

const ActivityHistory = (props) => {
  let activityHistory = props.activityHistory.message;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Friends</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activityHistory
          ? activityHistory
              .sort((a, b) => b.time - a.time)
              .map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{getLocalTime(activity.time)}</TableCell>
                  <TableCell>
                    {activity.activity == 'move' ? (
                      <div className="flex items-center gap-1">
                        <span>{activity.previous_location.name}</span>
                        <ArrowRight
                          className={`h-4 w-4 ${
                            activity.location.name == 'Kennel'
                              ? 'text-destructive'
                              : 'text-green-600'
                          }`}
                        />
                        <span>{activity.location.name}</span>
                      </div>
                    ) : (
                      <span>{`${activity.activity} - ${activity.location.name}`}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {activity.friends.map((friend) => friend.name).join(', ')}
                  </TableCell>
                </TableRow>
              ))
          : null}
      </TableBody>
    </Table>
  );
};

export default ActivityHistory;
