import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "../components/firebase";

export default function MoodCalendar({ refreshKey = 0 }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch check-ins from backend whenever refreshKey changes
  useEffect(() => {
    const fetchCheckins = async () => {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        console.log("No authenticated user found");
        setLoading(false);
        setCheckins([]);
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const uid = user.uid;

        console.log('Fetching check-ins for user:', uid);
        console.log('Making request to:', `http://127.0.0.1:5001/api/checkins/${uid}`);

        const res = await fetch(`http://127.0.0.1:5001/api/checkins/${uid}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Response data:', data);

        if (data.success && Array.isArray(data.checkins)) {
          setCheckins(data.checkins);
          console.log(`Successfully loaded ${data.checkins.length} check-ins`);
        } else {
          console.log("Invalid response format or no checkins found");
          setCheckins([]);
        }
      } catch (err) {
        console.error("Error fetching check-ins:", err);
        setError(err.message);
        setCheckins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, [refreshKey]);

  // Mood color & emoji mappings
  const moodColors = {
    happy: "#A8E6CF",
    neutral: "#FFD3B6",
    sad: "#FF8B94"
  };

  const moodEmojis = {
    happy: "😊",
    neutral: "😐",
    sad: "😔"
  };

  // Get mood data for a specific date
  const getMoodForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const entry = checkins.find(d => d.date === dateString);
    if (entry) {
      return {
        mood: entry.mood,
        color: entry.color || moodColors[entry.mood] || moodColors.neutral,
        hours_of_sleep: entry.hours_of_sleep
      };
    }
    return null;
  };

  // Calendar helpers
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getMonthName = (date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isToday = (date) => date.toDateString() === new Date().toDateString();
  const isSameDate = (date1, date2) => date1.toDateString() === date2.toDateString();

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedMood = getMoodForDate(selectedDate);

  // Unique moods for legend
  const uniqueMoods = [...new Set(checkins.map(c => c.mood))];
  const moodLegendData = uniqueMoods.map(mood => {
    const checkin = checkins.find(c => c.mood === mood);
    return {
      mood,
      color: checkin?.color || moodColors[mood] || moodColors.neutral
    };
  });

  const formatDate = (date) => date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-pink-600">Loading your mood calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Unable to load calendar</p>
          <p className="text-sm">Error: {error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Mood Calendar
        </h2>
        <p className="text-pink-600 text-lg">Track your daily emotions and patterns</p>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigateMonth(-1)} className="p-3 hover:bg-pink-100 rounded-xl transition-colors duration-200 group">
            <ChevronLeft className="w-6 h-6 text-pink-600 group-hover:text-pink-700" />
          </button>
          <h3 className="text-xl font-semibold text-pink-700">{getMonthName(currentDate)}</h3>
          <button onClick={() => navigateMonth(1)} className="p-3 hover:bg-pink-100 rounded-xl transition-colors duration-200 group">
            <ChevronRight className="w-6 h-6 text-pink-600 group-hover:text-pink-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-pink-600 bg-pink-50 rounded-xl">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {calendarDays.map((date, index) => {
          if (!date) return <div key={index} className="p-3 h-16"></div>;

          const moodData = getMoodForDate(date);
          const isSelectedDate = isSameDate(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <button key={index} onClick={() => setSelectedDate(date)}
              className={`relative p-3 h-16 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelectedDate ? 'border-pink-400 bg-pink-50 shadow-lg' :
                isTodayDate ? 'border-pink-300 bg-pink-100 shadow-md' :
                'border-gray-200 bg-white hover:border-pink-200 hover:bg-pink-50'
              }`}
            >
              <span className={`block text-sm font-medium ${isSelectedDate ? 'text-pink-700' : 'text-gray-700'}`}>
                {date.getDate()}
              </span>
              {moodData && (
                <>
                  <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: moodData.color }}
                    title={`Mood: ${moodData.mood}`}></div>
                  {moodData.hours_of_sleep && (
                    <div className="absolute top-1 left-1">
                      <div className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded-full font-medium">
                        {moodData.hours_of_sleep}h
                      </div>
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {selectedMood && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl shadow-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-pink-700 mb-3 text-center">
            {formatDate(selectedDate)} - Mood Summary
          </h4>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl mb-2">{moodEmojis[selectedMood.mood]}</div>
              <div className="text-sm font-medium text-pink-600 capitalize">{selectedMood.mood} Mood</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm mx-auto mb-2" style={{ backgroundColor: selectedMood.color }}></div>
              <div className="text-sm font-medium text-pink-600">Mood Color</div>
            </div>
            {selectedMood.hours_of_sleep && (
              <div className="text-center">
                <div className="text-2xl mb-2">😴</div>
                <div className="text-sm font-medium text-pink-600">{selectedMood.hours_of_sleep} hours sleep</div>
              </div>
            )}
          </div>
        </div>
      )}

      

      {/* Monthly Overview */}
      {checkins.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-green-700 mb-3 text-center">This Month's Overview</h4>
          <div className="text-center">
            <span className="text-3xl font-bold text-green-600">
              {checkins.filter(d => {
                const entryDate = new Date(d.date);
                return entryDate.getMonth() === currentDate.getMonth() &&
                       entryDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </span>
            <span className="text-sm text-green-600 ml-2">days tracked</span>
          </div>
        </div>
      )}
    </div>
  );
}