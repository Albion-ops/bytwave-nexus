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

const clientSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100),
  contact_person: z.string().min(1, "Contact person is required").max(100),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  service_type: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  status: z.string(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      company_name: client?.company_name || "",
      contact_person: client?.contact_person || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      service_type: client?.service_type || "",
      notes: client?.notes || "",
      status: client?.status || "active",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (client) {
        const updateData = {
          company_name: data.company_name,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          service_type: data.service_type || null,
          notes: data.notes || null,
          status: data.status,
        };
        
        const { error } = await supabase
          .from("clients")
          .update(updateData)
          .eq("id", client.id);
        
        if (error) throw error;
        toast({ title: "Client updated successfully" });
      } else {
        const insertData = {
          company_name: data.company_name,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          service_type: data.service_type || null,
          notes: data.notes || null,
          status: data.status,
          created_by: user?.id,
        };
        
        const { error } = await supabase
          .from("clients")
          .insert([insertData]);
        
        if (error) throw error;
        toast({ title: "Client created successfully" });
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
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
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
            {client ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
