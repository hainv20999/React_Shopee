import React, { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorMessage,
  className,
  name,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  register,
  rules,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input
        // className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        className={classNameInput}
        {...registerResult}
        {...rest}
      />
      <div
        // className='mt-1 min-h-[1.25rem] text-sm text-red-600'
        className={classNameError}
      >
        {errorMessage}
      </div>
    </div>
  )
}
