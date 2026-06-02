export const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const whatsappPhone = '2348099888812'

export const roomCatalog = [
  {
    name: 'Superior Standard',
    price: 'N40,000',
    image: '/images/rooms/superior-standard-960.webp',
    imageSrcSet: '/images/rooms/superior-standard-480.webp 480w, /images/rooms/superior-standard-960.webp 960w',
    fit: 'Best for solo work trips',
    meta: ['AC room', 'Double bed', 'LCD TV'],
    perks: ['Complimentary breakfast', '24-hour power', 'Water heater'],
  },
  {
    name: 'Luxury Executive',
    price: 'N45,000',
    image: '/images/rooms/luxury-executive-960.webp',
    imageSrcSet: '/images/rooms/luxury-executive-480.webp 480w, /images/rooms/luxury-executive-960.webp 960w',
    fit: 'Extra comfort at a modest upgrade',
    meta: ['AC room', 'Fridge', 'Electric kettle'],
    perks: ['Breakfast included', 'Quiet GRA stay', 'Restaurant access'],
  },
  {
    name: 'Single Room Suite',
    price: 'N50,000',
    image: '/images/rooms/single-room-suite-960.webp',
    imageSrcSet: '/images/rooms/single-room-suite-480.webp 480w, /images/rooms/single-room-suite-960.webp 960w',
    fit: 'Privacy-focused suite choice',
    meta: ['Private suite', 'LCD TV', 'Hot water'],
    perks: ['Secure parking', '24-hour power', 'Concierge support'],
  },
  {
    name: 'Double Room Suite',
    price: 'N80,000',
    image: '/images/rooms/double-room-suite-960.webp',
    imageSrcSet: '/images/rooms/double-room-suite-480.webp 480w, /images/rooms/double-room-suite-960.webp 960w',
    fit: 'Two-room ensuite with sitting area',
    meta: ['Separate sitting room', 'Double bed', 'Fridge'],
    perks: ['VIP privacy', 'Breakfast included', 'Taxi support'],
  },
  {
    name: 'Executive Suite',
    price: 'N86,000',
    image: '/images/rooms/executive-suite-960.webp',
    imageSrcSet: '/images/rooms/executive-suite-480.webp 480w, /images/rooms/executive-suite-960.webp 960w',
    fit: 'Most polished executive stay',
    meta: ['King-size bed', 'Lounge space', 'AC room'],
    perks: ['Prompt reception', '24-hour food & bar', 'Secure GRA location'],
  },
]

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date, count) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
}

export function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

export function getMonthDays(monthDate) {
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()

  return Array.from(
    { length: daysInMonth },
    (_, index) => new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1),
  )
}

export function getMondayStartOffset(monthDate) {
  return (monthDate.getDay() + 6) % 7
}

export function isSameDay(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

export function getNextWeekendDate(today) {
  const day = today.getDay()
  const daysUntilSaturday = (6 - day + 7) % 7 || 7

  return addDays(today, daysUntilSaturday)
}

export function formatBookingDate(date) {
  return `${monthShortNames[date.getMonth()]} ${date.getDate()}`
}

export function normalizeDepartureDate(arrivalDate, departureDate) {
  if (departureDate > arrivalDate) {
    return departureDate
  }

  return addDays(arrivalDate, 1)
}

export function getStayNights(arrivalDate, departureDate) {
  const millisecondsPerNight = 24 * 60 * 60 * 1000

  return Math.max(1, Math.round((startOfDay(departureDate) - startOfDay(arrivalDate)) / millisecondsPerNight))
}

export function formatGuestCount({ adults, children }) {
  const adultLabel = adults === 1 ? 'adult' : 'adults'
  const childLabel = children === 1 ? 'child' : 'children'

  return children > 0 ? `${adults} ${adultLabel}, ${children} ${childLabel}` : `${adults} ${adultLabel}`
}

export function getRoomByName(roomName) {
  return roomCatalog.find((room) => room.name === roomName) || roomCatalog[0]
}

export function getMissingBookingSteps({ arrivalSelected, departureSelected, guestsSelected }) {
  return [
    ['arrival', arrivalSelected],
    ['departure', departureSelected],
    ['guests', guestsSelected],
  ]
    .filter(([, isSelected]) => !isSelected)
    .map(([step]) => step)
}

export function confirmBookingStep(selectedSteps, step) {
  return { ...selectedSteps, [step]: true }
}

export function getNextCarouselIndex(currentIndex, itemCount) {
  if (itemCount <= 0) {
    return 0
  }

  return (currentIndex + 1) % itemCount
}

export function createWhatsAppReservationUrl({ phone, arrivalDate, departureDate, guests, roomName }) {
  const message = [
    'Hello Fancourt Suites, I would like to reserve a room.',
    `Arrival: ${formatBookingDate(arrivalDate)}`,
    `Departure: ${formatBookingDate(departureDate)}`,
    `Guests: ${formatGuestCount(guests)}`,
    `Room preference: ${roomName}`,
    'Please confirm availability and total price.',
  ].join('\n')

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
