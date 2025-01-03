// components/ToggleSwitch.tsx
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleSwitchProps {
  onToggle: (value: boolean) => void; // Function to pass the toggle state back to the parent
  defaultChecked?: boolean;
}

const ToggleSwitch = ({
  onToggle,
  defaultChecked = true,
}: ToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle(newValue); // Pass the new value to the parent
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="toggle-sales"
        checked={isChecked}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="toggle-sales" className="font-inter">
        Toggle Sales Data
      </Label>
    </div>
  );
};

export default ToggleSwitch;
