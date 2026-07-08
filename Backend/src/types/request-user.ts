import { User } from "@prisma/client";

// Define a minimal user shape that is stored in the request after JWT validation.
export type RequestUser = Pick<User, "id" | "role" | "email">;
