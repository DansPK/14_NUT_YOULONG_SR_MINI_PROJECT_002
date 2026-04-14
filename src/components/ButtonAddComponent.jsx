"use client";

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useCart } from "@/store/cartStore";

export default function ButtonAddComponent({ product }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      onPress={() => addItem(product)}
      className="size-11 rounded-full bg-lime-400 text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95"
    >
      <Plus size={20} />
    </Button>
  );
}
