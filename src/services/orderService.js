import { supabase } from '../lib/supabaseClient';

/**
 * Parses numeric price from string or number
 */
const parseNumericPrice = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  const cleaned = priceVal.toString().replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Saves a completed customer order and its items into Supabase,
 * and automatically triggers inventory stock deduction.
 *
 * @param {Object} params
 * @param {Object} params.orderData - Order summary and customer details
 * @param {Array} params.cartItems - Purchased cart items
 * @returns {Promise<{success: boolean, order?: Object, error?: any}>}
 */
export async function createOrderInSupabase({ orderData, cartItems }) {
  try {
    const subtotal = parseNumericPrice(orderData.totals?.subtotal || orderData.totals?.total);
    const shipping = parseNumericPrice(orderData.totals?.shipping || 0);
    const total = parseNumericPrice(orderData.totals?.total);

    // 1. Prepare and insert Order Record
    const orderRecord = {
      order_number: orderData.orderNumber,
      customer_email: orderData.customer?.email || 'customer@sol.com',
      customer_first_name: orderData.customer?.firstName || '',
      customer_last_name: orderData.customer?.lastName || '',
      customer_phone: orderData.customer?.phone || '',
      gender: orderData.customer?.gender || 'Mr',
      shipping_address: orderData.customer?.address || '',
      shipping_country: orderData.customer?.country || 'Thailand',
      delivery_method: orderData.customer?.deliveryMethod || 'Express (Free)',
      payment_method: orderData.paymentMethod || 'cards',
      payment_status: 'paid',
      order_status: 'processing',
      subtotal_amount: subtotal,
      shipping_amount: shipping,
      total_amount: total,
      currency: 'USD',
      stripe_payment_id: orderData.stripeDetails?.id || null,
      stripe_card_brand: orderData.stripeDetails?.brand || null,
      stripe_card_last4: orderData.stripeDetails?.last4 || null,
      metadata: {
        deliveryDateEstimate: orderData.deliveryDate,
        orderDateFormatted: orderData.orderDate,
        source: 'SOL Storefront Web'
      }
    };

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderRecord])
      .select()
      .single();

    if (orderError) {
      console.error('Failed to insert order in Supabase:', orderError);
      return { success: false, error: orderError };
    }

    // 2. Prepare and insert Order Items Records
    if (cartItems && cartItems.length > 0) {
      const itemsToInsert = cartItems.map(item => {
        const unitPrice = parseNumericPrice(item.price);
        const qty = item.quantity || 1;
        return {
          order_id: createdOrder.id,
          product_id: item.id ? String(item.id) : null,
          product_name: item.name || 'SOL Product',
          variant_name: item.variant?.name || item.color || null,
          size: item.size || item.selectedSize || null,
          quantity: qty,
          unit_price: unitPrice,
          total_price: unitPrice * qty,
          image_url: item.image || item.variant?.images?.[0] || item.coverImage || null
        };
      });

      const { data: createdItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert)
        .select();

      if (itemsError) {
        console.error('Failed to insert order items in Supabase:', itemsError);
      }

      // 3. Automated Stock Deduction for purchased products
      for (const item of cartItems) {
        if (item.id) {
          try {
            await supabase.rpc('deduct_product_stock', {
              p_product_id: String(item.id),
              p_quantity: item.quantity || 1
            });
          } catch (rpcErr) {
            console.warn(`Could not deduct stock for product ${item.id}:`, rpcErr);
          }
        }
      }

      return { 
        success: true, 
        order: createdOrder, 
        items: createdItems || itemsToInsert 
      };
    }

    return { success: true, order: createdOrder, items: [] };
  } catch (err) {
    console.error('Unexpected error in createOrderInSupabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetches an order and its items by order_number
 * @param {string} orderNumber
 */
export async function getOrderByNumber(orderNumber) {
  try {
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderErr || !order) return null;

    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    return {
      ...order,
      items: items || []
    };
  } catch (err) {
    console.error('Error fetching order by number:', err);
    return null;
  }
}

/**
 * Fetches all orders for a customer email (for Customer Account History)
 * @param {string} email
 */
export async function getOrdersByCustomerEmail(email) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }

    return orders || [];
  } catch (err) {
    console.error('Unexpected error fetching customer orders:', err);
    return [];
  }
}

/**
 * Fetches all orders with item count for the admin dashboard
 */
export async function getAllOrdersForAdmin() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin orders:', error);
      return [];
    }

    return orders || [];
  } catch (err) {
    console.error('Unexpected error in getAllOrdersForAdmin:', err);
    return [];
  }
}

/**
 * Updates an order status (e.g. processing, shipped, delivered, cancelled)
 * @param {string} orderId
 * @param {string} newStatus
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        order_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error };
    }

    return { success: true, order: data };
  } catch (err) {
    console.error('Unexpected error in updateOrderStatus:', err);
    return { success: false, error: err };
  }
}
