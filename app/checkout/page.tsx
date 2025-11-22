'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, CreditCard, Wallet, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface CartItem {
  menuItemId: string
  quantity: number
  price: number
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [restaurantId, setRestaurantId] = useState('')
  const [restaurant, setRestaurant] = useState<any>(null)
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'WALLET'>('CARD')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const cartData = localStorage.getItem('cart')
    const restaurantIdData = localStorage.getItem('restaurantId')

    if (!cartData || !restaurantIdData) {
      router.push('/restaurants')
      return
    }

    setCart(JSON.parse(cartData))
    setRestaurantId(restaurantIdData)
    fetchRestaurant(restaurantIdData)
  }, [session, router])

  const fetchRestaurant = async (id: string) => {
    try {
      const response = await fetch(`/api/restaurants/${id}`)
      const data = await response.json()
      setRestaurant(data.restaurant)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    }
  }

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = restaurant?.deliveryFee || 0
    const tax = subtotal * 0.1
    return {
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax,
    }
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address')
      return
    }

    setLoading(true)
    try {
      const totals = calculateTotal()
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          items: cart,
          deliveryAddress: address,
          paymentMethod,
          specialInstructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to place order')
        return
      }

      // Clear cart
      localStorage.removeItem('cart')
      localStorage.removeItem('restaurantId')
      
      toast.success('Order placed successfully!')
      router.push(`/orders/${data.order.id}`)
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  const totals = calculateTotal()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="input h-24"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <CreditCard className="w-5 h-5" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <DollarSign className="w-5 h-5" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="WALLET"
                    checked={paymentMethod === 'WALLET'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <Wallet className="w-5 h-5" />
                  <span>Wallet</span>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special instructions for delivery?"
                className="input h-24"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      Item × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>${totals.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !address.trim()}
                className="btn btn-secondary w-full mt-4"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
