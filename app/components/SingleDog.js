'use client';

import styled from 'styled-components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useEffect, useState } from 'react';
import { DOG_HEADER_TABS } from '@/app/constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';
import { createNote } from '../api/notes';
import { createAlert, deleteWhiteboard, getDogs, addFriend, deleteFriend, getActivity, updateDog } from '../api/dog';
import EditDogModal from './EditDogModal';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// components
import DogHeaderCard from '@/app/components/DogHeaderCard';
import DogDetailTab from '@/app/components/DogDetailTab';
import ActivityHistory from '@/app/components/ActivityHistory';
import BehaviorNotes from '@/app/components/BehaviorNotes';
import QRCode from '@/app/components/QRCode';
import { devices } from '@/app/constants/constants';
import AddAlert from './WhiteboardModal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35vw;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media ${devices['2xl']} {
    width: 45vw;
  }
  @media ${devices.xl} {
    width: 45vw;
  }
  @media ${devices.lg} {
    width: 80vw;
  }
  @media ${devices.md} {
    width: 95vw;
  }
  @media ${devices.xs} {
    width: 95vw;
  }
  @media ${devices.sm} {
    width: 95vw;
  }
`;

const tabComponentMap = {
  details: DogDetailTab,
  activity_history: ActivityHistory,
  behavior_notes: BehaviorNotes,
  qr_code: QRCode,
};

const TabPanelRenderer = ({
  tabName,
  dog,
  activityHistory,
  notes,
  handleChange,
  handleSubmit,
  newNote,
  toggleAlertsModalIsOpen,
  submitDeleteWhiteboard,
  allDogs,
  selectedDate,
  onPrevDay,
  onNextDay,
  onDateChange,
  activityLoading,
}) => {
  const Component = tabComponentMap[toSnakeCase(tabName)];
  return Component ? (
    <Component
      dog={dog}
      activityHistory={activityHistory}
      notes={notes}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      newNote={newNote}
      toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
      submitDeleteWhiteboard={submitDeleteWhiteboard}
      allDogs={allDogs}
      selectedDate={selectedDate}
      onPrevDay={onPrevDay}
      onNextDay={onNextDay}
      onDateChange={onDateChange}
      activityLoading={activityLoading}
    />
  ) : null;
};

const SingleDog = (props) => {
  const [currentSelectedTab, setCurrentSelectedTab] = useState('details');
  const [dog, setDog] = useState(props.dog.dog);
  const [activityHistory, setActivityHistory] = useState(props.activityHistory);
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newWhiteBoardNote, setNewWhiteboardNote] = useState('');
  const [newWhiteBoardCategory, setNewWhiteBoardCategory] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [tab, setTab] = useState(null);
  const [allDogs, setAllDogs] = useState([]);

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activityLoading, setActivityLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const fetchAllDogs = async () => {
      if (!props.token) return;

      try {
        const data = await getDogs(props.token);
        const otherDogs = data.message.filter((d) => d._id !== dog._id);
        setAllDogs(otherDogs);
      } catch (error) {
        console.error('Error fetching all dogs:', error);
      }
    };

    fetchAllDogs();
  }, [props.token, dog._id]);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!props.token || !props.dogId) return;
      setActivityLoading(true);
      try {
        const data = await getActivity(props.dogId, props.token, selectedDate);
        setActivityHistory(data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchActivityData();
  }, [props.token, props.dogId, selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const today = todayStr();
      if (prev >= today) return prev;
      const d = new Date(prev + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
  };

  const handleSaveDog = async (formData) => {
    setEditSaving(true);
    try {
      const res = await updateDog(props.dogId, formData, props.token);
      if (res.isSuccessful) {
        setDog(res.message);
        setEditOpen(false);
      }
    } catch (error) {
      console.error('Failed to update dog:', error);
    } finally {
      setEditSaving(false);
    }
  };

  const handleChange = async (e) => {
    await setNewNote(e.target.value);
  };

  const toggleAlertsModalIsOpen = async (currentTab) => {
    await setAddAlertOpen(!addAlertOpen);
    await setTab(currentTab);
  };

  const handleNewNoteChange = async (e) => {
    await setNewWhiteboardNote(e.target.value);
  };

  const handleNewCategoryChange = async (e) => {
    await setNewWhiteBoardCategory(e.target.value);
  };

  const handleFriendChange = async (e) => {
    await setSelectedFriend(e.target.value);
  };

  const handleSubmit = async () => {
    if (newNote == '') {
      return;
    }

    const dogs = [dog._id];
    let res = await createNote(newNote, dogs, props.token);
    let updatedNotes = [res, ...notes];
    await setNotes(updatedNotes);
    await setNewNote('');
  };

  const handleSubmitWhiteBoard = async () => {
    if (tab === 'Friends') {
      if (!selectedFriend) {
        return;
      }

      let res = await addFriend(dog._id, selectedFriend, props.token);
      let newDog = { ...dog };
      newDog.friends = res.data.friends;
      await setDog(newDog);
    } else {
      if (!newWhiteBoardNote.trim() || !newWhiteBoardCategory) {
        return;
      }

      let res = await createAlert(
        dog._id,
        newWhiteBoardNote,
        newWhiteBoardCategory,
        tab,
        props.token
      );
      let newDog = dog;
      newDog[tab.toLocaleLowerCase()] = res.message;
      await setDog(newDog);
    }

    await setNewWhiteboardNote('');
    await setNewWhiteBoardCategory('');
    await setSelectedFriend('');
    await toggleAlertsModalIsOpen();
    await setTab(null);
  };

  const submitDeleteWhiteboard = async (alertId, tab) => {
    let res;
    
    if (tab === 'Friends') {
      res = await deleteFriend(dog._id, alertId, props.token);
      let newDog = {
        ...dog,
        friends: res.data.friends,
      };
      await setDog(newDog);
    } else {
      res = await deleteWhiteboard(dog._id, tab, alertId, props.token);
      let newDog = {
        ...dog,
        [tab.toLowerCase()]: res.message,
      };
      await setDog(newDog);
    }
  };

  return (
    <main>
      <Wrapper>
        <AddAlert
          isOpen={addAlertOpen}
          toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
          handleNewNoteChange={handleNewNoteChange}
          handleNewCategoryChange={handleNewCategoryChange}
          handleFriendChange={handleFriendChange}
          newWhiteBoardNote={newWhiteBoardNote}
          newWhiteBoardCategory={newWhiteBoardCategory}
          selectedFriend={selectedFriend}
          handleSubmitWhiteBoard={handleSubmitWhiteBoard}
          tab={tab}
          allDogs={allDogs}
        />
        <EditDogModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          dog={dog}
          onSave={handleSaveDog}
          isSaving={editSaving}
        />
        <nav className="flex items-center text-sm text-muted-foreground mb-2">
          <Link href="/dogs/" className="hover:text-foreground transition-colors">
            Dogs
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground font-medium">{dog.name}</span>
        </nav>
        <DogHeaderCard
          dog={dog}
          onEdit={props.canEdit ? () => setEditOpen(true) : undefined}
        />
        <Tabs value={currentSelectedTab} onValueChange={setCurrentSelectedTab}>
          <TabsList className="w-full overflow-x-auto justify-start">
            {DOG_HEADER_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab.toLocaleLowerCase()}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {DOG_HEADER_TABS.map((tab) => (
            <TabsContent key={tab} value={tab.toLocaleLowerCase()}>
              <TabPanelRenderer
                tabName={tab}
                dog={dog}
                activityHistory={activityHistory}
                notes={notes}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                newNote={newNote}
                toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
                handleNewNoteChange={handleNewNoteChange}
                handleNewCategoryChange={handleNewCategoryChange}
                submitDeleteWhiteboard={submitDeleteWhiteboard}
                allDogs={allDogs}
                selectedDate={selectedDate}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
                onDateChange={setSelectedDate}
                activityLoading={activityLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Wrapper>
    </main>
  );
};

export default SingleDog;
