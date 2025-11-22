import Link from 'next/link'
import { Search, MapPin, Clock, Star, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-text py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Delicious Food, Delivered Fast
              </h1>
              <p className="text-xl mb-8 text-text/90">
                Order from your favorite restaurants and enjoy fresh meals delivered to your door
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-full p-2 shadow-lg max-w-2xl mx-auto flex items-center">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  className="flex-1 px-4 py-3 outline-none text-gray-700"
                />
                <button className="btn btn-secondary rounded-full px-8 py-3">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-text" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your food delivered in 30-45 minutes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Top Restaurants</h3>
                <p className="text-gray-600">
                  Order from the best restaurants in town
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
                <p className="text-gray-600">
                  Track your order in real-time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Restaurants Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Popular Restaurants</h2>
              <Link href="/restaurants" className="text-secondary hover:underline flex items-center gap-2">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Link key={i} href={`/restaurants/${i}`} className="card hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-lg mb-2">Restaurant {i}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.{i}</span>
                    <span>•</span>
                    <span>30-45 min</span>
                  </div>
                  <p className="text-sm text-gray-500">Italian, Pizza, Pasta</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of satisfied customers
            </p>
            <Link href="/auth/signup" className="btn btn-primary inline-block">
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
