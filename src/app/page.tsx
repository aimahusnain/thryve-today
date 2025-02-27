"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"              
import { useForm } from "react-hook-form"
import * as z from "zod"

// Form validation schema
const formSchema = z.object({
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  cityStateZip: z.string().min(5, { message: "City, state, and zip code are required." }),
  phoneHome: z.string().min(10, { message: "Home phone must be at least 10 digits." }),
  phoneCell: z.string().min(10, { message: "Cell phone must be at least 10 digits." }),
})

export default function EnrollmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      email: "",
      dateOfBirth: "",
      address: "",
      cityStateZip: "",
      phoneHome: "",
      phoneCell: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit enrollment")
      }

      // toast({
      //   title: "Enrollment Submitted",
      //   description: "Your enrollment has been successfully submitted.",
      // })

      // Reset form after successful submission
      form.reset()

      // Optionally redirect to a success page
      // router.push("/enroll/success");
    } catch (error) {
      console.error("Submission error:", error)
      // toast({
      //   title: "Submission Failed",
      //   description: error instanceof Error ? error.message : "Failed to submit enrollment",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Student Enrollment Form</CardTitle>
          <CardDescription>Please fill out all fields to complete your enrollment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
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
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cityStateZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City, State, Zip</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY 10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneCell"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cell Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Enrollment"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

