import React from 'react'

var SavedItems = React.createContext()

var SavedItemsProvider = SavedItems.Provider;
var SavedItemsConsumer = SavedItems.Consumer;

export { SavedItemsProvider, SavedItemsConsumer }