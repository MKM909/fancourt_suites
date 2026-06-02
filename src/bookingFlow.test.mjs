import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  confirmBookingStep,
  createWhatsAppReservationUrl,
  formatBookingDate,
  getNextCarouselIndex,
  getMissingBookingSteps,
  getRoomByName,
  getStayNights,
  normalizeDepartureDate,
} from './bookingFlow.js'

test('formats booking dates in the compact hotel pill style', () => {
  assert.equal(formatBookingDate(new Date(2026, 5, 2)), 'Jun 2')
})

test('keeps checkout after arrival when arrival changes', () => {
  const arrival = new Date(2026, 5, 8)
  const staleDeparture = new Date(2026, 5, 8)

  assert.equal(normalizeDepartureDate(arrival, staleDeparture).toDateString(), new Date(2026, 5, 9).toDateString())
})

test('calculates nights for the room recommendation summary', () => {
  assert.equal(getStayNights(new Date(2026, 5, 2), new Date(2026, 5, 5)), 3)
})

test('returns a concrete room for the booking summary', () => {
  assert.equal(getRoomByName('Executive Suite').price, 'N86,000')
  assert.equal(getRoomByName('Any available suite').name, 'Superior Standard')
})

test('reports booking steps that still need guest input', () => {
  assert.deepEqual(
    getMissingBookingSteps({
      arrivalSelected: true,
      departureSelected: false,
      guestsSelected: false,
    }),
    ['departure', 'guests'],
  )
})

test('confirms the default guest count without requiring a value change', () => {
  const selectedSteps = confirmBookingStep(
    {
      arrival: true,
      departure: true,
      guests: false,
    },
    'guests',
  )

  assert.deepEqual(selectedSteps, {
    arrival: true,
    departure: true,
    guests: true,
  })
  assert.deepEqual(
    getMissingBookingSteps({
      arrivalSelected: selectedSteps.arrival,
      departureSelected: selectedSteps.departure,
      guestsSelected: selectedSteps.guests,
    }),
    [],
  )
})

test('loops the testimonial carousel autoplay index', () => {
  assert.equal(getNextCarouselIndex(0, 3), 1)
  assert.equal(getNextCarouselIndex(1, 3), 2)
  assert.equal(getNextCarouselIndex(2, 3), 0)
})

test('builds a WhatsApp reservation handoff with the guest choices', () => {
  const url = createWhatsAppReservationUrl({
    phone: '2348099888812',
    arrivalDate: new Date(2026, 5, 2),
    departureDate: new Date(2026, 5, 5),
    guests: { adults: 2, children: 1 },
    roomName: 'Executive Suite',
  })

  assert.ok(url.startsWith('https://wa.me/2348099888812?text='))

  const message = decodeURIComponent(url.split('text=')[1])
  assert.match(message, /Arrival: Jun 2/)
  assert.match(message, /Departure: Jun 5/)
  assert.match(message, /Guests: 2 adults, 1 child/)
  assert.match(message, /Room preference: Executive Suite/)
  assert.match(message, /Please confirm availability and total price/)
})
