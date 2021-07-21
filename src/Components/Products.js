import React from 'react'
import Navbar from './Navbar'
import '../assets/css/Products.css'
import {productList} from '../assets/JSON/Products.json'
import { useState, useEffect } from 'react'
import { Container, Grid } from '@material-ui/core'
import { CartProvider } from '../Context/cartContext'
import { SavedItemsProvider } from '../Context/savedItemsContext'
import axios from 'axios'

export default function Products(props) {
    const [cart, setCart] = useState([])
    const [bool, setBool] = useState(false)
    const [savedbool, setSavedBool] = useState(false)

    const [savedItems, setSavedItems] = useState([])
    const [search, updateSearch] = useState('')

    useEffect(() => {
        axios.post('http://localhost:2100/reset')
            .then(res => {
                //Do Nothing
            })
    }, [])
    useEffect(() => {
        if(bool === true){
            axios.post('http://localhost:2100/cart', cart)
            .then((resp) => {
                console.log('Success: ' + resp.data)
            })
        }
        setBool(false);
    }, [cart]);

    useEffect(() => {
        if(savedbool === true){
            axios.post('http://localhost:2100/saved', savedItems)
                .then(resp => {
                    console.log(resp)
                })
        }
    }, [savedItems])
    
    function addProductToCart(product){
        setBool(true)
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
            document.getElementById(`${product.key}`).style.display = 'none'
            document.getElementById(`modify${product.key}`).style.display = 'block'
        }
        document.getElementById(`cartNumber${product.key}`).innerHTML = numberInCart;
        
    }

    function removeProductFromCart(product){
        setBool(true)
        var index = cart.indexOf(product)
        if(index !== -1){
            var newArr = cart.filter(item => item.key === product.key);
            newArr.pop()
            setCart(cart.filter(item => item.key !== product.key))
            setCart(cart => [...cart, ...newArr])

            axios.post('http://localhost:2100/cart', cart)
                .then((resp) => {
                    console.log('Success',resp)
                })
            document.getElementById(`cartNumber${product.key}`).innerHTML = newArr.length
            if(newArr.length === 0){
                document.getElementById(`modify${product.key}`).style.display = 'none'
                document.getElementById(`${product.key}`).style.display = 'block'
            }

        }else{
            console.error('Product is not in cart')
        }
    }

    function saveProduct(product){
        setSavedBool(true)
        var index = savedItems.indexOf(product)
        if(index === -1){
            setSavedItems(savedItems => [...savedItems, product])
            document.getElementById(`save-product${product.key}`).innerHTML = '<i class="fas fa-heart"></i>'
        }else{
            setSavedItems(savedItems.filter(item => item.key !== product.key))
            document.getElementById(`save-product${product.key}`).innerHTML = '<i class="far fa-heart"></i>'
        }
    }
    
    return (
        <>
            <CartProvider value={cart} >
                <SavedItemsProvider value={savedItems}>
                    <Navbar />
                </SavedItemsProvider>
                <center>
                    <Container maxWidth="lg">
                        <div className="products-container">
                            <Grid container spacing={4} alignItems="center" justifyContent="center" alignContent="center">
                                {
                                    productList.map(product => {
                                        return (
                                            <Grid item xs={6} sm={4} md={3} lg={3} key={product.key}>
                                                <div className="product">
                                                    <center>
                                                        <img src={product.pictureURL} alt="" className="product-image" />
                                                    </center>
                                                    <span className="product-name">
                                                        {product.name}
                                                    </span>
                                                    <center>
                                                        <span className="product-price font-weight-900 font-1-1">
                                                            ₦ {product.price}
                                                        </span>
                                                    </center>
                                                    <hr width="100%"/>
                                                    <div className="product-actions">
                                                        <span id={product.key} className="add-product"
                                                            onClick={() => addProductToCart(product)}
                                                        >
                                                            Add to cart
                                                        </span>
                                                        <div className="modify" id={`modify${product.key}`}>
                                                            <span className="add-one" 
                                                                onClick={() => addProductToCart(product)}
                                                            >
                                                                <i className="fal fa-plus"></i>
                                                            </span>
                                                            <span className="number-in-cart"
                                                                id={`cartNumber${product.key}`}>
                                                            </span>
                                                            <span className="minus-one"
                                                                onClick={() => removeProductFromCart(product)}
                                                            >
                                                                <i className="fal fa-minus"></i>
                                                            </span>
                                                        </div>
                                                        <span id={`save-product${product.key}`} className="save-product"
                                                            onClick={() => saveProduct(product)}
                                                        >
                                                            <i className="far fa-heart"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </div>
                    </Container>
                </center>
            </CartProvider>
        </>
    )
}