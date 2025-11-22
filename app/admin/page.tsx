'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { Users, ShoppingBag, Store, Truck, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalRestaurants: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchStats()
  }, [session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Restaurants</p>
                <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/restaurants" className="card hover:shadow-lg transition-shadow">
            <Store className="w-8 h-8 text-secondary mb-4" />
            <h2 className="text-xl font-bold mb-2">Manage Restaurants</h2>
            <p className="text-gray-600">Add, edit, and manage restaurant partners</p>
          </Link>

          <Link href="/admin/orders" className="card hover:shadow-lg transition-shadow">
            <ShoppingBag className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Manage Orders</h2>
            <p className="text-gray-600">View and manage all orders</p>
          </Link>

          <Link href="/admin/delivery-partners" className="card hover:shadow-lg transition-shadow">
            <Truck className="w-8 h-8 text-accent mb-4" />
            <h2 className="text-xl font-bold mb-2">Delivery Partners</h2>
            <p className="text-gray-600">Manage delivery partners and assignments</p>
          </Link>

          <Link href="/admin/users" className="card hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-purple-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-600">View and manage user accounts</p>
          </Link>

          <Link href="/admin/analytics" className="card hover:shadow-lg transition-shadow">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Analytics</h2>
            <p className="text-gray-600">View detailed analytics and reports</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
