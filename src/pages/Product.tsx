import { useEffect, useState } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
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

/* ================= API URLS ================= */
const RAW_MATERIAL_URL =
  "https://crud-operations-on-backend.onrender.com/api/crud/rawmaterial/get-all";
const PRODUCT_ADD_URL =
  "https://crud-operations-on-backend.onrender.com/api/crud/product/add";
const PRODUCT_GET_ALL_URL =
  "https://crud-operations-on-backend.onrender.com/api/crud/product/get-all";
const PRODUCT_DELETE_URL =
  "https://crud-operations-on-backend.onrender.com/api/crud/product/delete";
const PRODUCT_UPDATE_URL =
  "https://crud-operations-on-backend.onrender.com/api/crud/product/update";
interface SelectedMaterial {
  rawMaterialId: string;
  rawMaterialName: string;
  requiredQuantity: number;
}

const Product = () => {
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    assemblyTime: "",
    remarks: "",
  });

  const [currentMaterialId, setCurrentMaterialId] = useState("");
  const [currentMaterialQty, setCurrentMaterialQty] = useState("");
  const [currentMaterialName, setCurrentMaterialName] = useState("");

  // 🔑 CONTROL DROPDOWN OPEN STATE
  const [materialOpen, setMaterialOpen] = useState(false);

  /* ================= FETCH ================= */
  const fetchRawMaterials = async () => {
    const res = await fetch(RAW_MATERIAL_URL);
    const data = await res.json();
    setRawMaterials(data.data);
  };

  const fetchProducts = async () => {
    const res = await fetch(PRODUCT_GET_ALL_URL);
    const data = await res.json();
    setProducts(data.data);
  };

  useEffect(() => {
    fetchRawMaterials();
    fetchProducts();
  }, []);

  /* ================= ADD MATERIAL ================= */
  const handleAddMaterial = () => {
    if (!currentMaterialId || !currentMaterialQty) {
      toast.error("Select material and quantity");
      return;
    }

    const material = rawMaterials.find((m) => m._id === currentMaterialId);
    if (!material) return;

    setSelectedMaterials((prev) => [
      ...prev,
      {
        rawMaterialId: material._id,
        rawMaterialName: material.name,
        requiredQuantity: Number(currentMaterialQty),
      },
    ]);

    setCurrentMaterialId("");
    setCurrentMaterialQty("");
    setCurrentMaterialName("");
  };

  const handleRemoveMaterial = (id: string) => {
    setSelectedMaterials((prev) => prev.filter((m) => m.rawMaterialId !== id));
  };

  /* ================= EDIT PRODUCT ================= */
  const handleEditProduct = (product: any) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      quantity: product.quantity,
      assemblyTime: product.assemblyTime,
      remarks: product.remarks || "",
    });

    setSelectedMaterials(
      product.materials.map((m: any) => {
        const rm = rawMaterials.find((r) => r._id === m.rawMaterial);
        return {
          rawMaterialId: m.rawMaterial,
          rawMaterialName: rm?.name || "Material",
          requiredQuantity: m.quantityRequired,
        };
      }),
    );
    setUpdateModalOpen(true);
  };

  /* ================= DELETE PRODUCT ================= */
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`${PRODUCT_DELETE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Product deleted");
    fetchProducts();
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      assemblyTime: Number(formData.assemblyTime),
      remarks: formData.remarks.trim(),
      totalComponents: selectedMaterials.length,
      materials: selectedMaterials.map((m) => ({
        rawMaterial: m.rawMaterialId,
        quantityRequired: m.requiredQuantity,
      })),
    };

    const isUpdate = !!editingProductId;
    const url = isUpdate
      ? `${PRODUCT_UPDATE_URL}/${editingProductId}`
      : PRODUCT_ADD_URL;
    const method = isUpdate ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to save product");
      return;
    }

    toast.success(isUpdate ? "Product updated" : "Product added");

    setEditingProductId(null);
    setFormData({ name: "", quantity: "", assemblyTime: "", remarks: "" });
    setSelectedMaterials([]);
    setCurrentMaterialId("");
    setCurrentMaterialQty("");
    setCurrentMaterialName("");
    setUpdateModalOpen(false);

    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="h-10 w-10 border rounded-lg flex items-center justify-center"
          >
            <ArrowLeft />
          </Link>
          <Boxes />
          <h1 className="text-xl font-semibold">Products</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* FORM - for Add */}
        {!editingProductId && (
          <form
            onSubmit={handleSubmit}
            className="bg-card border rounded-xl p-6 space-y-4"
          >
            <Label>Product Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Assembly time (min)"
                value={formData.assemblyTime}
                onChange={(e) =>
                  setFormData({ ...formData, assemblyTime: e.target.value })
                }
              />
            </div>

            <Textarea
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />

            <Label>Raw Materials</Label>

            {/* 🔥 SEARCHABLE + RANKED DROPDOWN */}
            <Popover open={materialOpen} onOpenChange={setMaterialOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={materialOpen}
                  className="w-full justify-between"
                >
                  {currentMaterialName || "Select raw material"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command
                  filter={(value, search) => {
                    if (!search) return 1;

                    const v = value.toLowerCase();
                    const s = search.toLowerCase();

                    if (v.startsWith(s)) return 3;
                    if (v.includes(s)) return 2;
                    return 0;
                  }}
                >
                  <CommandInput placeholder="Search raw material..." />
                  <CommandEmpty>No material found.</CommandEmpty>

                  <CommandGroup>
                    {rawMaterials
                      .filter(
                        (m) =>
                          !selectedMaterials.some(
                            (sm) => sm.rawMaterialId === m._id,
                          ),
                      )
                      .map((m) => (
                        <CommandItem
                          key={m._id}
                          value={m.name}
                          onSelect={() => {
                            setCurrentMaterialId(m._id);
                            setCurrentMaterialName(m.name);
                            setMaterialOpen(false); // ✅ CLOSE DROPDOWN
                          }}
                        >
                          {m.name} ({m.quantity} {m.unit})
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Required qty"
                value={currentMaterialQty}
                onChange={(e) => setCurrentMaterialQty(e.target.value)}
              />
              <Button type="button" onClick={handleAddMaterial}>
                <Plus />
              </Button>
            </div>

            {selectedMaterials.map((rm) => (
              <div
                key={rm.rawMaterialId}
                className="flex justify-between items-center bg-muted px-3 py-2 rounded"
              >
                {rm.rawMaterialName} × {rm.requiredQuantity}
                <X
                  className="cursor-pointer"
                  onClick={() => handleRemoveMaterial(rm.rawMaterialId)}
                />
              </div>
            ))}

            <Button type="submit" className="w-full">
              Add Product
            </Button>
          </form>
        )}

        {/* PRODUCT LIST */}
        <div className="lg:col-span-2 space-y-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded-lg p-5 bg-card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEditProduct(p)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Quantity: {p.quantity} | <Clock size={14} className="inline" />{" "}
                {p.assemblyTime} min
              </p>

              <div className="flex flex-wrap gap-2">
                {p.materials.map((m: any) => (
                  <Badge key={m.rawMaterial}>
                    <Package className="h-3 w-3 mr-1" />
                    {m.quantityRequired}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* UPDATE PRODUCT MODAL */}
        <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Assembly time (min)"
                  value={formData.assemblyTime}
                  onChange={(e) =>
                    setFormData({ ...formData, assemblyTime: e.target.value })
                  }
                />
              </div>

              <Textarea
                placeholder="Remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />

              <Label>Raw Materials</Label>

              {/* 🔥 SEARCHABLE + RANKED DROPDOWN */}
              <Popover open={materialOpen} onOpenChange={setMaterialOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={materialOpen}
                    className="w-full justify-between"
                  >
                    {currentMaterialName || "Select raw material"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command
                    filter={(value, search) => {
                      if (!search) return 1;

                      const v = value.toLowerCase();
                      const s = search.toLowerCase();

                      if (v.startsWith(s)) return 3;
                      if (v.includes(s)) return 2;
                      return 0;
                    }}
                  >
                    <CommandInput placeholder="Search raw material..." />
                    <CommandEmpty>No material found.</CommandEmpty>

                    <CommandGroup>
                      {rawMaterials
                        .filter(
                          (m) =>
                            !selectedMaterials.some(
                              (sm) => sm.rawMaterialId === m._id,
                            ),
                        )
                        .map((m) => (
                          <CommandItem
                            key={m._id}
                            value={m.name}
                            onSelect={() => {
                              setCurrentMaterialId(m._id);
                              setCurrentMaterialName(m.name);
                              setMaterialOpen(false); // ✅ CLOSE DROPDOWN
                            }}
                          >
                            {m.name} ({m.quantity} {m.unit})
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Required qty"
                  value={currentMaterialQty}
                  onChange={(e) => setCurrentMaterialQty(e.target.value)}
                />
                <Button type="button" onClick={handleAddMaterial}>
                  <Plus />
                </Button>
              </div>

              {selectedMaterials.map((rm) => (
                <div
                  key={rm.rawMaterialId}
                  className="flex justify-between items-center bg-muted px-3 py-2 rounded"
                >
                  {rm.rawMaterialName} × {rm.requiredQuantity}
                  <X
                    className="cursor-pointer"
                    onClick={() => handleRemoveMaterial(rm.rawMaterialId)}
                  />
                </div>
              ))}

              <Button type="submit" className="w-full">
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
