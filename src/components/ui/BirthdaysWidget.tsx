import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { Cake, Send, Heart, Sparkles, PartyPopper, Check } from 'lucide-react';

interface BirthdayItem {
  id: number;
  name: string;
  department: string;
  date: string;
  isToday: boolean;
  daysAway: number;
  avatar: string;
}

const UPCOMING_BIRTHDAYS: BirthdayItem[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    department: 'Product',
    date: 'Today (July 23)',
    isToday: true,
    daysAway: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Alex Morgan',
    department: 'Engineering',
    date: 'July 25',
    isToday: false,
    daysAway: 2,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'David Kim',
    department: 'Product Design',
    date: 'July 28',
    isToday: false,
    daysAway: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    department: 'Human Resources',
    date: 'August 02',
    isToday: false,
    daysAway: 10,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  }
];

export const BirthdaysWidget: React.FC = () => {
  const [wishedIds, setWishedIds] = useState<number[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<BirthdayItem | null>(null);
  const [wishMessage, setWishMessage] = useState('Wishing you a fantastic birthday and a wonderful year ahead! 🎉🎂');
  const [celebratingId, setCelebratingId] = useState<number | null>(null);

  const handleOpenWishModal = (person: BirthdayItem) => {
    setSelectedPerson(person);
    setWishMessage(`Happy Birthday ${person.name}! Wishing you joy, health, and great success! 🥳🎉`);
  };

  const handleSendWish = () => {
    if (!selectedPerson) return;
    setWishedIds(prev => [...prev, selectedPerson.id]);
    setCelebratingId(selectedPerson.id);
    setSelectedPerson(null);

    setTimeout(() => {
      setCelebratingId(null);
    }, 4000);
  };

  const todayBirthday = UPCOMING_BIRTHDAYS.find(b => b.isToday);

  return (
    <>
      <Card className="hover:border-pink-300 dark:hover:border-pink-900 transition-colors duration-150 relative">
        <CardHeader
          action={
            <Badge variant="purple" size="sm" className="flex items-center gap-1">
              <Cake className="w-3 h-3 text-pink-500" /> Celebrations
            </Badge>
          }
        >
          <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Cake className="w-4 h-4 text-pink-500" /> Employee Birthdays
          </span>
        </CardHeader>

        {/* Today's Special Celebration Highlight Banner */}
        {todayBirthday && (
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-3.5 flex items-center justify-between text-xs shadow-inner">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full animate-bounce">
                <PartyPopper className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <span className="font-bold block leading-tight">Today is {todayBirthday.name}'s Birthday! 🎂</span>
                <span className="text-xs text-pink-100">{todayBirthday.department} • Send your wishes!</span>
              </div>
            </div>
            {!wishedIds.includes(todayBirthday.id) ? (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleOpenWishModal(todayBirthday)}
                className="bg-white text-pink-700 hover:bg-pink-50 text-xs py-1 px-2.5 font-bold shadow-xs border-0 cursor-pointer"
              >
                Wish Now
              </Button>
            ) : (
              <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Wished
              </span>
            )}
          </div>
        )}

        <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {UPCOMING_BIRTHDAYS.map((person) => {
            const isWished = wishedIds.includes(person.id);
            const isCelebrating = celebratingId === person.id;

            return (
              <div
                key={person.id}
                className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors duration-150 ${
                  person.isToday ? 'bg-pink-50/40 dark:bg-pink-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className={`w-9 h-9 rounded-full border-2 object-cover shrink-0 ${
                        person.isToday ? 'border-pink-500 ring-2 ring-pink-300 dark:ring-pink-800' : 'border-pink-200 dark:border-pink-900'
                      }`}
                    />
                    {person.isToday && (
                      <span className="absolute -top-1 -right-1 text-xs">👑</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                      {person.name}
                      {person.isToday && (
                        <span className="bg-pink-600 text-white text-xs font-extrabold uppercase px-1.5 py-0.2 rounded-full">
                          Today!
                        </span>
                      )}
                    </h5>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {person.department} • <strong className="text-pink-600 dark:text-pink-400">{person.date}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  {isCelebrating ? (
                    <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Wish Sent! 🎉
                    </span>
                  ) : isWished ? (
                    <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> Wished
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Send className="w-3 h-3 text-pink-500" />}
                      onClick={() => handleOpenWishModal(person)}
                      className="text-xs text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 cursor-pointer"
                      title="Send Birthday Wish Card"
                    >
                      Wish
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Send Birthday Wish Modal */}
      {selectedPerson && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPerson(null)}
          title={`Send Birthday Wish to ${selectedPerson.name}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
              <img
                src={selectedPerson.avatar}
                alt={selectedPerson.name}
                className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedPerson.name}</h4>
                <p className="text-xs text-slate-500">{selectedPerson.department} • {selectedPerson.date}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Greeting Card Message
              </label>
              <textarea
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Quick Greetings:</span>
              <button
                onClick={() => setWishMessage("Happy Birthday! Wishing you a fantastic year filled with success and happiness! 🎉🎂")}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-950 px-2 py-1 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Classic 🎂
              </button>
              <button
                onClick={() => setWishMessage("Hope your birthday is as awesome as you are! Have a wonderful celebration! 🥳🌟")}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-950 px-2 py-1 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cheerful 🌟
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedPerson(null)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
                onClick={handleSendWish}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Send Wish Card
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
