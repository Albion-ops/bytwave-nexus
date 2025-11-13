import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Monitor, 
  ShoppingCart, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Award,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.service,
          message: formData.message
        }]);

      if (error) throw error;

      toast.success("Request submitted successfully! We'll contact you soon.");
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 154, 255, 0.9) 0%, rgba(0, 218, 255, 0.7) 100%), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Professional Technology Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              CCTV Systems • Hardware & Software • Point of Sale Solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <a href="#contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  Get Started
                </Button>
              </a>
              <a href="#services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Services
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive technology solutions for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>CCTV Installation</CardTitle>
                <CardDescription>
                  Professional security camera systems installation and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    HD & 4K Cameras
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Remote Monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    24/7 Support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Hardware Supply</CardTitle>
                <CardDescription>
                  Quality computer hardware and networking equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Latest Technology
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Competitive Pricing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Warranty Support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Software Solutions</CardTitle>
                <CardDescription>
                  Custom software development and maintenance services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Custom Development
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    System Integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Ongoing Maintenance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>POS Systems</CardTitle>
                <CardDescription>
                  Modern point of sale systems for retail businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Cloud-Based
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Inventory Management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Analytics Dashboard
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose BytWave?</h2>
            <p className="text-xl text-muted-foreground">
              Industry-leading expertise and customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Response</h3>
              <p className="text-muted-foreground">
                Quick turnaround times for all service requests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Experts</h3>
              <p className="text-muted-foreground">
                Highly trained and certified technicians
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground">
                24/7 customer support for all clients
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                Premium quality products and services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              Request a quote or consultation today
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type</Label>
                    <select
                      id="service"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="CCTV">CCTV Installation</option>
                      <option value="Hardware">Hardware Supply</option>
                      <option value="Software">Software Solutions</option>
                      <option value="POS">POS Systems</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your requirements..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
