import z from "zod";

export type SignUpFormValues = z.infer<typeof signupSchema>;


export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z.date({
    required_error: "Date of Birth is required",
  }),
  email: z.string().email("Invalid email address"),
});
