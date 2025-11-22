'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Clock, MapPin, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Restaurant {
  id: string
  name: string
  description: string | null
  cuisine: string
  image: string | null
  rating: number
  deliveryTime: number
  deliveryFee: number
  city: string
  isOpen: boolean
  _count: {
    reviews: number
  }
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({
    city: '',
    cuisine: '',
    isOpen: '',
  })

  useEffect(() => {
    fetchRestaurants()
  }, [search, filter])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter.city) params.append('city', filter.city)
      if (filter.cuisine) params.append('cuisine', filter.cuisine)
      if (filter.isOpen) params.append('isOpen', filter.isOpen)

      const response = await fetch(`/api/restaurants?${params}`)
      const data = await response.json()
      setRestaurants(data.restaurants || [])
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12 w-full max-w-md"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filter.cuisine}
              onChange={(e) => setFilter({ ...filter, cuisine: e.target.value })}
              className="input"
            >
              <option value="">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              <option value="Japanese">Japanese</option>
              <option value="American">American</option>
            </select>

            <select
              value={filter.isOpen}
              onChange={(e) => setFilter({ ...filter, isOpen: e.target.value })}
              className="input"
            >
              <option value="">All</option>
              <option value="true">Open Now</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="text-center py-12">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No restaurants found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                    <span>({restaurant._count.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ${restaurant.deliveryFee} delivery
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      restaurant.isOpen
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
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
