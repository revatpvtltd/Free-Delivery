'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock, MapPin, CheckCircle, Package, Truck, Home } from 'lucide-react'

interface OrderTracking {
  id: string
  status: string
  message: string | null
  createdAt: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  menuItem: {
    name: string
    image: string | null
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  deliveryFee: number
  tax: number
  deliveryAddress: string
  specialInstructions: string | null
  createdAt: string
  restaurant: {
    name: string
    image: string | null
  }
  items: OrderItem[]
  tracking: OrderTracking[]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder()
      // Poll for order updates every 5 seconds
      const interval = setInterval(fetchOrder, 5000)
      return () => clearInterval(interval)
    }
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', icon: CheckCircle },
      { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
      { status: 'PREPARING', label: 'Preparing', icon: Package },
      { status: 'READY', label: 'Ready', icon: Package },
      { status: 'PICKED_UP', label: 'Picked Up', icon: Truck },
      { status: 'ON_THE_WAY', label: 'On the Way', icon: Truck },
      { status: 'DELIVERED', label: 'Delivered', icon: Home },
    ]
    return steps
  }

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps()
    return steps.findIndex((step) => step.status === order?.status)
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Order not found</div>
        </main>
      </div>
    )
  }

  const currentStepIndex = getCurrentStepIndex()
  const steps = getStatusSteps()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Order Status</h2>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-primary text-text'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isCompleted ? 'text-text' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && order.tracking.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {order.tracking[order.tracking.length - 1].message ||
                              'Processing...'}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant</span>
                  <span className="font-medium">{order.restaurant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <p className="text-gray-700">{order.deliveryAddress}</p>
              {order.specialInstructions && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-2">Special Instructions</h3>
                  <p className="text-gray-600">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.menuItem.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
