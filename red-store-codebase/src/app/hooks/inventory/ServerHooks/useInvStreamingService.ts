import { useEffect, useState } from "react";

// Handles both connection Event and batched Inventory Update Events
type InventoryEvent = {
  p_id: number;
  quantity: number;
  type?: never;
};

type ConnectionEvent = {
  type: "connected";
  message: string;
};

type PingEvent = {
  type: "ping";
};

type BatchedInventoryMessage = {
  store_id: number;
  user_id: string;
  inv_update: InventoryEvent[];
};

type SSEMessage = InventoryEvent | ConnectionEvent | BatchedInventoryMessage;

// Type guards for safety and clarity
const isConnectionEvent = (data: any): data is ConnectionEvent =>
  data && typeof data === "object" && data.type === "connected";

const isPingEvent = (data: any): data is PingEvent =>
  data && typeof data === "object" && data.type === "ping";

const isBatchedInventoryMessage = (
  data: any
): data is BatchedInventoryMessage =>
  data &&
  typeof data === "object" &&
  Array.isArray(data.inv_update) &&
  data.inv_update.every(
    (item: any) =>
      item && typeof item.p_id === "number" && typeof item.quantity === "number"
  );

const useInvStreamingService = (user_id: string, store_id: number) => {
  // Queue Incoming Events for UI changes
  const [inventoryEvents, setInventoryEvents] = useState<InventoryEvent[]>([]);

  useEffect(() => {
    if (!user_id) return;

    const eventSource = new EventSource(
      `http://localhost:3000/inventory/updates-stream?user_id=${user_id}&store_id=${store_id}`
    );

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        // Redis messages might be JSON strings inside JSON strings, so double parse
        let parsed: unknown = event.data;

        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }

        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }

        if (isConnectionEvent(parsed)) {
          console.log("Connection message:", parsed.message);
        } else if (isBatchedInventoryMessage(parsed)) {
          console.log("Batched Inventory event:", parsed.inv_update);
          setInventoryEvents(parsed.inv_update);
        } else if (isPingEvent(parsed)) {
          console.log("Ping Event", parsed.type);
        } else {
          console.warn("Unknown event type received", parsed);
        }
      } catch (err) {
        console.error("Failed to parse SSE data:", err, event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user_id, store_id]);

  return {
    inventoryEvents,
  };
};

export default useInvStreamingService;
