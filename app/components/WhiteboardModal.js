'use client';

import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const AddAlert = (props) => {
  const {
    type,
    selectedDogs,
    handleSubmit,
    handleLocationChange,
    locations,
    toggleAlertsModalIsOpen,
    handleNewCategoryChange,
    handleFriendChange,
    handleNewNoteChange,
    newWhiteBoardCategory,
    selectedFriend,
    newWhiteBoardNote,
    handleSubmitWhiteBoard,
    tab,
    allDogs,
  } = props;

  const isFriendsTab = tab === 'Friends';
  const isValid = isFriendsTab
    ? selectedFriend
    : newWhiteBoardNote.trim() && newWhiteBoardCategory;

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) toggleAlertsModalIsOpen();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isFriendsTab ? 'Add Friend' : 'Add Alert'}</DialogTitle>
          <DialogDescription>
            {isFriendsTab
              ? 'Select a friend for this dog.'
              : 'Add a new alert or note.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!isFriendsTab && (
            <Input
              placeholder="Shy! Go Slow"
              value={newWhiteBoardNote}
              onChange={(e) => handleNewNoteChange(e)}
            />
          )}
          {isFriendsTab ? (
            <Select
              value={selectedFriend}
              onValueChange={(val) =>
                handleFriendChange({ target: { value: val } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a friend..." />
              </SelectTrigger>
              <SelectContent>
                {allDogs?.map((dog) => (
                  <SelectItem key={dog._id} value={dog._id}>
                    {dog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={newWhiteBoardCategory}
              onValueChange={(val) =>
                handleNewCategoryChange({ target: { value: val } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={props.toggleOpen}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmitWhiteBoard()} disabled={!isValid}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlert;
