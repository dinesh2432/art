const { getFirestore } = require('../services/firebaseService')
const geminiService = require('../services/geminiService')
const { deleteFile } = require('../middleware/upload')

const productController = {
  // Get all products with filtering and pagination
  getProducts: async (req, res) => {
    try {
      const db = getFirestore()
      const {
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      let query = db.collection('products').where('isActive', '==', true)

      // Apply filters
      if (category && category !== 'all') {
        query = query.where('category', '==', category)
      }

      if (minPrice) {
        query = query.where('price', '>=', parseFloat(minPrice))
      }

      if (maxPrice) {
        query = query.where('price', '<=', parseFloat(maxPrice))
      }

      // Apply sorting
      query = query.orderBy(sortBy, sortOrder)

      // Apply pagination
      const offset = (parseInt(page) - 1) * parseInt(limit)
      query = query.offset(offset).limit(parseInt(limit))

      const snapshot = await query.get()
      const products = []

      for (const doc of snapshot.docs) {
        const productData = doc.data()
        
        // Get seller info
        const sellerDoc = await db.collection('sellers').doc(productData.sellerId).get()
        const sellerData = sellerDoc.exists ? sellerDoc.data() : null

        products.push({
          id: doc.id,
          ...productData,
          seller: sellerData ? {
            id: sellerDoc.id,
            name: sellerData.name,
            location: `${sellerData.city}, ${sellerData.state}`,
            rating: sellerData.rating || 0
          } : null
        })
      }

      // Apply search filter (client-side for now, consider using search service)
      let filteredProducts = products
      if (search) {
        const searchTerm = search.toLowerCase()
        filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.seller?.name || '').toLowerCase().includes(searchTerm)
        )
      }

      // Get total count for pagination
      const totalQuery = db.collection('products').where('isActive', '==', true)
      const totalSnapshot = await totalQuery.get()
      const total = totalSnapshot.size

      res.json({
        success: true,
        data: {
          products: filteredProducts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      })
    } catch (error) {
      console.error('Get products error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products'
      })
    }
  },

  // Get single product
  getProduct: async (req, res) => {
    try {
      const { id } = req.params
      const db = getFirestore()

      const productDoc = await db.collection('products').doc(id).get()

      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      const productData = productDoc.data()

      // Get seller info
      const sellerDoc = await db.collection('sellers').doc(productData.sellerId).get()
      const sellerData = sellerDoc.exists ? sellerDoc.data() : null

      // Get reviews
      const reviewsSnapshot = await db.collection('reviews')
        .where('productId', '==', id)
        .orderBy('createdAt', 'desc')
        .get()

      const reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculate average rating
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

      // Get related products
      const relatedSnapshot = await db.collection('products')
        .where('category', '==', productData.category)
        .where('sellerId', '==', productData.sellerId)
        .where('isActive', '==', true)
        .limit(4)
        .get()

      const relatedProducts = relatedSnapshot.docs
        .filter(doc => doc.id !== id)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

      res.json({
        success: true,
        data: {
          product: {
            id: productDoc.id,
            ...productData,
            averageRating: avgRating,
            reviewCount: reviews.length,
            seller: sellerData ? {
              id: sellerDoc.id,
              name: sellerData.name,
              location: `${sellerData.city}, ${sellerData.state}`,
              rating: sellerData.rating || 0,
              totalSales: sellerData.totalSales || 0,
              memberSince: sellerData.createdAt
            } : null,
            reviews,
            relatedProducts
          }
        }
      })
    } catch (error) {
      console.error('Get product error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product'
      })
    }
  },

  // Create new product (seller only)
  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        originalPrice,
        category,
        materials,
        dimensions,
        stockCount,
        tags
      } = req.body

      const db = getFirestore()

      // Get seller info
      const sellerDoc = await db.collection('sellers').doc(req.user.id).get()
      
      if (!sellerDoc.exists) {
        return res.status(400).json({
          success: false,
          message: 'Seller profile not found'
        })
      }

      // Process uploaded images
      const images = req.files ? req.files.map(file => file.url) : []

      // Generate enhanced description using AI if enabled
      let enhancedDescription = description
      try {
        const aiDescription = await geminiService.generateProductDescription({
          name,
          category,
          materials,
          dimensions,
          artisan: sellerDoc.data().name
        })
        if (aiDescription) {
          enhancedDescription = aiDescription
        }
      } catch (error) {
        console.log('AI description generation failed, using original description')
      }

      // Generate tags using AI
      let generatedTags = tags || []
      try {
        const aiTags = await geminiService.generateProductTags({
          name,
          description: enhancedDescription,
          category
        })
        if (aiTags && aiTags.length > 0) {
          generatedTags = [...new Set([...generatedTags, ...aiTags])]
        }
      } catch (error) {
        console.log('AI tag generation failed')
      }

      const productData = {
        name,
        description: enhancedDescription,
        originalDescription: description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        materials: materials || [],
        dimensions: dimensions || '',
        stockCount: parseInt(stockCount) || 0,
        images,
        tags: generatedTags,
        sellerId: req.user.id,
        isActive: true,
        isFeatured: false,
        viewCount: 0,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const productRef = await db.collection('products').add(productData)

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          product: {
            id: productRef.id,
            ...productData
          }
        }
      })
    } catch (error) {
      console.error('Create product error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create product'
      })
    }
  },

  // Update product (seller only)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params
      const {
        name,
        description,
        price,
        originalPrice,
        category,
        materials,
        dimensions,
        stockCount,
        tags,
        isActive
      } = req.body

      const db = getFirestore()
      const productDoc = await db.collection('products').doc(id).get()

      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      const productData = productDoc.data()

      // Check if user owns the product
      if (productData.sellerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        })
      }

      // Process new uploaded images
      let images = productData.images || []
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.url)
        images = [...images, ...newImages]
      }

      const updateData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(originalPrice && { originalPrice: parseFloat(originalPrice) }),
        ...(category && { category }),
        ...(materials && { materials }),
        ...(dimensions && { dimensions }),
        ...(stockCount !== undefined && { stockCount: parseInt(stockCount) }),
        ...(tags && { tags }),
        ...(isActive !== undefined && { isActive }),
        images,
        updatedAt: new Date().toISOString()
      }

      await productDoc.ref.update(updateData)

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: {
          product: {
            id,
            ...productData,
            ...updateData
          }
        }
      })
    } catch (error) {
      console.error('Update product error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update product'
      })
    }
  },

  // Delete product (seller only)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params
      const db = getFirestore()

      const productDoc = await db.collection('products').doc(id).get()

      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      const productData = productDoc.data()

      // Check if user owns the product
      if (productData.sellerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this product'
        })
      }

      // Delete associated images
      if (productData.images && productData.images.length > 0) {
        for (const imageUrl of productData.images) {
          const filename = imageUrl.split('/').pop()
          await deleteFile(filename)
        }
      }

      // Soft delete - just mark as inactive
      await productDoc.ref.update({
        isActive: false,
        deletedAt: new Date().toISOString()
      })

      res.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      console.error('Delete product error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      })
    }
  },

  // Search products
  searchProducts: async (req, res) => {
    try {
      const { q, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        })
      }

      const db = getFirestore()
      let query = db.collection('products').where('isActive', '==', true)

      // Apply category filter
      if (category && category !== 'all') {
        query = query.where('category', '==', category)
      }

      const snapshot = await query.get()
      let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Client-side filtering for search and price range
      const searchTerm = q.toLowerCase()
      products = products.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))

        const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice)
        const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice)

        return matchesSearch && matchesMinPrice && matchesMaxPrice
      })

      // Apply pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit)
      const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit))

      // Get seller info for each product
      const productsWithSellers = await Promise.all(
        paginatedProducts.map(async (product) => {
          const sellerDoc = await db.collection('sellers').doc(product.sellerId).get()
          const sellerData = sellerDoc.exists ? sellerDoc.data() : null

          return {
            ...product,
            seller: sellerData ? {
              id: sellerDoc.id,
              name: sellerData.name,
              location: `${sellerData.city}, ${sellerData.state}`,
              rating: sellerData.rating || 0
            } : null
          }
        })
      )

      res.json({
        success: true,
        data: {
          products: productsWithSellers,
          searchQuery: q,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.length,
            totalPages: Math.ceil(products.length / parseInt(limit))
          }
        }
      })
    } catch (error) {
      console.error('Search products error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to search products'
      })
    }
  },

  // Get products by seller
  getSellerProducts: async (req, res) => {
    try {
      const { sellerId } = req.params
      const { page = 1, limit = 12, status = 'all' } = req.query

      const db = getFirestore()
      let query = db.collection('products').where('sellerId', '==', sellerId)

      if (status !== 'all') {
        query = query.where('isActive', '==', status === 'active')
      }

      query = query.orderBy('createdAt', 'desc')

      const snapshot = await query.get()
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Apply pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit)
      const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit))

      res.json({
        success: true,
        data: {
          products: paginatedProducts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.length,
            totalPages: Math.ceil(products.length / parseInt(limit))
          }
        }
      })
    } catch (error) {
      console.error('Get seller products error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch seller products'
      })
    }
  },

  // Toggle product like
  toggleLike: async (req, res) => {
    try {
      const { id } = req.params
      const db = getFirestore()

      const productDoc = await db.collection('products').doc(id).get()
      
      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      // Check if user already liked this product
      const likeDoc = await db.collection('likes')
        .where('userId', '==', req.user.id)
        .where('productId', '==', id)
        .get()

      let liked = false
      const productData = productDoc.data()

      if (likeDoc.empty) {
        // Add like
        await db.collection('likes').add({
          userId: req.user.id,
          productId: id,
          createdAt: new Date().toISOString()
        })

        await productDoc.ref.update({
          likeCount: (productData.likeCount || 0) + 1
        })

        liked = true
      } else {
        // Remove like
        await likeDoc.docs[0].ref.delete()

        await productDoc.ref.update({
          likeCount: Math.max((productData.likeCount || 0) - 1, 0)
        })

        liked = false
      }

      res.json({
        success: true,
        data: {
          liked,
          likeCount: liked 
            ? (productData.likeCount || 0) + 1 
            : Math.max((productData.likeCount || 0) - 1, 0)
        }
      })
    } catch (error) {
      console.error('Toggle like error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to toggle like'
      })
    }
  }
}

module.exports = productController
