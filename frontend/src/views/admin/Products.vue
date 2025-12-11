<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Package, Search, Star, Eye, Edit2, Trash2, CheckCircle, XCircle, DollarSign, TrendingUp, ShoppingCart } from 'lucide-vue-next'
import axios from 'axios'

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  sales: number;
  views: number;
  rating: number;
  createdAt: string;
}

const products = ref<Product[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'pending' | 'approved' | 'rejected' | 'featured'>('all')
const selectedProduct = ref<Product | null>(null)
const showDetailModal = ref(false)

// Computed filtered products
const filteredProducts = computed(() => {
  let filtered = products.value

  // Apply status filter
  if (selectedFilter.value !== 'all') {
    if (selectedFilter.value === 'featured') {
      filtered = filtered.filter(p => p.featured)
    } else {
      filtered = filtered.filter(p => p.status === selectedFilter.value)
    }
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Stats
const productStats = computed(() => ({
  total: products.value.length,
  pending: products.value.filter(p => p.status === 'pending').length,
  approved: products.value.filter(p => p.status === 'approved').length,
  featured: products.value.filter(p => p.featured).length,
  totalSales: products.value.reduce((sum, p) => sum + (p.sales || 0), 0),
  totalRevenue: products.value.reduce((sum, p) => sum + (p.sales || 0) * p.price, 0)
}))

// Fetch all products
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/products')
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

// Approve product
const approveProduct = async (productId: string) => {
  try {
    await axios.put(`/api/admin/products/${productId}/approve`)
    await fetchProducts()
  } catch (error) {
    console.error('Error approving product:', error)
  }
}

// Reject product
const rejectProduct = async (productId: string) => {
  const reason = prompt('Please provide a reason for rejection:')
  if (reason) {
    try {
      await axios.put(`/api/admin/products/${productId}/reject`, { reason })
      await fetchProducts()
    } catch (error) {
      console.error('Error rejecting product:', error)
    }
  }
}

// Toggle featured status
const toggleFeatured = async (product: Product) => {
  try {
    await axios.put(`/api/admin/products/${product._id}/featured`, {
      featured: !product.featured
    })
    await fetchProducts()
  } catch (error) {
    console.error('Error toggling featured status:', error)
  }
}

// Delete product
const deleteProduct = async (productId: string) => {
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    try {
      await axios.delete(`/api/admin/products/${productId}`)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

// View product details
const viewDetails = (product: Product) => {
  selectedProduct.value = product
  showDetailModal.value = true
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <Package :size="32" class="text-orange-500" />
          <h1 class="text-4xl font-bold text-white">Product Management</h1>
        </div>
        <p class="text-gray-400">Review, approve, and manage marketplace products</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div class="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-blue-400 text-xs font-medium">Total</span>
            <Package :size="16" class="text-blue-400" />
          </div>
          <p class="text-2xl font-bold text-white">{{ productStats.total }}</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-yellow-400 text-xs font-medium">Pending</span>
            <Eye :size="16" class="text-yellow-400" />
          </div>
          <p class="text-2xl font-bold text-white">{{ productStats.pending }}</p>
        </div>

        <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-green-400 text-xs font-medium">Approved</span>
            <CheckCircle :size="16" class="text-green-400" />
          </div>
          <p class="text-2xl font-bold text-white">{{ productStats.approved }}</p>
        </div>

        <div class="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-400 text-xs font-medium">Featured</span>
            <Star :size="16" class="text-purple-400" />
          </div>
          <p class="text-2xl font-bold text-white">{{ productStats.featured }}</p>
        </div>

        <div class="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-xl p-4 border border-orange-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-orange-400 text-xs font-medium">Sales</span>
            <ShoppingCart :size="16" class="text-orange-400" />
          </div>
          <p class="text-2xl font-bold text-white">{{ productStats.totalSales }}</p>
        </div>

        <div class="bg-gradient-to-br from-teal-900/30 to-teal-800/20 rounded-xl p-4 border border-teal-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-teal-400 text-xs font-medium">Revenue</span>
            <DollarSign :size="16" class="text-teal-400" />
          </div>
          <p class="text-xl font-bold text-white">{{ formatCurrency(productStats.totalRevenue) }}</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative flex-1 w-full md:w-auto">
            <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search products by name, category, or description..."
              class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <!-- Filters -->
          <div class="flex gap-2 flex-wrap">
            <button 
              @click="selectedFilter = 'all'"
              :class="selectedFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              All
            </button>
            <button 
              @click="selectedFilter = 'pending'"
              :class="selectedFilter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Pending
            </button>
            <button 
              @click="selectedFilter = 'approved'"
              :class="selectedFilter === 'approved' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Approved
            </button>
            <button 
              @click="selectedFilter = 'rejected'"
              :class="selectedFilter === 'rejected' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Rejected
            </button>
            <button 
              @click="selectedFilter = 'featured'"
              :class="selectedFilter === 'featured' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg transition-colors"
            >
              Featured
            </button>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Loading products...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
        <Package :size="48" class="mx-auto mb-4 text-gray-600" />
        <p class="text-gray-400">No products found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in filteredProducts" 
          :key="product._id"
          class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all group"
        >
          <!-- Product Image -->
          <div class="relative h-48 bg-gray-700 overflow-hidden">
            <img 
              v-if="product.images && product.images[0]"
              :src="product.images[0]" 
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Package :size="48" class="text-gray-600" />
            </div>
            
            <!-- Featured Badge -->
            <div v-if="product.featured" class="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star :size="12" />
              Featured
            </div>

            <!-- Status Badge -->
            <div class="absolute top-2 left-2">
              <span 
                :class="{
                  'bg-green-500/90 text-white': product.status === 'approved',
                  'bg-yellow-500/90 text-white': product.status === 'pending',
                  'bg-red-500/90 text-white': product.status === 'rejected'
                }"
                class="px-3 py-1 rounded-full text-xs font-bold"
              >
                {{ product.status }}
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-6">
            <div class="mb-4">
              <h3 class="text-lg font-bold text-white mb-1 line-clamp-1">{{ product.name }}</h3>
              <p class="text-sm text-gray-400 line-clamp-2">{{ product.description }}</p>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-2xl font-bold text-orange-400">{{ formatCurrency(product.price) }}</p>
                <p class="text-xs text-gray-500">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1 text-yellow-400 mb-1">
                  <Star :size="14" :fill="'currentColor'" />
                  <span class="text-sm font-medium">{{ product.rating || 0 }}</span>
                </div>
                <p class="text-xs text-gray-500">{{ product.sales || 0 }} sales</p>
              </div>
            </div>

            <div class="mb-4 pb-4 border-b border-gray-700">
              <p class="text-sm text-gray-400">
                Seller: <span class="text-white">{{ product.sellerId.firstName }} {{ product.sellerId.lastName }}</span>
              </p>
              <p class="text-xs text-gray-500">Listed {{ formatDate(product.createdAt) }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="viewDetails(product)"
                class="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye :size="16" />
                View
              </button>
              
              <button 
                v-if="product.status === 'pending'"
                @click="approveProduct(product._id)"
                class="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle :size="16" />
                Approve
              </button>

              <button 
                v-if="product.status === 'pending' || product.status === 'approved'"
                @click="rejectProduct(product._id)"
                class="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <XCircle :size="16" />
                Reject
              </button>

              <button 
                @click="toggleFeatured(product)"
                :class="product.featured ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'"
                class="py-2 px-3 rounded-lg transition-colors"
                :title="product.featured ? 'Remove from Featured' : 'Add to Featured'"
              >
                <Star :size="16" :fill="product.featured ? 'currentColor' : 'none'" />
              </button>

              <button 
                @click="deleteProduct(product._id)"
                class="py-2 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal && selectedProduct" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Product Details</h2>
          <button @click="showDetailModal = false" class="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <XCircle :size="20" class="text-gray-400" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Images -->
          <div v-if="selectedProduct.images && selectedProduct.images.length" class="grid grid-cols-3 gap-4">
            <img 
              v-for="(image, index) in selectedProduct.images" 
              :key="index"
              :src="image" 
              :alt="`${selectedProduct.name} - ${index + 1}`"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Product Name</label>
              <p class="text-white font-medium">{{ selectedProduct.name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Price</label>
              <p class="text-white font-medium">{{ formatCurrency(selectedProduct.price) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Category</label>
              <p class="text-white font-medium">{{ selectedProduct.category }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Status</label>
              <span 
                :class="{
                  'bg-green-500/20 text-green-400 border-green-500/50': selectedProduct.status === 'approved',
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/50': selectedProduct.status === 'pending',
                  'bg-red-500/20 text-red-400 border-red-500/50': selectedProduct.status === 'rejected'
                }"
                class="inline-block px-3 py-1 rounded-full text-xs font-medium border"
              >
                {{ selectedProduct.status }}
              </span>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Seller</label>
              <p class="text-white font-medium">{{ selectedProduct.sellerId.firstName }} {{ selectedProduct.sellerId.lastName }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-400 mb-1 block">Listed Date</label>
              <p class="text-white font-medium">{{ formatDate(selectedProduct.createdAt) }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="text-sm text-gray-400 mb-2 block">Description</label>
            <p class="text-white">{{ selectedProduct.description }}</p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-700/50 rounded-lg p-4 text-center">
              <p class="text-gray-400 text-sm mb-1">Sales</p>
              <p class="text-2xl font-bold text-white">{{ selectedProduct.sales || 0 }}</p>
            </div>
            <div class="bg-gray-700/50 rounded-lg p-4 text-center">
              <p class="text-gray-400 text-sm mb-1">Views</p>
              <p class="text-2xl font-bold text-white">{{ selectedProduct.views || 0 }}</p>
            </div>
            <div class="bg-gray-700/50 rounded-lg p-4 text-center">
              <p class="text-gray-400 text-sm mb-1">Rating</p>
              <p class="text-2xl font-bold text-white">{{ selectedProduct.rating || 0 }}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
