import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ProductDisplayControlProps {
  handleRefresh?: () => void;
}

const ProductDisplayControl: React.FC<ProductDisplayControlProps> = ({
  handleRefresh,
}) => {
  return (
    <Button onClick={handleRefresh} variant={"secondary"}>
      <div className="flex items-center">
        <RefreshCw className="mr-2 h-3 w-3" />
        <p>Refresh</p>
      </div>
    </Button>
  );
};

export default ProductDisplayControl;
