import { apiClient } from "../api-client"

export interface StockModifyRequest {
  quantity: number
}

export interface StockResponse {
  productId: string
  quantity: number
}

export const inventoryApi = {
  getProductInventory: (productId: string) =>
    apiClient.get<StockResponse>(`/catalog-service/api/v1/stocks/${productId}`),
  modifyProductInventory: (productId: string, data: StockModifyRequest) =>
    apiClient.put<StockResponse>(
      `/catalog-service/api/v1/stocks/${productId}`,
      data
    ),
}
