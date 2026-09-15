import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Eye, ExternalLink, X, Package, CheckCircle2, Clock, Truck, Ban } from 'lucide-react';
import { getAllOrdersForAdmin, updateOrderStatus } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './ManageOrdersPage.module.css';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingId, setIsUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getAllOrdersForAdmin();
    setOrders(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Compute Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const processing = orders.filter(o => (o.order_status || '').toLowerCase() === 'processing').length;
    const delivered = orders.filter(o => (o.order_status || '').toLowerCase() === 'delivered').length;
    return { totalOrders, totalRevenue, processing, delivered };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchFilter = statusFilter === 'all' || (order.order_status || '').toLowerCase() === statusFilter.toLowerCase();
      
      const search = searchTerm.toLowerCase().trim();
      if (!search) return matchFilter;

      const orderNumber = (order.order_number || '').toLowerCase();
      const customerName = `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.toLowerCase();
      const customerEmail = (order.customer_email || '').toLowerCase();
      const customerPhone = (order.customer_phone || '').toLowerCase();

      const matchSearch = orderNumber.includes(search) || 
                          customerName.includes(search) || 
                          customerEmail.includes(search) ||
                          customerPhone.includes(search);

      return matchFilter && matchSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  // Status Change Handler
  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
      }
    } else {
      alert('Failed to update order status. Please check connection.');
    }
    setIsUpdatingId(null);
  };

  const getStatusStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'processing':
        return styles.statusProcessing;
      case 'shipped':
        return styles.statusShipped;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders Management</h1>
          <p className={styles.pageSubtitle}>Monitor customer orders, fulfillment tracking, and payment statuses.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnRefresh} onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Orders</span>
          <span className={styles.metricValue}>{metrics.totalOrders}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Revenue</span>
          <span className={styles.metricValue}>{formatCurrency(metrics.totalRevenue)}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>In Processing</span>
          <span className={styles.metricValue} style={{ color: '#d97706' }}>{metrics.processing}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Completed / Delivered</span>
          <span className={styles.metricValue} style={{ color: '#16a34a' }}>{metrics.delivered}</span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text"
            className={styles.searchInput}
            placeholder="Search by order #, customer, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(tab => (
            <button
              key={tab}
              className={`${styles.filterTab} ${statusFilter === tab ? styles.filterTabActive : ''}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.emptyBox}>Loading orders from Supabase...</div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyBox}>No orders found matching criteria.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const items = order.items || [];
                const customerName = `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() || 'Customer';

                return (
                  <tr key={order.id}>
                    <td>
                      <div className={styles.orderNumText}>{order.order_number}</div>
                      <div className={styles.orderDateText}>
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td>
                      <div className={styles.customerName}>{customerName}</div>
                      <div className={styles.customerEmail}>{order.customer_email}</div>
                    </td>

                    <td>
                      <div className={styles.itemsThumbList}>
                        {items.slice(0, 3).map((it, idx) => (
                          <img 
                            key={it.id || idx}
                            src={it.image_url || '/placeholder.svg'} 
                            alt={it.product_name} 
                            className={styles.itemThumbSmall}
                            title={`${it.product_name} (${it.size ? `Size ${it.size}, ` : ''}Qty ${it.quantity})`}
                          />
                        ))}
                        {items.length > 3 && (
                          <span className={styles.moreItemsCount}>+{items.length - 3}</span>
                        )}
                        <span style={{ fontSize: '11px', color: '#666', marginLeft: '4px' }}>
                          {items.reduce((s, it) => s + (it.quantity || 1), 0)} items
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: '#111' }}>
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>

                    <td>
                      <div style={{ textTransform: 'capitalize', fontSize: '12px', fontWeight: 500 }}>
                        {order.payment_method === 'cards' ? (
                          <span>{order.stripe_card_brand ? `${order.stripe_card_brand.toUpperCase()} •••• ${order.stripe_card_last4 || ''}` : 'Card'}</span>
                        ) : order.payment_method === 'promptpay' ? (
                          <span>PromptPay QR</span>
                        ) : (
                          <span>{order.payment_method}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '10px', color: '#16a34a', textTransform: 'uppercase', fontWeight: 600 }}>
                        {order.payment_status || 'Paid'}
                      </div>
                    </td>

                    <td>
                      <select 
                        className={`${styles.statusDropdown} ${getStatusStyle(order.order_status)}`}
                        value={order.order_status || 'processing'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdatingId === order.id}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <div className={styles.actionBtns}>
                        <button 
                          className={styles.btnAction}
                          onClick={() => setSelectedOrder(order)}
                          title="View Order Details"
                        >
                          <Eye size={13} style={{ marginRight: '4px' }} />
                          Details
                        </button>
                        <a 
                          href={`/order-success?order=${order.order_number}`}
                          target="_blank" 
                          rel="noreferrer"
                          className={styles.btnAction}
                          title="View Customer Confirmation Slip"
                        >
                          <ExternalLink size={13} style={{ marginRight: '4px' }} />
                          Receipt
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedOrder(null)}>
              <X size={20} />
            </button>

            <div>
              <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Order Details
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111', margin: '4px 0 0 0' }}>
                {selectedOrder.order_number}
              </h2>
              <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>
                Placed on {new Date(selectedOrder.created_at).toLocaleString('en-GB')}
              </p>
            </div>

            {/* Customer & Shipping Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f9fafb', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#374151' }}>Customer</strong>
                <div>{selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</div>
                <div style={{ color: '#6b7280' }}>{selectedOrder.customer_email}</div>
                <div style={{ color: '#6b7280' }}>{selectedOrder.customer_phone}</div>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#374151' }}>Shipping Address</strong>
                <div>{selectedOrder.shipping_address}</div>
                <div>{selectedOrder.shipping_country}</div>
                <div style={{ color: '#6b7280', marginTop: '2px' }}>Method: {selectedOrder.delivery_method}</div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111' }}>
                Purchased Items ({(selectedOrder.items || []).length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={it.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                    <img 
                      src={it.image_url || '/placeholder.svg'} 
                      alt={it.product_name} 
                      style={{ width: '48px', height: '64px', objectFit: 'contain', background: '#f9fafb', borderRadius: '4px' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '13px', color: '#111' }}>{it.product_name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                        {it.variant_name ? `Variant: ${it.variant_name}` : ''} {it.size ? `• Size: ${it.size}` : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        Qty: {it.quantity} × ${Number(it.unit_price).toLocaleString('en-US')}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>
                      ${Number(it.total_price || (it.unit_price * it.quantity)).toLocaleString('en-US')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Status Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Fulfillment Status</span>
                <div style={{ marginTop: '6px' }}>
                  <select 
                    className={`${styles.statusDropdown} ${getStatusStyle(selectedOrder.order_status)}`}
                    value={selectedOrder.order_status || 'processing'}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Total Amount Paid</span>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#111' }}>
                  {formatCurrency(selectedOrder.total_amount)}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageOrdersPage;
