'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { getLocalDate } from '../helpers/helpers';

const NoteRow = ({ note, handleEditNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editText.trim() || editText.trim() === note.text) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    await handleEditNote(note._id, editText.trim());
    setSaving(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') { setEditText(note.text); setIsEditing(false); }
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap align-top pt-3">
        {getLocalDate(note.created)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <Textarea
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px]"
              disabled={saving}
            />
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                <Check className="h-3 w-3 mr-1" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditText(note.text); setIsEditing(false); }}
                disabled={saving}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <span>{note.text}</span>
            {handleEditNote && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

const BehaviorNotes = (props) => {
  const { notes, newNote, handleChange, handleSubmit, handleEditNote } = props;

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
                value={newNote}
                onChange={(e) => handleChange(e)}
                className="min-h-[60px]"
              />
            </TableCell>
          </TableRow>
          {notes.map((note) => (
            <NoteRow key={note._id} note={note} handleEditNote={handleEditNote} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BehaviorNotes;
