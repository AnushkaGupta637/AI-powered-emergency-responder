'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Trash2, Save, ShieldAlert } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

// Define the schema for an emergency contact
const contactSchema = z.object({
  name: z.string().min(1, { message: 'Contact name is required.' }),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s\-()]+$/, { message: 'Invalid phone number format.' }),
});

// Define the main form schema
const setupSchema = z.object({
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContacts: z.array(contactSchema).min(1, { message: 'At least one emergency contact is required.' }),
});

type SetupFormValues = z.infer<typeof setupSchema>;

const LOCAL_STORAGE_KEY = 'lifeline_ai_setup';

export default function SetupPage() {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      medicalHistory: '',
      allergies: '',
      medications: '',
      bloodType: '',
      emergencyContacts: [{ name: '', phoneNumber: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'emergencyContacts',
  });

  // Load data from local storage on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Validate parsed data against schema before setting values
                const validation = setupSchema.safeParse(parsedData);
                if (validation.success) {
                    form.reset(validation.data);
                } else {
                    console.error("Invalid data found in local storage:", validation.error);
                    localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
                }
            }
        } catch (error) {
            console.error("Failed to load data from local storage:", error);
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear potentially corrupt data
        } finally {
            setIsLoaded(true); // Mark as loaded even if loading failed
        }
    }
  }, [form]); // Dependency array includes form to ensure reset works correctly


  const onSubmit = (values: SetupFormValues) => {
     if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
            toast({
                title: "Setup Saved",
                description: "Your emergency information has been saved locally.",
            });
             // Update setup completion status (this is a placeholder, implement proper state management if needed)
             // You might want to redirect or show a success message
        } catch (error) {
            console.error("Failed to save data to local storage:", error);
            toast({
                title: "Save Error",
                description: "Could not save your information. Please try again.",
                variant: "destructive",
            });
        }
    }
  };

  if (!isLoaded && typeof window !== 'undefined') {
      return <div className="flex justify-center items-center min-h-screen">Loading setup...</div>;
  }


  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
         <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lifeline AI Setup</h1>
          <Link href="/" passHref>
             <Button variant="outline" size="sm">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <Card className="w-full max-w-3xl shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-primary"/>Emergency Profile</CardTitle>
            <CardDescription>
              This information will be stored locally on your device and shared with emergency contacts and services during an extreme emergency.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Medical Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Medical Information (Optional)</h3>
                     <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Relevant Medical History</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Heart condition, Diabetes, Epilepsy" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Penicillin, Peanuts, Bee stings" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Medications</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Insulin, Aspirin (include dosage if known)" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Blood Type</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., O+, A-, Unknown" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>

                <Separator />

                {/* Emergency Contacts Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Emergency Contacts</h3>
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-md bg-background">
                       <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <FormField
                            control={form.control}
                            name={`emergencyContacts.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Jane Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name={`emergencyContacts.${index}.phoneNumber`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="e.g., +1 555-123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mt-6 md:mt-5 text-destructive hover:bg-destructive/10 flex-shrink-0"
                        aria-label="Remove contact"
                        disabled={fields.length <= 1} // Disable remove if only one contact left
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                   {form.formState.errors.emergencyContacts?.root?.message && (
                        <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.emergencyContacts.root.message}
                        </p>
                    )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', phoneNumber: '' })}
                    className="mt-2"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t pt-6">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Information
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <footer className="bg-secondary text-muted-foreground p-4 text-center text-sm border-t mt-8">
        © {new Date().getFullYear()} Lifeline AI. Privacy Assured.
      </footer>
    </div>
  );
}
