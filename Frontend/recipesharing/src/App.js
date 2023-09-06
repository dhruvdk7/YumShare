import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import RegistrationPage from './components/Registration';
import Loginpage from './components/Loginpage'
import RecipePage from './components/Recipe'
import AddRecipe from './components/AddRecipe'
import SpecificRecipe from './components/GetSpecificRecipe'
import ViewMyRecipe from './components/ViewMyRecipe'
// import LoginPage from './components/Login';
// import UserPage from './components/UserList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/addrecipe" element={<AddRecipe />} />
          <Route path="/recipe/:recipeId" element={<SpecificRecipe />} />
          <Route path="/myrecipe" element={<ViewMyRecipe />} />




          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
