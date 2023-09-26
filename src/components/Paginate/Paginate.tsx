import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2
export default function Paginate({ pageSize, queryConfig }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button key={index} className='ms-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </button>
        )
      }
      return null
    }
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button key={index} className='ms-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </button>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames(
              ' ms-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm hover:translate-y-[-0.0625rem]',
              {
                'border-cyan-500': pageNumber === page,
                'border-transparent': pageNumber !== page
              }
            )}
            onClick={() => {}}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page === 1 ? (
        <span className='ms-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm '>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='ms-2  rounded border bg-white px-3 py-2 shadow-sm first-line:cursor-pointer hover:translate-y-[-0.0625rem]'
        >
          Prev
        </Link>
      )}

      {renderPagination()}

      {page === pageSize ? (
        <span className='ms-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='ms-2 rounded  border bg-white px-3 py-2 shadow-sm first-line:cursor-pointer hover:translate-y-[-0.0625rem]'
        >
          Next
        </Link>
      )}
    </div>
  )
}
