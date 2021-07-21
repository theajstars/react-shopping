import React from 'react'

var CartValue = React.createContext();
var CartProvider = CartValue.Provider;
var CartConsumer = CartValue.Consumer;

export { CartProvider, CartConsumer }