import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ShieldAlert, Mail, Clock, UserCheck } from "lucide-react";
import { format } from "date-fns";
import type { User } from "@shared/models/auth";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="pt-6 pb-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/me"],
    enabled: !!user,
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: adminCheck?.isAdmin === true,
  });

  if (authLoading || adminCheckLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
          <ShieldAlert className="w-16 h-16 text-muted-foreground/40" />
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p className="text-muted-foreground">Please sign in to access this page.</p>
          <a href="/api/login" className="text-primary underline text-sm">Sign In</a>
        </div>
      </Layout>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
          <ShieldAlert className="w-16 h-16 text-destructive/40" />
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  const todayCount = users?.filter(u => {
    if (!u.createdAt) return false;
    const d = new Date(u.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length ?? 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Sabhi registered users ki details yahan dikhenge</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={users?.length ?? 0} icon={Users} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
          <StatCard label="Aaj Login Kiye" value={todayCount} icon={UserCheck} color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
          <StatCard label="Email Users" value={users?.filter(u => u.email).length ?? 0} icon={Mail} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registered Users
              <Badge variant="secondary" className="ml-2">{users?.length ?? 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">User</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground hidden md:table-cell">User ID</th>
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => {
                      const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || "?";
                      return (
                        <tr key={u.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 flex-shrink-0">
                                <AvatarImage src={u.profileImageUrl ?? ""} alt={initials} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">
                                  {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                                </p>
                                <p className="text-xs text-muted-foreground sm:hidden">{u.email ?? "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">
                            {u.email ?? <span className="italic text-muted-foreground/50">No email</span>}
                          </td>
                          <td className="py-3 px-3 hidden md:table-cell">
                            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{u.id.slice(0, 16)}…</code>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                              {u.createdAt ? format(new Date(u.createdAt), "dd MMM yyyy, hh:mm a") : "—"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Abhi koi user login nahi kiya hai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
