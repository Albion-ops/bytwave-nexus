import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  price_range: z.string().max(50).optional(),
  features: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      category: service?.category || "",
      description: service?.description || "",
      price_range: service?.price_range || "",
      features: service?.features?.join(", ") || "",
      image_url: service?.image_url || "",
      is_active: service?.is_active ?? true,
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const featuresArray = data.features
        ? data.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      if (service) {
        const updateData = {
          name: data.name,
          category: data.category,
          description: data.description || null,
          price_range: data.price_range || null,
          features: featuresArray,
          image_url: data.image_url || null,
          is_active: data.is_active,
        };
        
        const { error } = await supabase
          .from("services")
          .update(updateData)
          .eq("id", service.id);
        
        if (error) throw error;
        toast({ title: "Service updated successfully" });
      } else {
        const insertData = {
          name: data.name,
          category: data.category,
          description: data.description || null,
          price_range: data.price_range || null,
          features: featuresArray,
          image_url: data.image_url || null,
          is_active: data.is_active,
        };
        
        const { error } = await supabase
          .from("services")
          .insert([insertData]);
        
        if (error) throw error;
        toast({ title: "Service created successfully" });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Range</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., $500 - $2000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (comma-separated)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Feature 1, Feature 2, Feature 3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value ? "true" : "false"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
