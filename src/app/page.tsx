import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="landing-page bg-[#fefaf4] text-gray-800">
      <div className="hero-section min-h-screen flex flex-col items-center justify-center bg-[#fefaf4] py-24">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-7xl font-bold text-black">
            Build Effortlessly, <span className="text-green-600">Delight Customers</span>
          </h1>
          <p className="text-xl mt-4 text-black max-w-xl mx-auto">
            Leverage Kobot AI to automate conversations, deepen relationships, and scale both your customer & investor success seamlessly.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/conversation">
              <Button className="bg-black text-white py-3 px-8 rounded-md">Your Conversations</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
