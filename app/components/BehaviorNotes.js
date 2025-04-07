import { Button, EditableText, Section, SectionCard } from '@blueprintjs/core';
import styled from 'styled-components';
import { getLocalDate } from '../helpers/helpers';

const TextArea = styled.textarea`
  width: 100%;
  border: solid #eeeeee 1px;
  border-radius: 2px;
  padding: 10px;
`;

const BehaviorNotes = (props) => {
  const { notes, newNote } = props;
  const { handleChange, handleSubmit } = props;

  return (
    <div>
      <table className="bp5-html-table">
        <tbody>
          <tr>
            <td>
              <Button
                text="Add"
                icon="plus"
                intent="success"
                onClick={() => handleSubmit()}
              />
            </td>
            <td>
              <TextArea
                fill={true}
                placeholder="Write something here..."
                value={props.newNote}
                onChange={(e) => handleChange(e)}
              />
            </td>
          </tr>
          {notes.map((note) => (
            <tr key={note._id}>
              <td>{getLocalDate(note.created)}</td>
              <td>{note.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BehaviorNotes;
