from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    logger.error(f"Failed to load sentiment analyzer: {e}")
    sentiment_analyzer = None

def analyze_mood(text: str):
    """Analyze mood from text input with proper error handling"""
    if not sentiment_analyzer:
        logger.warning("Sentiment analyzer not available, using default")
        return {"mood": "neutral", "color": "#FFD3B6", "score": 0.5}
    
    if not text or not text.strip():
        return {"mood": "neutral", "color": "#FFD3B6", "score": 0.5}
    
    try:
        result = sentiment_analyzer(text)[0]
        label = result["label"].lower()
        score = result["score"]
        
        if "positive" in label:
            mood = "happy"
            color = "#A8E6CF"  # Green for happy
        elif "negative" in label:
            mood = "sad"
            color = "#FF8B94"  # Red for sad (matching database migration)
        else:
            mood = "neutral"
            color = "#FFD3B6"  # Orange for neutral
            
        return {"mood": mood, "color": color, "score": score}
        
    except Exception as e:
        logger.error(f"Error analyzing mood: {e}")
        return {"mood": "neutral", "color": "#FFD3B6", "score": 0.5}