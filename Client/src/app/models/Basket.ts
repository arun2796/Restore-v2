import type { IProduct } from "./product"

export type Basket ={
  basketId: string
  items: Item[]
  PaymentIntentId?:string
  clientSecret?:string
}

export class Item {
  constructor( product:IProduct,quantity:number) {
    this.productId=product.id;
    this.brand=product.brand;
    this.name=product.name;
    this.type=product.type;
    this.pictureUrl=product.pictureUrl;
    this.price=product.price;
    this.quantity=quantity;
  }
  productId: number
  name: string
  price: number
  pictureUrl: string
  type: string
  brand: string
  quantity: number
}