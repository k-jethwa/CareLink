from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

def analyze_mood(text: str):
    result = sentiment_analyzer(text)[0]
    label = result["label"].lower()

    if "positive" in label:
        mood = "happy"
        color = "#A8E6CF"
    elif "negative" in label:
        mood = "sad"
        color = "#89CFF0"
    else:
        mood = "neutral"
        color = "#FFD3B6"

    return {"mood": mood, "color": color, "score": result["score"]}