import React, { useState, useEffect } from "react";

export default function QuoteRotation({ quotes }) {
    const defaultQuotes = [
        "Keep going, you’re doing great!",
        "One step at a time is enough.",
        "You are stronger than you think.",
        "Progress, not perfection.",
        "Every day is a new beginning."
    ];

    const quoteList = quotes || defaultQuotes;
    const [index, setIndex] = useState(0);
    const [currentQuote, setCurrentQuote] = useState(quoteList[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % quoteList.length;
            setCurrentQuote(quoteList[newIndex]);
            return newIndex;
        });
    }, 5000); 

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="bg-pink-100 text-pink-800 p-4 rounded-lg shadow-sm text-center italic">
      {currentQuote}
    </div>
  );
}