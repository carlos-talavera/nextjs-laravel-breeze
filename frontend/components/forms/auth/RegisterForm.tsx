"use client"

import { handleBackendFormErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EyeSlashIcon } from "@heroicons/react/24/solid"
import { EyeIcon } from "lucide-react"

import SubmitFormButton from "@/components/shared/SubmitFormButton"
import { useUser } from "@/context/UserProvider"
import { toast } from "@/hooks/use-toast"
import { register } from "@/lib/auth/client"
import { RegisterRequest } from "@/lib/validations/auth/register.validations"
import Link from "next/link"

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const router = useRouter()
  const { registerUser } = useUser();

  const form = useForm<z.infer<typeof RegisterRequest>>({
    resolver: zodResolver(RegisterRequest),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    },
  })
 
  const onSubmit = async (values: z.infer<typeof RegisterRequest>) => {
    setIsSubmitting(true)

    try {
      const user = await register(values);
      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ user }),
        cache: "no-store",
      });
      registerUser(user);
      
      router.push("/verify-email");

      toast({
        variant: "success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      handleBackendFormErrors({
        setError: form.setError,
        error,
        toast,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Full name"
                  className="background-light900_dark text-slate900_light800 placeholder no-focus slate-border outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="background-light900_dark text-slate900_light800 placeholder no-focus slate-border outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <div className="background-light900_dark slate-border flex items-center justify-between rounded-md border">
                <FormControl>
                  <>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      className="text-slate900_light800 placeholder no-focus flex-1 border-none bg-transparent outline-none"
                      {...field}
                    />
                    <div
                      className="flex cursor-pointer select-none items-center pr-3"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashIcon className="text-slate900_light800 size-4" />
                      ) : (
                        <EyeIcon className="text-slate900_light800 size-4" />
                      )}
                    </div>
                  </>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>
                Password Confirmation{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <div className="background-light900_dark slate-border flex items-center justify-between rounded-md border">
                <FormControl>
                  <>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="text-slate900_light800 placeholder no-focus flex-1 border-none bg-transparent outline-none"
                      {...field}
                    />
                    <div
                      className="flex cursor-pointer select-none items-center pr-3"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashIcon className="text-slate900_light800 size-4" />
                      ) : (
                        <EyeIcon className="text-slate900_light800 size-4" />
                      )}
                    </div>
                  </>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitFormButton
          isSubmitting={isSubmitting}
          submitLabel="Register"
          extraElement={
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="text-slate900_light800 text-sm underline"
              >
                Already have an account?
              </Link>
            </div>
          }
        />
      </form>
    </Form>
  );
}

export default RegisterForm