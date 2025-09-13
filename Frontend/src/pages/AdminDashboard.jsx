import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../auth";
import { dashboardAPI, userAPI, healthCheck, salesAPI, productAPI, categoryAPI } from '../services/api';
import TransactionHistory from '../components/TransactionHistory';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenue: 0,
    profit: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTicket: 0,
    itemsSold: 0,
    recentTransactions: []
  });

  const [reportsData, setReportsData] = useState({
    thisWeek: { sales_count: 0, total_amount: 0, sales: [] },
    thisMonth: { sales_count: 0, total_amount: 0, sales: [] },
    thisYear: { sales_count: 0, total_amount: 0, sales: [] },
    perWeek: [],
    perMonth: [],
    perYear: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReportsData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setStaffLoading(true);

      console.log('Starting dashboard data fetch...');

      // Fetch all data in parallel using actual API calls (excluding user list for now)
      const [productsResponse, categoriesResponse, salesData, transactionsData] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories(),
        salesAPI.getAllSales(),
        salesAPI.getAllTransactions()
      ]);

      console.log('API Responses:', {
        products: productsResponse,
        categories: categoriesResponse,
        sales: salesData,
        transactions: transactionsData
      });

      // Process products data - handle different response formats
      const products = productsResponse.status === 'success' ? productsResponse.products : [];
      const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];
      
      // Calculate inventory stats
      const lowStockItems = products.filter(product => product.quantity_in_stock <= 5).length;
      const outOfStockItems = products.filter(product => product.quantity_in_stock <= 0).length;

      setStats(prev => ({
        ...prev,
        totalProducts: products.length,
        lowStockItems: lowStockItems,
        outOfStockItems: outOfStockItems
      }));

      // Calculate total sales from actual sales data
      let totalSales = 0;
      let recentTransactions = [];
      
      if (salesData.status === 'success' && Array.isArray(salesData.sales)) {
        totalSales = salesData.sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
        
        // Get recent transactions from sales data - sort by date to get most recent first
        recentTransactions = salesData.sales
          .sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date)) // Sort by date descending
          .slice(0, 5)
          .map(sale => ({
            id: sale.sale_id,
            customer: sale.employee_username,
            amount: parseFloat(sale.total_amount),
            time: new Date(sale.sale_date).toLocaleString(),
            items: 1, // Default to 1 item per sale
            status: 'Completed'
          }));
      }

      // Calculate items sold from transactions
      let itemsSold = 0;
      if (transactionsData.status === 'success' && Array.isArray(transactionsData.transactions)) {
        itemsSold = transactionsData.transactions.reduce((sum, tx) => sum + (tx.quantity_sold || 0), 0);
      }

      setSalesStats({
        totalSales: totalSales,
        totalTransactions: salesData.status === 'success' ? salesData.sales.length : 0,
        averageTicket: salesData.status === 'success' && salesData.sales.length > 0 ? totalSales / salesData.sales.length : 0,
        itemsSold: itemsSold,
        recentTransactions: recentTransactions
      });

      // Top products by stock
      if (products.length > 0) {
        const sortedProducts = products
          .sort((a, b) => b.quantity_in_stock - a.quantity_in_stock)
          .slice(0, 4)
          .map(product => ({
            name: product.product_name,
            sales: product.quantity_in_stock,
            revenue: `$${parseFloat(product.price).toFixed(2)}`
          }));
        setTopProducts(sortedProducts);
      } else {
        setTopProducts([]);
      }

      // Set recent activities to empty array (removed as requested)
        setRecentActivities([]);

      // Set staff members (set to empty for now since user list endpoint doesn't exist)
        setStaffMembers([]);
        setNotifications(0);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setRecentActivities([]);
      setTopProducts([]);
      setStaffMembers([]);
      setNotifications(0);
      
      // More specific error message
      if (error.response?.status === 404) {
        showMessage('Backend API endpoints not found. Please check if the backend is running.', 'error');
      } else if (error.response?.status >= 500) {
        showMessage('Backend server error. Please check if the backend is running properly.', 'error');
      } else if (error.code === 'ECONNREFUSED') {
        showMessage('Cannot connect to backend server. Please ensure the backend is running on port 8000.', 'error');
      } else {
      showMessage('Failed to fetch dashboard data. Please check your backend connection.', 'error');
      }
    } finally {
      setLoading(false);
      setStaffLoading(false);
    }
  };

  const fetchReportsData = async () => {
    try {
      const [thisWeek, thisMonth, thisYear, perWeek, perMonth, perYear] = await Promise.all([
        salesAPI.getSalesThisWeek(),
        salesAPI.getSalesThisMonth(),
        salesAPI.getSalesThisYear(),
        salesAPI.getSalesPerWeek(),
        salesAPI.getSalesPerMonth(),
        salesAPI.getSalesPerYear()
      ]);

      setReportsData({
        thisWeek: thisWeek.status === 'success' ? thisWeek : { sales_count: 0, total_amount: 0, sales: [] },
        thisMonth: thisMonth.status === 'success' ? thisMonth : { sales_count: 0, total_amount: 0, sales: [] },
        thisYear: thisYear.status === 'success' ? thisYear : { sales_count: 0, total_amount: 0, sales: [] },
        perWeek: perWeek.status === 'success' ? perWeek.data || [] : [],
        perMonth: perMonth.status === 'success' ? perMonth.data || [] : [],
        perYear: perYear.status === 'success' ? perYear.data || [] : []
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      showMessage('Failed to fetch reports data. Please check your backend connection.', 'error');
    }
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sales', name: 'Sales Analytics', icon: '💰' },
    { id: 'transactions', name: 'Transactions', icon: '🧾' },
    { id: 'staff', name: 'Staff Management', icon: '👥' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const showMessage = (message, type = 'success') => {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStaffDelete = async (staffName, staffId) => {
    if (window.confirm(`Are you sure you want to delete ${staffName}?`)) {
      try {
        await userAPI.deleteUser(staffId);
        showMessage(`${staffName} has been removed from the system.`, 'success');
        fetchDashboardData();
      } catch (err) {
        showMessage(`Failed to delete ${staffName}.`, 'error');
      }
    }
  };

  const hasRequiredRole = (requiredRoles) => {
    const userRole = localStorage.getItem('userRole');
    return requiredRoles.includes(userRole);
  };

  const handleInventoryAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (hasRequiredRole(['Admin', 'Manager'])) {
      showMessage('Accessing Inventory Management...', 'success');
      setTimeout(() => {
        window.location.href = '/manager';
      }, 1000);
    } else {
      showMessage(`Access denied. Admin or Manager privileges required. Current role: ${userRole || 'Not set'}`, 'error');
    }
  };

  const handlePOSAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (hasRequiredRole(['Admin', 'Manager'])) {
      showMessage('Accessing POS System...', 'success');
      setTimeout(() => {
        window.location.href = '/cashier';
      }, 1000);
    } else {
      showMessage(`Access denied. Admin or Manager privileges required. Current role: ${userRole || 'Not set'}`, 'error');
    }
  };

  // Removed setAdminRole and getCurrentRoleStatus

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
              <p className="text-sm text-slate-500">Store Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.id === 'staff' && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {notifications}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                {localStorage.getItem('fullName') || 'Admin User'}
              </p>
              <p className="text-sm text-slate-500">
                {localStorage.getItem('username') || 'admin@store.com'}
              </p>
              <p className="text-xs text-slate-400">
                Role: {localStorage.getItem('userRole') || 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'sales' && 'Sales Analytics'}
                {activeTab === 'transactions' && 'Transaction History'}
                {activeTab === 'staff' && 'Staff Management'}
                {activeTab === 'reports' && 'Reports & Analytics'}
              </h1>
              <p className="text-slate-600 mt-1">
                {activeTab === 'overview' && 'Monitor your store performance and key metrics'}
                {activeTab === 'sales' && 'Track sales performance and revenue analytics'}
                {activeTab === 'transactions' && 'View detailed transaction history and sales records'}
                {activeTab === 'staff' && 'Manage staff accounts and permissions'}
                {activeTab === 'reports' && 'Generate detailed reports and analytics'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              {/* Role Status Display removed */}
            </div>
          </div>
        </header>

        {/* Message Display */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-lg border ${
            messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {messageType === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Products</p>
                          <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                          <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">⚠️</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Staff Members</p>
                          <p className="text-2xl font-bold text-slate-800">{staffMembers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">👥</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales Summary and Top Products */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                       <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales Summary</h3>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                               <span className="text-sm">💰</span>
                             </div>
                             <div>
                               <p className="font-medium text-slate-800">Total Revenue</p>
                               <p className="text-sm text-slate-600">{salesStats.totalTransactions} transactions</p>
                             </div>
                           </div>
                           <p className="font-semibold text-green-600">${salesStats.totalSales.toFixed(2)}</p>
                         </div>
                         
                         <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                           <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                               <span className="text-sm">📊</span>
                             </div>
                             <div>
                               <p className="font-medium text-slate-800">Average Ticket</p>
                               <p className="text-sm text-slate-600">Per transaction</p>
                             </div>
                           </div>
                           <p className="font-semibold text-blue-600">${salesStats.averageTicket.toFixed(2)}</p>
                         </div>

                         <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                               <span className="text-sm">📦</span>
                             </div>
                             <div>
                               <p className="font-medium text-slate-800">Items Sold</p>
                               <p className="text-sm text-slate-600">Total quantity</p>
                             </div>
                           </div>
                           <p className="font-semibold text-purple-600">{salesStats.itemsSold}</p>
                         </div>

                         <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                               <span className="text-sm">⚠️</span>
                              </div>
                             <div>
                               <p className="font-medium text-slate-800">Low Stock Alert</p>
                               <p className="text-sm text-slate-600">Items need attention</p>
                              </div>
                            </div>
                           <p className="font-semibold text-orange-600">{stats.lowStockItems}</p>
                          </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Products by Stock</h3>
                      <div className="space-y-3">
                        {topProducts.length > 0 ? (
                          topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{product.name}</p>
                                  <p className="text-sm text-slate-600">Stock: {product.sales}</p>
                                </div>
                              </div>
                              <p className="font-semibold text-slate-800">{product.revenue}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No products available</p>
                            <p className="text-sm text-slate-500 mt-2">Add products to see them here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                                     {/* Recent Transactions */}
                   <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                     <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
                     <div className="space-y-3">
                       {salesStats.recentTransactions && salesStats.recentTransactions.length > 0 ? (
                         salesStats.recentTransactions.map((transaction) => (
                           <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                             <div>
                               <p className="font-medium text-slate-800">{transaction.customer}</p>
                               <p className="text-sm text-slate-600">{transaction.time} • {transaction.items} items</p>
                             </div>
                             <div className="text-right">
                               <p className="font-semibold text-slate-800">${transaction.amount.toFixed(2)}</p>
                               <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                 {transaction.status}
                               </span>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-8">
                           <p className="text-slate-600">No recent transactions</p>
                           <p className="text-sm text-slate-500 mt-2">Transactions will appear here as sales are made</p>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    {/* Access Control and Set Admin Role removed */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={handleInventoryAccess}
                        className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <span className="text-2xl">📦</span>
                        <div>
                          <p className="font-medium text-slate-800">Manage Inventory</p>
                          <p className="text-sm text-slate-600">Add or update products</p>
                        </div>
                      </button>
                      <button
                        onClick={handlePOSAccess}
                        className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                      >
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-medium text-slate-800">POS System</p>
                          <p className="text-sm text-slate-600">Process transactions</p>
                        </div>
                      </button>
                      <Link
                        to="/signup"
                        className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <span className="text-2xl">👨‍💼</span>
                        <div>
                          <p className="font-medium text-slate-800">Add Staff Member</p>
                          <p className="text-sm text-slate-600">Create new staff accounts</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sales' && (
                <div className="space-y-6">
                  {/* Sales Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Transactions</p>
                          <p className="text-2xl font-bold text-slate-800">{salesStats.totalTransactions}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📊</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Average Ticket</p>
                          <p className="text-2xl font-bold text-slate-800">${salesStats.averageTicket.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📈</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Items Sold</p>
                          <p className="text-2xl font-bold text-slate-800">{salesStats.itemsSold}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {salesStats.recentTransactions && salesStats.recentTransactions.length > 0 ? (
                        salesStats.recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800">{transaction.customer}</p>
                              <p className="text-sm text-slate-600">{transaction.time} • {transaction.items} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-800">${transaction.amount.toFixed(2)}</p>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No recent transactions</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-6">
                  <TransactionHistory />
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">Staff Management</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            const isConnected = await healthCheck();
                            if (isConnected) {
                              showMessage('Backend is reachable!', 'success');
                            } else {
                              showMessage('Backend connection failed!', 'error');
                            }
                          }}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Test Backend
                        </button>
                        <button
                          onClick={() => {
                            fetchDashboardData();
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Refresh
                        </button>
                        <Link
                          to="/signup"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add New Staff
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {staffLoading ? (
                        <div className="text-center py-8">
                          <p className="text-slate-600">Loading staff data...</p>
                        </div>
                      ) : staffMembers.length > 0 ? (
                        staffMembers.map((staff, index) => (
                          <div key={staff.id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {staff.full_name ? staff.full_name.split(' ').map(n => n[0]).join('') : staff.username}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{staff.full_name || staff.username}</p>
                                <p className="text-sm text-slate-600">@{staff.username} • {staff.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                {staff.status || 'Active'}
                              </span>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleStaffDelete(staff.full_name || staff.username, staff.id)}
                              >
                                <span className="text-lg">🗑️</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No staff members found</p>
                          <p className="text-sm text-slate-500 mt-2">
                            Add staff members using the button above or check your backend connection
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  {/* Reports Header */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-800">Sales Reports & Analytics</h3>
                      <button
                        onClick={fetchReportsData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Refresh Reports
                      </button>
                    </div>
                  </div>

                  {/* Current Period Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-slate-800">This Week</h4>
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">Total Sales</p>
                        <p className="text-2xl font-bold text-slate-800">${parseFloat(reportsData.thisWeek.total_amount || 0).toFixed(2)}</p>
                        <p className="text-sm text-slate-600">Transactions: {reportsData.thisWeek.sales_count || 0}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-slate-800">This Month</h4>
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">Total Sales</p>
                        <p className="text-2xl font-bold text-slate-800">${parseFloat(reportsData.thisMonth.total_amount || 0).toFixed(2)}</p>
                        <p className="text-sm text-slate-600">Transactions: {reportsData.thisMonth.sales_count || 0}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-slate-800">This Year</h4>
                        <span className="text-2xl">📈</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">Total Sales</p>
                        <p className="text-2xl font-bold text-slate-800">${parseFloat(reportsData.thisYear.total_amount || 0).toFixed(2)}</p>
                        <p className="text-sm text-slate-600">Transactions: {reportsData.thisYear.sales_count || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Historical Data */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Trends */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">Weekly Sales Trends</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {reportsData.perWeek.length > 0 ? (
                          reportsData.perWeek.slice(-10).map((week, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-800">Week {week.week}, {week.year}</p>
                                <p className="text-sm text-slate-600">{week.sales_count} transactions</p>
                              </div>
                              <p className="font-semibold text-slate-800">${parseFloat(week.total_amount).toFixed(2)}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No weekly data available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">Monthly Sales Trends</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {reportsData.perMonth.length > 0 ? (
                          reportsData.perMonth.slice(-10).map((month, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-800">
                                  {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                                <p className="text-sm text-slate-600">{month.sales_count} transactions</p>
                              </div>
                              <p className="font-semibold text-slate-800">${parseFloat(month.total_amount).toFixed(2)}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">No monthly data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Yearly Overview */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Yearly Sales Overview</h4>
                    <div className="space-y-3">
                      {reportsData.perYear.length > 0 ? (
                        reportsData.perYear.map((year, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">{year.year}</span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{year.year}</p>
                                <p className="text-sm text-slate-600">{year.sales_count} total transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-slate-800">${parseFloat(year.total_amount).toFixed(2)}</p>
                              <p className="text-sm text-slate-600">Total Revenue</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No yearly data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Sales Details */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Sales Details</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {reportsData.thisWeek.sales && reportsData.thisWeek.sales.length > 0 ? (
                        reportsData.thisWeek.sales.map((sale, index) => (
                          <div key={sale.sale_id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800">Sale #{sale.sale_id}</p>
                              <p className="text-sm text-slate-600">
                                {sale.employee_username} • {new Date(sale.sale_date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-semibold text-slate-800">${parseFloat(sale.total_amount).toFixed(2)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-600">No recent sales data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
