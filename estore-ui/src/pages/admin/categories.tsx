import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Category, Product } from "@/types";
import { api } from "@/services/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, productRes] = await Promise.all([api.categories.list(), api.products.list()]);
        setCategories(c);
        setProducts(productRes.data);
      } catch {
        toast.error("Erreur lors du chargement des catégories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openAdd = () => {
    setEditingCat(null);
    setForm({ name: "", slug: "", image: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setForm({ name: cat.name, slug: cat.slug, image: cat.image, description: cat.description });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
      if (editingCat) {
        const updated = await api.categories.update(editingCat.id, { ...form, slug });
        setCategories(categories.map((c) => (c.id === editingCat.id ? updated : c)));
        toast.success("Catégorie modifiée");
      } else {
        const created = await api.categories.create({ ...form, slug });
        setCategories([...categories, created]);
        toast.success("Catégorie ajoutée");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAttempt = (cat: Category) => {
    const count = products.filter((p) => p.category === cat.name).length;
    if (count > 0) {
      setErrorAlert(
        `Impossible de supprimer "${cat.name}" — ${count} produit(s) y sont rattachés.`,
      );
    } else {
      setDeleteTarget(cat);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.categories.delete(deleteTarget.id);
      setCategories(categories.filter((c) => c.id !== deleteTarget.id));
      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Catégorie",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <img
            src={row.original.image}
            alt=""
            className="w-12 h-12 rounded-xl object-cover border shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold">{row.original.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{row.original.slug}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
          {row.original.description}
        </p>
      ),
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
              handleDeleteAttempt(row.original);
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
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">{categories.length} catégories.</p>
        </div>
        <Button onClick={openAdd} className="gap-2 h-11 shadow-sm">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Rechercher une catégorie..."
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingCat ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </DialogTitle>
              <DialogDescription>Créez ou modifiez une catégorie.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nom</Label>
                <Input
                  className="col-span-3"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Slug</Label>
                <Input
                  className="col-span-3"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="Auto-généré"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image (URL)</Label>
                <Input
                  className="col-span-3"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Description</Label>
                <Textarea
                  className="col-span-3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
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
                {editingCat ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!errorAlert} onOpenChange={() => setErrorAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle>Action impossible</AlertDialogTitle>
            <AlertDialogDescription>{errorAlert}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorAlert(null)}>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Supprimer la catégorie <span className="font-bold">"{deleteTarget?.name}"</span> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
