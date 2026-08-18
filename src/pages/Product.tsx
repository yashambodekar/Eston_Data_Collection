import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Boxes,
  Plus,
  Package,
  X,
  Clock,
  Pencil,
  Trash2,
  ChevronDown,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { productionApi } from "../lib/axiosInstance";

// ============================================================
// API ENDPOINTS
// ============================================================

const RAW_MATERIAL_URL = "/api/crud/rawmaterial/get-all";
const PRODUCT_ADD_URL = "/api/crud/product/add";
const PRODUCT_GET_ALL_URL = "/api/crud/product/get-all";
const PRODUCT_DELETE_URL = "/api/crud/product/delete";
const PRODUCT_UPDATE_URL = "/api/crud/product/update";

// ============================================================
// TYPES
// ============================================================

interface SelectedMaterial {
  rawMaterialId: string;
  rawMaterialName: string;
  requiredQuantity: number;
}

// ============================================================
// COMPONENT
// ============================================================

const Product = () => {
  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // ----------------------------------------------------------
  // PRODUCT FORM
  // ----------------------------------------------------------

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    assemblyTime: "",
    remarks: "",
  });

  // ----------------------------------------------------------
  // SELECTED MATERIALS
  // ----------------------------------------------------------

  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);

  const [currentMaterialId, setCurrentMaterialId] = useState("");
  const [currentMaterialQty, setCurrentMaterialQty] = useState("");
  const [currentMaterialName, setCurrentMaterialName] = useState("");

  // ----------------------------------------------------------
  // PRODUCT SEARCH
  // ----------------------------------------------------------

  const [productSearch, setProductSearch] = useState("");

  // ----------------------------------------------------------
  // DROPDOWN
  // ----------------------------------------------------------

  const [materialOpen, setMaterialOpen] = useState(false);

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  const [editingProductId, setEditingProductId] = useState<string | null>(
    null
  );

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // ==========================================================
  // FETCH RAW MATERIALS
  // ==========================================================

  const fetchRawMaterials = async () => {
    try {
      const res = await productionApi.get(RAW_MATERIAL_URL);

      setRawMaterials(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch raw materials:", error);
      toast.error("Failed to fetch raw materials");
    }
  };

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = async () => {
    try {
      const res = await productionApi.get(PRODUCT_GET_ALL_URL);

      setProducts(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      await fetchRawMaterials();
      await fetchProducts();
    };

    loadData();
  }, []);

  // ==========================================================
  // PRODUCT SEARCH
  // ==========================================================

  const filteredProducts = useMemo(() => {
    const search = productSearch.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const remarks = product.remarks?.toLowerCase() || "";

      const materialMatch = product.materials?.some(
        (material: any) =>
          material.rawMaterial?.name?.toLowerCase().includes(search)
      );

      return (
        productName.includes(search) ||
        remarks.includes(search) ||
        materialMatch
      );
    });
  }, [products, productSearch]);

  // ==========================================================
  // ADD MATERIAL TO PRODUCT
  // ==========================================================

  const handleAddMaterial = () => {
    if (!currentMaterialId) {
      toast.error("Please select a raw material");
      return;
    }

    if (!currentMaterialQty || Number(currentMaterialQty) <= 0) {
      toast.error("Please enter a valid required quantity");
      return;
    }

    const material = rawMaterials.find(
      (m) => m._id === currentMaterialId
    );

    if (!material) {
      toast.error("Raw material not found");
      return;
    }

    // Prevent duplicate material
    const alreadySelected = selectedMaterials.some(
      (m) => m.rawMaterialId === material._id
    );

    if (alreadySelected) {
      toast.error("This material is already added");
      return;
    }

    setSelectedMaterials((prev) => [
      ...prev,
      {
        rawMaterialId: material._id,
        rawMaterialName: material.name,
        requiredQuantity: Number(currentMaterialQty),
      },
    ]);

    // Reset material selector
    setCurrentMaterialId("");
    setCurrentMaterialQty("");
    setCurrentMaterialName("");
  };

  // ==========================================================
  // REMOVE MATERIAL
  // ==========================================================

  const handleRemoveMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.filter((material) => material.rawMaterialId !== id)
    );
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      assemblyTime: "",
      remarks: "",
    });

    setSelectedMaterials([]);

    setCurrentMaterialId("");
    setCurrentMaterialQty("");
    setCurrentMaterialName("");

    setEditingProductId(null);
    setMaterialOpen(false);
  };

  // ==========================================================
  // EDIT PRODUCT
  // ==========================================================

  const handleEditProduct = (product: any) => {
    setEditingProductId(product._id);

    setFormData({
      name: product.name || "",
      quantity: String(product.quantity ?? ""),
      assemblyTime: String(product.assemblyTime ?? ""),
      remarks: product.remarks || "",
    });

    setSelectedMaterials(
      (product.materials || []).map((material: any) => ({
        rawMaterialId: material.rawMaterial?._id || "",
        rawMaterialName:
          material.rawMaterial?.name || "Unknown Material",
        requiredQuantity: Number(material.quantityRequired || 0),
      }))
    );

    // Clear temporary material selection
    setCurrentMaterialId("");
    setCurrentMaterialQty("");
    setCurrentMaterialName("");

    setMaterialOpen(false);
    setUpdateModalOpen(true);
  };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await productionApi.delete(`${PRODUCT_DELETE_URL}/${id}`);

      toast.success("Product deleted successfully");

      await fetchProducts();
    } catch (error: any) {
      console.error("Delete product error:", error);
      console.error("Response:", error?.response?.data);

      toast.error(
        error?.response?.data?.message || "Failed to delete product"
      );
    }
  };

  // ==========================================================
  // SUBMIT PRODUCT
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Enter a valid product quantity");
      return;
    }

    if (
      !formData.assemblyTime ||
      Number(formData.assemblyTime) <= 0
    ) {
      toast.error("Enter a valid assembly time");
      return;
    }

    if (selectedMaterials.length === 0) {
      toast.error("Please add at least one raw material");
      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      assemblyTime: Number(formData.assemblyTime),
      remarks: formData.remarks.trim(),

      totalComponents: selectedMaterials.length,

      materials: selectedMaterials.map((material) => ({
        rawMaterial: material.rawMaterialId,
        quantityRequired: material.requiredQuantity,
      })),
    };

    console.log("====================================");
    console.log("PRODUCT SUBMIT");
    console.log("Editing ID:", editingProductId);
    console.log("Payload:", payload);
    console.log("====================================");

    try {
      // ======================================================
      // UPDATE
      // ======================================================

      if (editingProductId) {
        const url = `${PRODUCT_UPDATE_URL}/${editingProductId}`;

        console.log("Updating product:", url);

        const response = await productionApi.put(url, payload);

        console.log("Update response:", response);

        toast.success("Product updated successfully");

        setUpdateModalOpen(false);

        resetForm();

        await fetchProducts();

        return;
      }

      // ======================================================
      // ADD
      // ======================================================

      console.log("Adding product:", PRODUCT_ADD_URL);

      const response = await productionApi.post(
        PRODUCT_ADD_URL,
        payload
      );

      console.log("Add response:", response);

      toast.success("Product added successfully");

      resetForm();

      await fetchProducts();
    } catch (error: any) {
      console.error("====================================");
      console.error("PRODUCT SAVE ERROR");
      console.error("Error:", error);
      console.error("Response:", error?.response);
      console.error("Status:", error?.response?.status);
      console.error("Data:", error?.response?.data);
      console.error("====================================");

      toast.error(
        error?.response?.data?.message ||
          (editingProductId
            ? "Failed to update product"
            : "Failed to add product")
      );
    }
  };

  // ==========================================================
  // MATERIAL DROPDOWN
  // ==========================================================

  const materialDropdown = (
    <Command
      className="overflow-hidden"
      filter={(value, search) => {
        if (!search) return 1;

        const valueLower = value.toLowerCase();
        const searchLower = search.toLowerCase();

        if (valueLower.startsWith(searchLower)) {
          return 3;
        }

        if (valueLower.includes(searchLower)) {
          return 2;
        }

        return 0;
      }}
    >
      <CommandInput placeholder="Search raw material..." />

      <CommandEmpty>
        No material found.
      </CommandEmpty>

      {/* IMPORTANT:
          Only this section scrolls.
          The main page will NOT scroll with it.
      */}
      <div
        className="max-h-[300px] overflow-y-auto overscroll-contain"
        onWheelCapture={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        <CommandGroup>
          {rawMaterials
            .filter(
              (material) =>
                !selectedMaterials.some(
                  (selected) =>
                    selected.rawMaterialId === material._id
                )
            )
            .map((material) => (
              <CommandItem
                key={material._id}
                value={material.name}
                onSelect={() => {
                  setCurrentMaterialId(material._id);
                  setCurrentMaterialName(material.name);
                  setMaterialOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {material.name}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Available: {material.quantity}{" "}
                    {material.unit}
                  </span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </div>
    </Command>
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-background">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b bg-card sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">

          <Link
            to="/"
            className="h-10 w-10 border rounded-lg flex items-center justify-center hover:bg-muted transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Boxes className="h-6 w-6" />

          <h1 className="text-xl font-semibold">
            Products
          </h1>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="container mx-auto px-6 py-8">

        {/* ====================================================
            PRODUCT SEARCH
        ==================================================== */}

        <div className="mb-8">

          <div className="relative max-w-2xl">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />

            <Input
              type="text"
              placeholder="Search products or raw materials..."
              value={productSearch}
              onChange={(e) =>
                setProductSearch(e.target.value)
              }
              className="h-12 pl-11 pr-11 rounded-xl"
            />

            {productSearch && (
              <button
                type="button"
                onClick={() => setProductSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {productSearch && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </p>
          )}
        </div>

        {/* ====================================================
            CONTENT GRID
        ==================================================== */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ==================================================
              ADD PRODUCT FORM
          ================================================== */}

          {!editingProductId && (
            <form
              onSubmit={handleSubmit}
              className="bg-card border rounded-xl p-6 space-y-4 h-fit"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  Add Product
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Create a new product with its required raw
                  materials.
                </p>
              </div>

              {/* PRODUCT NAME */}

              <div className="space-y-2">
                <Label>Product Name</Label>

                <Input
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* QUANTITY + ASSEMBLY TIME */}

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Quantity</Label>

                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assembly Time</Label>

                  <Input
                    type="number"
                    min="1"
                    placeholder="Minutes"
                    value={formData.assemblyTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assemblyTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              {/* REMARKS */}

              <div className="space-y-2">
                <Label>Remarks</Label>

                <Textarea
                  placeholder="Enter remarks..."
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              {/* RAW MATERIAL */}

              <div className="space-y-2">
                <Label>Raw Materials</Label>

                <Popover
                  open={materialOpen}
                  onOpenChange={setMaterialOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={materialOpen}
                      className="w-full justify-between h-11"
                    >
                      <span
                        className={
                          currentMaterialName
                            ? "text-foreground truncate"
                            : "text-muted-foreground"
                        }
                      >
                        {currentMaterialName ||
                          "Select raw material"}
                      </span>

                      <ChevronDown
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="w-[320px] p-0 overflow-hidden"
                  >
                    {materialDropdown}
                  </PopoverContent>
                </Popover>
              </div>

              {/* REQUIRED QUANTITY */}

              <div className="flex gap-2">

                <Input
                  type="number"
                  min="1"
                  placeholder="Required quantity"
                  value={currentMaterialQty}
                  onChange={(e) =>
                    setCurrentMaterialQty(e.target.value)
                  }
                />

                <Button
                  type="button"
                  onClick={handleAddMaterial}
                  className="shrink-0"
                >
                  <Plus size={18} />
                </Button>

              </div>

              {/* SELECTED MATERIALS */}

              {selectedMaterials.length > 0 && (
                <div className="space-y-2">

                  {selectedMaterials.map((material) => (
                    <div
                      key={material.rawMaterialId}
                      className="flex justify-between items-center bg-muted px-3 py-2.5 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">

                        <Package
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {material.rawMaterialName}
                        </span>

                        <span className="text-muted-foreground whitespace-nowrap">
                          × {material.requiredQuantity}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMaterial(
                            material.rawMaterialId
                          )
                        }
                        className="p-1 rounded hover:bg-background transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                </div>
              )}

              {/* ADD PRODUCT */}

              <Button
                type="submit"
                className="w-full h-11"
              >
                Add Product
              </Button>
            </form>
          )}

          {/* ==================================================
              PRODUCT LIST
          ================================================== */}

          <div
            className={
              !editingProductId
                ? "lg:col-span-2 space-y-4"
                : "lg:col-span-3 space-y-4"
            }
          >

            {/* EMPTY SEARCH */}

            {filteredProducts.length === 0 && (
              <div className="border rounded-xl p-12 text-center bg-card">

                <Package
                  className="mx-auto mb-4 text-muted-foreground"
                  size={40}
                />

                <h3 className="font-semibold text-lg">
                  {productSearch
                    ? "No products found"
                    : "No products available"}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {productSearch
                    ? `No products match "${productSearch}".`
                    : "Add your first product using the form."}
                </p>

              </div>
            )}

            {/* PRODUCTS */}

            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-5 bg-card hover:shadow-sm transition"
              >

                {/* PRODUCT HEADER */}

                <div className="flex justify-between items-start gap-4 mb-3">

                  <div className="min-w-0">

                    <h3 className="font-semibold text-lg truncate">
                      {product.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity: {product.quantity}
                      {" | "}
                      <Clock
                        size={14}
                        className="inline-block mr-1"
                      />
                      {product.assemblyTime} min
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-2 shrink-0">

                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleEditProduct(product)
                      }
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        handleDeleteProduct(product._id)
                      }
                    >
                      <Trash2 size={16} />
                    </Button>

                  </div>

                </div>

                {/* REMARKS */}

                {product.remarks && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.remarks}
                  </p>
                )}

                {/* MATERIALS */}

                {product.materials?.length > 0 && (
                  <div className="flex flex-wrap gap-2">

                    {product.materials.map((material: any) => (
                      <Badge
                        key={material._id}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        <Package
                          className="h-3 w-3 mr-1"
                        />

                        {material.rawMaterial?.name ||
                          "Unknown Material"}

                        {" × "}

                        {material.quantityRequired}
                      </Badge>
                    ))}

                  </div>
                )}

              </div>
            ))}

          </div>
        </div>

        {/* ====================================================
            UPDATE PRODUCT MODAL
        ==================================================== */}

        <Dialog
          open={updateModalOpen}
          onOpenChange={(open) => {
            setUpdateModalOpen(open);

            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

            <DialogHeader>
              <DialogTitle>
                Update Product
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* PRODUCT NAME */}

              <div className="space-y-2">
                <Label>Product Name</Label>

                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* QUANTITY + TIME */}

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Quantity</Label>

                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assembly Time</Label>

                  <Input
                    type="number"
                    min="1"
                    placeholder="Minutes"
                    value={formData.assemblyTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assemblyTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

              </div>

              {/* REMARKS */}

              <div className="space-y-2">
                <Label>Remarks</Label>

                <Textarea
                  placeholder="Remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              {/* RAW MATERIAL */}

              <div className="space-y-2">
                <Label>Raw Materials</Label>

                <Popover
                  open={materialOpen}
                  onOpenChange={setMaterialOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={materialOpen}
                      className="w-full justify-between h-11"
                    >
                      <span
                        className={
                          currentMaterialName
                            ? "text-foreground truncate"
                            : "text-muted-foreground"
                        }
                      >
                        {currentMaterialName ||
                          "Select raw material"}
                      </span>

                      <ChevronDown
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="w-[320px] p-0 overflow-hidden"
                  >
                    {materialDropdown}
                  </PopoverContent>
                </Popover>
              </div>

              {/* ADD MATERIAL */}

              <div className="flex gap-2">

                <Input
                  type="number"
                  min="1"
                  placeholder="Required quantity"
                  value={currentMaterialQty}
                  onChange={(e) =>
                    setCurrentMaterialQty(e.target.value)
                  }
                />

                <Button
                  type="button"
                  onClick={handleAddMaterial}
                  className="shrink-0"
                >
                  <Plus size={18} />
                </Button>

              </div>

              {/* SELECTED MATERIALS */}

              {selectedMaterials.length > 0 && (
                <div className="space-y-2">

                  {selectedMaterials.map((material) => (
                    <div
                      key={material.rawMaterialId}
                      className="flex justify-between items-center bg-muted px-3 py-2.5 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">

                        <Package
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {material.rawMaterialName}
                        </span>

                        <span className="text-muted-foreground whitespace-nowrap">
                          × {material.requiredQuantity}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMaterial(
                            material.rawMaterialId
                          )
                        }
                        className="p-1 rounded hover:bg-background transition"
                      >
                        <X size={18} />
                      </button>

                    </div>
                  ))}

                </div>
              )}

              {/* UPDATE */}

              <Button
                type="submit"
                className="w-full h-11"
              >
                Update Product
              </Button>

            </form>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default Product;
