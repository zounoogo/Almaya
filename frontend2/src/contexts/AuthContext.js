import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// jwtDecode n'est plus nécessaire car le token n'est plus lu par JavaScript.
// import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext(null);

// **CRITIQUE : Mettez à jour cette URL vers votre domaine HTTPS en production**
const API_URL = 'http://localhost:3001'; 

// --- Fonction d'aide pour vérifier la session utilisateur via le serveur ---
const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/api/profile`, { 
            method: 'GET',
            // IMPORTANT : Ceci assure que le cookie 'token' est envoyé
            credentials: 'include' 
        });
        
        if (response.ok) {
            return await response.json(); // Renvoie les données utilisateur (id, username, email, role)
        }
        return null; // Session invalide ou expirée
    } catch (error) {
        console.error("Erreur lors de la vérification du profil:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Le token n'est plus stocké dans le state car il est géré par le cookie
    // const [token, setToken] = useState(localStorage.getItem('token')); 
    const [cart, setCart] = useState([]); 
    const [loading, setLoading] = useState(true);

    const isAdmin = user && user.role === 'admin'; 

    // --- Synchronisation du panier vers le serveur ---
    const syncCartToServer = async (currentCart) => { // Plus besoin de currentToken
        // On vérifie si l'utilisateur est connecté via le state 'user'
        if (!user) return; 

        try {
            await fetch(`${API_URL}/api/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Envoie le cookie d'authentification
                body: JSON.stringify({ cart: currentCart }),
            });
        } catch (error) {
            console.error("Échec de la synchronisation du panier avec le serveur:", error);
        }
    };

    // --- Récupération du panier depuis le serveur ---
    // Envelopper fetchUserCart dans useCallback pour la stabiliser
    const fetchUserCart = useCallback(async () => { 
        if (!user) return; 
        try {
            const response = await fetch(`${API_URL}/api/cart`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Envoie le cookie d'authentification
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
    }, [user, setCart]); // Dépend de user pour la logique et setCart pour l'état

    // --- Effet pour vérifier la session au chargement ---
    useEffect(() => {
        const checkAuthStatus = async () => {
            const userData = await fetchUserProfile();
            
            if (userData) {
                // Session valide : définissez l'utilisateur et récupérez le panier
                setUser(userData);
                // Le panier est chargé une fois que 'user' est défini.
            } else {
                // Session invalide/expirée : réinitialisation
                setUser(null);
                setCart([]);
            }
            setLoading(false);
        };
        
        checkAuthStatus();
        
        // Dépendances : Aucune car nous vérifions le statut au montage du composant
    }, []); 

    // --- Re-fetch le panier lorsque l'utilisateur change ---
    // Correction: fetchUserCart est maintenant inclus dans les dépendances
    useEffect(() => {
        if (user) {
            fetchUserCart();
        } else {
            setCart([]);
        }
    }, [user, fetchUserCart]); // L'avertissement est corrigé ici

    // --- Fonctions d'authentification simplifiées ---
    const login = async () => {
        // Appelé après la connexion réussie dans AuthForm
        // Le backend a défini le cookie; il suffit de recharger le profil pour mettre à jour l'état.
        const userData = await fetchUserProfile();
        if (userData) {
            setUser(userData);
        }
    };

    const logout = async () => {
        // Appelle le backend pour supprimer le cookie
        try {
             await fetch(`${API_URL}/api/logout`, { method: 'POST', credentials: 'include' });
        } catch(e) {
            // Ignore l'erreur; nous forçons la déconnexion côté client
        }
        setUser(null);
        setCart([]); 
    };

    // --- Fonctions du panier (Appellent syncCartToServer sans token) ---
    // Les fonctions addToCart, increaseQuantity, decreaseQuantity, removeItem sont 
    // mises à jour pour ne plus passer de token. Le backend utilise le cookie.

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
            isAdmin, 
            // 'token' n'est plus exposé (retiré des props du provider)
            login, 
            logout, 
            cart, 
            setCart, 
            addToCart, 
            increaseQuantity, 
            decreaseQuantity, 
            removeItem, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);