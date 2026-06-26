import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import EmptyState from '@/app/components/ui/EmptyState';
import { DETAIL_CATEGORIES, PRIORITIES } from '../constants/constants';
import { normalizePriority } from '../helpers/helpers';
import { Plus } from 'lucide-react';

// Components
import Tags from './Tag';

const DogDetailTab = (props) => {
  const { dog, toggleAlertsModalIsOpen, submitDeleteWhiteboard, allDogs } =
    props;

  return (
    <Accordion type="multiple" defaultValue={['Alerts']} className="w-full">
      {DETAIL_CATEGORIES.map((tab) => {
        const items = dog[tab.toLocaleLowerCase()];
        const activeCount = items.filter((item) => !item.isDeleted).length;

        return (
          <AccordionItem key={tab} value={tab}>
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <span>{tab}</span>
                {activeCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full text-xs px-2 py-0"
                  >
                    {activeCount}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-3">
                {items.length !== 0 ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {tab === 'Friends'
                        ? items
                            .filter((friend) => !friend.isDeleted)
                            .map((friend, index) => (
                              <Tags
                                key={index}
                                alert={friend}
                                tab={tab}
                                submitDeleteWhiteboard={submitDeleteWhiteboard}
                                allDogs={allDogs}
                              />
                            ))
                        : PRIORITIES.map((priority, index) =>
                            items
                              .filter(
                                (a) =>
                                  normalizePriority(a.priority) === priority,
                              )
                              .map((alert, index) =>
                                alert && !alert.isDeleted ? (
                                  <Tags
                                    key={index}
                                    alert={alert}
                                    tab={tab}
                                    submitDeleteWhiteboard={
                                      submitDeleteWhiteboard
                                    }
                                    allDogs={allDogs}
                                  />
                                ) : null,
                              ),
                          )}
                    </div>
                    <Badge
                      variant="outline"
                      className="cursor-pointer mt-2 mb-1 ml-1"
                      onClick={() => toggleAlertsModalIsOpen(tab)}
                    >
                      Add
                    </Badge>
                  </div>
                ) : (
                  <EmptyState
                    title="Nothing to see here!"
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAlertsModalIsOpen(tab)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add something
                      </Button>
                    }
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default DogDetailTab;
