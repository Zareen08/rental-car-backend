export const Roles = {
  admin: "admin",
  customer: "customer",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
