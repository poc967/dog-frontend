import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { getLocalTime } from '../helpers/helpers';
import { Button } from '@/app/components/ui/button';

const formatDateLabel = (dateStr) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ActivityHistory = (props) => {
  const { selectedDate, onPrevDay, onNextDay, onDateChange, activityLoading } = props;
  const dateInputRef = useRef(null);
  let activityHistory = props.activityHistory?.message;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = !selectedDate || selectedDate === todayStr;

  const openPicker = () => {
    try {
      dateInputRef.current?.showPicker();
    } catch {
      dateInputRef.current?.focus();
    }
  };

  return (
    <div>
      {selectedDate && onPrevDay && onNextDay && (
        <div className="flex items-center justify-between mb-3 px-1">
          <Button variant="ghost" size="icon" onClick={onPrevDay} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <button
            onClick={openPicker}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors"
            aria-label="Pick a date"
          >
            <CalendarDays className="h-4 w-4" />
            {formatDateLabel(selectedDate)}
          </button>
          {/* Hidden native date input — showPicker() opens the OS calendar */}
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            max={todayStr}
            onChange={(e) => e.target.value && onDateChange?.(e.target.value)}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextDay}
            disabled={isToday}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Friends</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                Loading…
              </TableCell>
            </TableRow>
          ) : activityHistory && activityHistory.length > 0 ? (
            activityHistory
              .sort((a, b) => new Date(b.time) - new Date(a.time))
              .map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{getLocalTime(activity.time)}</TableCell>
                  <TableCell>
                    {activity.activity === 'move' ? (
                      <div className="flex items-center gap-1">
                        <span>{activity.previous_location.name}</span>
                        <ArrowRight
                          className={`h-4 w-4 ${
                            activity.location.name === 'Kennel'
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
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                No activity recorded for this day.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityHistory;
