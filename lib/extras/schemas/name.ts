import { z } from "zod";

export const nameSchema = z.string().min(1, "Name must be at least 2 characters long");