// src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Search, ShoppingCart, Star, MapPin, Filter, Heart, User, Bell, Grid, List, ChevronDown, Truck, Shield, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const CustomerDashboard = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [cartItems, setCartItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentUser] = useState({ name: 'John Doe', avatar: null })

  const categories = [
    'all', 'pottery', 'woodwork', 'textiles', 'jewelry', 'metalwork', 'leather', 'glass', 'painting', 'sculpture'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ]

  useEffect(() => {
    fetchProducts()
    loadCartItems()
    loadWishlist()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Simulate API call with more comprehensive mock data
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: 'Handmade Ceramic Vase with Traditional Patterns',
            price: 45.99,
            originalPrice: 59.99,
            image: 'https://via.placeholder.com/300x300?text=Ceramic+Vase',
            images: [
              'https://via.placeholder.com/300x300?text=Vase+1',
              'https://via.placeholder.com/300x300?text=Vase+2',
              'https://via.placeholder.com/300x300?text=Vase+3'
            ],
            seller: {
              name: 'John Potter',
              location: 'Chennai, Tamil Nadu',
              rating: 4.8,
              verified: true,
              responseTime: '2 hours'
            },
            category: 'pottery',
            rating: 4.7,
            reviewCount: 23,
            description: 'Beautiful handcrafted ceramic vase with traditional Indian patterns',
            deliveryTime: '5-7 days',
            inStock: true,
            stockCount: 12,
            isPopular: true,
            discount: 23,
            tags: ['handmade', 'ceramic', 'traditional', 'home-decor'],
            specifications: {
              material: 'High-quality ceramic',
              dimensions: '8" H x 4" W',
              weight: '1.2 lbs',
              care: 'Dishwasher safe'
            }
          },
          {
            id: 2,
            name: 'Solid Oak Coffee Table with Carved Details',
            price: 199.99,
            originalPrice: 249.99,
            image: 'https://via.placeholder.com/300x300?text=Coffee+Table',
            images: [
              'https://via.placeholder.com/300x300?text=Table+1',
              'https://via.placeholder.com/300x300?text=Table+2'
            ],
            seller: {
              name: 'Sarah Carpenter',
              location: 'Bangalore, Karnataka',
              rating: 4.9,
              verified: true,
              responseTime: '1 hour'
            },
            category: 'woodwork',
            rating: 4.8,
            reviewCount: 45,
            description: 'Handcrafted solid oak coffee table with intricate carved details',
            deliveryTime: '10-14 days',
            inStock: true,
            stockCount: 5,
            isPopular: false,
            discount: 20,
            tags: ['furniture', 'oak', 'handcrafted', 'living-room'],
            specifications: {
              material: 'Solid Oak Wood',
              dimensions: '42" L x 24" W x 16" H',
              weight: '35 lbs',
              care: 'Regular dusting, avoid direct sunlight'
            }
          },
          {
            id: 3,
            name: 'Handwoven Silk Scarf with Traditional Motifs',
            price: 89.99,
            originalPrice: 119.99,
            image: 'https://via.placeholder.com/300x300?text=Silk+Scarf',
            images: [
              'https://via.placeholder.com/300x300?text=Scarf+1',
              'https://via.placeholder.com/300x300?text=Scarf+2',
              'https://via.placeholder.com/300x300?text=Scarf+3',
              'https://via.placeholder.com/300x300?text=Scarf+4'
            ],
            seller: {
              name: 'Priya Weaver',
              location: 'Varanasi, Uttar Pradesh',
              rating: 4.6,
              verified: true,
              responseTime: '3 hours'
            },
            category: 'textiles',
            rating: 4.5,
            reviewCount: 18,
            description: 'Luxurious handwoven silk scarf featuring traditional Indian motifs',
            deliveryTime: '3-5 days',
            inStock: true,
            stockCount: 8,
            isPopular: true,
            discount: 25,
            tags: ['silk', 'handwoven', 'traditional', 'fashion'],
            specifications: {
              material: '100% Pure Silk',
              dimensions: '70" L x 35" W',
              weight: '0.3 lbs',
              care: 'Dry clean only'
            }
          },
          {
            id: 4,
            name: 'Silver Pendant Necklace with Gemstone',
            price: 129.99,
            originalPrice: 159.99,
            image: 'https://via.placeholder.com/300x300?text=Silver+Pendant',
            images: [
              'https://via.placeholder.com/300x300?text=Necklace+1',
              'https://via.placeholder.com/300x300?text=Necklace+2'
            ],
            seller: {
              name: 'Rajesh Jeweller',
              location: 'Jaipur, Rajasthan',
              rating: 4.9,
              verified: true,
              responseTime: '30 mins'
            },
            category: 'jewelry',
            rating: 4.9,
            reviewCount: 67,
            description: 'Handcrafted silver pendant necklace with traditional Rajasthani design',
            deliveryTime: '7-10 days',
            inStock: true,
            stockCount: 15,
            isPopular: false,
            discount: 19,
            tags: ['silver', 'jewelry', 'traditional', 'gemstone'],
            specifications: {
              material: '925 Sterling Silver',
              dimensions: 'Chain: 18", Pendant: 2" x 1.5"',
              weight: '0.8 oz',
              care: 'Clean with soft cloth'
            }
          },
          {
            id: 5,
            name: 'Vintage Leather Messenger Bag',
            price: 159.99,
            originalPrice: 199.99,
            image: 'https://via.placeholder.com/300x300?text=Leather+Bag',
            images: [
              'https://via.placeholder.com/300x300?text=Bag+1',
              'https://via.placeholder.com/300x300?text=Bag+2',
              'https://via.placeholder.com/300x300?text=Bag+3'
            ],
            seller: {
              name: 'Ahmed Leather',
              location: 'Kanpur, Uttar Pradesh',
              rating: 4.7,
              verified: true,
              responseTime: '4 hours'
            },
            category: 'leather',
            rating: 4.6,
            reviewCount: 34,
            description: 'Genuine leather messenger bag with vintage finish and brass hardware',
            deliveryTime: '5-8 days',
            inStock: true,
            stockCount: 6,
            isPopular: true,
            discount: 20,
            tags: ['leather', 'vintage', 'messenger', 'professional'],
            specifications: {
              material: 'Genuine Leather',
              dimensions: '15" L x 12" H x 4" D',
              weight: '2.5 lbs',
              care: 'Use leather conditioner monthly'
            }
          },
          {
            id: 6,
            name: 'Hand Forged Iron Candle Stand Set',
            price: 79.99,
            originalPrice: 99.99,
            image: 'https://via.placeholder.com/300x300?text=Iron+Stand',
            images: [
              'https://via.placeholder.com/300x300?text=Stand+1',
              'https://via.placeholder.com/300x300?text=Stand+2'
            ],
            seller: {
              name: 'Vikram Blacksmith',
              location: 'Jodhpur, Rajasthan',
              rating: 4.8,
              verified: true,
              responseTime: '6 hours'
            },
            category: 'metalwork',
            rating: 4.7,
            reviewCount: 29,
            description: 'Traditional hand-forged iron candle stand with rustic finish',
            deliveryTime: '6-9 days',
            inStock: false,
            stockCount: 0,
            isPopular: false,
            discount: 20,
            tags: ['iron', 'forged', 'candle', 'rustic'],
            specifications: {
              material: 'Hand-forged Iron',
              dimensions: 'Set of 3: 6", 8", 10" heights',
              weight: '4.5 lbs',
              care: 'Wipe with dry cloth, apply oil to prevent rust'
            }
          }
        ]
        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Failed to load products')
      setLoading(false)
    }
  }

  const loadCartItems = () => {
    const saved = localStorage.getItem('cartItems')
    if (saved) {
      setCartItems(JSON.parse(saved))
    }
  }

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setWishlist(JSON.parse(saved))
    }
  }

  const saveCartItems = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items))
    setCartItems(items)
  }

  const saveWishlist = (items) => {
    localStorage.setItem('wishlist', JSON.stringify(items))
    setWishlist(items)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    
    const matchesMinPrice = !priceRange.min || product.price >= parseFloat(priceRange.min)
    const matchesMaxPrice = !priceRange.max || product.price <= parseFloat(priceRange.max)
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
        return b.reviewCount - a.reviewCount
      case 'newest':
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
  })

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    let newCartItems

    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCartItems = [...cartItems, { ...product, quantity: 1 }]
    }

    saveCartItems(newCartItems)
    toast.success(`${product.name} added to cart!`)
  }

  const toggleWishlist = (productId) => {
    const isInWishlist = wishlist.includes(productId)
    let newWishlist

    if (isInWishlist) {
      newWishlist = wishlist.filter(id => id !== productId)
      toast.success('Removed from wishlist')
    } else {
      newWishlist = [...wishlist, productId]
      toast.success('Added to wishlist')
    }

    saveWishlist(newWishlist)
  }

  const calculateDeliveryDate = (deliveryTime) => {
    const days = parseInt(deliveryTime.split('-')[1] || deliveryTime.split('-')[0]) || 7
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{product.discount}%
            </span>
          )}
          {product.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:shadow-md transition-all duration-200"
        >
          <Heart 
            className={`w-5 h-5 ${
              wishlist.includes(product.id) 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          >
            Quick View
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link 
            to={`/product/${product.id}`}
            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>by {product.seller.name}</span>
          {product.seller.verified && (
            <Shield className="w-4 h-4 ml-1 text-green-500" />
          )}
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          {product.seller.location}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Truck className="w-4 h-4 mr-1" />
          <span>Delivery by {calculateDeliveryDate(product.deliveryTime)}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
          >
            View
          </Link>
        </div>

        {/* Contact Seller */}
        <button className="w-full mt-2 text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center justify-center">
          <MessageCircle className="w-4 h-4 mr-1" />
          Contact Seller
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HN</span>
              </div>
              <span className="text-xl font-bold text-primary-600 hidden sm:block">
                Handmade Nexus
              </span>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for handmade products, artisans..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2 ml-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {currentUser.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover unique handmade products from talented artisans across India
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Price Filter */}
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} products
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          
          {(searchTerm || selectedCategory !== 'all' || priceRange.min || priceRange.max) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setPriceRange({ min: '', max: '' })
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <p className="text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setPriceRange({ min: '', max: '' })
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Load More Button (if implementing pagination) */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
