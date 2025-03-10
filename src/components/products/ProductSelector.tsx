import { useState, useEffect } from "react";
import { roundToNearestHour } from "@/utils/timeUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { JobType, Product } from "@/types/product";
import { JobProduct } from "@/types/job";
import { Plus, Trash2 } from "lucide-react";

interface ProductSelectorProps {
  onProductsChange: (products: JobProduct[]) => void;
  initialProducts?: JobProduct[];
}

export default function ProductSelector({
  onProductsChange,
  initialProducts = [],
}: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] =
    useState<JobProduct[]>(initialProducts);
  const [currentProduct, setCurrentProduct] = useState<Partial<JobProduct>>({
    productType: "",
    quantity: 1,
    productionTime: 0,
  });

  // Product catalog data
  const productCatalog: Product[] = [];

  const jobTypes: JobType[] = [
    "Digital Printing",
    "Wide Format",
    "Screen Printing",
    "DTF",
    "Embroidery",
  ];

  // Filter products by selected job type
  const [selectedJobType, setSelectedJobType] = useState<JobType | "">("");
  const filteredProducts = selectedJobType
    ? productCatalog.filter((product) => product.jobType === selectedJobType)
    : [];

  const handleAddProduct = () => {
    if (!currentProduct.productType || !currentProduct.quantity) return;

    // Find the product in the catalog to get its production times
    const productDetails = productCatalog.find(
      (p) => p.name === currentProduct.productType,
    );

    if (!productDetails) return;

    const newProduct: JobProduct = {
      productType: currentProduct.productType,
      quantity: currentProduct.quantity || 1,
      productionTime: Math.round(productDetails.productionTime / 60) * 60,
      setupTime: productDetails.setupTime,
      finishingTime: productDetails.finishingTime,
    };

    const updatedProducts = [...selectedProducts, newProduct];
    setSelectedProducts(updatedProducts);
    onProductsChange(updatedProducts);

    // Reset current product
    setCurrentProduct({
      productType: "",
      quantity: 1,
      productionTime: 0,
    });
    setSelectedJobType("");
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  const handleProductSelect = (productName: string) => {
    const productDetails = productCatalog.find((p) => p.name === productName);
    if (!productDetails) return;

    setCurrentProduct({
      productType: productName,
      quantity: 1,
      productionTime: Math.round(productDetails.productionTime / 60) * 60,
    });
  };

  const calculateTotalTime = (product: JobProduct): number => {
    return (
      product.productionTime +
      (product.setupTime || 0) +
      (product.finishingTime || 0)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
          <CardDescription>
            Select products to include in this job
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                value={selectedJobType}
                onValueChange={(value) => setSelectedJobType(value as JobType)}
              >
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product</Label>
              <Select
                value={currentProduct.productType}
                onValueChange={handleProductSelect}
                disabled={!selectedJobType}
              >
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={currentProduct.quantity || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: parseInt(e.target.value) || 1,
                    // Ensure production time is in hour increments
                    productionTime: currentProduct.productionTime
                      ? Math.round(currentProduct.productionTime / 60) * 60
                      : 0,
                  })
                }
                disabled={!currentProduct.productType}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddProduct}
                disabled={
                  !currentProduct.productType || !currentProduct.quantity
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Products</CardTitle>
            <CardDescription>Products included in this job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{product.productType}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {product.quantity} • Total Time:{" "}
                      {(calculateTotalTime(product) / 60).toFixed(1)} hours
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-between">
              <span className="font-medium">Total Production Time:</span>
              <span className="font-bold">
                {(
                  selectedProducts.reduce(
                    (total, product) => total + calculateTotalTime(product),
                    0,
                  ) / 60
                ).toFixed(1)}{" "}
                hours
              </span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
