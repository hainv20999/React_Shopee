import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import produce from 'immer'
import { toast } from 'react-toastify'
import { keyBy } from 'lodash'

interface ExtendedPurchases extends Purchase {
  disable: boolean
  checked: boolean
}

export default function Cart() {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchase({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProduct,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        autoClose: 1000,
        position: 'top-center'
      })
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      refetch()
      toast.success('Delete Successfully!')
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const isCheckedAll = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedCount = checkedPurchases.length

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disable: false,
          checked: Boolean(extendedPurchaseObject[purchase._id]?.checked)
        })) || []
      )
    })
  }, [purchasesInCart])

  const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) => prev.map((purchase) => ({ ...purchase, checked: !isCheckedAll })))
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleBuyProduct = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  const handleDelete = (purchaseIndex: number) => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  return (
    <div className='bg-neutral-100 py-16 '>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6 bg-white'>
                <div className='flex items-center'>
                  <div className='shink-0 flex items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      checked={isCheckedAll}
                      onChange={handleCheckedAll}
                      className='h-5 w-5 accent-orange'
                    />
                  </div>
                  <div className='flex-grow text-black'>sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'> Số lương</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            {extendedPurchases.length > 0 && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchases?.map((purchase, index) => (
                  <div
                    className=' mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-5 py-5 text-center text-sm text-gray-500 first:mt-0'
                    key={purchase._id}
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='item-center flex shrink-0 justify-center pr-3'>
                          <input
                            type='checkbox'
                            checked={purchase.checked}
                            onChange={handleChecked(index)}
                            className='h-5 w-6 accent-orange'
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='flex-shink-0 h-20 w-20'
                            >
                              <img alt={purchase.product.name} src={purchase.product.image} />
                            </Link>
                            <div className='flex-grow px-2 pb-2 pt-1'>
                              <Link
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='line-clamp-2'
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>
                              ${formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3'>${formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            classNameWrapper='items-center flex'
                            max={purchase.product.quantity}
                            onIncrese={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                            onDecrese={(value) => handleQuantity(index, value, value >= 1)}
                            onType={handleTypeQuantity(index)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchase.product.quantity &&
                                  value !== (purchasesInCart as Purchase[])[index].buy_count
                              )
                            }
                            value={purchase.buy_count}
                          />
                        </div>
                        <div className='col-span-1'>
                          <span className='text-sm text-orange'>
                            ${formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1'>
                          <button onClick={() => handleDelete(index)} className='bg-white text-black hover:text-orange'>
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex items-center bg-white pr-3 shadow'>
          <div className='flex flex-shrink-0 items-center rounded-sm bg-white p-5'>
            <input
              type='checkbox'
              checked={isCheckedAll}
              onChange={handleCheckedAll}
              className='h-5 w-5 accent-orange'
            />
          </div>
          <button className='mx-3 border-none bg-none' onClick={handleCheckedAll}>
            Chọn tất cả ({extendedPurchases.length})
          </button>
          <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
            Xóa
          </button>
          <div className='ml-auto flex items-center'>
            <div>
              <div className='items-cetner flex justify-end'>
                <div>Tổng sản phầm (0 sản phẩm):</div>
                <div className='ml-2 text-2xl text-orange'>₫206000</div>
              </div>
              <div className='flex items-center justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>₫62000</div>
              </div>
            </div>
            <Button
              onClick={handleBuyProduct}
              disabled={buyProductsMutation.isLoading}
              className=' ml-4 flex h-10 w-52 items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
