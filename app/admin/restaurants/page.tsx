'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  isActive: boolean
  isOpen: boolean
  rating: number
  createdAt: string
}

export default function AdminRestaurantsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchRestaurants()
  }, [session, router])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/admin/restaurants')
      const data = await response.json()
      setRestaurants(data.restaurants || [])
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <Link href="/admin/restaurants/new" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Restaurant
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Cuisine</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{restaurant.name}</td>
                    <td className="p-4">{restaurant.cuisine}</td>
                    <td className="p-4">{restaurant.rating.toFixed(1)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            restaurant.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {restaurant.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            restaurant.isOpen
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
