import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      restaurants: 'Restaurants',
      orders: 'Orders',
      cart: 'Cart',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      search: 'Search',
      addToCart: 'Add to Cart',
      checkout: 'Checkout',
      orderTracking: 'Order Tracking',
      deliveryAddress: 'Delivery Address',
      paymentMethod: 'Payment Method',
      placeOrder: 'Place Order',
      orderPlaced: 'Order Placed',
      preparing: 'Preparing',
      onTheWay: 'On the Way',
      delivered: 'Delivered',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      restaurants: 'Restaurantes',
      orders: 'Pedidos',
      cart: 'Carrito',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      search: 'Buscar',
      addToCart: 'Añadir al Carrito',
      checkout: 'Finalizar Compra',
      orderTracking: 'Seguimiento de Pedido',
      deliveryAddress: 'Dirección de Entrega',
      paymentMethod: 'Método de Pago',
      placeOrder: 'Realizar Pedido',
      orderPlaced: 'Pedido Realizado',
      preparing: 'Preparando',
      onTheWay: 'En Camino',
      delivered: 'Entregado',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      restaurants: 'Restaurants',
      orders: 'Commandes',
      cart: 'Panier',
      signIn: 'Se Connecter',
      signUp: "S'Inscrire",
      signOut: 'Se Déconnecter',
      search: 'Rechercher',
      addToCart: 'Ajouter au Panier',
      checkout: 'Commander',
      orderTracking: 'Suivi de Commande',
      deliveryAddress: 'Adresse de Livraison',
      paymentMethod: 'Méthode de Paiement',
      placeOrder: 'Passer la Commande',
      orderPlaced: 'Commande Passée',
      preparing: 'En Préparation',
      onTheWay: 'En Route',
      delivered: 'Livré',
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
