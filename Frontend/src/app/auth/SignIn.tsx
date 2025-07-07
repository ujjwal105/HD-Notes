import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import PublicLayout from "@/layouts/PublicLayout";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInFormValues } from "@/lib/schema";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignIn() {
  const [showOtp, setShowOtp] = useState(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      otp: "",
      keepLoggedIn: false,
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    console.log(data);
  };

  return (
    <PublicLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#232323] text-center lg:text-start">
            Sign in
          </h1>
          <p className="text-[#969696] text-base font-light text-center lg:text-start">
            Please login to continue to your account.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOtp ? "text" : "password"}
                        placeholder="OTP"
                        className="pr-10 h-11"
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowOtp((v) => !v)}
                      >
                        {showOtp ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Link
                to="#"
                className="text-[#367AFF] underline text-sm font-medium hover:underline"
              >
                Resend OTP
              </Link>
            </div>
            <FormField
              control={form.control}
              name="keepLoggedIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="keepLoggedIn"
                      className="border-2 border-black"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="keepLoggedIn"
                    className="text-sm font-normal cursor-pointer select-none text-[#232323]"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-2 w-full text-base font-semibold h-12 bg-[#367AFF] hover:bg-[#367AFF] cursor-pointer"
            >
              Sign in
            </Button>
          </form>
        </Form>
        <div className="text-center text-[#969696] text-base mt-6 font-light">
          Need an account?{" "}
          <Link to="/" className="text-[#367AFF] underline font-medium">
            Create one
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
