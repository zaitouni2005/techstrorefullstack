import { useState, useEffect } from "react";
import { Product, Category } from "@/data/products";
import { api } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Package,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.products.list(),
          api.categories.list(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await api.products.delete(productToDelete);
        setProducts(products.filter((p) => p.id !== productToDelete));
        toast.success("Produit supprimé avec succès");
        setProductToDelete(null);
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);

      const additionalImages = (formData.get("additionalImages") as string)
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      const oldPriceStr = formData.get("oldPrice") as string;
      const oldPrice = oldPriceStr ? Number(oldPriceStr) : undefined;

      const newProductData: Omit<Product, "id"> = {
        name: formData.get("name") as string,
        brand: formData.get("brand") as string,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        oldPrice: oldPrice,
        stock: Number(formData.get("stock")),
        mainImage: formData.get("mainImage") as string,
        images: [formData.get("mainImage") as string, ...additionalImages],
        description: formData.get("description") as string,
        rating: 0,
        specs: [],
      };

      const createdProduct = await api.products.create(newProductData);
      setProducts([createdProduct, ...products]);
      setIsAddDialogOpen(false);
      toast.success("Produit ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-10 h-11 bg-card shadow-sm border-muted-foreground/10 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2 h-11 shadow-sm">
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl">
            <ScrollArea className="max-h-[90vh]">
              <form onSubmit={handleAddProduct} className="p-8 space-y-8 bg-card">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-bold">Nouveau Produit</DialogTitle>
                  <DialogDescription className="text-base">
                    Complétez les informations pour référencer un nouvel article.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Nom du produit
                      </Label>
                      <Input id="name" name="name" placeholder="ex: iPhone 15 Pro" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-sm font-semibold">
                        Marque
                      </Label>
                      <Input id="brand" name="brand" placeholder="ex: Apple" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-semibold">
                        Catégorie
                      </Label>
                      <Select name="category" required>
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
                      <Label htmlFor="price" className="text-sm font-semibold">
                        Prix Actuel (€)
                      </Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="oldPrice"
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        Ancien Prix (€)
                      </Label>
                      <Input
                        id="oldPrice"
                        name="oldPrice"
                        type="number"
                        step="0.01"
                        placeholder="Optionnel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-semibold">
                        Stock Initial
                      </Label>
                      <Input id="stock" name="stock" type="number" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="mainImage"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-primary" /> Image Principale (Lien)
                    </Label>
                    <Input
                      id="mainImage"
                      name="mainImage"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary/30"
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalImages" className="text-sm font-semibold">
                      Galerie d'images (Liens séparés par des virgules)
                    </Label>
                    <Textarea
                      id="additionalImages"
                      name="additionalImages"
                      className="min-h-[80px]"
                      placeholder="URL1, URL2, URL3..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">
                      Description détaillée
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="min-h-[120px] leading-relaxed"
                      required
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="h-12 px-8"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 px-12 shadow-lg shadow-primary/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publication...
                      </>
                    ) : (
                      "Publier le produit"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-muted-foreground/10 bg-card overflow-hidden shadow-sm transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-muted-foreground/10">
              <TableHead className="w-[100px] font-semibold py-4 px-6">Produit</TableHead>
              <TableHead className="font-semibold"></TableHead>
              <TableHead className="font-semibold">Catégorie</TableHead>
              <TableHead className="font-semibold">Prix</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="text-right font-semibold px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                className="group border-b-muted-foreground/10 hover:bg-muted/10 transition-colors"
              >
                <TableCell className="py-4 px-6">
                  <div className="relative w-16 h-16">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full rounded-xl object-cover border border-muted-foreground/10 shadow-sm transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 bg-primary text-[10px] flex items-center justify-center border-2 border-card">
                      {product.images?.length || 1}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col min-w-[200px]">
                    <span className="font-bold text-base group-hover:text-primary transition-colors">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {product.brand}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-medium bg-muted text-muted-foreground rounded-md"
                  >
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-base">
                  <div className="flex flex-col">
                    <span>{product.price.toFixed(2)}€</span>
                    {product.oldPrice && (
                      <span className="text-xs text-muted-foreground line-through font-normal">
                        {product.oldPrice.toFixed(2)}€
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${product.stock < 10 ? "bg-destructive animate-pulse" : "bg-emerald-500"}`}
                    />
                    <span
                      className={`font-bold ${product.stock < 10 ? "text-destructive" : "text-foreground"}`}
                    >
                      {product.stock}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 shadow-xl border-muted-foreground/10"
                    >
                      <DropdownMenuLabel>Gestion</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Edit2 className="w-4 h-4 text-blue-500" /> Modifier la fiche
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => setProductToDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer du catalogue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed rounded-2xl bg-muted/10 border-muted-foreground/20">
          <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">Aucun produit</p>
          <p className="text-sm text-muted-foreground/60">
            Ajustez votre recherche ou ajoutez un produit.
          </p>
        </div>
      )}

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Cette action est définitive. Le produit sera retiré du catalogue et ne sera plus
              visible par les clients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11">Conserver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11"
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
