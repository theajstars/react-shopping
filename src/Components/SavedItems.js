import { Container, Typography } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import '../assets/css/Saved.css'
import { useEffect, useState } from 'react'
import { CartProvider } from '../Context/cartContext'
import { SavedItemsProvider } from '../Context/savedItemsContext'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

export default function SavedItems() {
    const [cart, setCart] = useState([])
    const [bool, setBool] = useState(false)
    const [savedBool, setSavedBool] = useState(false)
    const [savedItems, setSavedItems] = useState([])
    useEffect(() => {
        var empty = document.getElementById('saved-empty')
        var items = document.querySelector('.saved-items')
        axios.get('https://drbravo-shopping-cart-api.herokuapp.com/cart/retrieve')
            .then(res => {
                if(res.data === '' || res.data === undefined || res.data === null || res.data.length === 0){
                    //Do Nothing
                }else{
                    setCart(res.data)
                }
            })
        axios.get('https://drbravo-shopping-cart-api.herokuapp.com/saved/retrieve')
            .then(res => {
                console.log(res.data.length)
                if(res.data.length > 0){
                    setSavedItems(res.data)
                }else if(res.data.length === 0){
                    setSavedItems([])
                    console.log(savedItems)
                    empty.style.display = 'block'
                    items.style.display = 'none'
                }
            })
    }, [])
    useEffect(() => {
        if(bool === true){
            axios.post('https://drbravo-shopping-cart-api.herokuapp.com/cart', cart)
            .then((resp) => {
                console.log('Success: ' + resp.data)
            })
        }
        setBool(false);
    }, [cart]);
    useEffect(() => {
        if(savedBool === true){
            axios.post('https://drbravo-shopping-cart-api.herokuapp.com/saved', savedItems)
                .then(resp => {
                    console.log(resp)
                })
        }
        
        var empty = document.getElementById('saved-empty')
        var items = document.querySelector('.saved-items')
        if(savedItems.length === 0){
            empty.style.display = 'block'
            items.style.display = 'none'
        }else{
            empty.style.display = 'none'
            items.style.display = 'block'
        }
    }, [savedItems])
    function saveProduct(product){
        setSavedBool(true)
        var index = savedItems.indexOf(product)
        if(index === -1){
            setSavedItems(savedItems => [...savedItems, product])
            // document.getElementById(`save-product${product.key}`).innerHTML = '<i class="fas fa-heart"></i>'
        }else{
            setSavedItems(savedItems.filter(item => item.key !== product.key))
            // document.getElementById(`save-product${product.key}`).innerHTML = '<i class="far fa-heart"></i>'
        }
        console.log(savedBool)
        // setSavedBool(false)
    }

    function addProductToCart(product){
        setBool(true)
        console.log(bool)
        setCart(cart => [...cart, product])
        var index = 1
        var numberInCart = 1
        for(var i = 0; i < cart.length; i++){
            if(cart[i].key === product.key){
                index += 1;
                numberInCart += 1
            }
        }
        if(index === 1){
            //Do Nothing!
        }
        // document.getElementById(`cartNumber${product.key}`).innerHTML = numberInCart;
        saveProduct(product)
    }
    
    return (
        <>
            <CartProvider value={cart}>
                <SavedItemsProvider value={savedItems}>
                    <Navbar/>
                </SavedItemsProvider>
            </CartProvider>
            <Container maxWidth="sm">
                <div style={{'marginTop': '120px'}}>
                    <Typography variant="h4" style={{'fontFamily': 'Jost, sans-serif'}}>Saved Items</Typography>
                    <center>
                    <div id="saved-empty" style={{display: 'none', 'marginTop': '50px'}}>
                        <center>
                            <span style={{'fontFamily': 'Jost, sans-serif', 'fontSize': '1.5rem'}}>
                                You have no saved Items! <br /><Link to="/"><span className="home">Go home</span></Link>
                            </span>
                        </center>
                    </div>
                        <div className="saved-items" style={{display: 'none '}}>
                            {
                                savedItems.map(item => {
                                    return(
                                        <div className="saved-item" key={`product${savedItems.indexOf(item)}key`}>
                                            <img src={item.pictureURL} alt="" />
                                            <div className="saved-item-details">
                                                <span className="product-name">
                                                    {item.name}
                                                </span>
                                                <span className="vendor">
                                                   Vendor: {item.vendor}
                                                </span>
                                                <span className="ratings">
                                                    Rating: {item.reviews}
                                                </span>
                                            </div>
                                            <div className="saved-item-actions">
                                                <span className="buy"
                                                    onClick={() => addProductToCart(item)}
                                                >
                                                    Buy now
                                                </span>
                                                <span className="remove-saved"
                                                    onClick={() => {
                                                        setSavedBool(true)
                                                        saveProduct(item);
                                                    }}
                                                >
                                                    Remove <i className="fas fa-heart"></i>
                                                </span>
                                            </div>
                                        </div>            
                                    )
                                })
                            }
                        </div>
                    </center>
                </div>
            </Container>
        </>
    )
}
