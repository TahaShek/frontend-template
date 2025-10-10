import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/form";
import { userFormSchema } from "./userFormSchema";
import type { UserFormValues } from "./userFormSchema";

// Define the field configuration array - similar to your MUI example
const textFields = [
  {
    name: "firstName" as keyof UserFormValues,
    label: "First Name",
    type: "text" as const,
    placeholder: "John",
    gridClass: "md:col-span-6",
  },
  {
    name: "lastName" as keyof UserFormValues,
    label: "Last Name",
    type: "text" as const,
    placeholder: "Doe",
    gridClass: "md:col-span-6",
  },
  {
    name: "email" as keyof UserFormValues,
    label: "Email",
    type: "email" as const,
    placeholder: "john.doe@example.com",
    description: "We'll never share your email with anyone else.",
    gridClass: "md:col-span-12",
  },
  {
    name: "cellPhone" as keyof UserFormValues,
    label: "Cell Phone",
    type: "tel" as const,
    placeholder: "555-123-4567",
    gridClass: "md:col-span-6",
  },
  {
    name: "zipCode" as keyof UserFormValues,
    label: "ZIP Code",
    type: "text" as const,
    placeholder: "12345",
    gridClass: "md:col-span-6",
  },
  {
    name: "address1" as keyof UserFormValues,
    label: "Address Line 1",
    type: "text" as const,
    placeholder: "123 Main St",
    gridClass: "md:col-span-12",
  },
  {
    name: "address2" as keyof UserFormValues,
    label: "Address Line 2 (Optional)",
    type: "text" as const,
    placeholder: "Apt 4B",
    gridClass: "md:col-span-8",
  },
  {
    name: "city" as keyof UserFormValues,
    label: "City",
    type: "text" as const,
    placeholder: "New York",
    gridClass: "md:col-span-4",
  },
];

export function UserForm() {
  // 1. Define your form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      cellPhone: "",
      address1: "",
      address2: "",
      city: "",
      zipCode: "",
    },
  });

  // 2. Define a submit handler
  function onSubmit(values: UserFormValues) {
    // Do something with the form values
    // ✅ This will be type-safe and validated
    console.log("Form submitted with values:", values);
    alert("Check the console for form values!");
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">User Information Form</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill out the form below with your information
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Grid container for form fields */}
            <div className="grid grid-cols-12 gap-4">
              {textFields.map((field) => (
                <div key={field.name} className={`col-span-12 ${field.gridClass}`}>
                  <TextInput {...field} />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

