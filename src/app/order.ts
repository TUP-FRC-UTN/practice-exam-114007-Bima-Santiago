import Product from "./product"

class Order{
  id: string | null = null
  customerName: string = ''
  email: string = ''
  products: Product[] = []
  total: number = 0
  orderCode: string = ''
  timeStamp: string = ''
}

export default Order;
