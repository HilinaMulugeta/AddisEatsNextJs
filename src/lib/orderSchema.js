import { z } from "zod";

/** Validates checkout details before saving an order in browser storage. */
export const orderSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z
    .string()
    .trim()
    .regex(/^(\+251|0)[79]\d{8}$/, "Use a valid Ethiopian mobile number"),
  address: z.string().trim().min(8, "Enter a delivery address"),
  paymentMethod: z.enum(["telebirr", "cash"], {
    errorMap: () => ({ message: "Choose a payment option" }),
  }),
});

export const cartItemsSchema = z
  .array(
    z.object({
      id: z.string().trim().min(1),
      quantity: z.coerce.number().int().min(1).max(20),
    }),
  )
  .min(1, "Add at least one dish to your cart")
  .max(20, "Your cart has too many different dishes");
