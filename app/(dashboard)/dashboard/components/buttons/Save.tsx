import {Save} from "lucide-react";
import {Button} from "@heroui/react";

interface SaveButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export default function SaveButton({ onClick, loading = false }: SaveButtonProps) {
  return (
    <Button
      onPress={onClick}
      color="primary"
      disabled={loading}
    >
      <Save size={18}  />
      Save
    </Button>
  );
}
