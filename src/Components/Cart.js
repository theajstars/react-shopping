import { Container, Typography } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { CartProvider } from '../Context/cartContext'
import { SavedItemsProvider } from '../Context/savedItemsContext'
import '../assets/css/Cart.css'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

export default function Cart() {
    const [cart, setCart] = useState([])
    const [sum, setSum] = useState(0)
    const [delivery, setDelivery] = useState(0)
    const [customs, setCustoms] = useState(0)
    const [savedItems, setSavedItems] = useState([])
    useEffect(() => {
        axios.get('https://drbravo-shopping-cart-api.herokuapp.com/cart/retrieve')
            .then(res => {
                if(res.data === '' || res.data === undefined || res.data === null || res.data.length === 0){
                    document.getElementById('cart-empty').style.display = 'block'
                }else{
                    document.getElementById('cart-empty').style.display = 'none'
                    setCart(res.data)
                    if(res.data.length !== 0){
                        document.querySelector('.cart-details-container').style.visibility = 'visible'
                        
                    }
                }
            })
        axios.get('https://drbravo-shopping-cart-api.herokuapp.com/saved/retrieve')
            .then(res => {
                if(res.data !== '' || res.data !== undefined || res.data !== null || res.data.length !== 0){
                    setSavedItems(res.data)
                }
            })
    }, [])
    useEffect(() => {
        
        setSum(0)
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        cart.forEach(cartItem => {
            setSum(sum => sum + cartItem.price)
        })
        setTimeout(() => {
            var del = getRandomInt(3000, 7600)
            var cus = getRandomInt(3000, 7600)

            setCustoms(cus)
            setDelivery(del)
        }, 200)  
        
        
        
        if(cart.length !== 0){
            document.querySelector('.cart-details-container').style.visibility = 'visible'
            document.getElementById('cart-empty').style.display = 'none'    
        }else{
            document.querySelector('.cart-details-container').style.visibility = 'hidden'
            document.getElementById('cart-empty').style.display = 'block'
        }
                
    }, [cart])

    function removeCartItem(product){
        console.log(product)
        var index = cart.indexOf(product)
        if(index !== -1){
            var newArr = cart.filter(item => item.key === product.key);
            newArr.pop()
            setCart(cart.filter(item => item.key !== product.key))
            setCart(cart => [...cart, ...newArr])

            axios.post('https://drbravo-shopping-cart-api.herokuapp.com/cart', cart)
                .then((resp) => {
                    console.log('Success',resp)
                })
           
        }else{
            console.error('Product is not in cart')
        }
    }
    function processPayment(){
        var paymentModal = document.querySelector('.payment-display');
        var pay = document.querySelector('.pay');
            pay.innerHTML = 'Processing payment...'
        paymentModal.style.display = 'block'
        paymentModal.innerHTML = '<i style="color: rgba(19, 18, 18, 0.75);" class="fas fa-3x fa-spin fa-badge-dollar"></i>'

        setTimeout(() => {
            paymentModal.innerHTML = '<i style="color: #059862" class="far fa-3x fa-check"></i>'
            pay.innerHTML = 'Payment Completed!'
        }, 2200)
        setTimeout(() => {
            axios.post('https://drbravo-shopping-cart-api.herokuapp.com/reset', '')
            .then((resp) => {
                console.log('Success',resp)
            })
            window.location.href = '/'
        }, 3200)
    }
    return (
        <>
        <CartProvider value={cart}>
            <SavedItemsProvider value={savedItems}>
                <Navbar/>
            </SavedItemsProvider>
        </CartProvider>
            <Container maxWidth="md">
                <div className="cart-container">
                    <Typography variant="h4" style={{'fontFamily': 'Jost, sans-serif'}}>Cart</Typography>
                    <div id="cart-empty" style={{display: 'none'}}>
                        <center>
                            <span style={{'fontFamily': 'Jost, sans-serif', 'fontSize': '1.5rem'}}>
                                Your cart is empty! <br /><Link to="/"><span className="home">Go home</span></Link>
                            </span>
                        </center>
                    </div>
                    <div className="cart-section">
                        <div className="cart-products">
                            
                            {
                                cart.map(cartItem => {
                                    return(
                                        <div className="cart-item" key={`item${cart.indexOf(cartItem)}${cartItem.key}`}>
                                            <img src={cartItem.pictureURL} 
                                                alt="_product avatar"
                                                className="product-image" 
                                            />
                                            <div className="cart-item-details">
                                                <span className="vendor">
                                                    {cartItem.vendor}
                                                </span>
                                                <span className="product-name">
                                                    {cartItem.name}
                                                </span>
                                                <span className="vendor">
                                                    {cartItem.reviews}/5
                                                </span>
                                            </div>
                                            <hr className="cart-item-line" />

                                            <div className="cart-item-properties">
                                                <span className="property font-weight-900" id="cost">
                                                    <span>Cost:</span>
                                                    <span>{cartItem.price}</span>
                                                </span>
                                                <span className="remove-item"
                                                    onClick={() => removeCartItem(cartItem)}
                                                >
                                                    Remove&nbsp; <i className="fal fa-trash"></i>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="cart-details-container">
                            <div className="cart-details">
                                <span className="cart-detail font-weight-900 subtotal">
                                    <span>Subtotal</span>
                                    <span>{sum}</span>
                                </span>
                                <span className="cart-detail font-weight-900 delivery">
                                    <span>Delivery Fee</span>
                                    <span>{delivery}</span>
                                </span>
                                <span className="cart-detail font-weight-900 customs">
                                    <span>Customs</span>
                                    <span>{customs}</span>
                                </span>
                                <span className="cart-detail font-weight-900 total">
                                    <span>Total</span>
                                    <span>{delivery + customs + sum}</span>
                                </span>
                            </div>
                            <span className="pay"
                                onClick={() => processPayment()}
                            >
                                Pay now&nbsp;<i className=" fal fa-tag"></i>
                            </span>
                            <div className="payment-display"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}
