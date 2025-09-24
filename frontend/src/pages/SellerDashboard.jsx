import React, { useState, useEffect } from 'react'
import { User, Package, Users, Truck, Plus, Search, Star, MapPin } from 'lucide-react'

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [sellerData, setSellerData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Chennai, Tamil Nadu 600001',
    productType: 'Pottery',
    experience: '5+ years',
    rating: 4.7,
    totalOrders: 156,
    completedOrders: 142
  })

  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Alice Johnson',
      product: 'Ceramic Vase Set',
      quantity: 2,
      amount: 89.98,
      status: 'pending',
      orderDate: '2024-01-15',
      deliveryAddress: 'Bangalore, Karnataka'
    },
    {
      id: 'ORD002',
      customerName: 'Bob Smith',
      product: 'Handmade Pottery Bowls',
      quantity: 4,
      amount: 156.00,
      status: 'completed',
      orderDate: '2024-01-12',
      deliveryAddress: 'Mumbai, Maharashtra'
    }
  ])

  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: 'Sarah Wilson',
      skill: 'Painter',
      rating: 4.8,
      location: 'Chennai, TN',
      experience: '3+ years',
      image: 'https://via.placeholder.com/100x100?text=SW'
    },
    {
      id: 2,
      name: 'Mike Chen',
      skill: 'Wood Carver',
      rating: 4.9,
      location: 'Bangalore, KA',
      experience: '7+ years',
      image: 'https://via.placeholder.com/100x100?text=MC'
    }
  ])

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Clay & More Supplies',
      materials: ['Premium Clay', 'Glazes', 'Tools'],
      location: 'Chennai, Tamil Nadu',
      rating: 4.6,
      minOrder: 1000,
      contact: '+91 9876543210'
    },
    {
      id: 2,
      name: 'Artisan Raw Materials',
      materials: ['Wood', 'Paints', 'Brushes'],
      location: 'Bangalore, Karnataka',
      rating: 4.8,
      minOrder: 500,
      contact: '+91 9876543211'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{sellerData.name}</h2>
            <p className="text-gray-600">{sellerData.productType} Specialist</p>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{sellerData.rating}/5</span>
              <span className="text-sm text-gray-400 ml-2">({sellerData.totalOrders} orders)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{sellerData.totalOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{sellerData.completedOrders}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Success Rate</h3>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((sellerData.completedOrders / sellerData.totalOrders) * 100)}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{sellerData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">{sellerData.phone}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="text-gray-900">{sellerData.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <p className="text-gray-900">{sellerData.productType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <p className="text-gray-900">{sellerData.experience}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.deliveryAddress}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.product}</div>
                    <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const CollaborationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Find Collaborators</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by skill..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborators
            .filter(collab => collab.skill.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((collaborator) => (
            <div key={collaborator.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={collaborator.image}
                  alt={collaborator.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{collaborator.name}</h3>
                  <p className="text-sm text-primary-600">{collaborator.skill}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {collaborator.location}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  {collaborator.rating}/5
                </div>
                <div>Experience: {collaborator.experience}</div>
              </div>
              
              <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SupplyTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Raw Material Suppliers</h2>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Request Quote
          </button>
        </div>

        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{supplier.location}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{supplier.rating}/5</span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                  Contact
                </button>
              </div>
              
              <div className="mb-3">
                <h4 className="font-medium text-gray-700 mb-2">Available Materials:</h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.materials.map((material, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Min Order: ₹{supplier.minOrder}</span>
                <span>Phone: {supplier.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'collaboration', label: 'Collaboration Hub', icon: Users },
    { id: 'supply', label: 'Supply', icon: Truck }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">Handmade Nexus - Seller</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {sellerData.name}</span>
              <button className="text-gray-500 hover:text-gray-700">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                                                    ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'collaboration' && <CollaborationTab />}
            {activeTab === 'supply' && <SupplyTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
