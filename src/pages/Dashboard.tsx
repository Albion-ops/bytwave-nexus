import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentSession, signOut, checkIsAdmin } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Users, Package, FileText, BarChart } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>

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
