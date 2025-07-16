export interface Order {
  id: number
  buyerEmail: string
  shippingAddress: ShippingAddress
  orderDate: string
  orderItems: OrderItem[]
  subTotal: number
  discount: number
  deliveryFee: number
  total: number
  paymentSummary: PaymentSummary
  status: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string|null
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  productId: number
  name: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface PaymentSummary {
 brand: string;
  exp_month: number;
  exp_year: number;
  last4: string |number;
}

export interface CreateOrder{
    ShippingAddress:ShippingAddress
    PaymentSummary:PaymentSummary
}
