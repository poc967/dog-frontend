import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import { Plus } from 'lucide-react';
import { getLocalDate } from '../helpers/helpers';

const BehaviorNotes = (props) => {
  const { notes, newNote } = props;
  const { handleChange, handleSubmit } = props;

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleSubmit()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </TableCell>
            <TableCell>
              <Textarea
                placeholder="Write something here..."
                value={props.newNote}
                onChange={(e) => handleChange(e)}
                className="min-h-[60px]"
              />
            </TableCell>
          </TableRow>
          {notes.map((note) => (
            <TableRow key={note._id}>
              <TableCell className="text-muted-foreground text-sm">{getLocalDate(note.created)}</TableCell>
              <TableCell>{note.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BehaviorNotes;
