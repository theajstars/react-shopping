import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/Navbar.css'
import { CartConsumer } from '../Context/cartContext'
import { SavedItemsConsumer } from '../Context/savedItemsContext'

export default function Navbar(props) {

    useEffect(() => {
        setTimeout(() => {
            
        }, 1200)
    }, [])
    return (
            <div className="nav">
                <Link to='/'>
                    <span className="home-icon nav-icon">
                        <i className="fas fa-home"></i>
                    </span>
                </Link>
                <input type="search" className="search-products font-1-1"
                    placeholder="Filter products..." spellCheck="false"
                />
                <div className="nav-actions">
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