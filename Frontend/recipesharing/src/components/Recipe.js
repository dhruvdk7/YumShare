import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes.');
      }
      const data = await response.json();
      setRecipes(data.recipes);
      console.log(data.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
    console.log('Clicked recipeId:', recipeId);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const recipeNameLower = recipe.recipeName.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();

    return recipeNameLower.includes(searchQueryLower);
  });
//Having Container
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers
//Card Body
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers https://getbootstrap.com/docs/5.1/components/card/ 
//form control
//https://getbootstrap.com/docs/5.0/forms/form-control/
  return (
    <div className="container mt-5">
      <h2 className="text-center">Recipe List</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by recipe name..."
        className="form-control mb-3"
      />

      {/* Buttons */}
      <div className="row mt-2">
        <div className="col-md-6 text-center mb-3"> 
          <button
            className="btn btn-primary"
            onClick={() => navigate('/addrecipe')}
          >
            Add a Recipe
          </button>
        </div>
        <div className="col-md-6 text-center mb-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/myrecipe')}
          >
            View My Recipe
          </button>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-12 text-center mb-3">
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row">
        {Array.isArray(filteredRecipes) && filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={recipe.imageUrl} 
                  alt={recipe.recipeName}
                  className="card-img-top"
                  style={{ height: '300px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(recipe.recipeId)}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.recipeName}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-md-12">
            <p className="text-center">No recipes found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default RecipePage;
