import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { products } from "@/data/products";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const data = [
  { name: "Lun", total: 1200 },
  { name: "Mar", total: 1900 },
  { name: "Mer", total: 1500 },
  { name: "Jeu", total: 2400 },
  { name: "Ven", total: 2800 },
  { name: "Sam", total: 3200 },
  { name: "Dim", total: 2100 },
];

const categoryData = [
  { name: "Smartphones", value: 45 },
  { name: "Ordinateurs", value: 30 },
  { name: "Tablettes", value: 15 },
  { name: "Accessoires", value: 10 },
];

export function AdminDashboard() {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre interface d'administration.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chiffre d'Affaires"
          value="15,230€"
          icon={DollarSign}
          trend="+12% vs mois dernier"
          trendUp={true}
        />
        <StatCard
          title="Commandes"
          value="142"
          icon={ShoppingCart}
          trend="+5% vs mois dernier"
          trendUp={true}
        />
        <StatCard
          title="Produits en Stock"
          value={totalStock.toString()}
          icon={Package}
          trend={`${lowStockProducts.length} alertes stock bas`}
          trendUp={false}
        />
        <StatCard
          title="Clients"
          value="1,204"
          icon={Users}
          trend="+18% vs mois dernier"
          trendUp={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Ventes cette semaine</CardTitle>
            <CardDescription>Évolution du chiffre d'affaires quotidien.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}€`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                  cursor={{ fill: "rgba(226, 232, 240, 0.4)" }}
                />
                <Bar dataKey="total" fill="#1e68d7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Top Catégories</CardTitle>
            <CardDescription>Répartition des ventes par catégorie.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#1e68d7"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#1e68d7" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{cat.name}</p>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#1e68d7]" style={{ width: `${cat.value}%` }} />
                    </div>
                  </div>
                  <div className="text-sm font-medium">{cat.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table or List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Alertes de stock</CardTitle>
              <CardDescription>Produits avec moins de 10 unités en stock.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/products">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-6">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border shadow-sm"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.brand} • {p.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={p.stock === 0 ? "destructive" : "secondary"} className="mb-1">
                        {p.stock === 0 ? "Rupture" : `${p.stock} restants`}
                      </Badge>
                      <p className="text-xs font-medium text-muted-foreground">{p.price}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions sur la boutique.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <ActivityItem
                title="Nouvelle commande #4592"
                description="Par Jean Dupont • 129.00€"
                time="Il y a 2 min"
              />
              <ActivityItem
                title="Produit ajouté"
                description="iPhone 15 Pro Max par Admin"
                time="Il y a 15 min"
              />
              <ActivityItem
                title="Stock mis à jour"
                description="MacBook Pro M3 (+10 unités)"
                time="Il y a 1h"
              />
              <ActivityItem
                title="Nouvel utilisateur"
                description="Marie Curie s'est inscrite"
                time="Il y a 2h"
              />
            </div>
            <Button variant="ghost" className="w-full mt-6 gap-2" size="sm">
              Voir tout le journal <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trendUp ? (
            <TrendingUp className="w-3 h-3 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3 h-3 text-amber-600" />
          )}
          <span
            className={`text-xs font-medium ${trendUp ? "text-emerald-600" : "text-amber-600"}`}
          >
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-[10px] font-medium text-muted-foreground uppercase">{time}</div>
    </div>
  );
}
