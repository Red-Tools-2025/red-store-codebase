import { usePos } from "@/app/contexts/pos/PosContext";
import useCart from "@/app/hooks/pos/StaticHooks/useCart";
import { Cart } from "@/app/types/pos/cart";
import { Button } from "@/components/ui/button";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

interface CartDisplayProps {
  cartItems: Cart[];
}

const CartDisplay: React.FC<CartDisplayProps> = ({ cartItems }) => {
  const { setCartItems } = usePos();
  const { handleRemoveFromCart, handleCartItemQty } = useCart();

  return (
    <div className="w-80  ml-3 p-3 pt-0 flex flex-col justify-between">
      <div className="flex flex-col">
        <p className="text-xl pb-3">Order Summary</p>
        <div className="flex flex-col gap-3">
          {cartItems.map((item, i) => {
            return (
              <div
                key={i}
                className="flex rounded-lg flex-col bg-gray-100 gap-1 p-3"
              >
                <p className="text-xs bg-white px-3 py-1 border border-1 w-fit rounded-md">
                  {item.productBrand}
                </p>
                <p className="w-30">{item.productName}</p>
                <div className="flex justify-between mt-2">
                  <p>{`x ${item.productQuantity}`}</p>
                  <div className="flex gap-1 items-center">
                    <CiCirclePlus
                      onClick={() =>
                        handleCartItemQty(
                          item.product_id,
                          "positive",
                          setCartItems
                        )
                      }
                      className="text-xl hover:cursor-pointer hover:text-blue-500 transition-all"
                    />
                    <CiCircleMinus
                      onClick={() =>
                        handleCartItemQty(
                          item.product_id,
                          "negative",
                          setCartItems
                        )
                      }
                      className="text-xl hover:cursor-pointer hover:text-blue-500 transition-all"
                    />
                    <MdOutlineDelete
                      className="text-xl text-red-300 hover:text-red-500 cursor-pointer transition-all"
                      onClick={() =>
                        handleRemoveFromCart(item.product_id, setCartItems)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between p-2 bg-gray-100 rounded-md">
          <p className="font-semibold">Total :</p>
          <p>
            {`₹
            ${cartItems.reduce(
              (total, item) => total + item.productQuantity * item.productPrice,
              0
            )}`}
          </p>
        </div>
        <Button variant="secondary">Checkout</Button>
      </div>
    </div>
  );
};

export default CartDisplay;
