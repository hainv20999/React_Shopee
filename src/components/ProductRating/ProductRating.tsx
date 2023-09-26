export default function ProductRating({
  rating,
  activeClassname = 'h-3 w-3 fill-yellow-300 text-yellow-300',
  nonActiveClassname = 'h3 w-3 fill-current text-gray-300'
}: {
  rating: number
  activeClassname?: string
  nonActiveClassname?: string
}) {
  // rating = 3.4
  // order
  // 1 <=  rating  => 100%
  // 2 <=  rating  => 100%
  // 3 <=  rating  => 100%
  // 4 >  rating  => order > rating && order - rating (3.4 - 3) = 0.4 * 100% = 40%
  // 5 >  rating  => 0%
  const handleWithRating = (order: number) => {
    if (order <= rating) {
      return '100%'
    } else if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'
    } else return '0%'
  }
  return (
    <div className='item-center flex'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div className='relative' key={index}>
            <div
              className='absolute left-0 top-0 h-full overflow-hidden'
              style={{ width: handleWithRating(index + 1) }}
            >
              <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={activeClassname}>
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit='10'
                ></polygon>
              </svg>
            </div>
            <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={nonActiveClassname}>
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit='10'
              ></polygon>
            </svg>
          </div>
        ))}
    </div>
  )
}
