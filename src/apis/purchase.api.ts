import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCard(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchase(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, { params })
  },
  buyProduct(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccessResponseApi<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponseApi<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

export default purchaseApi
