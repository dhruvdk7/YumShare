import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SpecificRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const { recipeId } = useParams(); 

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]); 

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/${recipeId}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details.');
      }
      const data = await response.json();
      console.log(data)
      const recipeDetails =data.recipe;
      //  data.recipes.find((recipe) => recipe.recipeId === recipeId);
      setRecipe(recipeDetails);
    } catch (error) {
      console.error(error);
    }
  };

  if (!recipe) {
    return <p>Loading recipe details...</p>;
  }
//Having Container
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers
//Card Body
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers https://getbootstrap.com/docs/5.1/components/card/ 
//form control
//https://getbootstrap.com/docs/5.0/forms/form-control/
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">{recipe.recipeName}</h2>
              <img
                src={recipe.imageUrl}
                alt={recipe.recipeName}
                className="card-img-top"
                style={{ height: '400px', width: '100%', objectFit: 'cover' }}
              />
              <div className="mt-4">
                <h5>Ingredients:</h5>
                <p>{recipe.ingredients}</p>
                <h5>Preparation Steps:</h5>
                <p>{recipe.preparationSteps}</p>
                <p>Cooking Time: {recipe.cookingTime}</p>
                <p>Cuisine: {recipe.cuisine}</p>
                <p>Difficulty: {recipe.difficulty}</p>
                <p>Serving Size: {recipe.servingSize}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificRecipe;
