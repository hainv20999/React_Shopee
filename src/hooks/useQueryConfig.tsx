import { ProductListConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      exclude: queryParams.exclude,
      limit: queryParams.limit || '10',
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      sort_by: queryParams.sort_by,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
