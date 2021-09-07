import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import '../assets/css/Navbar.css'
import { CartConsumer } from '../Context/cartContext'
import { SavedItemsConsumer } from '../Context/savedItemsContext'

export default function Navbar(props) {

    const [searchValue, setSearchValue] = useState('')
    const [menuStatus, setMenuStatus] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            
        }, 1200)
    }, [])
    function searchProducts(){
        console.log(searchValue)
        searchValue !== '' ? window.location.href = `/?search=${searchValue}` : alert('You must enter a search term')
    }
    function menuDrop(){
        var menu = document.getElementById('nav-actions')
        menu.classList.toggle('nav-actions-active')
    }
    return (
            <div className="nav">
                <Link to='/'>
                    <span className="home-icon nav-icon">
                        <i className="fas fa-home"></i>
                    </span>
                </Link>
                
                <div>
                    <input type="text" className="search-products font-1-1"
                        placeholder="Search products..." spellCheck="false"
                        onInput={(e) => setSearchValue(e.target.value)}
                        onKeyUp={(event) => {
                            if(event.keyCode === 13){
                                searchProducts()
                            }
                        }}
                        autoFocus
                        value={searchValue}
                    />
                    
                    <span className="search-products-icon"
                        onClick={() =>searchProducts()}
                    >
                            <i className="fas fa-search"></i>
                    </span>
                </div>
                <div className="dropdown"
                    onClick={() => menuDrop()}
                >
                    <i className="far fa-bars"></i>
                </div>
                <div className="nav-actions" id="nav-actions">
                    <Link to='/saved'>
                        <span className="saved-items-icon nav-icon">
                            <SavedItemsConsumer>
                                {
                                    (savedItems) => {
                                        var savedItemsLength = savedItems.length
                                        if(savedItemsLength <= 0){
                                            //Do Nothing
                                        }else{
                                            return(
                                                <span className="saved-value">
                                                    {savedItemsLength}
                                                </span>
                                            )
                                        }
                                    }
                                }
                        </SavedItemsConsumer>
                        <i className="far fa-heart"></i>
                    </span>
                    </Link>
                    <Link to='/cart'>
                        <span className="cart-icon nav-icon">
                            <i className="far fa-shopping-cart"></i>
                                <CartConsumer>
                                    {
                                        (cartValue) => {
                                            var length = cartValue.length
                                            if(length <= 0){
                                                //Do Nothing as well
                                            }else{
                                                return (
                                                    <span className="cart-value">
                                                        {length}
                                                    </span>
                                                )
                                        }
                                        }
                                    }
                                </CartConsumer>
                        </span>
                    </Link>
                </div>
            </div>
    )
}
