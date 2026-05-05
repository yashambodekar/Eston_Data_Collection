import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Boxes, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { testApi, productionApi } from "../lib/axiosInstance";

const BASE_URL = "/api/crud/rawmaterial";

const CATEGORY_OPTIONS = [
  "Virat Fuse",
  "Contactor",
  "Connector",
  "Convertor Relay (Red Relay)",
  "Mobile Auto",
  "MK1 Relay (Black)",
  "MK2 Relay (DMC)",
  "MU Relay",
  "Virat Capacitor",
  "Shubh Capacitor",
  "Epcos Capacitor",
  "Box Capacitor",
  "Oil Capacitor",
  "Coil",
  "MCB",
  "Base",
  "8 MM Dol Starter",
  "10 MM Dol Starter",
  "MU DMC Starter",
  "Patti Kit",
  "Switch",
  "Meter",
  "Transformer",
  "Wire",
  "Wire Connector",
  "Ready Wire Set",
  "Blank PCB",
  "Assemble PCB",
  "Metal Body",
  "Screw",
  "Outer Box",
  "Electronic Components",
  "Ready Auto",
  "Ready Panel"
];

const RawMaterial = () => {
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    pieces: "",
    quantity: "",
    unit: "",
    supplier: "",
    remarks: "",
    category: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchRawMaterials = async () => {
    try {
      // const res = await testApi.get(`${BASE_URL}/get-all`);
      const res = await productionApi.get(`${BASE_URL}/get-all`);
      setRawMaterials(res.data.data);
    } catch (error: any) {
      toast.error("Failed to fetch raw materials");
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.pieces ||
      !formData.quantity ||
      !formData.unit.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      pieces: Number(formData.pieces),
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      supplier: formData.supplier.trim(),
      remarks: formData.remarks.trim(),
      category: formData.category.trim(),
    };

    try {
      const url = editingId
        ? `${BASE_URL}/update/${editingId}`
        : `${BASE_URL}/add`;

      const method = editingId ? "PUT" : "POST";

      if (method === "PUT") {
        //   await testApi.put(url, payload);
        await productionApi.put(url, payload);
        toast.success("Material updated successfully");
      } else {
        // await testApi.post(url, payload);
        await productionApi.post(url, payload);
        toast.success("Material added");
      }
      setEditingId(null);
      setFormData({
        name: "",
        pieces: "",
        quantity: "",
        unit: "",
        supplier: "",
        remarks: "",
        category: "",
      });
      fetchRawMaterials();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (material: any) => {
    setEditingId(material._id);
    setFormData({
      name: material.name,
      pieces: material.pieces,
      quantity: material.quantity,
      unit: material.unit,
      supplier: material.supplier || "",
      remarks: material.remarks || "",
      category: material.category || "",
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      // await testApi.delete(`${BASE_URL}/delete/${id}`);
      await productionApi.delete(`${BASE_URL}/delete/${id}`);
      toast.success("Material deleted");
      fetchRawMaterials();
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="h-10 w-10 rounded-lg border flex items-center justify-center"
          >
            <ArrowLeft />
          </Link>
          <Boxes />
          <h1 className="text-xl font-semibold">Raw Materials</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border rounded-xl p-6 space-y-4"
        >
          <h2 className="font-semibold text-lg">
            {editingId ? "Edit Material" : "Add Material"}
          </h2>

          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name *"
          />
          <Input
            name="pieces"
            type="number"
            value={formData.pieces}
            onChange={handleInputChange}
            placeholder="Pieces *"
          />
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Quantity *"
          />

          {/* UNIT DROPDOWN */}
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select Unit *</option>
            <option value="PCS">PCS</option>
            <option value="BOX">BOX</option>
            <option value="MTR">MTR</option>
            <option value="SET">SET</option>
            <option value="CHART">CHART</option>
          </select>

          <Input
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            placeholder="Supplier"
          />

          <div className="relative">
            {/* SELECT BOX */}
            <div
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm flex items-center justify-between cursor-pointer"
            >
              <span className={formData.category ? "" : "text-muted-foreground"}>
                {formData.category || "Select Category"}
              </span>
              <span>▼</span>
            </div>

            {/* DROPDOWN */}
            {isCategoryOpen && (
              <div className="absolute z-10 w-full bg-card border rounded-md mt-1 shadow-lg">

                {/* SEARCH INPUT */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full px-3 py-2 border-b outline-none text-sm"
                />

                {/* OPTIONS */}
                <div className="max-h-48 overflow-y-auto">
                  {CATEGORY_OPTIONS.filter((cat) =>
                    cat.toLowerCase().includes(categorySearch.toLowerCase())
                  ).map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, category: cat }));
                        setIsCategoryOpen(false);
                        setCategorySearch("");
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                    >
                      {cat}
                    </div>
                  ))}

                  {CATEGORY_OPTIONS.filter((cat) =>
                    cat.toLowerCase().includes(categorySearch.toLowerCase())
                  ).length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No category found
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <Textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Remarks"
          />

          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Add"}
          </Button>
        </form>

        {/* Table */}
        <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Pieces</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawMaterials.map((m) => (
                <TableRow key={m._id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.pieces}</TableCell>
                  <TableCell>{m.quantity}</TableCell>
                  <TableCell>{m.unit}</TableCell>
                  <TableCell>{m.supplier || "—"}</TableCell>
                  <TableCell>{m.category || "—"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(m)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(m._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default RawMaterial;
