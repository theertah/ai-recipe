# Pantry to Plate — AI Recipe Generator

A small full-stack project that combines **AI and prompt engineering**:

1. **Prompt Engineering** — `prompt_engine.py` builds a structured prompt
   (role, constraints, strict JSON schema) and sends it to an LLM to turn a
   list of ingredients into a full recipe with steps and nutrition info.
2. **Web app** — `app.py` (Flask) serves a REST API,
   served by a plain HTML/CSS/JS frontend (`templates/`, `static/`).

## Folder structure

```
ai-recipe-generator/
├── app.py                 # Flask server + API routes
├── prompt_engine.py        # LLM prompt + recipe generation (prompt engineering)
├── requirements.txt
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
```

## Setup

```bash
cd ai-recipe-generator
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running it

```bash
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## Using a real LLM

By default the app uses an offline mock recipe, so it does not call an AI
service until you configure a provider and API key. To use OpenAI, copy
`.env.example` to `.env`, then replace the placeholder with your API key:

```text
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key
```

For Claude, set `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY=your-api-key`
instead. For Gemini, set `LLM_PROVIDER=gemini` and `GEMINI_API_KEY=your-api-key`.
Keep `.env` private; it is excluded from Git. Restart the app after
changing it. API usage may incur charges.

## How to use it

1. Type ingredients separated by commas.
2. Pick a cuisine and diet.
3. Press **Generate recipe**. Without a configured API key, the recipe card
   identifies that it used the offline demo generator.

## Notes / possible extensions

- Add a "save recipe" feature backed by a small SQLite database.
- Add streaming responses from the LLM for a nicer UX.
