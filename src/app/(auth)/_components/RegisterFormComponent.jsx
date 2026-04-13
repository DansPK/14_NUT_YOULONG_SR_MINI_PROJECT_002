"use client";

import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import {loginAction, RegisterAction} from "../../../../action/auth.action";
import {useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function RegisterFormComponent() {

  const [submitError, setSubmitError] = useState(null);


  const schema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must not contain special characters")
        .refine((val) => val.trim().includes(" "), "Name must contain at least one space"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    birthdate: z
        .string()
        .min(1, "Birthdate is required"),

  })



  const {register, handleSubmit, formState: {errors} } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError:true,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });



  const onSubmit =  async (data) => {

    const parts = data.name.trim().split(" ");

    const dataReq = {
      firstName: parts[0],
      lastName: parts[1],
      email: data.email,
      password: data.password,
      birthdate: data.birthdate,
    };


    try {
      const response = await RegisterAction(dataReq);
      console.log("Register response:", response);

      if (!response?.success) {
        setSubmitError("Invalid data");
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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
              type="text"
              {...register("name")}
              placeholder="Jane Doe"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          />
          {
              errors.name && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.name.message}
                  </p>
              )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          />
          {
              errors.email && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.email.message}
                  </p>
              )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          />
          {
              errors.password && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.password.message}
                  </p>
              )}
        </div>

        {/* Birthdate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Birthdate
          </label>
          <input
              type="date"
              {...register("birthdate")}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          />
          {
              errors.birthdate && (
                  <p className={`mt-1 text-xs text-red-500`}>
                    {errors.birthdate.message}
                  </p>
              )}
        </div>

        <Button
            type="submit"
            variant="solid"
            className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
        >
          Create account
        </Button>
      </form>
  );
}
