import z from "zod";

export type SignUpFormValues = z.infer<typeof signupSchema>;

export type SignInFormValues = z.infer<typeof signInSchema>;


export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z.date({
    required_error: "Date of Birth is required",
  }),
  email: z.string().email("Invalid email address"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "OTP is required"),
  keepLoggedIn: z.boolean().optional(),
});
