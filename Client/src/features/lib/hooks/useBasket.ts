import type { Item } from "../../../app/models/Basket";
import { useClearBasketMutation, useFetchBasketQuery } from "../../basket/basketApi";

export const useBasket = () => {
      const { data: basket } = useFetchBasketQuery();
      const[clearBasket]=useClearBasketMutation();
      const subtotal = basket?.items.reduce((sum: number, item: Item) => sum + item.quantity * item.price, 0) || 0;
      const deliveryFee = subtotal > 100000 ? 0 : 5000;
      const total = subtotal + deliveryFee;

      return { basket, subtotal, deliveryFee, total, clearBasket };
}