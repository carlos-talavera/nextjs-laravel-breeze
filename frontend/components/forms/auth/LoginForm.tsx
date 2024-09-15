"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SubmitFormButton from "@/components/shared/SubmitFormButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DASHBOARD_ROUTE } from "@/constants";
import { useUser } from "@/context/UserProvider";
import { toast } from "@/hooks/use-toast";
import { login } from "@/lib/auth/client";
import { handleBackendFormErrors } from "@/lib/utils";
import { LoginRequest } from "@/lib/validations/auth/login.validations";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const router = useRouter()
  const { registerUser } = useUser()

  const form = useForm<z.infer<typeof LoginRequest>>({
    resolver: zodResolver(LoginRequest),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    },
  })
 
  const onSubmit = async (values: z.infer<typeof LoginRequest>) => {
    setIsSubmitting(true)

    try {
      const user = await login(values);
      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ user }),
        cache: "no-store"
      });
      registerUser(user)
      router.push(DASHBOARD_ROUTE);
    } catch (error: any) {
      handleBackendFormErrors({
        setError: form.setError,
        error,
        toast
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your email"
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
              <FormLabel>Password</FormLabel>
              <div className="background-light900_dark slate-border flex items-center justify-between rounded-md border">
                <FormControl>
                  <>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Your password"
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
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  className="gray-border text-slate900_light800 rounded-full"
                />
              </FormControl>
              <FormLabel className="text-slate900_light800 cursor-pointer">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />
        <SubmitFormButton
          isSubmitting={isSubmitting}
          submitLabel="Log in"
          extraElement={
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="text-slate900_light800 text-sm underline"
              >
                Register
              </Link>
              <Link
                href="/forgot-password"
                className="text-slate900_light800 text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
          }
        />
      </form>
    </Form>
  );
};

export default LoginForm;
