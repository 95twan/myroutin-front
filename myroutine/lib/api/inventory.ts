import { apiClient } from "../api-client"

export interface StockRegisterRequest {
  productId: string
  quantity: number
}

export interface StockModifyRequest {
  quantity: number
}

export interface StockResponse {
  productId: string
  quantity: number
}

export const inventoryApi = {
  createProductInventory: (data: StockRegisterRequest) =>
    apiClient.post<void>(`/catalog-service/api/v1/stocks`, data),
  getProductInventory: (productId: string) =>
    apiClient.get<StockResponse>(`/catalog-service/api/v1/stocks/${productId}`),
  modifyProductInventory: (productId: string, data: StockModifyRequest) =>
    apiClient.put<StockResponse>(
      `/catalog-service/api/v1/stocks/${productId}`,
      data
    ),
}
