import React, { useState, useEffect } from "react";

export default function QuoteRotation({ quotes }) {
    const defaultQuotes = [
        "Keep going, you're doing great!",
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl shadow-lg text-center p-6">
      
      
      <blockquote className="text-lg text-blue-800 italic font-medium leading-relaxed">
        "{currentQuote}"
      </blockquote>
      
      <div className="mt-3 flex justify-center space-x-1">
        {quoteList.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-blue-500' : 'bg-blue-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}