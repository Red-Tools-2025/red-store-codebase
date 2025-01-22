import { usePos } from "@/app/contexts/pos/PosContext";
import useCart from "@/app/hooks/pos/StaticHooks/useCart";
import { Cart } from "@/app/types/pos/cart";

interface CartDisplayProps {
  cartItems: Cart[];
}

const CartDisplay: React.FC<CartDisplayProps> = ({ cartItems }) => {
  const { setCartItems } = usePos();
  const { handleRemoveFromCart } = useCart();

  return (
    <div className="w-80 bg-green-500 p-4">
      {cartItems.map((item, i) => {
        return (
          <div key={i} className="flex flex-col">
            <p>{item.productName}</p>
            <p>{item.productQuantity}</p>
            <p
              onClick={() =>
                handleRemoveFromCart(item.product_id, setCartItems)
              }
            >
              remove
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CartDisplay;
