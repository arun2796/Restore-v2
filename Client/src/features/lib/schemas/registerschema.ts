import z from "zod";

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])\\S{6,10}$");

export const registerSchema = z.object({
  email: z.string().email(),  
    password: z.string()
    .regex(passwordRegex, { message: "Password must be 6-10 characters, include uppercase, lowercase, number, and special character." })  
  })

  export  type RegisterSchema = z.infer<typeof registerSchema>;  