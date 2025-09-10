"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProductModal from "./create-product-modal";

interface CreateProductFabProps {
  onProductCreated?: () => void;
}

export default function CreateProductFab({ onProductCreated }: CreateProductFabProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateProductModal 
        open={open} 
        handleClose={() => setOpen(false)} 
        onProductCreated={onProductCreated}
      />
      <div className="fixed bottom-10 left-10">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
