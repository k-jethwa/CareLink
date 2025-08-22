import React, { useState } from "react";

export default function CheckInForm({ onClose }) {
    const [mood, setMood] = useState(5);
    const [sleep, setSleep] = useState(0);
    const [reflections, setReflections] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("mood:", mood, "sleep:", sleep, "reflections", reflections);

        // send the data to backend

        onClose();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-4">
          <h2 className="text-xl font-bold mb-4 text-center">Daily Check-In</h2>
    
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Mood slider */}
            <label className="flex flex-col">
              Mood: <span className="font-semibold">{mood}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full"
              />
            </label>
    
            {/* Sleep hours */}
            <label className="flex flex-col">
              Hours of Sleep:
              <input
                type="number"
                min="0"
                max="24"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </label>
    
            {/* Daily reflections */}
            <label className="flex flex-col">
              Reflections:
              <textarea
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="border rounded p-2 w-full"
                rows={5}
                placeholder="Write down your thoughts, feelings, or reflections from today..."
              />
            </label>
    
            {/* Buttons */}
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
}