"use client";

import { useState, ChangeEvent, FormEvent } from "react"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define TypeScript interfaces
interface FormData {
  studentName: string;
  email: string;
  dateOfBirth: string;
  address: string;
  cityStateZip: string;
  phoneHome: string;
  phoneCell: string;
}

interface FormErrors {
  studentName: string;
  email: string;
  dateOfBirth: string;
  address: string;
  cityStateZip: string;
  phoneHome: string;
  phoneCell: string;
}

interface FormGroupProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

export default function EnrollmentForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    cityStateZip: "",
    phoneHome: "",
    phoneCell: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    studentName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    cityStateZip: "",
    phoneHome: "",
    phoneCell: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Student name validation
    if (formData.studentName.length < 2) {
      newErrors.studentName = "Student name must be at least 2 characters.";
      isValid = false;
    } else {
      newErrors.studentName = "";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    } else {
      newErrors.email = "";
    }
    
    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
      isValid = false;
    } else {
      newErrors.dateOfBirth = "";
    }
    
    // Address validation
    if (formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
      isValid = false;
    } else {
      newErrors.address = "";
    }
    
    // City, state, zip validation
    if (formData.cityStateZip.length < 5) {
      newErrors.cityStateZip = "City, state, and zip code are required.";
      isValid = false;
    } else {
      newErrors.cityStateZip = "";
    }
    
    // Phone validations
    if (formData.phoneHome.length < 10) {
      newErrors.phoneHome = "Home phone must be at least 10 digits.";
      isValid = false;
    } else {
      newErrors.phoneHome = "";
    }
    
    if (formData.phoneCell.length < 10) {
      newErrors.phoneCell = "Cell phone must be at least 10 digits.";
      isValid = false;
    } else {
      newErrors.phoneCell = "";
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit enrollment");
      }

      // Success toast notification
      toast.success("Enrollment Submitted", {
        description: "Your enrollment has been successfully submitted.",
      });

      // Reset form after successful submission
      setFormData({
        studentName: "",
        email: "",
        dateOfBirth: "",
        address: "",
        cityStateZip: "",
        phoneHome: "",
        phoneCell: "",
      });

      // Optionally redirect to a success page
      // router.push("/enroll/success");
    } catch (error) {
      console.error("Submission error:", error);
      
      // Error toast notification
      toast.error("Submission Failed", {
        description: error instanceof Error ? error.message : "Failed to submit enrollment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // FormGroup component to reduce repetition
  const FormGroup = ({ label, name, type = "text", placeholder, value, onChange, error }: FormGroupProps) => (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Student Enrollment Form</CardTitle>
          <CardDescription>
            Please fill out all fields to complete your enrollment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup
              label="Student Name"
              name="studentName"
              placeholder="Full Name"
              value={formData.studentName}
              onChange={handleChange}
              error={errors.studentName}
            />

            <FormGroup
              label="Email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormGroup
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />

            <FormGroup
              label="Street Address"
              name="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            <FormGroup
              label="City, State, Zip"
              name="cityStateZip"
              placeholder="New York, NY 10001"
              value={formData.cityStateZip}
              onChange={handleChange}
              error={errors.cityStateZip}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="Home Phone"
                name="phoneHome"
                placeholder="(555) 123-4567"
                value={formData.phoneHome}
                onChange={handleChange}
                error={errors.phoneHome}
              />

              <FormGroup
                label="Cell Phone"
                name="phoneCell"
                placeholder="(555) 987-6543"
                value={formData.phoneCell}
                onChange={handleChange}
                error={errors.phoneCell}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Enrollment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}