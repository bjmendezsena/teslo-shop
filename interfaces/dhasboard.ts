

export interface DashboardSumarryResponse {
  numberOfOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  paidOrders: number;
  notPaidOrders: number;
  productsWithNotInventory: number;
  lowInventoryProducts: number;
}
