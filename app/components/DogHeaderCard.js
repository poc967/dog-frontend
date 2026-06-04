import { Card, CardContent } from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Pencil } from 'lucide-react';

// components
import LevelIndicator from './LevelIndicator';

const DogHeaderCard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-2.5">
        <div className="flex flex-row items-start">
          <Image
            src={props.dog.imageUrl || '/dog.png'}
            width={115}
            height={115}
            className="rounded cursor-pointer"
            alt="image of dog"
            onClick={toggleIsOpen}
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[420px] p-2">
              <DialogTitle className="sr-only">{props.dog.name} photo</DialogTitle>
              <DialogDescription className="sr-only">Enlarged photo of {props.dog.name}</DialogDescription>
              <Image
                src={props.dog.imageUrl || '/dog.png'}
                width={350}
                height={350}
                alt="image of dog"
                className="rounded"
              />
            </DialogContent>
          </Dialog>
          <div className="pl-4">
            <div className="flex flex-row items-center">
              <h3 className="text-lg font-semibold mr-2">
                {props.dog.name}
              </h3>
              <LevelIndicator
                color1={props.dog.level1}
                color2={props.dog.level2}
              />
              {props.onEdit && (
                <button
                  onClick={props.onEdit}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit dog details"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1.5 text-destructive" />
              <span className="text-sm">{props.dog.location.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogHeaderCard;
