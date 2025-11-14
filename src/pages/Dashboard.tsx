import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentSession, signOut, checkIsAdmin } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Users, Package, FileText, BarChart, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { 
  LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    requestsByMonth: [] as any[],
    requestsByStatus: [] as any[],
    requestsByService: [] as any[],
    clientGrowth: [] as any[]
  });

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getCurrentSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Check if user is admin
      const adminStatus = await checkIsAdmin(session.user.id);
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        await fetchAnalyticsData();
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Real-time subscriptions for analytics updates
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to service_requests changes
    const requestsChannel = supabase
      .channel('service_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests'
        },
        (payload) => {
          console.log('Service requests changed:', payload);
          fetchAnalyticsData();
        }
      )
      .subscribe();

    // Subscribe to clients changes
    const clientsChannel = supabase
      .channel('clients_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Clients changed:', payload);
          fetchAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, [isAdmin]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch service requests
      const { data: requests } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at");

      // Fetch clients
      const { data: clients } = await supabase
        .from("clients")
        .select("*")
        .order("created_at");

      if (requests) {
        // Group by month
        const monthlyData = requests.reduce((acc: any, req: any) => {
          const month = new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const requestsByMonth = Object.entries(monthlyData).map(([month, count]) => ({
          month,
          requests: count
        }));

        // Group by status
        const statusData = requests.reduce((acc: any, req: any) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {});

        const requestsByStatus = Object.entries(statusData).map(([status, count]) => ({
          name: status,
          value: count
        }));

        // Group by service type
        const serviceData = requests.reduce((acc: any, req: any) => {
          acc[req.service_type] = (acc[req.service_type] || 0) + 1;
          return acc;
        }, {});

        const requestsByService = Object.entries(serviceData).map(([service, count]) => ({
          service,
          count
        }));

        setAnalyticsData(prev => ({
          ...prev,
          requestsByMonth,
          requestsByStatus,
          requestsByService
        }));
      }

      if (clients) {
        // Client growth over time
        const growthData = clients.reduce((acc: any, client: any) => {
          const month = new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        let cumulative = 0;
        const clientGrowth = Object.entries(growthData).map(([month, count]: [string, any]) => {
          cumulative += count;
          return { month, clients: cumulative };
        });

        setAnalyticsData(prev => ({ ...prev, clientGrowth }));
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">BW</span>
              </div>
              <span className="font-bold text-xl">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage your services, clients, and requests." : "View your dashboard and services."}
          </p>
        </div>

        {!isAdmin && (
          <Card className="mb-8 border-accent bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You don't have admin access yet. Contact an administrator to grant you access.
              </p>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Active offerings</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">8 pending review</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45.2K</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="analytics" className="space-y-4">
              <TabsList>
                <TabsTrigger value="analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Service Requests Over Time</CardTitle>
                      <CardDescription>Monthly trend of incoming service requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.requestsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="requests" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Client Growth</CardTitle>
                      <CardDescription>Cumulative client acquisition over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analyticsData.clientGrowth}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="clients" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary) / 0.2)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Requests by Service Type</CardTitle>
                      <CardDescription>Distribution of service requests by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={analyticsData.requestsByService}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="service" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Requests by Status</CardTitle>
                      <CardDescription>Current status distribution of all requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.requestsByStatus}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {analyticsData.requestsByStatus.map((entry: any, index: number) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={[
                                  'hsl(var(--chart-1))',
                                  'hsl(var(--chart-2))',
                                  'hsl(var(--chart-3))',
                                  'hsl(var(--chart-4))',
                                  'hsl(var(--chart-5))'
                                ][index % 5]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New service request received</p>
                          <p className="text-xs text-muted-foreground">CCTV Installation - Acme Corp</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Client added</p>
                          <p className="text-xs text-muted-foreground">TechStart Solutions</p>
                          <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Service completed</p>
                          <p className="text-xs text-muted-foreground">POS System Installation - Retail Plus</p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Services Management</CardTitle>
                    <CardDescription>Manage your service offerings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Service management interface coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clients">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>View and manage your clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Client management interface coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Service Requests</CardTitle>
                    <CardDescription>Manage incoming service requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Request management interface coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
