import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';

const EndWalk = (props) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => { if (!open) props.toggleOpen(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End Walk</DialogTitle>
          <DialogDescription>
            Confirm ending the current walk session.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={props.toggleOpen}>
            Cancel
          </Button>
          <Button onClick={props.submitEndWalk}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndWalk;
