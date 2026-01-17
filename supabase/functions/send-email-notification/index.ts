import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createTransport } from 'nodemailer'

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: 'order_received' | 'order_shipped' | 'order_delivered' | 'order_cancelled';
  order_data?: any;
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const payload: EmailPayload = await req.json()

    // Get environment variables from Deno
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com'
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587')
    const smtpUser = Deno.env.get('SMTP_USER') || ''
    const smtpPass = Deno.env.get('SMTP_PASS') || ''

    if (!smtpUser || !smtpPass) {
      return new Response(JSON.stringify({ error: 'SMTP credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create transporter
    const transporter = createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Customize email content based on type
    let subject = payload.subject
    let html = payload.html

    if (payload.type && payload.order_data) {
      switch (payload.type) {
        case 'order_received':
          subject = `Order Received - ${payload.order_data.id}`
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">🛍️ Order Received</h1>
                <p style="opacity: 0.9;">Your order has been successfully placed</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #2C3E50;">Thank You for Your Order!</h2>
                
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p><strong>Order ID:</strong> ${payload.order_data.id}</p>
                  <p><strong>Customer:</strong> ${payload.order_data.customer_name}</p>
                  <p><strong>Email:</strong> ${payload.order_data.customer_email}</p>
                  <p><strong>Phone:</strong> ${payload.order_data.customer_phone}</p>
                  <p><strong>Total Amount:</strong> ₹${payload.order_data.total_amount?.toLocaleString('en-IN')}</p>
                  <p><strong>Date:</strong> ${new Date(payload.order_data.created_at || new Date()).toLocaleString()}</p>
                </div>

                <div style="margin-top: 20px; background: #e8f4fd; padding: 15px; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Order Details:</h3>
                  <ul style="text-align: left;">
                    ${(payload.order_data.items || []).map((item: any) => `
                      <li style="margin-bottom: 8px;">
                        <strong>${item.name}</strong> - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                  <p style="margin: 0;"><strong>Next Steps:</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    We'll process your order shortly. You'll receive updates about shipping and delivery.
                  </p>
                </div>
              </div>

              <div style="background: #2C3E50; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 5px 0;">© 2026 MythManga. All rights reserved.</p>
                <p style="margin: 5px 0;">Premium Anime Merchandise Store</p>
              </div>
            </div>
          `
          break

        case 'order_shipped':
          subject = `Order Shipped - ${payload.order_data.id}`
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">✈️ Order Shipped</h1>
                <p style="opacity: 0.9;">Your order is on its way to you</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #2C3E50;">Great News! Your Order Has Been Shipped!</h2>
                
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p><strong>Order ID:</strong> ${payload.order_data.id}</p>
                  <p><strong>Tracking Number:</strong> ${payload.order_data.tracking_number || 'TK-' + Date.now()}</p>
                  <p><strong>Shipped Date:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Estimated Delivery:</strong> ${payload.order_data.estimated_delivery || '3-5 business days'}</p>
                </div>

                <div style="margin-top: 20px; background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                  <h3 style="margin-top: 0; color: #155724;">Tracking Information:</h3>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Your package is being delivered by our premium shipping partner.
                    Track your shipment using the tracking number above.
                  </p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #e7f3fe; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Order Summary:</h3>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    ${(payload.order_data.items || []).length || 0} items shipped • Total: ₹${payload.order_data.total_amount?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div style="background: #2C3E50; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 5px 0;">© 2026 MythManga. All rights reserved.</p>
                <p style="margin: 5px 0;">Premium Anime Merchandise Store</p>
              </div>
            </div>
          `
          break

        case 'order_delivered':
          subject = `Order Delivered - ${payload.order_data.id}`
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">📦 Order Delivered</h1>
                <p style="opacity: 0.9;">Your order has been delivered successfully</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #2C3E50;">Your Order Has Been Delivered!</h2>
                
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p><strong>Order ID:</strong> ${payload.order_data.id}</p>
                  <p><strong>Delivery Date:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">DELIVERED</span></p>
                </div>

                <div style="margin-top: 20px; background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                  <h3 style="margin-top: 0; color: #155724;">Package Delivered:</h3>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Your package has been delivered to the specified address.
                    If you haven't received it, please contact our support team.
                  </p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Enjoy Your Purchase!</h3>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Thank you for choosing MythManga. We hope you love your new items!
                  </p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #e2e3e5; border-radius: 8px; text-align: center;">
                  <a href="${Deno.env.get('SITE_URL') || 'https://mythmanga.com'}/orders/${payload.order_data.id}" 
                     style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    View Order Details
                  </a>
                </div>
              </div>

              <div style="background: #2C3E50; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 5px 0;">© 2026 MythManga. All rights reserved.</p>
                <p style="margin: 5px 0;">Premium Anime Merchandise Store</p>
              </div>
            </div>
          `
          break

        case 'order_cancelled':
          subject = `Order Cancelled - ${payload.order_data.id}`
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">❌ Order Cancelled</h1>
                <p style="opacity: 0.9;">Your order has been cancelled</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #2C3E50;">Order Cancelled Notification</h2>
                
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p><strong>Order ID:</strong> ${payload.order_data.id}</p>
                  <p><strong>Cancelled Date:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Reason:</strong> ${payload.order_data.cancel_reason || 'Customer Request'}</p>
                </div>

                <div style="margin-top: 20px; background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
                  <h3 style="margin-top: 0; color: #721c24;">Cancellation Details:</h3>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Your order has been successfully cancelled. If you paid online, 
                    the refund will be processed within 3-5 business days.
                  </p>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #e2e3e5; border-radius: 8px; text-align: center;">
                  <a href="${Deno.env.get('SITE_URL') || 'https://mythmanga.com'}" 
                     style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Shop More Items
                  </a>
                </div>
              </div>

              <div style="background: #2C3E50; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 5px 0;">© 2026 MythManga. All rights reserved.</p>
                <p style="margin: 5px 0;">Premium Anime Merchandise Store</p>
              </div>
            </div>
          `
          break
      }
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"MythManga Store" <${smtpUser}>`,
      to: payload.to,
      subject: subject,
      html: html,
    })

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Email error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})