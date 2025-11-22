'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock, MapPin, ArrowRight } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  restaurant: {
    name: string
    image: string | null
  }
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (session) {
    fetchOrders()
  }
}, [session])


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PREPARING: 'bg-orange-100 text-orange-700',
      READY: 'bg-purple-100 text-purple-700',
      PICKED_UP: 'bg-indigo-100 text-indigo-700',
      ON_THE_WAY: 'bg-teal-100 text-teal-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link href="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="card hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{order.restaurant.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mt-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
