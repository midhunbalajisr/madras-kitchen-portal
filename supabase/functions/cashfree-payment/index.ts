import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, orderData, orderId } = await req.json();
    
    const appId = Deno.env.get('CASHFREE_APP_ID=1148827fed953f04e7dfac249f37288411');
    const secretKey = Deno.env.get('CASHFREE_SECRET_KEY=cfsk_ma_prod_2335c9165dde63a616539be4a9071e1b_4ff59a5a');
    
    if (!appId || !secretKey) {
      console.error('Missing Cashfree credentials');
      throw new Error('Payment gateway not configured');
    }

    const baseUrl = 'https://api.cashfree.com/pg';
    
    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
    };

    if (action === 'create_order') {
      console.log('Creating Cashfree order:', orderData);
      
      const orderPayload = {
        order_id: orderData.orderId,
        order_amount: orderData.amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail || `${orderData.customerId}@madrasKitchen.com`,
          customer_phone: orderData.customerPhone || '9999999999',
        },
        order_meta: {
          return_url: orderData.returnUrl,
          notify_url: orderData.notifyUrl,
        },
        order_note: orderData.orderNote || 'Madras Kitchen Order',
      };

      console.log('Order payload:', JSON.stringify(orderPayload));

      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      console.log('Cashfree response:', JSON.stringify(data));

      if (!response.ok) {
        console.error('Cashfree API error:', data);
        throw new Error(data.message || 'Failed to create order');
      }

      return new Response(JSON.stringify({
        success: true,
        orderId: data.order_id,
        paymentSessionId: data.payment_session_id,
        orderStatus: data.order_status,
        cfOrderId: data.cf_order_id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'verify_payment') {
      console.log('Verifying payment for order:', orderId);
      
      const response = await fetch(`${baseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      console.log('Payment verification response:', JSON.stringify(data));

      if (!response.ok) {
        console.error('Verification error:', data);
        throw new Error(data.message || 'Failed to verify payment');
      }

      return new Response(JSON.stringify({
        success: true,
        orderStatus: data.order_status,
        orderAmount: data.order_amount,
        paymentStatus: data.order_status === 'PAID' ? 'SUCCESS' : data.order_status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in cashfree-payment function:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
