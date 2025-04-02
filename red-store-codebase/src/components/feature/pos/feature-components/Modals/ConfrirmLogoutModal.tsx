import { usePos } from "@/app/contexts/pos/PosContext";
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const { selectedStore } = usePos();
  const { handleEmployeeLogout } = useAuthServerHook();
  const { syncToServer, isSyncingToInventory } = useBrowserCacheStorage();

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (selectedStore) {
      await syncToServer(selectedStore.storeId);
      await handleEmployeeLogout();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Sure about logging out ?</DialogTitle>
          <DialogDescription>
            Confirm logout, your sales remaining sales will be synced to the
            server, upon confirmation
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => void handleLogout()}
            disabled={isLoggingOut || !selectedStore || isSyncingToInventory}
          >
            {isLoggingOut
              ? "Activating..."
              : isSyncingToInventory && isLoggingOut
              ? "Syncing..."
              : "Logout"}
          </Button>
          <Button variant={"secondary"} onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
