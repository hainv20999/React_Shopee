import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { LoginSchema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import authApi from 'src/apis/auth.api'

type FormData = Pick<LoginSchema, 'email' | 'password'>

const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data
          console.log('formError', formError)
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'error'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-2 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'> Đăng Nhập </div>
              <Input
                name='email'
                type='email'
                register={register}
                className='mt-8'
                placeholder='Email'
                errorMessage={errors.email?.message}
              />

              <Input
                name='password'
                type='password'
                register={register}
                className='mt-2'
                placeholder='Password'
                errorMessage={errors.password?.message}
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='item-center mt-8 flex justify-center'>
                <span className='text-gray-300'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400' to='/Register'>
                  Đăng Ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
