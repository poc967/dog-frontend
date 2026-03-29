'use client';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
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
  const {
    type,
    selectedDogs,
    handleSubmit,
    handleLocationChange,
    locations,
    handleBehaviorNoteChange,
  } = props;

  const getTitle = () => {
    switch (type) {
      case 'move': return 'Move Dog(s)';
      case 'walk': return 'Start Walk';
      case 'behaviorNote': return 'New Behavior Note';
      default: return 'Action';
    }
  };

  const NamesFragment = selectedDogs ? (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {selectedDogs.map((d, index) => (
        <Badge key={index} variant="default">
          {d.name}
        </Badge>
      ))}
    </div>
  ) : null;

  let content;
  switch (type) {
    case 'move':
      content = (
        <>
          {NamesFragment}
          <Select onValueChange={(val) => handleLocationChange({ target: { value: val } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Destination..." />
            </SelectTrigger>
            <SelectContent>
              {locations
                .filter((location) => !('walkable' in location) || location.walkable == false)
                .map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </>
      );
      break;
    case 'walk':
      content = (
        <>
          {NamesFragment}
          <Select onValueChange={(val) => handleLocationChange({ target: { value: val } })}>
            <SelectTrigger>
              <SelectValue placeholder="Walk Destination..." />
            </SelectTrigger>
            <SelectContent>
              {locations
                .filter((location) => location.walkable)
                .map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </>
      );
      break;
    case 'behaviorNote':
      content = (
        <>
          {NamesFragment}
          <Textarea
            placeholder="Write a behavior note..."
            onChange={(e) => handleBehaviorNoteChange(e)}
          />
        </>
      );
      break;
    default:
      content = null;
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => { if (!open) props.toggleOpen(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {type === 'move' ? 'Select a destination to move the selected dogs.' :
             type === 'walk' ? 'Select a walking destination.' :
             'Add a behavior note for the selected dogs.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">{content}</div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={props.toggleOpen}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(type)}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDog;
