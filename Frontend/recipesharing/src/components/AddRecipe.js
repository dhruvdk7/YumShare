import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Setting up env variable from cloud formation
//https://stackoverflow.com/questions/69506471/referencing-lambda-environment-variable-in-cloudformation-template-throws-circu
const AddRecipePage = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparationSteps, setPreparationSteps] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecipe = async () => {
    const base64Image = selectedImage.split(',')[1];
    console.log(base64Image,"ssssssss")

    const data = {
      recipeName,
      ingredients,
      preparationSteps,
      cookingTime,
      cuisine,
      difficulty,
      servingSize,
      imageBase64: base64Image,
      userId: localStorage.getItem('userId'), 

    };
    console.log(data,"dddddddd")

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/add-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },   
       body: JSON.stringify(data)
         });

      if (response.ok) {
        toast.success('Recipe Added Successfully');
        setTimeout(() => {
          navigate('/recipe');
        }, 2000);
      }
      else{
        toast.error('Failed to add the Recipe')
       throw new Error('Failed to add recipe.');      
      }
    } catch (error) {
      console.error(error);
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
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Add Recipe</h2>
              <form>
                <div className="form-group">
                  <label>Recipe Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Ingredients</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Preparation Steps</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={preparationSteps}
                    onChange={(e) => setPreparationSteps(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Cooking Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Cuisine</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <input
                    type="text"
                    className="form-control"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Serving Size</label>
                  <input
                    type="text"
                    className="form-control"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  <input
                    type="file"
                    className="form-control-file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {selectedImage && (
                  <div className="form-group">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="img-thumbnail"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="text-center">
                  <button type="button" className="btn btn-primary" onClick={handleAddRecipe}>
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
};

export default AddRecipePage;
