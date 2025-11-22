'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Star, Clock, MapPin, Plus, Minus } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'


interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  prepTime: number
  image: string | null
  isVegetarian: boolean
  isVegan: boolean
  isSpicy: boolean
}

interface Category {
  id: string
  name: string
  menuItems: MenuItem[]
}

interface Restaurant {
  id: string
  name: string
  description: string | null
  cuisine: string
  image: string | null
  rating: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  categories: Category[]
}

export default function RestaurantPage() {
  const params = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    if (params.id) {
      fetchRestaurant()
    }
  }, [params.id])

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants/${params.id}`)
      const data = await response.json()
      setRestaurant(data.restaurant)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
    toast.success('Added to cart')
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    if (!restaurant) return 0
    let total = 0
    restaurant.categories.forEach((category) => {
      category.menuItems.forEach((item) => {
        if (cart[item.id]) {
          total += item.price * cart[item.id]
        }
      })
    })
    return total
  }

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Store cart in localStorage or context for checkout page
    const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
      const item = restaurant?.categories
        .flatMap((c) => c.menuItems)
        .find((i) => i.id === itemId)
      return {
        menuItemId: itemId,
        quantity,
        price: item?.price || 0,
      }
    })

    localStorage.setItem('cart', JSON.stringify(cartItems))
    localStorage.setItem('restaurantId', restaurant?.id || '')
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Restaurant not found</div>
        </main>
      </div>
    )
  }

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Restaurant Header */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                {restaurant.image ? (
                  <Image src="/logo.png.png" width={200} height={200} alt="Logo" />


                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{restaurant.cuisine}</span>
                  </div>
                  <span className="font-medium">${restaurant.deliveryFee} delivery fee</span>
                </div>
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      restaurant.isOpen
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {restaurant.categories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                  <div className="space-y-4">
                    {category.menuItems.map((item) => (
                      <div key={item.id} className="card flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <span className="font-bold">${item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            {item.isVegetarian && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                Vegetarian
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                Vegan
                              </span>
                            )}
                            {item.isSpicy && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                                Spicy
                              </span>
                            )}
                            <span>{item.prepTime} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cart[item.id] ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-medium w-8 text-center">
                                  {cart[item.id]}
                                </span>
                                <button
                                  onClick={() => addToCart(item.id)}
                                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item.id)}
                                className="btn btn-primary text-sm"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 card">
                <h2 className="text-xl font-bold mb-4">Your Order</h2>
                {cartItemCount === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                      {restaurant.categories.map((category) =>
                        category.menuItems
                          .filter((item) => cart[item.id])
                          .map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.name} × {cart[item.id]}
                              </span>
                              <span>${(item.price * cart[item.id]).toFixed(2)}</span>
                            </div>
                          ))
                      )}
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>${restaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>
                          ${(getCartTotal() + restaurant.deliveryFee + getCartTotal() * 0.1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="btn btn-secondary w-full mt-4"
                      disabled={!restaurant.isOpen}
                    >
                      Checkout
                    </button>
                    {getCartTotal() < restaurant.minOrder && (
                      <p className="text-sm text-red-600 mt-2 text-center">
                        Minimum order: ${restaurant.minOrder}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
