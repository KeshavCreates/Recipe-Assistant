// App.jsx
import React, { useState, useEffect } from 'react';
import '../src/App.css';

// Simple icon components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// Add your Spoonacular API key here
// You'll need to sign up at https://spoonacular.com/food-api/console to get a free API key
const API_KEY = 'a657acaf90e54ee185deb825b4a3ee25';

const App = () => {
  const [inputIngredient, setInputIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [error, setError] = useState('');
  const [recipeDetails, setRecipeDetails] = useState(null);

  // Add ingredient to the list
  const addIngredient = () => {
    if (inputIngredient.trim() !== '') {
      setIngredientsList([...ingredientsList, inputIngredient.trim()]);
      setInputIngredient('');
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (index) => {
    const updatedList = [...ingredientsList];
    updatedList.splice(index, 1);
    setIngredientsList(updatedList);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ingredientsList.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await fetchRecipesByIngredients(ingredientsList.join(','));
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes by ingredients using Spoonacular API
  const fetchRecipesByIngredients = async (ingredients) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=9&ranking=1&ignorePantry=true&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes by ingredients:', error);
      throw error;
    }
  };

  // Get detailed recipe information using Spoonacular API
  const fetchRecipeDetails = async (recipeId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setRecipeDetails(data);
      setSelectedRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle recipe selection
  const handleRecipeSelect = (recipe) => {
    fetchRecipeDetails(recipe.id);
  };

  // Handle back button
  const handleBack = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  // Handle key press for adding ingredients
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputIngredient.trim() !== '') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Smart Recipe Assistant</h1>
        <p>Find delicious recipes with ingredients you have on hand</p>
      </header>

      {!selectedRecipe ? (
        <div className="main-content">
          <div className="search-section">
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  value={inputIngredient}
                  onChange={(e) => setInputIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter an ingredient..."
                  className="ingredient-input"
                />
                <button 
                  type="button" 
                  onClick={addIngredient} 
                  className="add-ingredient-btn"
                  disabled={inputIngredient.trim() === ''}
                >
                  Add
                </button>
              </div>

              <div className="ingredients-list">
                {ingredientsList.map((ingredient, index) => (
                  <div key={index} className="ingredient-tag">
                    <span>{ingredient}</span>
                    <button 
                      type="button" 
                      onClick={() => removeIngredient(index)}
                      className="remove-ingredient"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="search-btn"
                disabled={loading}
              >
                {loading ? 'Searching...' : (
                  <>
                    <SearchIcon />
                    Find Recipes
                  </>
                )}
              </button>
            </form>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Finding delicious recipes for you...</p>
            </div>
          )}

          {!loading && recipes.length > 0 && (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeSelect(recipe)}>
                  <div className="recipe-image">
                    <img src={recipe.image} alt={recipe.title} />
                  </div>
                  <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <div className="recipe-meta">
                      <span className="used-ingredients">{recipe.usedIngredientCount} of your ingredients used</span>
                      {recipe.missedIngredientCount > 0 && (
                        <span className="missed-ingredients">Need {recipe.missedIngredientCount} more</span>
                      )}
                    </div>
                    <ul className="ingredient-match-list">
                      {recipe.usedIngredients && recipe.usedIngredients.slice(0, 3).map((ingredient, idx) => (
                        <li key={idx} className="used-ingredient">{ingredient.name}</li>
                      ))}
                      {recipe.missedIngredients && recipe.missedIngredients.slice(0, 2).map((ingredient, idx) => (
                        <li key={idx} className="missed-ingredient">{ingredient.name}</li>
                      ))}
                    </ul>
                    <button className="view-recipe-btn">
                      View Recipe <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && recipes.length === 0 && ingredientsList.length > 0 && (
            <div className="no-recipes">
              <p>No recipes found with these ingredients. Try adding different ingredients.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="recipe-detail">
          <button className="back-button" onClick={handleBack}>
            ← Back to recipes
          </button>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading recipe details...</p>
            </div>
          ) : (
            <>
              <div className="recipe-header">
                <h2>{selectedRecipe.title}</h2>
                <div className="recipe-meta">
                  <span><ClockIcon /> {selectedRecipe.readyInMinutes} mins</span>
                  <span><UsersIcon /> {selectedRecipe.servings} servings</span>
                </div>
              </div>
              
              <div className="recipe-main">
                <div className="recipe-image-large">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                </div>
                
                <div className="recipe-description">
                  <div dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} />
                </div>
                
                <div className="recipe-sections">
                  <div className="ingredients-section">
                    <h3>Ingredients</h3>
                    <ul className="ingredients">
                      {selectedRecipe.extendedIngredients && selectedRecipe.extendedIngredients.map((ingredient, index) => (
                        <li key={index}>
                          <span className="ingredient-amount">{ingredient.measures.us.amount} {ingredient.measures.us.unitShort}</span>
                          <span className="ingredient-name">{ingredient.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="instructions-section">
                    <h3>Instructions</h3>
                    {selectedRecipe.analyzedInstructions && selectedRecipe.analyzedInstructions.length > 0 ? (
                      <div className="instructions">
                        {selectedRecipe.analyzedInstructions[0].steps.map((step, index) => (
                          <p key={index} className="instruction-step">
                            <span className="step-number">{step.number}</span>
                            <span>{step.step}</span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="instructions">
                        <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <footer>
        <p>Smart Recipe Assistant © 2025 | KeshavCreates</p>
      </footer>
    </div>
  );
};

export default App;
