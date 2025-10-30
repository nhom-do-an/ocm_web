
export interface LineItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number; // unit price
  grams: number;
  note: string;
  requires_shipping: boolean;
  variant_id: number;
  variant_title: string;
}

export interface LineItemDetail {
  id: number;
  alias: string;
  image_url: string;
  product_name: string;
  quantity: number;
  price: number;
  original_price: number;
  total_price: number;
  grams: number;
  note: string;
  product_exist: boolean;
  requires_shipping: boolean;
  variant_id: number;
  variant_title: string;
}

// Cart detail returned by API
export interface CartDetail {
  created_at: string;
  updated_at: string;
  customer_id: number;
  id: number;
  token: string;
  line_items: LineItemDetail[];
  requires_shipping: boolean;
  status: CartStatus
  total_price: number;
  total_weights: number;
  item_count: number;
}


export interface UpdateLineItemRequest {
  line_item_id: number;
  quantity: number;
}

export enum CartStatus {
    Active = "active",
    Converted = "converted",
}


export default {};
