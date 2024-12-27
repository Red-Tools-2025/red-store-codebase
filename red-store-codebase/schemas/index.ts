import * as z from "zod"


export const LoginSchema = z.object({
email: z.string().email(),
password: z.string().min(1,{message:"Password is required"})
})


export const RegisterSchema = z.object({
email: z.string().email(),
password: z.string().min(6,{message:"Password is required"}),
name:z.string().min(1,{message:"Name is required "}),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }) // Apply regex before .optional()
    .optional(),
})
