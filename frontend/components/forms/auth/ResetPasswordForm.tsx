"use client";

import { handleBackendFormErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "lucide-react";

import SubmitFormButton from "@/components/shared/SubmitFormButton";
import { toast } from "@/hooks/use-toast";
import { postData } from "@/lib/actions/data.action";
import { ResetPasswordRequest } from "@/lib/validations/auth/reset-password.validations";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({
  token
}: ResetPasswordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof ResetPasswordRequest>>({
    resolver: zodResolver(ResetPasswordRequest),
    defaultValues: {
      email: searchParams.get("email") || "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordRequest>) => {
    setIsSubmitting(true);

    const dataToSend = {
      ...values,
      token
    }

    const response = await postData({
      url: "/reset-password",
      data: dataToSend,
      path: "/login",
    });

    setIsSubmitting(false);

    if (response && !response.success) {
      handleBackendFormErrors({
        setError: form.setError,
        error: response.error,
        toast,
      });
      return;
    }

    router.push("/login");

    toast({
      variant: "success",
      description: response?.result?.message || "Password reset successfully",
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Password Confirmation <span className="text-red-500">*</span>
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
          submitLabel="Reset"
        />
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
