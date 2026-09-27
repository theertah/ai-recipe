"""AI Recipe Generator — Flask backend
--------------------------------------
Combines prompt engineering and a small web app:

1. prompt_engine.py sends a structured prompt to an LLM (OpenAI/Claude)
    to turn a list of ingredients into a full recipe.
2. This file exposes the recipe generator through a REST API and serves
    the plain HTML/CSS/JS frontend.

Run with:  python app.py
Then open: http://127.0.0.1:5000
"""

import os

from flask import Flask, request, jsonify, render_template

from prompt_engine import generate_recipe

app = Flask(__name__)


@app.route("/")
def home():
    """Serves the single-page frontend."""
    return render_template("index.html")


@app.route("/api/generate-recipe", methods=["POST"])
def recipe():
    """
    Prompt engineering step: takes a list of typed ingredients and asks
    an LLM to produce a structured recipe.
    """
    data = request.get_json(silent=True) or {}
    ingredients = data.get("ingredients", [])
    diet = data.get("diet", "none")
    cuisine = data.get("cuisine", "any")

    if not ingredients:
        return jsonify({"error": "Please provide at least one ingredient"}), 400

    result = generate_recipe(ingredients, diet=diet, cuisine=cuisine)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", debug=False, port=5000)
