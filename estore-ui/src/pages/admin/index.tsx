import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/services/api";
import { toast } from "sonner";
import type { DashboardStats, SalesPoint } from "@/types";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#1e68d7", "#10b981", "#f59e0b", "#ef4444"];

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<SalesPoint[]>([]);
  const [categories, setCategories] = useState<{ name: string; value: number }[]>([]);
  const [activities, setActivities] = useState<
    { title: string; description: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, salesData, catData, activityData] = await Promise.all([
          api.dashboard.stats(),
          api.dashboard.sales(),
          api.dashboard.categoryBreakdown(),
          api.dashboard.recentActivity(),
        ]);
        setStats(statsData);
        setSales(salesData);
        setCategories(catData);
        setActivities(activityData);
      } catch {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chiffre d'Affaires"
          value={`${stats?.revenue.toLocaleString()}€`}
          icon={DollarSign}
          trend={`${stats?.revenueChange}% vs mois dernier`}
          trendUp={(stats?.revenueChange ?? 0) > 0}
        />
        <StatCard
          title="Commandes"
          value={String(stats?.orders ?? 0)}
          icon={ShoppingCart}
          trend={`${stats?.ordersChange}% vs mois dernier`}
          trendUp={(stats?.ordersChange ?? 0) > 0}
        />
        <StatCard
          title="Produits en Stock"
          value={String(stats?.products ?? 0)}
          icon={Package}
          trend={`${stats?.lowStock ?? 0} alertes stock bas`}
          trendUp={false}
        />
        <StatCard
          title="Clients"
          value={String(stats?.customers ?? 0)}
          icon={Users}
          trend={`${stats?.customersChange}% vs mois dernier`}
          trendUp={(stats?.customersChange ?? 0) > 0}
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
              <BarChart data={sales}>
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
            <CardDescription>Répartition des ventes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Alertes de stock</CardTitle>
              <CardDescription>Produits avec moins de 10 unités.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/products">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats && stats.lowStock > 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {stats.lowStock} produit{stats.lowStock > 1 ? "s" : ""} avec un stock bas
                  nécessite{stats.lowStock > 1 ? "nt" : ""} votre attention.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Aucune alerte de stock.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions sur la boutique.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase whitespace-nowrap">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}) {
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

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
        <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
