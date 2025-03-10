import { useState } from "react";
import { roundToNearestHour } from "@/utils/timeUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Package, Clock, Settings } from "lucide-react";
import { JobType, Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProductsPage() {
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    jobType: "Digital Printing",
    productionTime: 60,
  });

  // Product data
  const products: Product[] = [];

  const jobTypes: JobType[] = [
    "Digital Printing",
    "Wide Format",
    "Screen Printing",
    "DTF",
    "Embroidery",
  ];

  const filteredProducts =
    selectedJobType === "all"
      ? products
      : products.filter((product) => product.jobType === selectedJobType);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [id]:
        id === "productionTime" || id === "setupTime" || id === "finishingTime"
          ? Math.round((parseInt(value) || 0) / 60) * 60 // Ensure hour increments
          : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = () => {
    // In a real app, this would save to a database
    console.log("Adding new product:", newProduct);
    setShowAddProductDialog(false);
    // Reset form
    setNewProduct({
      jobType: "Digital Printing",
      productionTime: 60,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage products and production time specifications
          </p>
        </div>
        <Button onClick={() => setShowAddProductDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedJobType}
          onValueChange={setSelectedJobType}
        >
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            {jobTypes.map((jobType) => (
              <TabsTrigger key={jobType} value={jobType}>
                {jobType}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </div>
              <CardDescription>{product.jobType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{product.description}</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Production Time:
                  </span>
                  <span className="font-medium">
                    {(product.productionTime / 60).toFixed(1)} hours
                  </span>
                </div>
                {product.setupTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Setup Time:</span>
                    <span className="font-medium">
                      {(product.setupTime / 60).toFixed(1)} hours
                    </span>
                  </div>
                )}
                {product.finishingTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Finishing Time:
                    </span>
                    <span className="font-medium">
                      {(product.finishingTime / 60).toFixed(1)} hours
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="font-medium">
                    {(
                      (product.productionTime +
                        (product.setupTime || 0) +
                        (product.finishingTime || 0)) /
                      60
                    ).toFixed(1)}{" "}
                    hours
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product with production time specifications
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                id="name"
                value={newProduct.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobType" className="text-right">
                Job Type
              </Label>
              <Select
                value={newProduct.jobType}
                onValueChange={(value) => handleSelectChange("jobType", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((jobType) => (
                    <SelectItem key={jobType} value={jobType}>
                      {jobType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProduct.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productionTime" className="text-right">
                Production Time (hours)
              </Label>
              <Input
                id="productionTime"
                type="number"
                value={
                  newProduct.productionTime
                    ? newProduct.productionTime / 60
                    : ""
                }
                onChange={(e) => {
                  const hours = parseFloat(e.target.value) || 0;
                  // Convert hours to minutes for storage
                  const minutes = Math.round(hours * 60);
                  setNewProduct((prev) => ({
                    ...prev,
                    productionTime: minutes,
                  }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setupTime" className="text-right">
                Setup Time (hours)
              </Label>
              <Input
                id="setupTime"
                type="number"
                value={newProduct.setupTime ? newProduct.setupTime / 60 : ""}
                onChange={(e) => {
                  const hours = parseFloat(e.target.value) || 0;
                  // Convert hours to minutes for storage
                  const minutes = Math.round(hours * 60);
                  setNewProduct((prev) => ({
                    ...prev,
                    setupTime: minutes,
                  }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="finishingTime" className="text-right">
                Finishing Time (hours)
              </Label>
              <Input
                id="finishingTime"
                type="number"
                value={
                  newProduct.finishingTime ? newProduct.finishingTime / 60 : ""
                }
                onChange={(e) => {
                  const hours = parseFloat(e.target.value) || 0;
                  // Convert hours to minutes for storage
                  const minutes = Math.round(hours * 60);
                  setNewProduct((prev) => ({
                    ...prev,
                    finishingTime: minutes,
                  }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newProduct.notes || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddProductDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
