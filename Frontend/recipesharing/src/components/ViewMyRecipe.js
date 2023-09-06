import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const REACT_APP_BASE_URL =`${process.env.REACT_APP_BASE_URL}`

const ViewMyRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Get userId from local storage
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Fetching recipes data from the backend API using the userId from local storage
      fetch(`${process.env.REACT_APP_BASE_URL}/userrecipe/${userId}`)
        .then((response) => response.json())
        .then((data) => setRecipes(data.recipes))
        .catch((error) => console.error('Error fetching recipes:', error));
    }
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Recipe Deleted Succesfully');
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.recipeId !== recipeId));
      } else {
        toast.error('Error Deleting Recipe');
        console.error('Failed to delete recipe:', response);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
//Having Container
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers
//Card Body
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers https://getbootstrap.com/docs/5.1/components/card/ 
//form control
//https://getbootstrap.com/docs/5.0/forms/form-control/
  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div key={recipe.recipeId} className="col-lg-4 mb-4">
              <div className="card h-100">
                <img
                  src={recipe.imageUrl}
                  className="card-img-top img-fluid"
                  alt={recipe.recipeName}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.recipeName}</h5>
                  <div className="d-flex justify-content-between">
                  <a href={`/recipe/${recipe.recipeId}`} className="btn btn-primary mr-2">
                    View Recipe
                  </a>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRecipe(recipe.recipeId)} // Passing recipeId to the delete function
                  >
                    Delete
                  </button>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewMyRecipes;
