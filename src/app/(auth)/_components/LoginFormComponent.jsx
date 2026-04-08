"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import {loginAction} from "../../../../action/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastIndicator,
  ToastQueue,
  ToastTitle,
} from "@heroui/react";

export default function LoginFormComponent() {

  const [submitError, setSubmitError] = useState(null);



  const schema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
  });



  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError:true,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginAction(data);
      console.log("Login response:", response);

      if (!response?.success) {
        setSubmitError("Invalid email or password");
      }


    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Something went wrong");
    }
  };



  return (
      <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
      >
        {submitError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {submitError}
            </div>
        )}

        <div>
          <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
              placeholder="you@example.com"
          />
          {
              errors.email && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.email.message}
                  </p>
              )}

        </div>

        <div>
          <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
              placeholder="••••••••"
          />
          {
              errors.password && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.password.message}
                  </p>
              )

          }
        </div>

        <Button
            type="submit"
            variant="solid"
            className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
        >
          Sign in
        </Button>
      </form>
  );
}