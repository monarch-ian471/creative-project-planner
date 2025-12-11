<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Heart, ShoppingCart, Eye, Star, Filter, Grid, LayoutGrid } from 'lucide-vue-next'
import axios from 'axios'

// Product Interface
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  seller: {
    _id: string;
    name: string;
    avatar: string;
    rating: number;
    totalSales: number;
  };
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  tags: string[];
  createdAt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// State
const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)
const showProductModal = ref(false)
const filter = ref('All')
const viewMode = ref<'grid' | 'large-grid'>('grid')
const cartItems = ref<CartItem[]>([])
const showCart = ref(false)
const loading = ref(false)

// Computed
const categories = computed(() => {
  const cats = ['All', ...new Set(products.value.map(p => p.category))]
  return cats
})

const filteredProducts = computed(() => 
  filter.value === 'All' 
    ? products.value 
    : products.value.filter(product => product.category === filter.value)
)

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
})

const cartItemsCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Methods
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/community/products')
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to mock data if API fails
    products.value = []
  } finally {
    loading.value = false
  }
}

const openProductDetail = (product: Product) => {
  selectedProduct.value = product
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

const addToCart = (product: Product) => {
  const existingItem = cartItems.value.find(item => item.product._id === product._id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({ product, quantity: 1 })
  }
  showCart.value = true
}

const removeFromCart = (productId: string) => {
  const index = cartItems.value.findIndex(item => item.product._id === productId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const updateQuantity = (productId: string, newQuantity: number) => {
  const item = cartItems.value.find(item => item.product._id === productId)
  if (item && newQuantity > 0) {
    item.quantity = newQuantity
  } else if (newQuantity === 0) {
    removeFromCart(productId)
  }
}

const proceedToCheckout = () => {
  // This will integrate with Stripe/payment gateway
  alert('Checkout functionality will be integrated with Stripe and other payment gateways')
}

const addProductReview = async (productId: string, rating: number, comment: string) => {
  try {
    await axios.post(`/api/community/products/${productId}/reviews`, {
      rating,
      comment
    })
    // Refresh product details
    await fetchProducts()
  } catch (error) {
    console.error('Error adding review:', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-custom-teal via-custom-peach to-custom-lime bg-clip-text text-transparent">
          Creative Marketplace
        </h1>
        <p class="text-gray-300 text-lg max-w-2xl mx-auto">
          Discover unique creative projects from talented makers. Support creators and find inspiration.
        </p>
      </header>

      <!-- Filters and Controls -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="filter = cat"
            :class="`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === cat 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`"
          >
            {{ cat }}
          </button>
        </div>

        <!-- View Mode and Cart -->
        <div class="flex items-center gap-3">
          <button 
            @click="viewMode = 'grid'"
            :class="`p-3 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`"
          >
            <Grid :size="20" />
          </button>
          <button 
            @click="viewMode = 'large-grid'"
            :class="`p-3 rounded-lg transition-all ${
              viewMode === 'large-grid' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`"
          >
            <LayoutGrid :size="20" />
          </button>
          
          <!-- Cart Button -->
          <button 
            @click="showCart = !showCart"
            class="relative p-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white transition-all"
          >
            <ShoppingCart :size="20" />
            <span 
              v-if="cartItemsCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartItemsCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div 
        v-if="!loading"
        :class="`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`"
      >
        <div 
          v-for="product in filteredProducts" 
          :key="product._id" 
          class="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          @click="openProductDetail(product)"
        >
          <!-- Product Image -->
          <div class="relative aspect-square overflow-hidden bg-gray-800">
            <img 
              :src="product.images[0]" 
              :alt="product.title" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Quick Actions -->
            <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart :size="18" class="text-red-500" />
              </button>
              <button class="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Eye :size="18" class="text-blue-500" />
              </button>
            </div>

            <!-- Stock Badge -->
            <div 
              v-if="!product.inStock"
              class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              Out of Stock
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-5">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 flex-1">
                {{ product.title }}
              </h3>
            </div>
            
            <p class="text-gray-400 text-sm mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Rating -->
            <div class="flex items-center gap-1 mb-3">
              <Star :size="14" class="fill-yellow-400 text-yellow-400" />
              <span class="text-sm text-gray-300">{{ product.rating }}</span>
              <span class="text-xs text-gray-500">({{ product.reviewsCount }})</span>
            </div>

            <!-- Seller Info -->
            <div class="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
              <img 
                :src="product.seller.avatar" 
                :alt="product.seller.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-300 truncate">{{ product.seller.name }}</p>
                <p class="text-xs text-gray-500">{{ product.seller.totalSales }} sales</p>
              </div>
            </div>

            <!-- Price and Add to Cart -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-white">MWK {{ product.price.toLocaleString() }}</p>
              </div>
              <button 
                @click.stop="addToCart(product)"
                :disabled="!product.inStock"
                class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <ShoppingCart :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        <p class="text-gray-400 mt-4">Loading products...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No products found in this category.</p>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showProductModal && selectedProduct"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        @click.self="closeProductModal"
      >
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl transform transition-all">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-gray-900/95 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-gray-700 z-10">
            <h2 class="text-2xl font-bold text-white">Product Details</h2>
            <button 
              @click="closeProductModal"
              class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X :size="24" class="text-gray-400" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Images -->
              <div>
                <div class="aspect-square rounded-xl overflow-hidden bg-gray-800 mb-4">
                  <img 
                    :src="selectedProduct.images[0]" 
                    :alt="selectedProduct.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <div 
                    v-for="(image, index) in selectedProduct.images.slice(1)" 
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                  >
                    <img 
                      :src="image" 
                      :alt="`${selectedProduct.title} ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <!-- Details -->
              <div>
                <h1 class="text-3xl font-bold text-white mb-4">{{ selectedProduct.title }}</h1>
                
                <div class="flex items-center gap-2 mb-6">
                  <div class="flex items-center gap-1">
                    <Star :size="18" class="fill-yellow-400 text-yellow-400" />
                    <span class="text-white font-semibold">{{ selectedProduct.rating }}</span>
                  </div>
                  <span class="text-gray-400">({{ selectedProduct.reviewsCount }} reviews)</span>
                  <span 
                    :class="`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.inStock 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`"
                  >
                    {{ selectedProduct.inStock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </div>

                <p class="text-gray-300 text-lg mb-6 leading-relaxed">
                  {{ selectedProduct.description }}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <span 
                    v-for="tag in selectedProduct.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <!-- Seller Card -->
                <div class="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                  <p class="text-sm text-gray-400 mb-3">Sold by</p>
                  <div class="flex items-center gap-3">
                    <img 
                      :src="selectedProduct.seller.avatar" 
                      :alt="selectedProduct.seller.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex-1">
                      <h3 class="text-white font-semibold">{{ selectedProduct.seller.name }}</h3>
                      <div class="flex items-center gap-2 text-sm text-gray-400">
                        <Star :size="14" class="fill-yellow-400 text-yellow-400" />
                        <span>{{ selectedProduct.seller.rating }}</span>
                        <span>•</span>
                        <span>{{ selectedProduct.seller.totalSales }} sales</span>
                      </div>
                    </div>
                    <button class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>

                <!-- Price and Actions -->
                <div class="border-t border-gray-700 pt-6">
                  <div class="flex items-center justify-between mb-6">
                    <div>
                      <p class="text-sm text-gray-400 mb-1">Price</p>
                      <p class="text-4xl font-bold text-white">MWK {{ selectedProduct.price.toLocaleString() }}</p>
                    </div>
                  </div>

                  <div class="flex gap-4">
                    <button 
                      @click="addToCart(selectedProduct)"
                      :disabled="!selectedProduct.inStock"
                      class="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart :size="20" />
                      Add to Cart
                    </button>
                    <button class="p-4 bg-gray-700 text-white rounded-xl hover:bg-red-500 transition-colors">
                      <Heart :size="20" />
                    </button>
                  </div>
                </div>

                <!-- Payment Methods Info -->
                <div class="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p class="text-sm text-gray-400 mb-2">Accepted Payment Methods</p>
                  <div class="flex gap-3">
                    <div class="px-3 py-2 bg-gray-700 rounded text-xs text-gray-300">Stripe</div>
                    <div class="px-3 py-2 bg-gray-700 rounded text-xs text-gray-300">PayPal</div>
                    <div class="px-3 py-2 bg-gray-700 rounded text-xs text-gray-300">Card</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Section (Placeholder) -->
            <div class="mt-8 border-t border-gray-700 pt-8">
              <h3 class="text-2xl font-bold text-white mb-6">Customer Reviews</h3>
              <div class="text-center py-8 text-gray-400">
                <p>Reviews will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Shopping Cart Sidebar -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="showCart"
        class="fixed top-0 right-0 h-full w-full md:w-96 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-700"
      >
        <!-- Cart Header -->
        <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">Shopping Cart</h2>
          <button 
            @click="showCart = false"
            class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X :size="24" class="text-gray-400" />
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="cartItems.length === 0" class="text-center py-20">
            <ShoppingCart :size="64" class="text-gray-600 mx-auto mb-4" />
            <p class="text-gray-400">Your cart is empty</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="item in cartItems" 
              :key="item.product._id"
              class="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div class="flex gap-4">
                <img 
                  :src="item.product.images[0]" 
                  :alt="item.product.title"
                  class="w-20 h-20 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-semibold mb-1 truncate">{{ item.product.title }}</h3>
                  <p class="text-gray-400 text-sm mb-2">MWK {{ item.product.price.toLocaleString() }}</p>
                  
                  <div class="flex items-center gap-2">
                    <button 
                      @click="updateQuantity(item.product._id, item.quantity - 1)"
                      class="w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span class="text-white w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.product._id, item.quantity + 1)"
                      class="w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                    <button 
                      @click="removeFromCart(item.product._id)"
                      class="ml-auto text-red-400 hover:text-red-500 transition-colors"
                    >
                      <X :size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div v-if="cartItems.length > 0" class="p-6 border-t border-gray-700 bg-gray-900">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-400">Subtotal</span>
            <span class="text-2xl font-bold text-white">MWK {{ cartTotal.toLocaleString() }}</span>
          </div>
          <button 
            @click="proceedToCheckout"
            class="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </transition>

    <!-- Cart Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showCart"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        @click="showCart = false"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
