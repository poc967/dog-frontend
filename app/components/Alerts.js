'use client';

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

const MoveDog = (props) => {
  const { type, selectedDogs, handleSubmit, handleLocationChange, locations } =
    props;

  let content;
  switch (type) {
    case 'move':
      content = (
        <Select onValueChange={(val) => handleLocationChange({ target: { value: val } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Destination..." />
          </SelectTrigger>
          <SelectContent>
            {locations
              .filter((location) => {
                return !('walkable' in location) || location.walkable == false;
              })
              .map((location) => (
                <SelectItem key={location._id} value={location._id}>
                  {location.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );
      break;
    default:
      content = null;
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => { if (!open) props.toggleOpen(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move Dog</DialogTitle>
          <DialogDescription>
            Select a destination to move the selected dogs.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">{content}</div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={props.toggleOpen}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDog;
