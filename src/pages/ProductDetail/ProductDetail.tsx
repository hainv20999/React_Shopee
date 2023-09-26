import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { purchasesStatus } from 'src/constants/purchase'
import { Product } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const [buyCount, setBuyCount] = useState(1)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailData?.data.data
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [currentIndexImages, product]
  )
  const imageRef = useRef<HTMLImageElement>(null)

  const addToCardMutation = useMutation(purchaseApi.addToCard)

  useEffect(() => {
    if (product && product.image.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const next = () => {
    if (currentIndexImages[1] < (product as Product).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    // cách 1: sử dụng đơn giản khi có bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // cách 2: khi chúng ta không sử xử lý được buddle event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleByCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCard = () => {
    addToCardMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data?.data?.message, { autoClose: 1000 })
          // fetch data no refresh
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className=' absolute left-0 top-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button onClick={prev} className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button onClick={next} className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='text-organe mr-1 border-b border-b-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    nonActiveClassname='fill-gray-300  text-gray-300 h-4 w-4'
                    activeClassname='fill-orange text-oragan h-4 w-4'
                  />
                  <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                  <div>
                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-300'> Đã bán </span>
                  </div>
                </div>
              </div>
              <div className='px-50 mt-8 flex items-center bg-gray-50 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)}giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>số lượng</div>
                <QuantityController max={product.quantity} />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCard}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x='0'
                    y='0'
                    className='mx-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit='10'
                        ></polyline>
                        <circle cx='6' cy='13.5' r='1' stroke='none'></circle>
                        <circle cx='11.5' cy='13.5' r='1' stroke='none'></circle>
                      </g>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit='10'
                        x1='7.5'
                        x2='10.5'
                        y1='7'
                        y2='7'
                      ></line>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit='10'
                        x1='9'
                        x2='9'
                        y1='8.5'
                        y2='5.5'
                      ></line>
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className='ml-6 flex h-12 items-center  justify-center rounded-sm bg-orange px-4 capitalize text-white shadow-sm outline-none hover:bg-orange/90 '>
                  Mua ngay
                </button>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 bg-white p-4 shadow'>
        <div className='container'>
          <div className='bg-gray-50p-4 rounded text-lg capitalize text-slate-700'> mô tả sản phẩm</div>
          <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
