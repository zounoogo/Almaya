import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState([]); 
    const [loading, setLoading] = useState(true);

    // Fonction pour synchroniser le panier avec le serveur
    const syncCartToServer = async (currentCart, currentToken) => {
        const syncToken = currentToken || token;
        if (!syncToken) return; 

        try {
            await fetch('http://localhost:3001/api/cart', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${syncToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart: currentCart }),
            });
        } catch (error) {
            console.error("Échec de la synchronisation du panier avec le serveur:", error);
        }
    };

    // Fonction pour récupérer le panier du serveur
    const fetchUserCart = async (currentToken) => {
        try {
            const response = await fetch('http://localhost:3001/api/cart', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []); 
            } else {
                console.error("Échec de la récupération du panier serveur. Code:", response.status);
                setCart([]); 
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du panier:", error);
            setCart([]);
        }
    };


    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                fetchUserCart(token); 
            } catch (error) {
                console.error("Token invalide:", error);
                setToken(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
            setCart([]);
        }
        setLoading(false);
    }, [token]); 


    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setCart([]); 
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            let newCart;

            if (existingItem) {
                newCart = prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                newCart = [...prevCart, { ...item, quantity: 1 }];
            }
            
            syncCartToServer(newCart); 
            return newCart;
        });
    };

    const increaseQuantity = (itemId) => {
        setCart((prevCart) => {
            const newCart = prevCart.map((item) => 
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            );
            
            syncCartToServer(newCart); 
            return newCart;
        });
    };

    const decreaseQuantity = (itemId) => {
        setCart((prevCart) => {
            const newCart = prevCart.reduce((acc, item) => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity - 1;
                    if (newQuantity > 0) {
                        acc.push({ ...item, quantity: newQuantity });
                    }
                } else {
                    acc.push(item);
                }
                return acc;
            }, []);
            
            syncCartToServer(newCart); 
            return newCart;
        });
    };
    
    // NOUVELLE FONCTION : Retire complètement un article du panier
    const removeItem = (itemId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== itemId);
            syncCartToServer(newCart);
            return newCart;
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
            increaseQuantity, 
            decreaseQuantity, 
            removeItem, // EXPORTÉ MAINTENANT
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);