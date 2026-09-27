// ---- State ----
let ingredients = [];

// ---- Elements ----
const ingredientText = document.getElementById("ingredient-text");
const addIngredientBtn = document.getElementById("add-ingredient-btn");
const chipList = document.getElementById("chip-list");

const cuisineSelect = document.getElementById("cuisine-select");
const dietSelect = document.getElementById("diet-select");
const generateBtn = document.getElementById("generate-btn");

const emptyState = document.getElementById("empty-state");
const recipeContent = document.getElementById("recipe-content");
const recipeNote = document.getElementById("recipe-note");

// ---- Ingredient chips ----

function renderChips() {
  chipList.innerHTML = "";
  ingredients.forEach((ing, index) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.innerHTML = `${ing} <button aria-label="Remove ${ing}">&times;</button>`;
    li.querySelector("button").addEventListener("click", () => {
      ingredients.splice(index, 1);
      renderChips();
    });
    chipList.appendChild(li);
  });
}

function addIngredient(raw) {
  raw.split(",").forEach((part) => {
    const clean = part.trim().toLowerCase();
    if (clean && !ingredients.includes(clean)) {
      ingredients.push(clean);
    }
  });
  renderChips();
}

addIngredientBtn.addEventListener("click", () => {
  if (ingredientText.value.trim()) {
    addIngredient(ingredientText.value);
    ingredientText.value = "";
  }
});

ingredientText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addIngredientBtn.click();
  }
});

// ---- Recipe generation ----

generateBtn.addEventListener("click", async () => {
  if (ingredients.length === 0) {
    alert("Add at least one ingredient first.");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Cooking up a recipe…";

  try {
    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients,
        cuisine: cuisineSelect.value,
        diet: dietSelect.value,
      }),
    });
    const recipe = await res.json();

    if (!res.ok) throw new Error(recipe.error || "Recipe generation failed");

    renderRecipe(recipe);
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate recipe";
  }
});

function renderRecipe(recipe) {
  emptyState.hidden = true;
  recipeContent.hidden = false;

  if (recipe.note) {
    recipeNote.hidden = false;
    recipeNote.textContent = recipe.note;
  } else {
    recipeNote.hidden = true;
  }

  document.getElementById("recipe-title").textContent = recipe.title;
  document.getElementById("recipe-description").textContent = recipe.description;
  document.getElementById("prep-time").textContent = `${recipe.prep_time_minutes} min`;
  document.getElementById("cook-time").textContent = `${recipe.cook_time_minutes} min`;
  document.getElementById("servings").textContent = recipe.servings;

  const ingList = document.getElementById("recipe-ingredients");
  ingList.innerHTML = "";
  recipe.ingredients.forEach((ing) => {
    const li = document.createElement("li");
    li.textContent = ing;
    ingList.appendChild(li);
  });

  const stepsList = document.getElementById("recipe-steps");
  stepsList.innerHTML = "";
  recipe.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  const nutritionList = document.getElementById("nutrition-list");
  nutritionList.innerHTML = "";
  const n = recipe.nutrition_estimate || {};
  const entries = [
    ["Calories", n.calories],
    ["Protein", n.protein_g && `${n.protein_g} g`],
    ["Carbs", n.carbs_g && `${n.carbs_g} g`],
    ["Fat", n.fat_g && `${n.fat_g} g`],
  ];
  entries.forEach(([label, value]) => {
    if (value === undefined || value === null) return;
    const li = document.createElement("li");
    li.textContent = `${label}: ${value}`;
    nutritionList.appendChild(li);
  });
}
