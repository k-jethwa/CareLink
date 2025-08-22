import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MoodCalendar({ moodData = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Enhanced mood colors with better contrast and visual appeal
  const moodColors = {
    happy: "#10B981",     // emerald green
    neutral: "#F59E0B",   // amber
    sad: "#8B5CF6",       // violet
    anxious: "#EF4444"    // red
  };

  // Mood emoji mapping for better visual representation
  const moodEmojis = {
    happy: "😊",
    neutral: "😐", 
    sad: "😔",
    anxious: "😰"
  };

  // Get mood for a specific date
  const getMoodForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const entry = moodData.find(d => d.date === dateString);
    return entry ? entry.mood : null;
  };

  // Calendar utility functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedMood = getMoodForDate(selectedDate);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Mood Calendar</h2>
        <p className="text-gray-600">Track your daily emotions</p>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
        <button 
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {getMonthName(currentDate)}
        </h3>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2 h-12"></div>;
          }

          const mood = getMoodForDate(date);
          const isSelectedDate = isSameDate(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                relative p-2 h-12 rounded-lg border transition-all duration-200 hover:shadow-md
                ${isSelectedDate 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                  : isTodayDate 
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              <span className={`text-sm font-medium ${isSelectedDate ? 'text-white' : 'text-gray-700'}`}>
                {date.getDate()}
              </span>
              
              {mood && (
                <div 
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: moodColors[mood] }}
                  title={`Mood: ${mood}`}
                ></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Mood Display */}
      {selectedMood && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="flex items-center justify-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: moodColors[selectedMood] }}
            >
              <span className="text-white text-sm">
                {moodEmojis[selectedMood]}
              </span>
            </div>
            <span className="text-xl font-medium capitalize text-gray-700">
              {selectedMood}
            </span>
          </div>
        </div>
      )}

      {/* Mood Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
          Mood Legend
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm capitalize text-gray-600 flex items-center space-x-1">
                <span>{moodEmojis[mood]}</span>
                <span>{mood}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary (if there's mood data) */}
      {moodData.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
            This Month's Overview
          </h4>
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">
              {moodData.filter(d => {
                const entryDate = new Date(d.date);
                return entryDate.getMonth() === currentDate.getMonth() && 
                       entryDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </span>
            <span className="text-sm text-gray-600 ml-1">days tracked</span>
          </div>
        </div>
      )}
    </div>
  );
}