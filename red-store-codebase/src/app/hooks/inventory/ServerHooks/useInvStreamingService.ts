import { useEffect } from "react";

const useInvStreamingService = (user_id: string, store_id: number) => {
  useEffect(() => {
    if (!user_id) return;

    const eventSource = new EventSource(
      `http://localhost:3000/inventory/consumer-event?user_id=${user_id}&store_id=${store_id}`
    );

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log({ parsed });
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
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
};

export default useInvStreamingService;
