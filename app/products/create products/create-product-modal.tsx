"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct } from "./createProduct";
import { getCategories } from "../../common/utill/fetch";
import {
  createCategory,
  createCategory as createCategoryApi,
} from "./createCategory"; // adjust path

// Define the form schema with category
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  imageFile: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  id: number;
  name: string;
}

interface CreateProductModalProps {
  open: boolean;
  handleClose: () => void;
  onProductCreated?: () => void;
}

export default function CreateProductModal({
  open,
  handleClose,
  onProductCreated,
}: CreateProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        setError("Please select an image");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          await createProduct({
            ...data,
            categoryId: parseInt(data.categoryId),
            price: parseFloat(data.price),
            imageFile: base64String,
          });
          handleClose();
          reset();
          onProductCreated?.();
        } catch (err) {
          setError("Failed to create product");
          console.error("Error creating product:", err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to create product");
      console.error("Error creating product:", err);
      setLoading(false);
    }
  };
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      // Call backend API to create category
      const createdCategory = await createCategory({ name: newCategory });

      // Add to local state
      setCategories([...categories, createdCategory]);

      // Select the newly added category
      setValue("categoryId", createdCategory.id.toString());

      // Reset input
      setNewCategory("");
      setShowAddInput(false);
    } catch (err) {
      console.error("Failed to add category:", err);
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center">
          <DialogTitle className="text-center mb-4">
            Create New Product
          </DialogTitle>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Product name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Product description"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Product price"
                      {...register("price")}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="category" className="mb-3">
                      Category
                    </Label>

                    <div className="flex flex-col space-y-2 gap-2">
                      {/* Select dropdown */}
                      <Select
                        onValueChange={(value) => setValue("categoryId", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Add new category input */}
                      {showAddInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category"
                            className="flex-1 px-2 py-1 border rounded"
                          />
                          <Button
                            type="button"
                            onClick={handleAddCategory} // now calls backend
                            disabled={loading}
                          >
                            {loading ? "Adding..." : "Add"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => setShowAddInput(true)}
                        >
                          + Add Category
                        </Button>
                      )}
                    </div>

                    {/* Validation error */}
                    {errors.categoryId && (
                      <p className="text-sm text-red-500">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      {...register("imageFile")}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
