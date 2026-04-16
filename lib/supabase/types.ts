export type UserType = "customer" | "campus_rep" | "account_manager";

export type OrderStatus =
  | "new"
  | "proof_pending"
  | "proof_ready"
  | "approved"
  | "in_production"
  | "shipped"
  | "complete";

export type ProofStatus = "pending" | "approved" | "revision_requested";

export interface CustomerOrderRow {
  id: string;
  event_name: string;
  due_date: string;
  status: OrderStatus;
}
