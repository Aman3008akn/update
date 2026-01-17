/**
 * Email Notification Service for Order Updates
 * Handles sending professional emails for order lifecycle events
 */

interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  created_at?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  cancel_reason?: string;
}

interface EmailNotificationParams {
  to: string;
  type: 'order_received' | 'order_shipped' | 'order_delivered' | 'order_cancelled';
  order_data: OrderData;
  custom_subject?: string;
  custom_message?: string;
}

export class EmailNotificationService {
  private static readonly EMAIL_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-notification`;
  
  /**
   * Send order received notification
   */
  static async sendOrderReceived(orderData: OrderData): Promise<boolean> {
    try {
      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: orderData.customer_email,
          type: 'order_received',
          order_data: orderData,
          subject: `Order Received - ${orderData.id}`,
        }),
      });

      const result = await response.json();
      console.log('Order received email sent:', result);
      return response.ok;
    } catch (error) {
      console.error('Error sending order received email:', error);
      return false;
    }
  }

  /**
   * Send order shipped notification
   */
  static async sendOrderShipped(orderData: OrderData): Promise<boolean> {
    try {
      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: orderData.customer_email,
          type: 'order_shipped',
          order_data: orderData,
          subject: `Order Shipped - ${orderData.id}`,
        }),
      });

      const result = await response.json();
      console.log('Order shipped email sent:', result);
      return response.ok;
    } catch (error) {
      console.error('Error sending order shipped email:', error);
      return false;
    }
  }

  /**
   * Send order delivered notification
   */
  static async sendOrderDelivered(orderData: OrderData): Promise<boolean> {
    try {
      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: orderData.customer_email,
          type: 'order_delivered',
          order_data: orderData,
          subject: `Order Delivered - ${orderData.id}`,
        }),
      });

      const result = await response.json();
      console.log('Order delivered email sent:', result);
      return response.ok;
    } catch (error) {
      console.error('Error sending order delivered email:', error);
      return false;
    }
  }

  /**
   * Send order cancelled notification
   */
  static async sendOrderCancelled(orderData: OrderData): Promise<boolean> {
    try {
      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: orderData.customer_email,
          type: 'order_cancelled',
          order_data: orderData,
          subject: `Order Cancelled - ${orderData.id}`,
        }),
      });

      const result = await response.json();
      console.log('Order cancelled email sent:', result);
      return response.ok;
    } catch (error) {
      console.error('Error sending order cancelled email:', error);
      return false;
    }
  }

  /**
   * Generic method to send any type of email notification
   */
  static async sendNotification(params: EmailNotificationParams): Promise<boolean> {
    try {
      const response = await fetch(this.EMAIL_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: params.to,
          type: params.type,
          order_data: params.order_data,
          subject: params.custom_subject || this.getDefaultSubject(params.type),
        }),
      });

      const result = await response.json();
      console.log(`${params.type} email sent:`, result);
      return response.ok;
    } catch (error) {
      console.error(`Error sending ${params.type} email:`, error);
      return false;
    }
  }

  private static getDefaultSubject(type: string): string {
    switch (type) {
      case 'order_received': return 'Order Received';
      case 'order_shipped': return 'Order Shipped';
      case 'order_delivered': return 'Order Delivered';
      case 'order_cancelled': return 'Order Cancelled';
      default: return 'Order Update';
    }
  }
}