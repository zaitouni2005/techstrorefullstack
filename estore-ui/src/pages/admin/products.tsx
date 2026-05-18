import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Product, Category } from "@/types";
import { api } from "@/services/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Plus, Edit2, Trash2, ArrowUpDown, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const emptyProduct = () => ({
  name: "",
  brand: "",
  category: "",
  price: 0,
  oldPrice: undefined as number | undefined,
  stock: 0,
  mainImage: "",
  images: [] as string[],
  description: "",
  descriptionMarkdown: "",
  rating: 0,
  specs: [] as { label: string; value: string }[],
});

export function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ReturnType<typeof emptyProduct>>(emptyProduct());
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, c] = await Promise.all([api.products.list(), api.categories.list()]);
        setProducts(productRes.data);
        setCategories(c);
      } catch {
        toast.error("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct());
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      stock: p.stock,
      mainImage: p.mainImage,
      images: p.images,
      description: p.description,
      descriptionMarkdown: p.descriptionMarkdown ?? "",
      rating: p.rating,
      specs: p.specs,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const categoryId = categories.find((c) => c.name === form.category)?.id || "";
      const payload = {
        ...form,
        categoryId,
        images: [form.mainImage, ...form.images.filter((i) => i !== form.mainImage)],
      };
      if (editingProduct) {
        const updated = await api.products.update(editingProduct.id, payload);
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
        toast.success("Produit modifié avec succès");
      } else {
        const created = await api.products.create(payload);
        setProducts([created, ...products]);
        toast.success("Produit ajouté avec succès");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.products.delete(deleteId);
      setProducts(products.filter((p) => p.id !== deleteId));
      toast.success("Produit supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Produit <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 shrink-0">
            <img
              src={row.original.mainImage}
              alt=""
              className="w-full h-full rounded-lg object-cover border"
            />
            <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 bg-primary text-[10px] border-2 border-card">
              {row.original.images.length}
            </Badge>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate max-w-[200px]">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.brand}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className="font-medium bg-muted text-muted-foreground rounded-md"
        >
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Prix <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.original.price.toFixed(2)}€</span>
          {row.original.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {row.original.oldPrice.toFixed(2)}€
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Stock <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${stock < 10 ? "bg-destructive animate-pulse" : "bg-emerald-500"}`}
            />
            <span className={`font-bold ${stock < 10 ? "text-destructive" : ""}`}>{stock}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row.original);
            }}
          >
            <Edit2 className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.original.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">{products.length} produits référencés.</p>
        </div>
        <Button onClick={openAdd} className="gap-2 h-11 shadow-sm">
          <Plus className="w-4 h-4" /> Ajouter un produit
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Rechercher un produit..."
        loading={loading}
        onRowClick={(row) => navigate(`/products/${row.id}`)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifiez les informations du produit ci-dessous."
                  : "Remplissez les informations pour ajouter un produit."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cat">Catégorie</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oldPrice" className="text-muted-foreground">
                    Ancien prix (€)
                  </Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    step="0.01"
                    value={form.oldPrice ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Optionnel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Image principale (URL)
                </Label>
                <Input
                  value={form.mainImage}
                  onChange={(e) => setForm({ ...form, mainImage: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description (courte)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description détaillée (Markdown)</Label>
                <MarkdownEditor
                  value={form.descriptionMarkdown ?? ""}
                  onChange={(v) => setForm({ ...form, descriptionMarkdown: v })}
                  placeholder="Rédigez une description détaillée en markdown..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingProduct ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est définitive.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
