import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import QuestionsForm from './questions'
import DynamicCalendar from '@/components/appointment/DynamicCalendar'
import { Button } from '@/components/ui/button'
import BookAppointmentDate from './booking-date'
import PaymentCheckout from './product-checkout'

type Props = {
  questions: {
    id: string
    question: string
    answered: string | null
  }[]
  type: 'Appointment' | 'Payment'
  register: UseFormRegister<FieldValues>
  error: FieldErrors<FieldValues>
  onNext(): void
  step: number
  date: Date | undefined
  onBooking: React.Dispatch<React.SetStateAction<Date | undefined>>
  onBack(): void
  onSlot(slot: string): void
  slot?: string
  loading: boolean
  availableSlots?: string[]
  bookings?:
    | {
        date: Date
        slot: string
      }[]
    | undefined
  products?:
    | {
        name: string
        image: string
        price: number
      }[]
    | undefined
  amount?: number
  email?: string
  stripeId?: string
}

const PortalSteps = ({
  questions,
  type,
  register,
  error,
  onNext,
  step,
  onBooking,
  date,
  onBack,
  onSlot,
  loading,
  slot,
  availableSlots,
  email,
  products,
  bookings,
  amount,
  stripeId,
}: Props) => {
  if (step == 1) {
    return (
      <QuestionsForm
        register={register}
        error={error}
        onNext={onNext}
        questions={questions}
      />
    )
  }

  if (step == 2 && type == 'Appointment') {
    return (
      <div>
        <DynamicCalendar
          date={date}
          onDateChange={onBooking}
          availableSlots={availableSlots || []}
          onSlotSelect={onSlot}
        />
        <Button
          onClick={onBack}
          variant="outline"
          className="mt-4 mr-2"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!date || !slot || loading}
          className="mt-4"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </div>
    )
  }

  if (step == 2 && type == 'Payment') {
    return (
      <PaymentCheckout
        products={products}
        stripeId={stripeId}
        onBack={onBack}
        onNext={onNext}
        email={email ?? 'null'}
        amount={amount ?? 0} 
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="font-bold text-gray-600 text-4xl">Thank You</h2>
      <p className="text-center">
        Thank you for taking the time to fill in this form. We look forward to
        <br /> speaking to you soon.
      </p>
    </div>
  )
}

export default PortalSteps
