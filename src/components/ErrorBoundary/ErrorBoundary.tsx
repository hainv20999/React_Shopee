import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='container'>
          <div className='-mx-4 flex items-center justify-center'>
            <div className='w-full px-4'>
              <div className='mx-auto max-w-[400px] text-center'>
                <h2 className='mb-2 text-[50px] font-bold leading-none text-black sm:text-[80px] md:text-[100px]'>
                  500
                </h2>
                <h4 className='mb-3 text-[22px] font-semibold leading-tight text-black'>Error!</h4>
                <a
                  href='/'
                  className='hover:text-primary hover:bg-gray inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-black transition'
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
