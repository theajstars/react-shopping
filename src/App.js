import React from 'react'
import {BrowserRouter as  Router, Route } from 'react-router-dom';
import Cart from './Components/Cart';
import Products from './Components/Products'
import SavedItems from './Components/SavedItems';


export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Products}/>
      <Route exact path="/cart" component={Cart}/>
      <Route exact path="/saved" component={SavedItems}/>
    </Router>
  );
}
