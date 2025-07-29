// Updated hook in accordance to kafka + redis

/*
1. saveToCache --> handleCartPurchase
Purchases will be moved to redis cache storage
- Producer Event will be fired to update all client side storages and systems
- Consumer Event will be waiting to listen on a seperate system waiting for these events sales and inventory

- Consumer Service Updates Sales + Inventory Tables
- Consumer Endpoint sources on UI update POS + Inventory

- Note: For Sake of preventing double updates prioritize updates via a consumer
- Future: Assign POS IDs for updating and handling all events for POS specific drivers
 */

const usePurchase = () => {
  const handleCartPurchase = () => {};
};

export default usePurchase;
