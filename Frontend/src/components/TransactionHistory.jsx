import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';
import { Receipt, Calendar, User, Package, DollarSign, Search } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    fetchTransactionData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale =>
        sale.employee_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.sale_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSales(filtered);
    }
  }, [searchQuery, sales]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const [transactionsResponse, salesResponse] = await Promise.all([
        salesAPI.getAllTransactions(),
        salesAPI.getAllSales()
      ]);

      if (transactionsResponse.status === 'success') {
        setTransactions(transactionsResponse.transactions);
      }

      if (salesResponse.status === 'success') {
        setSales(salesResponse.sales);
        setFilteredSales(salesResponse.sales);
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsForSale = (saleId) => {
    return transactions.filter(tx => tx.sale_id === saleId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Transaction History</h3>
          <div className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-slate-600">{sales.length} Sales</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by employee or sale ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sales List */}
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => {
            const saleTransactions = getTransactionsForSale(sale.sale_id);
            const totalItems = saleTransactions.reduce((sum, tx) => sum + tx.quantity_sold, 0);
            
            return (
              <div key={sale.sale_id} className="bg-white rounded-xl p-6 shadow-lg border border-white/20">
                {/* Sale Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Sale #{sale.sale_id.slice(-8)}</h4>
                      <p className="text-sm text-slate-600">{formatDate(sale.sale_date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">${parseFloat(sale.total_amount).toFixed(2)}</p>
                    <p className="text-sm text-slate-600">{totalItems} items</p>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="flex items-center space-x-2 mb-4 p-3 bg-slate-50 rounded-lg">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">{sale.employee_username}</span>
                </div>

                {/* Transaction Details */}
                {saleTransactions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-800 mb-2">Items Sold:</h5>
                    {saleTransactions.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="h-4 w-4 text-slate-600" />
                          <div>
                            <p className="font-medium text-slate-800">{tx.product_name}</p>
                            <p className="text-sm text-slate-600">
                              {tx.quantity_sold} × ${parseFloat(tx.price_at_sale).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">
                            ${(parseFloat(tx.price_at_sale) * tx.quantity_sold).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-white/20 text-center">
            <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">No transactions found</p>
            <p className="text-slate-500">Transactions will appear here once sales are processed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
