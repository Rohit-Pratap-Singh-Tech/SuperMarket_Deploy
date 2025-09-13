import axios from 'axios';

// API Base URL - automatically switches between development and production
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL_PROD || 'https://store-management-backend.onrender.com')
  : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (only for user-related endpoints)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log('Request URL:', config.url);
  console.log('Token available:', !!token);
  console.log('Full request config:', config);

  // Temporarily disable authentication headers for testing
  // TODO: Re-enable when backend authentication is fixed
  /*
  if (token && (
    config.url.includes('/users/') || 
    config.url.includes('/admin/')
  )) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added Authorization header for:', config.url);
    console.log('Headers after adding auth:', config.headers);
  } else {
    console.log('No Authorization header added for:', config.url);
  }
  */

  console.log('No Authorization header added (temporarily disabled for testing)');
  return config;
});

// Health check function to test backend connectivity
export const healthCheck = async () => {
  try {
    console.log('Testing backend connectivity...');
    const response = await api.get('/users/list/');
    console.log('Backend is reachable, response:', response.status);
    return true;
  } catch (error) {
    console.error('Backend connectivity test failed:', error.response?.status, error.message);
    return false;
  }
};

// Product API functions
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/api/product/list`);
      const response = await api.get('/api/product/list');
      console.log('Products response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const response = await api.post('/api/product/add', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productData) => {
    try {
      const response = await api.put('/api/product/update', productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Update product stock (for sales)
  updateProductStock: async (productName, newQuantity) => {
    try {
      const response = await api.put('/api/product/update', {
        product_name: productName,
        quantity_in_stock: newQuantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productName) => {
    try {
      const response = await api.delete('/api/product/delete', {
        data: { product_name: productName }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Search product by name
  searchProduct: async (productName) => {
    try {
      const response = await api.get('/api/product/search', {
        data: { product_name: productName }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching product:', error);
      throw error;
    }
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/api/category/list`);
      const response = await api.get('/api/category/list');
      console.log('Categories response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Add new category
  addCategory: async (categoryData) => {
    try {
      console.log('Adding category with data:', categoryData);
      console.log('Request headers:', api.defaults.headers);
      const response = await api.post('/api/category/add', categoryData);
      console.log('Category added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryData) => {
    try {
      const response = await api.put('/api/category/update', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryName) => {
    try {
      const response = await api.delete('/api/category/delete', {
        data: { category_name: categoryName }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Search category by name
  searchCategory: async (categoryName) => {
    try {
      const response = await api.get('/api/category/search', {
        data: { category_name: categoryName }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching category:', error);
      throw error;
    }
  },
};

// Sales and Transaction API functions
export const salesAPI = {
  // Get all sales
  getAllSales: async () => {
    try {
      const response = await api.get('/api/sale/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  // Add new sale
  addSale: async (saleData) => {
    try {
      const response = await api.post('/api/sale/add', saleData);
      return response.data;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  },

  // Search sale by ID
  searchSale: async (saleId) => {
    try {
      const response = await api.get(`/api/sale/search?sale_id=${saleId}`);
      return response.data;
    } catch (error) {
      console.error('Error searching sale:', error);
      throw error;
    }
  },

  // Get sales statistics
  getSalesStats: async () => {
    try {
      // Return empty data since backend doesn't have sales endpoints yet
      return {
        totalSales: 0,
        totalTransactions: 0,
        averageTicket: 0,
        itemsSold: 0,
        recentTransactions: []
      };
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      throw error;
    }
  },

  // Transaction API functions
  // Add new transaction with multiple items
  addTransaction: async (transactionData) => {
    try {
      const response = await api.post('/api/transaction/add', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Get all transactions
  getAllTransactions: async () => {
    try {
      const response = await api.get('/api/transaction/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Search transactions by employee
  getEmployeeTransactions: async (employeeUsername) => {
    try {
      const response = await api.get('/api/transaction/employee_transaction', {
        data: { employee_username: employeeUsername }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee transactions:', error);
      throw error;
    }
  },

  // Get sales statistics with real data
  getSalesStats: async () => {
    try {
      const [salesResponse, transactionsResponse] = await Promise.all([
        salesAPI.getAllSales(),
        salesAPI.getAllTransactions()
      ]);

      const sales = salesResponse.status === 'success' ? salesResponse.sales : [];
      const transactions = transactionsResponse.status === 'success' ? transactionsResponse.transactions : [];

      const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
      const totalTransactions = sales.length;
      const averageTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0;
      const itemsSold = transactions.reduce((sum, tx) => sum + tx.quantity_sold, 0);

      return {
        totalSales,
        totalTransactions,
        averageTicket,
        itemsSold,
        recentTransactions: sales.slice(0, 10).map(sale => ({
          id: sale.sale_id,
          customer: sale.employee_username,
          amount: parseFloat(sale.total_amount),
          time: new Date(sale.sale_date).toLocaleString(),
          items: transactions.filter(tx => tx.sale_id === sale.sale_id).reduce((sum, tx) => sum + tx.quantity_sold, 0),
          status: 'Completed'
        }))
      };
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      throw error;
    }
  },

  // Get sales for this week
  getSalesThisWeek: async () => {
    try {
      const response = await api.get('/api/sale/sell_this_week');
      return response.data;
    } catch (error) {
      console.error('Error fetching this week sales:', error);
      throw error;
    }
  },

  // Get sales for this month
  getSalesThisMonth: async () => {
    try {
      const response = await api.get('/api/sale/sell_this_month');
      return response.data;
    } catch (error) {
      console.error('Error fetching this month sales:', error);
      throw error;
    }
  },

  // Get sales for this year
  getSalesThisYear: async () => {
    try {
      const response = await api.get('/api/sale/sell_this_year');
      return response.data;
    } catch (error) {
      console.error('Error fetching this year sales:', error);
      throw error;
    }
  },

  // Get sales grouped by week (all time)
  getSalesPerWeek: async () => {
    try {
      const response = await api.get('/api/sale/sell_per_week');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales per week:', error);
      throw error;
    }
  },

  // Get sales grouped by month (all time)
  getSalesPerMonth: async () => {
    try {
      const response = await api.get('/api/sale/sell_per_month');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales per month:', error);
      throw error;
    }
  },

  // Get sales grouped by year (all time)
  getSalesPerYear: async () => {
    try {
      const response = await api.get('/api/sale/sell_per_year');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales per year:', error);
      throw error;
    }
  },
};

// Dashboard Stats API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Return empty data since backend doesn't have these endpoints yet
      return {
        totalProducts: 0,
        totalCategories: 0,
        totalSales: 0,
        totalOrders: 0,
        lowStockItems: 0,
        recentTransactions: []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories()
      ]);

      const products = productsResponse.status === 'success' ? productsResponse.products : [];
      const categories = categoriesResponse || [];

      const lowStockItems = products.filter(product => product.quantity_in_stock <= 5).length;
      const outOfStockItems = products.filter(product => product.quantity_in_stock <= 0).length;

      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        lowStockItems,
        outOfStockItems,
        products,
        categories
      };
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  },

  // Get sales statistics
  getSalesStats: async () => {
    try {
      // Return empty data since backend doesn't have sales endpoints yet
      return {
        totalSales: 0,
        totalTransactions: 0,
        averageTicket: 0,
        itemsSold: 0,
        recentTransactions: []
      };
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      throw error;
    }
  },
};

// User API functions
export const userAPI = {
  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      console.log('=== STARTING USER FETCH ===');
      console.log('Fetching users from backend...');
      console.log('API base URL:', API_BASE_URL);
      console.log('Full URL will be:', `${API_BASE_URL}/users/list/`);
      
      const response = await api.get('/users/list/');
      console.log('=== BACKEND RESPONSE SUCCESS ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== USER FETCH ERROR ===');
      console.error('Error fetching users from backend:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Don't return fallback data - let the error propagate
      throw error;
    }
  },

  // Register new staff member (admin only)
  registerStaff: async (userData) => {
    try {
      const response = await api.post('/users/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering staff:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (username) => {
    try {
      const response = await api.post('/users/delete/', { username });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/users/password/change/', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};

export const aiAPI = {
  askAssistant: async (query) => {
    try {
      const response = await api.post('/ai/assistant/', { query });
      return response.data;
    } catch (error) {
      console.error('Error querying AI assistant:', error);
      throw error;
    }
  },
};

export default api;
