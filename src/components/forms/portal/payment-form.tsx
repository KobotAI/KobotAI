'use client'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useCompleteCustomerPayment } from '@/hooks/billing/use-billing'
import { PaymentElement } from '@stripe/react-stripe-js'
import React from 'react'

type CustomerPaymentFormProps = {
  onNext(): void
  amount: number
  email: string
  stripeId: string
}

export const CustomerPaymentForm = ({ amount, email, onNext, stripeId }: CustomerPaymentFormProps) => {
  const { processing, onMakePayment } = useCompleteCustomerPayment(amount, email, onNext, stripeId)
  return (
    <div className="flex flex-col">
      <PaymentElement />
      <Button
        type="button"
        className="w-full mt-5"
        onClick={onMakePayment}
        disabled={processing}
      >
        <Loader loading={processing}>Pay</Loader>
      </Button>
    </div>
  )
}
