// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Function to retrieve the cart from localStorage
const getCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Erreur lors de la lecture du panier depuis le localStorage:", error);
        return [];
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState(getCartFromLocalStorage()); // Initialize cart from localStorage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Token invalide:", error);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [token]);

    // This effect saves the cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart'); // Clear the cart from localStorage on logout
        setToken(null);
        setUser(null);
        setCart([]); // Reset the cart state
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    // --- NEW FUNCTION: Increase the quantity of an item ---
    const increaseQuantity = (itemId) => {
        setCart((prevCart) => {
            return prevCart.map((item) => 
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            );
        });
    };

    // --- NEW FUNCTION: Decrease the quantity of an item and remove if quantity is 0 ---
    const decreaseQuantity = (itemId) => {
        setCart((prevCart) => {
            return prevCart.reduce((acc, item) => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity - 1;
                    // Only keep the item if the new quantity is greater than 0
                    if (newQuantity > 0) {
                        acc.push({ ...item, quantity: newQuantity });
                    }
                    // If newQuantity is 0, the item is simply not pushed back into the accumulator (acc)
                } else {
                    // Keep all other items unchanged
                    acc.push(item);
                }
                return acc;
            }, []);
        });
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            cart, 
            setCart, 
            addToCart, 
            increaseQuantity, // Exposed the new function
            decreaseQuantity, // Exposed the new function
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);