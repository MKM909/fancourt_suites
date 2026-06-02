import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  Armchair,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Coffee,
  ConciergeBell,
  Info,
  Mail,
  MapPin,
  Moon,
  Phone,
  Send,
  Star,
  Tv,
  Utensils,
  UsersRound,
  X,
  Wifi,
  Zap,
} from 'lucide-react'
import {
  addDays,
  addMonths,
  confirmBookingStep,
  createWhatsAppReservationUrl,
  formatBookingDate,
  formatGuestCount,
  getMissingBookingSteps,
  getMondayStartOffset,
  getMonthDays,
  getNextCarouselIndex,
  getNextWeekendDate,
  getRoomByName,
  getStayNights,
  isSameDay,
  normalizeDepartureDate,
  roomCatalog,
  startOfDay,
  startOfMonth,
  whatsappPhone,
} from './bookingFlow.js'

gsap.registerPlugin(ScrollTrigger)

const navItems = ['Home', 'Rooms', 'About', 'Amenities', 'Location', 'Contact']
const navSectionFlow = ['Home', 'Rooms', 'About', 'Amenities', 'Location', 'Contact']
const rooms = roomCatalog
const stats = [
  {
    number: '5,850+',
    label: 'Guests Hosted',
    text: 'First-class hospitality for guests who care about privacy, steady power, security, and prompt service.',
    image: '/images/portfolio/reception-1000.webp',
    imageSrcSet: '/images/portfolio/reception-640.webp 640w, /images/portfolio/reception-1000.webp 1000w',
  },
  {
    number: '24hr',
    label: 'Power, Food & Bar',
    text: 'A visible promise for business travellers who need work-ready comfort in Ilorin.',
    image: '/images/portfolio/bathroom-860.webp',
    imageSrcSet: '/images/portfolio/bathroom-480.webp 480w, /images/portfolio/bathroom-860.webp 860w',
  },
  {
    number: '40',
    label: 'Car Park Spaces',
    text: 'A secure Flower Garden GRA address with easy access to Ilorin Golf Course and Shoprite.',
    image: '/images/portfolio/location-800.webp',
    imageSrcSet: '/images/portfolio/location-640.webp 640w, /images/portfolio/location-800.webp 800w',
  },
]

const storyImages = [
  {
    alt: 'Fancourt suite lounge',
    src: '/images/portfolio/lounge-760.webp',
    srcSet: '/images/portfolio/lounge-480.webp 480w, /images/portfolio/lounge-760.webp 760w',
  },
  {
    alt: 'Fancourt restaurant dining',
    src: '/images/portfolio/dining-760.webp',
    srcSet: '/images/portfolio/dining-480.webp 480w, /images/portfolio/dining-760.webp 760w',
  },
  {
    alt: 'Fancourt bedroom suite',
    src: '/images/portfolio/bedroom-760.webp',
    srcSet: '/images/portfolio/bedroom-480.webp 480w, /images/portfolio/bedroom-760.webp 760w',
  },
  {
    alt: 'Fancourt suite sitting area',
    src: '/images/portfolio/sitting-area-760.webp',
    srcSet: '/images/portfolio/sitting-area-480.webp 480w, /images/portfolio/sitting-area-760.webp 760w',
  },
  {
    alt: 'Fancourt room detail',
    src: '/images/portfolio/room-detail-760.webp',
    srcSet: '/images/portfolio/room-detail-480.webp 480w, /images/portfolio/room-detail-760.webp 760w',
  },
]

const amenities = [
  {
    title: 'Luxury Room',
    icon: BedDouble,
    featured: true,
    text: 'Quiet rooms, calm interiors, and a private boutique feel in Flower Garden GRA.',
  },
  {
    title: '24-Hour Power',
    icon: Zap,
    text: 'Reliable power supply for work trips, late arrivals, video calls, and restful nights.',
  },
  {
    title: 'Food & Restaurant',
    icon: Utensils,
    text: 'Local and exotic meals, drinks, restaurant, and bar service available around the clock.',
  },
  {
    title: 'Secure Parking',
    icon: Car,
    text: 'Large secured car park with capacity for 40 vehicles and fast access to GRA routes.',
  },
  {
    title: 'Breakfast Included',
    icon: Coffee,
    text: 'Complimentary breakfast from 7am to 11am for every checked-in guest.',
  },
  {
    title: 'Laundry & Taxi',
    icon: ConciergeBell,
    text: 'Laundry, taxi service, WiFi, and reception support for easy business travel.',
  },
]

const testimonials = [
  {
    name: 'Yinka Agbegba',
    role: 'Business guest',
    avatar: 'https://i.pravatar.cc/160?img=32',
    text: 'I booked directly before arriving in Ilorin and reception confirmed quickly. The room was quiet, breakfast was ready, and the power stayed steady through my work calls.',
    time: '2 weeks ago',
  },
  {
    name: 'John Williams',
    role: 'Returning guest',
    avatar: 'https://i.pravatar.cc/160?img=12',
    text: 'Fancourt made the stay feel simple from the first message. The suite was clean, the staff were helpful, and the GRA location made moving around Ilorin easy.',
    time: '1 month ago',
    featured: true,
  },
  {
    name: 'Delia Arnold',
    role: 'Weekend stay',
    avatar: 'https://i.pravatar.cc/160?img=47',
    text: 'The direct reservation felt personal. We got clear directions, secure parking, and a calm room that looked exactly like the photos.',
    time: '4 weeks ago',
  },
]

const panelCopy = {
  arrival: {
    eyebrow: 'Arrival',
    title: 'Choose when you want to arrive in Ilorin.',
    detail: 'Late arrivals can still go through reception confirmation on WhatsApp.',
  },
  departure: {
    eyebrow: 'Departure',
    title: 'Set the checkout date for the stay.',
    detail: 'The checkout date stays after arrival so the rate summary always makes sense.',
  },
  guests: {
    eyebrow: 'Guests',
    title: 'Guests',
    detail: 'Set guest count',
  },
}

const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function App() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const roomsScrollerRef = useRef(null)
  const aboutImagesScrollerRef = useRef(null)
  const testimonialsSectionRef = useRef(null)
  const testimonialsScrollerRef = useRef(null)
  const testimonialInteractionTimerRef = useRef(null)
  const pageRef = useRef(null)
  const navRef = useRef(null)
  const heroRef = useRef(null)
  const [activePanel, setActivePanel] = useState(null)
  const [arrivalDate, setArrivalDate] = useState(() => addDays(startOfDay(new Date()), 1))
  const [departureDate, setDepartureDate] = useState(() => addDays(startOfDay(new Date()), 2))
  const [arrivalMonth, setArrivalMonth] = useState(() => startOfMonth(addDays(startOfDay(new Date()), 1)))
  const [departureMonth, setDepartureMonth] = useState(() => startOfMonth(addDays(startOfDay(new Date()), 2)))
  const [guests, setGuests] = useState({ adults: 1, children: 0 })
  const [roomPreference, setRoomPreference] = useState(rooms[0].name)
  const [drawerView, setDrawerView] = useState('summary')
  const [drawerBackView, setDrawerBackView] = useState(null)
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(1)
  const [isTestimonialAutoPaused, setIsTestimonialAutoPaused] = useState(false)
  const [isTestimonialsSectionVisible, setIsTestimonialsSectionVisible] = useState(false)
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('Home')
  const [roomsScrollEdges, setRoomsScrollEdges] = useState({ left: false, progress: 0, right: false })
  const [selectedSteps, setSelectedSteps] = useState({
    arrival: false,
    departure: false,
    guests: false,
  })
  const [missingSteps, setMissingSteps] = useState([])

  const stayNights = getStayNights(arrivalDate, departureDate)
  const guestLabel = formatGuestCount(guests)
  const selectedRoom = getRoomByName(roomPreference)
  const activeNavIndex = Math.max(0, navItems.indexOf(activeNavItem))
  const bookingFields = useMemo(
    () => [
      {
        id: 'arrival',
        label: 'Arrival',
        value: formatBookingDate(arrivalDate),
        icon: ChevronDown,
      },
      {
        id: 'departure',
        label: 'Departure',
        value: formatBookingDate(departureDate),
        icon: ChevronDown,
      },
      {
        id: 'guests',
        label: 'Guests',
        value: guestLabel,
        icon: ChevronDown,
      },
    ],
    [arrivalDate, departureDate, guestLabel],
  )
  const bookingSummary = useMemo(
    () => `${formatBookingDate(arrivalDate)} to ${formatBookingDate(departureDate)} | ${stayNights} night${stayNights === 1 ? '' : 's'} | ${guestLabel} | ${roomPreference}`,
    [arrivalDate, departureDate, guestLabel, roomPreference, stayNights],
  )
  const footerWhatsAppUrl = createWhatsAppReservationUrl({
    phone: whatsappPhone,
    arrivalDate,
    departureDate,
    guests,
    roomName: roomPreference,
  })

  const updateRoomsScrollEdges = useCallback(() => {
    const scroller = roomsScrollerRef.current

    if (!scroller) {
      return
    }

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    const rawProgress = scroller.scrollWidth <= scroller.clientWidth
      ? 1
      : (scroller.scrollLeft + scroller.clientWidth) / scroller.scrollWidth
    const progress = Math.min(1, Math.max(0, Number(rawProgress.toFixed(4))))
    const nextEdges = {
      left: scroller.scrollLeft > 6,
      progress,
      right: scroller.scrollLeft < maxScrollLeft - 6,
    }

    setRoomsScrollEdges((currentEdges) => (
      currentEdges.left === nextEdges.left
        && currentEdges.progress === nextEdges.progress
        && currentEdges.right === nextEdges.right
        ? currentEdges
        : nextEdges
    ))
  }, [])

  useEffect(() => {
    let frameId = 0

    const updateNavState = () => {
      frameId = 0

      if (document.documentElement.dataset.pageRevealing === 'true') {
        setIsNavScrolled(false)
        setActiveNavItem('Home')
        return
      }

      setIsNavScrolled(window.scrollY > 28)

      const readPoint = Math.min(window.innerHeight * 0.36, 260)
      let nextActiveItem = 'Home'

      navSectionFlow.forEach((item) => {
        const section = document.getElementById(item.toLowerCase())

        if (!section) {
          return
        }

        const sectionRect = section.getBoundingClientRect()

        if (sectionRect.top <= readPoint) {
          nextActiveItem = item
        }
      })

      setActiveNavItem(nextActiveItem)
    }

    const scheduleNavUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(updateNavState)
    }

    updateNavState()
    window.addEventListener('scroll', scheduleNavUpdate, { passive: true })
    window.addEventListener('resize', scheduleNavUpdate)
    window.addEventListener('fancourt:nav-refresh', scheduleNavUpdate)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', scheduleNavUpdate)
      window.removeEventListener('resize', scheduleNavUpdate)
      window.removeEventListener('fancourt:nav-refresh', scheduleNavUpdate)
    }
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const hero = heroRef.current

    if (!nav || !hero) {
      return undefined
    }

    let timeline
    let hasPlayed = false

    const context = gsap.context(() => {
      const heading = hero.querySelector('[data-hero-heading]')
      const copyItems = Array.from(hero.querySelectorAll('[data-hero-copy]'))
      const booking = hero.querySelector('[data-hero-booking]')
      const copyTargets = [heading, ...copyItems].filter(Boolean)
      const allTargets = [nav, ...copyTargets, booking].filter(Boolean)
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const settleTargets = () => {
        gsap.set(allTargets, { autoAlpha: 1, clearProps: 'opacity,visibility,willChange' })
      }

      const playHeroEntrance = () => {
        if (hasPlayed) {
          return
        }

        hasPlayed = true

        if (reduceMotion) {
          settleTargets()
          return
        }

        timeline = gsap.timeline({
          defaults: {
            overwrite: 'auto',
          },
          onComplete: () => {
            settleTargets()
            window.dispatchEvent(new Event('fancourt:nav-refresh'))
          },
        })

        timeline
          .to(nav, {
            autoAlpha: 1,
            duration: 0.72,
            ease: 'power4.out',
            yPercent: 0,
          }, 0)
          .to(copyTargets, {
            autoAlpha: 1,
            duration: 0.82,
            ease: 'power3.out',
            scale: 1,
            stagger: 0.085,
            y: 0,
          }, 0.2)
          .to(booking, {
            autoAlpha: 1,
            duration: 0.74,
            ease: 'power4.out',
            y: 0,
          }, 0.42)
      }

      if (reduceMotion) {
        settleTargets()
      } else {
        gsap.set(nav, {
          autoAlpha: 0,
          yPercent: -115,
          willChange: 'transform, opacity',
        })
        gsap.set(copyTargets, {
          autoAlpha: 0,
          scale: 0.91,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
          y: 22,
        })
        gsap.set(booking, {
          autoAlpha: 0,
          willChange: 'transform, opacity',
          y: 58,
        })
      }

      window.addEventListener('fancourt:hero-intro-start', playHeroEntrance)
      window.addEventListener('fancourt:reveal-complete', playHeroEntrance)

      if (document.documentElement.dataset.pageRevealed === 'true') {
        window.requestAnimationFrame(playHeroEntrance)
      }

      return () => {
        timeline?.kill()
        window.removeEventListener('fancourt:hero-intro-start', playHeroEntrance)
        window.removeEventListener('fancourt:reveal-complete', playHeroEntrance)
      }
    }, hero)

    return () => context.revert()
  }, [])

  useEffect(() => {
    const page = pageRef.current

    if (!page) {
      return undefined
    }

    let context

    const setupScrollAnimations = () => {
      if (context) {
        return
      }

      context = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scrollWords = gsap.utils.toArray('[data-scroll-float-word]', page)
      const cards = gsap.utils.toArray('[data-scroll-card]', page)
      const rows = gsap.utils.toArray('[data-scroll-row]', page)
      const statCounters = gsap.utils.toArray('[data-stat-counter]', page)
      const tiltCards = gsap.utils.toArray('[data-tilt-card]', page)
      const microTargets = gsap.utils.toArray('button, a[href]', page)

      if (reduceMotion) {
        statCounters.forEach((counter) => {
          counter.textContent = counter.dataset.statCounterFinal || counter.textContent
        })
        gsap.set([...scrollWords, ...cards, ...rows], { clearProps: 'all' })
        return
      }

      const formatCounterValue = (value, target) => (
        target >= 1000
          ? Math.round(value).toLocaleString('en-US')
          : String(Math.round(value))
      )

      const renderCounterValue = (counter, value) => {
        const target = Number(counter.dataset.statCounterValue || 0)
        const suffix = counter.dataset.statCounterSuffix || ''

        counter.textContent = `${formatCounterValue(value, target)}${suffix}`
      }

      const animateStatCounter = (counter) => {
        if (counter.dataset.statCounterPlayed === 'true') {
          return
        }

        const target = Number(counter.dataset.statCounterValue || 0)
        const finalText = counter.dataset.statCounterFinal || counter.textContent
        const counterState = { value: 0 }

        counter.dataset.statCounterPlayed = 'true'
        renderCounterValue(counter, 0)

        gsap.fromTo(
          counterState,
          { value: 0 },
          {
            duration: target >= 1000 ? 1.32 : 0.98,
            ease: 'power3.out',
            onComplete: () => {
              counter.textContent = finalText
            },
            onUpdate: () => {
              renderCounterValue(counter, counterState.value)
            },
            snap: { value: 1 },
            value: target,
          },
        )

        gsap.fromTo(
          counter,
          { scale: 0.9, y: 10 },
          {
            clearProps: 'transform',
            duration: 0.9,
            ease: 'elastic.out(1, 0.48)',
            scale: 1,
            y: 0,
          },
        )
      }

      statCounters.forEach((counter) => {
        renderCounterValue(counter, 0)
        ScrollTrigger.create({
          end: 'bottom 12%',
          onEnter: () => animateStatCounter(counter),
          onEnterBack: () => animateStatCounter(counter),
          start: 'top 86%',
          trigger: counter,
        })
      })

      gsap.set(scrollWords, {
        autoAlpha: 0,
        rotationX: -20,
        transformOrigin: 'center bottom',
        willChange: 'transform, opacity',
        yPercent: 78,
      })

      gsap.utils.toArray('[data-scroll-float]', page).forEach((heading) => {
        const words = gsap.utils.toArray('[data-scroll-float-word]', heading)
        const playHeading = () => {
          if (heading.dataset.scrollFloatPlayed === 'true') {
            return
          }

          heading.dataset.scrollFloatPlayed = 'true'
          gsap.to(words, {
            autoAlpha: 1,
            clearProps: 'transform,opacity,visibility,willChange',
            duration: 0.74,
            ease: 'power4.out',
            rotationX: 0,
            stagger: {
              amount: Math.min(0.42, words.length * 0.055),
              from: 'start',
            },
            yPercent: 0,
          })
        }

        ScrollTrigger.create({
          end: 'bottom 12%',
          onEnter: playHeading,
          onEnterBack: playHeading,
          start: 'top 84%',
          trigger: heading,
        })
      })

      gsap.set(cards, {
        autoAlpha: 0,
        scale: 0.985,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        y: 42,
      })

      ScrollTrigger.batch(cards, {
        batchMax: 4,
        interval: 0.08,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            clearProps: 'transform,opacity,visibility,willChange',
            duration: 0.82,
            ease: 'power3.out',
            scale: 1,
            stagger: 0.085,
            y: 0,
          })
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            clearProps: 'transform,opacity,visibility,willChange',
            duration: 0.72,
            ease: 'power3.out',
            scale: 1,
            stagger: 0.06,
            y: 0,
          })
        },
        start: 'top 88%',
      })

      gsap.set(rows, {
        autoAlpha: 0,
        willChange: 'transform, opacity',
        x: -34,
      })

      ScrollTrigger.batch(rows, {
        batchMax: 2,
        interval: 0.08,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            clearProps: 'transform,opacity,visibility,willChange',
            duration: 0.86,
            ease: 'power3.out',
            stagger: 0.12,
            x: 0,
          })
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            clearProps: 'transform,opacity,visibility,willChange',
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.08,
            x: 0,
          })
        },
        start: 'top 86%',
      })

      const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const cleanupHandlers = []

      if (canTilt) {
        tiltCards.forEach((card) => {
          const handleMove = (event) => {
            const rect = card.getBoundingClientRect()
            const xProgress = (event.clientX - rect.left) / rect.width - 0.5
            const yProgress = (event.clientY - rect.top) / rect.height - 0.5

            gsap.to(card, {
              duration: 0.42,
              ease: 'power3.out',
              overwrite: 'auto',
              rotationX: yProgress * -3.5,
              rotationY: xProgress * 4.5,
              transformPerspective: 900,
              y: -5,
            })
          }

          const handleLeave = () => {
            gsap.to(card, {
              duration: 0.72,
              ease: 'elastic.out(1, 0.55)',
              overwrite: 'auto',
              rotationX: 0,
              rotationY: 0,
              y: 0,
            })
          }

          card.addEventListener('pointermove', handleMove, { passive: true })
          card.addEventListener('pointerleave', handleLeave)
          cleanupHandlers.push(() => {
            card.removeEventListener('pointermove', handleMove)
            card.removeEventListener('pointerleave', handleLeave)
          })
        })
      }

      microTargets.forEach((target) => {
        const handleDown = () => {
          if (target.matches(':disabled') || target.getAttribute('aria-disabled') === 'true') {
            return
          }

          gsap.to(target, {
            duration: 0.12,
            ease: 'power2.out',
            overwrite: 'auto',
            scale: 0.965,
          })
        }

        const handleUp = () => {
          gsap.to(target, {
            duration: 0.56,
            ease: 'elastic.out(1, 0.45)',
            overwrite: 'auto',
            scale: 1,
          })
        }

        target.addEventListener('pointerdown', handleDown)
        target.addEventListener('pointerup', handleUp)
        target.addEventListener('pointerleave', handleUp)
        cleanupHandlers.push(() => {
          target.removeEventListener('pointerdown', handleDown)
          target.removeEventListener('pointerup', handleUp)
          target.removeEventListener('pointerleave', handleUp)
        })
      })

      window.requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cleanupHandlers.forEach((cleanup) => cleanup())
      }
      }, page)
    }

    if (document.documentElement.dataset.pageRevealed === 'true') {
      setupScrollAnimations()
    } else {
      window.addEventListener('fancourt:reveal-complete', setupScrollAnimations, { once: true })
    }

    return () => {
      window.removeEventListener('fancourt:reveal-complete', setupScrollAnimations)
      context?.revert()
    }
  }, [])

  useEffect(() => {
    const scroller = roomsScrollerRef.current
    const handleScroll = () => window.requestAnimationFrame(updateRoomsScrollEdges)
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateRoomsScrollEdges)

    updateRoomsScrollEdges()

    window.addEventListener('resize', updateRoomsScrollEdges)
    scroller?.addEventListener('scroll', handleScroll, { passive: true })
    if (scroller) {
      resizeObserver?.observe(scroller)
    }
    const timer = window.setTimeout(updateRoomsScrollEdges, 250)

    return () => {
      window.removeEventListener('resize', updateRoomsScrollEdges)
      scroller?.removeEventListener('scroll', handleScroll)
      resizeObserver?.disconnect()
      window.clearTimeout(timer)
    }
  }, [updateRoomsScrollEdges])

  useEffect(() => {
    const scroller = aboutImagesScrollerRef.current

    if (!scroller) {
      return undefined
    }

    function centerScroller() {
      const target = scroller.querySelector('[data-gallery-center]')

      if (!target || scroller.scrollWidth <= scroller.clientWidth) {
        scroller.scrollLeft = 0
        return
      }

      const scrollerRect = scroller.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const nextScrollLeft = scroller.scrollLeft
        + (targetRect.left + targetRect.width / 2)
        - (scrollerRect.left + scrollerRect.width / 2)

      scroller.scrollLeft = Math.max(0, Math.min(nextScrollLeft, scroller.scrollWidth - scroller.clientWidth))
    }

    const frame = window.requestAnimationFrame(centerScroller)
    const timer = window.setTimeout(centerScroller, 350)
    const images = Array.from(scroller.querySelectorAll('img'))

    images.forEach((image) => {
      image.addEventListener('load', centerScroller, { once: true })
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      images.forEach((image) => {
        image.removeEventListener('load', centerScroller)
      })
    }
  }, [])

  useEffect(() => {
    const scroller = testimonialsScrollerRef.current

    if (!scroller) {
      return undefined
    }

    function updateActiveTestimonial() {
      const cards = Array.from(scroller.querySelectorAll('[data-testimonial-card]'))
      const scrollerRect = scroller.getBoundingClientRect()
      const scrollerCenter = scrollerRect.left + scrollerRect.width / 2
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2
        const distance = Math.abs(cardCenter - scrollerCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveTestimonialIndex(closestIndex)
    }

    function centerInitialTestimonial() {
      const cards = Array.from(scroller.querySelectorAll('[data-testimonial-card]'))
      const targetCard = cards[1]

      if (targetCard) {
        const scrollerRect = scroller.getBoundingClientRect()
        const cardRect = targetCard.getBoundingClientRect()
        const nextScrollLeft = scroller.scrollLeft
          + (cardRect.left + cardRect.width / 2)
          - (scrollerRect.left + scrollerRect.width / 2)

        scroller.scrollTo({ left: nextScrollLeft, behavior: 'auto' })
        setActiveTestimonialIndex(1)
      }

      updateActiveTestimonial()
    }

    const handleScroll = () => window.requestAnimationFrame(updateActiveTestimonial)
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateActiveTestimonial)
    const frame = window.requestAnimationFrame(centerInitialTestimonial)
    const timer = window.setTimeout(centerInitialTestimonial, 350)

    scroller.addEventListener('scroll', handleScroll, { passive: true })
    resizeObserver?.observe(scroller)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      scroller.removeEventListener('scroll', handleScroll)
      resizeObserver?.disconnect()
    }
  }, [])

  useEffect(() => () => {
    window.clearTimeout(testimonialInteractionTimerRef.current)
  }, [])

  useEffect(() => {
    const section = testimonialsSectionRef.current

    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsTestimonialsSectionVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTestimonialsSectionVisible(entry.isIntersecting)
      },
      { threshold: 0.28 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isTestimonialsSectionVisible || isTestimonialAutoPaused || testimonials.length <= 1) {
      return undefined
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduceMotionQuery.matches) {
      return undefined
    }

    const timer = window.setInterval(() => {
      const nextIndex = getNextCarouselIndex(activeTestimonialIndex, testimonials.length)
      scrollTestimonialToIndex(nextIndex)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [activeTestimonialIndex, isTestimonialAutoPaused, isTestimonialsSectionVisible])

  useEffect(() => {
    const isMobileBookingSheet = ['arrival', 'departure', 'guests'].includes(activePanel)
      && window.matchMedia('(max-width: 767px)').matches

    if (activePanel !== 'summary' && !isMobileBookingSheet) {
      return undefined
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscroll = document.body.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'contain'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscroll
    }
  }, [activePanel])

  function openPanel(panelId) {
    if (panelId === 'guests') {
      markStepSelected('guests')
    }

    setActivePanel((currentPanel) => (currentPanel === panelId ? null : panelId))
  }

  function markStepSelected(step) {
    setSelectedSteps((currentSteps) => confirmBookingStep(currentSteps, step))
    setMissingSteps((currentSteps) => currentSteps.filter((item) => item !== step))
  }

  function closeBookingPanel(panelId) {
    if (panelId === 'guests') {
      markStepSelected('guests')
    }

    setActivePanel(null)
  }

  function selectArrivalDate(date) {
    const normalizedDeparture = normalizeDepartureDate(date, departureDate)

    setArrivalDate(date)
    setArrivalMonth(startOfMonth(date))
    setDepartureDate(normalizedDeparture)
    setDepartureMonth(startOfMonth(normalizedDeparture))
    markStepSelected('arrival')
    setActivePanel('departure')
  }

  function selectDepartureDate(date) {
    const normalizedDeparture = normalizeDepartureDate(arrivalDate, date)

    setDepartureDate(normalizedDeparture)
    setDepartureMonth(startOfMonth(normalizedDeparture))
    markStepSelected('departure')
    setActivePanel('guests')
  }

  function changeGuestCount(kind, delta) {
    markStepSelected('guests')

    setGuests((currentGuests) => {
      const minimum = kind === 'adults' ? 1 : 0
      const nextValue = Math.min(6, Math.max(minimum, currentGuests[kind] + delta))

      return { ...currentGuests, [kind]: nextValue }
    })
  }

  function handlePickRoom() {
    const nextMissingSteps = getMissingBookingSteps({
      arrivalSelected: selectedSteps.arrival,
      departureSelected: selectedSteps.departure,
      guestsSelected: selectedSteps.guests,
    })

    if (nextMissingSteps.length > 0) {
      setMissingSteps(nextMissingSteps)
      setActivePanel(nextMissingSteps[0])
      return
    }

    setMissingSteps([])
    setActivePanel(null)
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  function handleRoomBooking(roomName) {
    setRoomPreference(roomName)
    setDrawerView('summary')
    setDrawerBackView(null)
    setActivePanel('summary')
  }

  function handleRoomCardClick(roomName) {
    setRoomPreference(roomName)
    setDrawerView('roomInfo')
    setDrawerBackView(null)
    setActivePanel('summary')
  }

  function handleDrawerInfoRequest() {
    setDrawerView('roomInfo')
    setDrawerBackView('summary')
  }

  function handleDrawerBookRequest() {
    setDrawerView('summary')
    setDrawerBackView('roomInfo')
  }

  function handleDrawerBack() {
    if (!drawerBackView) {
      return
    }

    setDrawerView(drawerBackView)
    setDrawerBackView(null)
  }

  function handleDrawerClose() {
    setActivePanel(null)
    setDrawerBackView(null)
  }

  function handleContactSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const message = [
      'Hello Fancourt Suites, I would like to make an enquiry.',
      `Name: ${formData.get('name') || ''}`,
      `Phone: ${formData.get('phone') || ''}`,
      `Email: ${formData.get('email') || ''}`,
      `Message: ${formData.get('message') || ''}`,
    ].join('\n')

    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    form.reset()
  }

  function scrollRooms(direction) {
    roomsScrollerRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
    window.setTimeout(updateRoomsScrollEdges, 420)
  }

  function pauseTestimonialAutoplay(duration = 6500) {
    setIsTestimonialAutoPaused(true)
    window.clearTimeout(testimonialInteractionTimerRef.current)
    testimonialInteractionTimerRef.current = window.setTimeout(() => {
      setIsTestimonialAutoPaused(false)
    }, duration)
  }

  function holdTestimonialAutoplay() {
    window.clearTimeout(testimonialInteractionTimerRef.current)
    setIsTestimonialAutoPaused(true)
  }

  function resumeTestimonialAutoplay() {
    window.clearTimeout(testimonialInteractionTimerRef.current)
    setIsTestimonialAutoPaused(false)
  }

  function scrollTestimonialToIndex(index, behavior = 'smooth') {
    const scroller = testimonialsScrollerRef.current
    const cards = scroller ? Array.from(scroller.querySelectorAll('[data-testimonial-card]')) : []
    const targetCard = cards[index]

    if (!scroller || !targetCard) {
      return
    }

    const scrollerRect = scroller.getBoundingClientRect()
    const cardRect = targetCard.getBoundingClientRect()
    const nextScrollLeft = scroller.scrollLeft
      + (cardRect.left + cardRect.width / 2)
      - (scrollerRect.left + scrollerRect.width / 2)

    scroller.scrollTo({ left: nextScrollLeft, behavior })
    setActiveTestimonialIndex(index)
  }

  return (
    <main ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#e9e0cf] text-[#2c2617]">
      <PageRevealOverlay />
      <CustomPageScrollbar />
      <nav
        ref={navRef}
        className="fixed inset-x-0 top-0 z-[900] px-4 py-3 text-white sm:px-10 sm:py-4 lg:px-20"
        aria-label="Primary navigation"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-300"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(44, 38, 23, 0.88) 0%, rgba(44, 38, 23, 0.62) 38%, rgba(44, 38, 23, 0.24) 68%, rgba(44, 38, 23, 0) 100%)',
            opacity: isNavScrolled ? 1 : 0,
          }}
        />
        <div className="relative z-10 mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-cols-[1fr_auto_1fr]">
          <a className="inline-flex items-center" href="#home" aria-label="Fancourt Suites home">
            <img
              alt="Fancourt Suites"
              className="h-10 w-auto object-contain brightness-0 invert sm:h-12"
              decoding="async"
              fetchPriority="high"
              src="/fancourt-logo.webp"
            />
          </a>
          <div className="relative hidden h-10 w-[min(52vw,500px)] grid-cols-6 items-center justify-self-center overflow-hidden rounded-full border border-white/35 bg-[#2c2617]/22 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.16)] md:grid">
            <span
              aria-hidden="true"
              className="absolute bottom-1 top-1 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out"
              style={{
                left: '0.25rem',
                width: `calc((100% - 0.5rem) / ${navItems.length})`,
                transform: `translateX(${activeNavIndex * 100}%)`,
              }}
            />
            {navItems.map((item) => (
              <a
                className={`relative z-10 grid h-full min-w-0 place-items-center rounded-full px-1.5 text-center text-[11px] font-bold transition-colors duration-300 lg:text-xs ${
                  item === activeNavItem
                    ? 'text-[#2c2617]'
                    : 'text-white/86 hover:bg-white/14 hover:text-white'
                }`}
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>
          <a
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-white/45 bg-[#2c2617]/18 pl-3 pr-1 text-[11px] font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)] transition hover:bg-white hover:text-[#2c2617] sm:h-10 sm:gap-2.5 sm:pl-4 sm:pr-1.5 sm:text-xs"
            href="#rooms"
          >
            <span>Book Direct</span>
            <span className="grid size-7 place-items-center rounded-full bg-white text-[#2c2617]">
              <ArrowRight size={17} strokeWidth={3} />
            </span>
          </a>
        </div>
      </nav>
      <div className="bg-[#e9e0cf] p-1.5">
        <section
          ref={heroRef}
          className="hero-fixed-background relative isolate grid h-[calc(100svh-12px)] min-h-[620px] grid-rows-[1fr] overflow-hidden rounded-b-[22px] rounded-t-none bg-[#2c2617] px-4 py-4 text-white sm:min-h-[560px] sm:px-14 sm:py-5 lg:px-20"
          id="home"
          aria-label="Luxury hotel hero"
        >
          <div className="absolute inset-0 -z-10 bg-[#2c2617]/80" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_48%_42%,rgba(255,255,255,.08),transparent_32%),linear-gradient(90deg,rgba(44,38,23,.18),transparent_28%,transparent_70%,rgba(44,38,23,.2))]" />
          <div className="booking-focus-layer pointer-events-none absolute inset-0 z-[15] bg-[#2c2617]/28 opacity-0 backdrop-blur-[1px] transition-opacity duration-300" aria-hidden="true" />

          <div className="relative z-30 mx-auto flex h-full w-full min-w-0 max-w-[1180px] -translate-y-[clamp(.15rem,.7vh,.5rem)] flex-col items-center justify-start pb-[clamp(.75rem,2.2vh,2rem)] pt-[clamp(9.15rem,24.8svh,12.8rem)] text-center sm:h-auto sm:justify-center sm:pt-1">
  <h1
    data-hero-heading
    className="mt-2 -mb-1 max-w-full translate-y-1 select-none overflow-visible whitespace-nowrap pb-0 pt-3 font-extrabold uppercase leading-[.82] tracking-[.02em] text-white [font-size:clamp(3.1rem,15.1vw,3.8rem)] sm:mt-5.5 sm:-mb-[clamp(.55rem,1.2vh,.95rem)] sm:translate-y-[clamp(.45rem,1.1vw,.95rem)] sm:pt-[clamp(.9rem,2.3vh,1.55rem)] sm:tracking-[.03em] sm:[font-size:clamp(5.15rem,13.75vw,10.35rem)] lg:tracking-[.035em] lg:[font-size:clamp(7.2rem,12.7vw,12.25rem)] 2xl:[font-size:clamp(9rem,11.8vw,12.45rem)]"
    style={{
      // Pushed the solid black opacity down from 28% to 42% so more solid white shines through the top
      WebkitMaskImage:
        'linear-gradient(180deg,#000 0%,#000 42%,rgba(0,0,0,.66) 56%,rgba(0,0,0,.22) 71%,rgba(0,0,0,.025) 85%,rgba(0,0,0,0) 100%)',
      maskImage:
        'linear-gradient(180deg,#000 0%,#000 42%,rgba(0,0,0,.66) 56%,rgba(0,0,0,.22) 71%,rgba(0,0,0,.025) 85%,rgba(0,0,0,0) 100%)',
      textShadow: '0 20px 24px rgba(44,38,23,.68)',
    }}
  >
    Fancourt
  </h1>

  {/* Increased margin-top from clamp(.55rem, 1.05vw, 1.15rem) to clamp(.9rem, 1.6vw, 1.75rem) */}
  <div data-hero-copy className="mt-5 inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-black text-white sm:mt-[clamp(.95rem,1.65vw,1.8rem)] sm:text-sm" aria-label="Rated 4.9 out of 5">
    <span className="inline-flex items-center gap-1 text-xs font-medium leading-5 text-white/78 drop-shadow">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star className="size-3.5 fill-current sm:size-4" strokeWidth={1.5} key={index} />
      ))}
    </span>
    <span className="h-3 w-px bg-white/35" aria-hidden="true" />
    <span className=" text-xs font-medium leading-5 text-white/78 drop-shadow">Rated 4.9/5</span>
  </div>

  {/* Reduced margin-top from mt-6 to mt-3.5 */}
  <p data-hero-copy className="mt-5 max-w-[22rem] text-[clamp(1.45rem,6.2vw,1.85rem)] font-medium leading-[1.18] tracking-[.025em] drop-shadow-[0_12px_24px_rgba(0,0,0,.42)] sm:mt-3.5 sm:max-w-[760px] sm:text-[clamp(2.1rem,2.8vw,3.2rem)] md:whitespace-nowrap">
    Experience Timeless Luxury.
  </p>
  <p data-hero-copy className="mt-4 max-w-[19rem] text-[11px] font-medium leading-4 text-white/78 drop-shadow sm:max-w-[540px] sm:text-sm sm:leading-5">
    Secure privacy, steady power, complimentary breakfast, <span className="hidden sm:inline"><br /></span>
    and fast reservations in Flower Garden GRA, Ilorin.
  </p>

            <div
              data-hero-booking
              className="booking-shell mobile-hero-booking-shell absolute inset-x-2 bottom-[-0.625rem] z-30 mx-auto min-w-0 max-w-none sm:relative sm:inset-x-auto sm:bottom-auto sm:mt-[clamp(2.25rem,5.8vh,4rem)] sm:w-full sm:max-w-[calc(100vw-2rem)] md:w-[min(78vw,860px)]"
              data-active={activePanel ? 'true' : 'false'}
            >
              {Object.entries(panelCopy).map(([id, panel]) => (
                <div
                  aria-hidden={activePanel !== id}
                  className={`booking-panel booking-panel-${id} ${activePanel === id ? 'booking-panel-active' : ''} absolute bottom-[calc(100%+8px)] z-[960] w-[min(84vw,540px)] bg-transparent p-0 text-[#2c2617] opacity-0 transition-all duration-300 ease-out`}
                  data-picker={id === 'arrival' || id === 'departure' ? 'arrival' : undefined}
                  id={`booking-panel-${id}`}
                  key={id}
                  role="dialog"
                >
                  <BookingPanel
                    activeId={id}
                    arrivalDate={arrivalDate}
                    arrivalMonth={arrivalMonth}
                    departureDate={departureDate}
                    departureMonth={departureMonth}
                    guests={guests}
                    onArrivalDateChange={selectArrivalDate}
                    onArrivalMonthChange={setArrivalMonth}
                    onClose={() => closeBookingPanel(id)}
                    onDepartureDateChange={selectDepartureDate}
                    onDepartureMonthChange={setDepartureMonth}
                    onGuestChange={changeGuestCount}
                    panel={panel}
                    today={today}
                  />
                </div>
              ))}
              {['arrival', 'departure', 'guests'].includes(activePanel) && (
                <button
                  aria-label="Close booking panel"
                  className="fixed inset-0 z-[930] cursor-default bg-[#2c2617]/28 md:bg-transparent"
                  onClick={() => closeBookingPanel(activePanel)}
                  type="button"
                />
              )}

              <div className="mobile-booking-card grid w-full grid-cols-2 overflow-visible rounded-[24px] bg-white text-[#2c2617] shadow-[0_22px_70px_rgba(0,0,0,.28)] ring-1 ring-white/70 sm:grid-cols-3 sm:rounded-full md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(160px,auto)]">
                {bookingFields.map((field, index) => {
                  const Icon = field.icon
                  const isMissing = missingSteps.includes(field.id)

                  return (
                    <button
                      aria-controls={`booking-panel-${field.id}`}
                      aria-expanded={activePanel === field.id}
                      className={`group relative flex min-h-[62px] items-center justify-between border-[#2c2617]/10 px-4 py-3 text-left transition sm:min-h-[68px] sm:border-r sm:first:rounded-l-full sm:first:rounded-r-none sm:last:rounded-none ${index === 0 ? 'rounded-tl-[24px]' : ''} ${index === 1 ? 'rounded-tr-[24px] border-l' : ''} ${index === 2 ? 'rounded-bl-[24px] border-t' : ''} ${
                        isMissing
                          ? 'bg-[#fff4d6] shadow-[inset_0_0_0_2px_rgba(215,178,75,.9)]'
                          : activePanel === field.id
                            ? 'bg-[#efe7d7]'
                            : 'bg-white hover:bg-[#efe7d7] focus:bg-white'
                      }`}
                      data-booking-panel={field.id}
                      key={field.id}
                      onClick={() => openPanel(field.id)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-[#7b6b4b]">{field.label}</span>
                        <span className="mt-1 block truncate text-[15px] font-black">{field.value}</span>
                      </span>
                      <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[#7b6b4b] transition ${activePanel === field.id ? 'rotate-180 text-[#2c2617]' : 'group-hover:text-[#2c2617]'}`}>
                        <Icon size={14} strokeWidth={2.8} />
                      </span>
                      {isMissing && (
                        <span className="absolute -top-11 left-1/2 z-[70] w-max max-w-[190px] -translate-x-1/2 rounded-full bg-[#2c2617] px-3 py-2 text-center text-[11px] font-black text-white shadow-[0_14px_34px_rgba(0,0,0,.24)]">
                          {field.id === 'arrival' && 'Pick an arrival date'}
                          {field.id === 'departure' && 'Pick a departure date'}
                          {field.id === 'guests' && 'Confirm guests'}
                        </span>
                      )}
                    </button>
                  )
                })}
                <button
                  className="mobile-booking-cta m-1.5 inline-flex min-h-[56px] items-center justify-center gap-3 whitespace-nowrap rounded-[18px] bg-[#2c2617] px-4 text-sm font-black text-white transition hover:bg-[#4d422b] focus:outline-none focus:ring-4 focus:ring-[#c6b27e]/45 sm:col-span-3 sm:m-2 sm:min-h-12 sm:rounded-full md:col-span-1"
                  onClick={handlePickRoom}
                  type="button"
                >
                  Pick a room
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
              <p className="sr-only">{bookingSummary}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#e7dfcf] px-5 pb-10 pt-9 sm:px-8 sm:pt-[4.8rem] lg:px-12 lg:pt-[5.35rem]" id="rooms">
        <SectionHeading title="Available Rooms & Suites" compact showMark={false} />
        <div className="mx-auto mt-8 max-w-[1010px]">
          <div className="relative">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#e7dfcf] to-transparent transition-opacity duration-300 ${roomsScrollEdges.left ? 'opacity-100' : 'opacity-0'}`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#e7dfcf] to-transparent transition-opacity duration-300 ${roomsScrollEdges.right ? 'opacity-100' : 'opacity-0'}`}
            />
          <div
            className="rooms-scroll flex gap-3.5 overflow-x-auto pb-2 sm:gap-4"
            onScroll={updateRoomsScrollEdges}
            ref={roomsScrollerRef}
          >
            {rooms.map((room) => (
              <article
                className="group min-w-[260px] rounded-[14px] bg-white p-2.5 text-left shadow-[0_14px_30px_rgba(44,38,23,.09)] ring-1 ring-[#2c2617]/7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(44,38,23,.15)] sm:min-w-[292px] lg:min-w-[318px]"
                data-scroll-card
                data-tilt-card
                key={room.name}
                onClick={() => handleRoomCardClick(room.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleRoomCardClick(room.name)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative overflow-hidden rounded-[10px]">
                  <img
                    className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.035] sm:h-40"
                    src={room.image}
                    srcSet={room.imageSrcSet}
                    sizes="(min-width: 1024px) 318px, (min-width: 640px) 292px, 260px"
                    alt={`${room.name} bedroom`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-black text-[#2c2617] shadow-[0_10px_24px_rgba(0,0,0,.18)]">
                    {room.price}
                    <small className="ml-1 text-[9px] font-black text-[#7b6b4b]">/night</small>
                  </span>
                </div>
                <div className="px-2 pb-1.5 pt-3.5">
                  <h3 className="truncate text-lg font-black tracking-[0]">{room.name}</h3>
                  <ul className="mt-2.5 grid grid-cols-3 gap-2 text-[10px] font-bold text-[#7b6b4b]">
                    {room.meta.map((item, index) => (
                      <li className="inline-flex min-w-0 items-center gap-1" key={item}>
                        {[BedDouble, Bath, Tv][index] && (
                          <RoomMetaIcon Icon={[BedDouble, Bath, Tv][index]} />
                        )}
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="mt-3.5 inline-flex rounded-full border border-[#2c2617]/10 bg-white px-4 py-2 text-xs font-black text-[#2c2617] shadow-sm transition hover:bg-[#2c2617] hover:text-white"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRoomBooking(room.name)
                    }}
                    type="button"
                  >
                    Book now
                  </button>
                </div>
              </article>
            ))}
          </div>
          </div>
          <div className="mt-7 flex items-center gap-5">
            <div
              aria-label="Rooms carousel progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(roomsScrollEdges.progress * 100)}
              className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-[#2c2617]/10"
              role="progressbar"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-full bg-[#2c2617]/48 transition-[width] duration-300 ease-out"
                style={{ width: `${roomsScrollEdges.progress * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Scroll rooms left"
                className="grid size-8 place-items-center rounded-full border border-[#2c2617]/18 text-[#7b6b4b] transition hover:bg-white hover:text-[#2c2617] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[#7b6b4b]"
                disabled={!roomsScrollEdges.left}
                onClick={() => scrollRooms(-1)}
                type="button"
              >
                <ChevronLeft size={16} strokeWidth={2.4} />
              </button>
              <button
                aria-label="Scroll rooms right"
                className="grid size-8 place-items-center rounded-full border border-[#2c2617]/18 text-[#7b6b4b] transition hover:bg-white hover:text-[#2c2617] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[#7b6b4b]"
                disabled={!roomsScrollEdges.right}
                onClick={() => scrollRooms(1)}
                type="button"
              >
                <ChevronRight size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9e0cf] p-1.5" aria-label="Hotel statistics">
        <div className="rounded-[22px] bg-[#2c2617] px-7 pb-8 pt-10 text-white sm:px-12 sm:py-[4.5rem] lg:px-24 lg:py-20" data-scroll-card>
          <SectionHeading title="When Our Stats Speaks" compact dark showMark={false} />
          <div className="mx-auto mt-6 max-w-6xl divide-y divide-white/10 sm:mt-12">
            <TrustStatRow stat={stats[0]} variant="copy-stat-image" />
            <TrustStatRow stat={stats[1]} variant="stat-image-copy" />
            <TrustStatRow stat={stats[2]} variant="image-stat-copy" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#e9e0cf] pb-8 pt-20 sm:pb-10 sm:pt-24" id="about">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[430px] text-[#2c2617] lg:ml-[51%] lg:mr-0" data-scroll-card>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#7b6b4b] shadow-sm">
              <CircleCheck size={11} fill="#d4bd72" strokeWidth={2.5} />
              Fancourt Luxury
            </span>
            <p className="mt-4 text-[1.04rem] font-semibold leading-[1.22] tracking-[0] text-[#2c2617] sm:text-[1.12rem]">
              <strong className="text-[2rem] font-black leading-none tracking-[-.01em] sm:text-[2.28rem]">Fancourt</strong>{' '}
              is a calm, modern, and privacy-forward boutique hotel designed for the contemporary traveller.{' '}
              <span className="font-medium text-[#7a705f]">
                It blends secure GRA comfort with steady power, breakfast, restaurant access, and fast direct reservations for business guests, solo adventurers, and couples.
              </span>
            </p>
          </div>
        </div>

        <div
          aria-label="Fancourt suite gallery"
          className="rooms-scroll mt-2 overflow-x-auto overflow-y-hidden px-4 py-8 sm:mt-1 sm:px-6 sm:py-9 lg:px-7"
          ref={aboutImagesScrollerRef}
        >
          <div className="mx-auto flex w-max items-end gap-4 sm:gap-6 lg:gap-8">
            <img
              className="h-[250px] w-[176px] shrink-0 rounded-full object-cover shadow-[0_28px_70px_rgba(44,38,23,.18)] sm:h-[330px] sm:w-[218px]"
              src={storyImages[0].src}
              srcSet={storyImages[0].srcSet}
              sizes="218px"
              alt={storyImages[0].alt}
              data-scroll-card
              loading="lazy"
              decoding="async"
            />
            <img
              className="mb-5 h-[200px] w-[200px] shrink-0 rounded-full object-cover shadow-[0_28px_70px_rgba(44,38,23,.16)] sm:mb-8 sm:h-[238px] sm:w-[238px]"
              src={storyImages[1].src}
              srcSet={storyImages[1].srcSet}
              sizes="238px"
              alt={storyImages[1].alt}
              data-scroll-card
              loading="lazy"
              decoding="async"
            />
            <div className="relative shrink-0" data-gallery-center>
            <img
              className="h-[288px] w-[210px] rounded-full object-cover shadow-[0_28px_70px_rgba(44,38,23,.18)] sm:h-[362px] sm:w-[262px]"
              src={storyImages[2].src}
              srcSet={storyImages[2].srcSet}
              sizes="262px"
              alt={storyImages[2].alt}
              data-scroll-card
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-8 right-4 rotate-[58deg] text-[10px] font-black tracking-[.28em] text-white/80">
              secure GRA comfort
            </span>
            </div>
            <img
              className="mb-6 h-[218px] w-[196px] shrink-0 rounded-full object-cover shadow-[0_28px_70px_rgba(44,38,23,.16)] sm:mb-10 sm:h-[276px] sm:w-[226px]"
              src={storyImages[3].src}
              srcSet={storyImages[3].srcSet}
              sizes="226px"
              alt={storyImages[3].alt}
              data-scroll-card
              loading="lazy"
              decoding="async"
            />
            <img
              className="mb-1 h-[240px] w-[172px] shrink-0 rounded-full object-cover shadow-[0_28px_70px_rgba(44,38,23,.16)] sm:h-[318px] sm:w-[212px]"
              src={storyImages[4].src}
              srcSet={storyImages[4].srcSet}
              sizes="212px"
              alt={storyImages[4].alt}
              data-scroll-card
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-0 sm:px-8 lg:px-12" id="amenities">
        <SectionHeading title="Enjoy Premium Amenities" compact showMark={false} />
        <div className="mx-auto mt-6 grid max-w-[1040px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => {
            const Icon = amenity.icon
            return (
              <article
                className={`relative min-h-[190px] overflow-hidden rounded-[10px] p-6 shadow-[0_18px_45px_rgba(44,38,23,.08)] ${
                  amenity.featured ? 'bg-[#2c2617] text-white' : 'bg-white text-[#2c2617]'
                }`}
                data-scroll-card
                data-tilt-card
                key={amenity.title}
              >
                {amenity.featured && (
                  <span
                    aria-hidden="true"
                    className="absolute right-6 top-7 h-12 w-24 opacity-25 [background:repeating-linear-gradient(135deg,transparent_0_7px,rgba(255,255,255,.55)_7px_9px,transparent_9px_16px)]"
                  />
                )}
                <div className={`grid size-12 place-items-center rounded-full ${amenity.featured ? 'bg-white/12 text-[#d7c284]' : 'bg-[#e9e0cf] text-[#7b6b4b]'}`}>
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h3 className="mt-7 text-base font-black">{amenity.title}</h3>
                <p className={`mt-3 max-w-[260px] text-[11px] font-semibold leading-5 ${amenity.featured ? 'text-white/58' : 'text-[#76694d]'}`}>{amenity.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-[#e9e0cf] p-1.5 pb-1.5" id="testimonials" ref={testimonialsSectionRef}>
        <div className="relative overflow-hidden rounded-[22px] bg-[#17140e] px-0 py-12 text-white lg:py-14">
          <Star
            aria-hidden="true"
            className="absolute left-1/2 top-6 size-24 -translate-x-1/2 rotate-12 fill-[#d2b85d] text-[#d2b85d] opacity-12"
            strokeWidth={1.4}
          />
          <div className="relative z-10 mx-auto max-w-xl px-6 text-center sm:px-8" data-scroll-card>
            <h2 aria-label="Customer Experiences" className="text-2xl font-black tracking-[0] sm:text-3xl" data-scroll-float>
              <ScrollFloatWords text="Customer Experiences" />
            </h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-white/54 sm:text-sm">
              Hear firsthand from guests about quiet stays, fast reservations, and attentive Fancourt hospitality.
            </p>
          </div>

          <div
            aria-label="Guest testimonial carousel"
            className="rooms-scroll relative z-10 mt-6 flex gap-5 overflow-x-auto overflow-y-hidden px-[max(1.5rem,calc((100vw-500px)/2))] py-3"
            onBlur={resumeTestimonialAutoplay}
            onFocus={holdTestimonialAutoplay}
            onMouseEnter={holdTestimonialAutoplay}
            onMouseLeave={resumeTestimonialAutoplay}
            onPointerDown={() => pauseTestimonialAutoplay()}
            onWheel={() => pauseTestimonialAutoplay()}
            ref={testimonialsScrollerRef}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                active={activeTestimonialIndex === index}
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </div>
          <div className="relative z-10 mt-4 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                aria-label={`Show testimonial from ${testimonial.name}`}
                className={`h-2 rounded-full transition-all ${
                  activeTestimonialIndex === index ? 'w-8 bg-[#d2b85d]' : 'w-2 bg-white/24 hover:bg-white/45'
                }`}
                key={testimonial.name}
                onClick={() => {
                  pauseTestimonialAutoplay()
                  scrollTestimonialToIndex(index)
                }}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9e0cf] px-6 pb-14 pt-12 sm:px-8 sm:pb-16 sm:pt-14 lg:px-12 lg:pt-16" id="location">
        <SectionHeading title="Where to find us" compact showMark={false} />
        <div className="mx-auto mt-7 max-w-[1180px] overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_26px_70px_rgba(44,38,23,.12)] ring-1 ring-[#2c2617]/8" data-scroll-card>
          <div className="relative h-[360px] overflow-hidden rounded-[18px] sm:h-[430px] lg:h-[500px]">
            <iframe
              allowFullScreen
              aria-label="Map showing Fancourt Suites at 1 Reservation Road, Flower Garden GRA, Ilorin"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Fancourt%20Suites%2C%201%20Reservation%20Road%2C%20Flower%20Garden%20GRA%2C%20Ilorin%2C%20Kwara%20State%2C%20Nigeria&output=embed"
              title="Fancourt Suites location map"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#e9e0cf] px-6 pb-12 pt-0 sm:px-8 sm:pb-14 lg:px-12" id="contact">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch">
          <div className="relative min-h-[370px] overflow-hidden px-2 pt-1 text-[#2c2617] sm:min-h-[420px] sm:px-4 lg:min-h-[500px] lg:px-0" data-scroll-card>
            <h2 aria-label="Lets get in touch" className="relative z-10 max-w-[300px] text-[clamp(1.85rem,3.05vw,3.25rem)] font-black leading-[.98] tracking-[0]" data-scroll-float>
              <ScrollFloatWords text="Lets get in touch" />
            </h2>
            <img
              alt="Fancourt Suites receptionist waving"
              className="absolute bottom-0 left-0 z-[1] h-[285px] max-w-none object-contain sm:left-2 sm:h-[335px] lg:left-0 lg:h-[405px]"
              decoding="async"
              loading="lazy"
              src="/contact-host.webp"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[62%]"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(233, 224, 207, 0) 0%, rgba(233, 224, 207, 0.025) 18%, rgba(233, 224, 207, 0.12) 36%, rgba(233, 224, 207, 0.34) 56%, rgba(233, 224, 207, 0.72) 78%, #e9e0cf 100%)',
              }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-8%] left-[-10%] z-[3] h-[68%] w-[88%]"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 0% 100%, #e9e0cf 0%, rgba(233, 224, 207, 0.82) 28%, rgba(233, 224, 207, 0.44) 49%, rgba(233, 224, 207, 0.14) 68%, rgba(233, 224, 207, 0) 88%)',
              }}
            />
            <div className="absolute bottom-7 left-2 z-10 grid gap-3 text-sm font-bold text-[#2c2617]/78 sm:left-4 lg:left-0">
              <span className="inline-flex items-center gap-2">
                <Phone size={16} strokeWidth={2.3} />
                09126511517
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} strokeWidth={2.3} />
                Flower Garden GRA, Ilorin
              </span>
            </div>
          </div>

          <div className="rounded-[22px] bg-[#2c2617] px-6 py-8 text-white shadow-[0_30px_80px_rgba(44,38,23,.16)] sm:px-10 sm:py-10 lg:px-12 lg:py-12" data-scroll-card>
            <form className="grid gap-5" onSubmit={handleContactSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2.5 text-xs font-black uppercase tracking-[.08em] text-[#d7c284]">
                  Name
                  <input
                    className="min-h-[52px] rounded-[14px] border border-white/10 bg-white px-4 text-sm font-bold normal-case tracking-[0] text-[#2c2617] outline-none transition focus:border-[#d2b85d] focus:ring-4 focus:ring-[#d2b85d]/25"
                    name="name"
                    placeholder="Your name"
                    required
                    type="text"
                  />
                </label>
                <label className="grid gap-2.5 text-xs font-black uppercase tracking-[.08em] text-[#d7c284]">
                  Phone
                  <input
                    className="min-h-[52px] rounded-[14px] border border-white/10 bg-white px-4 text-sm font-bold normal-case tracking-[0] text-[#2c2617] outline-none transition focus:border-[#d2b85d] focus:ring-4 focus:ring-[#d2b85d]/25"
                    name="phone"
                    placeholder="080..."
                    required
                    type="tel"
                  />
                </label>
              </div>
              <label className="grid gap-2.5 text-xs font-black uppercase tracking-[.08em] text-[#d7c284]">
                Email
                <input
                  className="min-h-[52px] rounded-[14px] border border-white/10 bg-white px-4 text-sm font-bold normal-case tracking-[0] text-[#2c2617] outline-none transition focus:border-[#d2b85d] focus:ring-4 focus:ring-[#d2b85d]/25"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>
              <label className="grid gap-2.5 text-xs font-black uppercase tracking-[.08em] text-[#d7c284]">
                Message
                <textarea
                  className="min-h-[118px] resize-none rounded-[18px] border border-white/10 bg-white px-4 py-4 text-sm font-bold normal-case leading-6 tracking-[0] text-[#2c2617] outline-none transition focus:border-[#d2b85d] focus:ring-4 focus:ring-[#d2b85d]/25"
                  name="message"
                  placeholder="Tell us what you need help with"
                  required
                />
              </label>
              <button
                className="mt-2 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#d7c284] px-6 text-sm font-black text-[#2c2617] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#c6b27e]/45"
                type="submit"
              >
                Send message
                <Send size={16} strokeWidth={2.6} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-[#e9e0cf] text-[#2c2617]">
        <div className="w-full">
          <div
            className="relative overflow-hidden px-6 pb-6 pt-9 text-white shadow-[0_34px_90px_rgba(44,38,23,.2)] sm:px-9 sm:pb-7 sm:pt-10 lg:px-12"
            data-scroll-card
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(44, 38, 23, .82), rgba(44, 38, 23, .96)), url(/images/portfolio/reception-1000.webp)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderRadius: 0,
            }}
          >
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h2 aria-label="Calm stays, steady comfort, first-class hospitality." className="max-w-[500px] text-[clamp(1.55rem,3.1vw,3.25rem)] font-black leading-[1.02] tracking-[0]" data-scroll-float>
                  <ScrollFloatWords text="Calm stays, steady comfort, first-class hospitality." />
                </h2>
              </div>
              <a
                className="inline-flex h-11 items-center justify-center gap-2.5 self-start rounded-full border border-white/45 bg-[#2c2617]/18 pl-5 pr-1.5 text-xs font-black uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)] transition hover:bg-white hover:text-[#2c2617]"
                href={footerWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Reception
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#2c2617]">
                  <ArrowRight size={18} strokeWidth={3} />
                </span>
              </a>
            </div>

            <div className="relative z-10 mt-16 grid gap-5 border-t border-white/14 pt-5 text-sm font-bold text-white/76 sm:grid-cols-2 lg:grid-cols-[1.2fr_.9fr_.9fr_auto] lg:items-end">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[.14em] text-[#d7c284]">Address</span>
                <span className="mt-2 inline-flex items-start gap-2 leading-5">
                  <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={2.3} />
                  1 Reservation Road, Flower Garden GRA, Ilorin.
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[.14em] text-[#d7c284]">Reception</span>
                <a className="mt-2 inline-flex items-center gap-2 transition hover:text-white" href="tel:+2349126511517">
                  <Phone className="size-4" strokeWidth={2.3} />
                  09126511517
                </a>
              </div>
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[.14em] text-[#d7c284]">Email</span>
                <a className="mt-2 inline-flex items-center gap-2 transition hover:text-white" href="mailto:info@fancourtsuites.com">
                  <Mail className="size-4" strokeWidth={2.3} />
                  info@fancourtsuites.com
                </a>
              </div>
              <p className="text-xs font-black text-white/42 lg:text-right">2026 Fancourt Suites</p>
            </div>
          </div>
        </div>
      </footer>
      <BookingSummaryDrawer
        arrivalDate={arrivalDate}
        backView={drawerBackView}
        departureDate={departureDate}
        guests={guests}
        isOpen={activePanel === 'summary'}
        onBack={handleDrawerBack}
        onBookFromInfo={handleDrawerBookRequest}
        onClose={handleDrawerClose}
        onShowInfo={handleDrawerInfoRequest}
        room={selectedRoom}
        view={drawerView}
      />
    </main>
  )
}

function PageRevealOverlay() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current

    if (!overlay) {
      return undefined
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior
    let timeline

    const context = gsap.context(() => {
      const columns = overlay.querySelectorAll('[data-reveal-column]')
      const logo = overlay.querySelector('[data-reveal-logo]')
      const pageContent = Array.from(document.querySelectorAll('main > :not(.page-reveal):not(nav)'))
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const completeReveal = () => {
        document.body.style.overflow = previousBodyOverflow
        document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior
        delete document.documentElement.dataset.pageRevealing
        document.documentElement.dataset.pageRevealed = 'true'
        window.dispatchEvent(new Event('fancourt:nav-refresh'))
        window.dispatchEvent(new Event('fancourt:reveal-complete'))
        gsap.set(overlay, { display: 'none' })
      }

      delete document.documentElement.dataset.pageRevealed
      document.documentElement.dataset.pageRevealing = 'true'
      document.documentElement.style.scrollBehavior = 'auto'
      document.body.style.overflow = 'hidden'
      window.dispatchEvent(new Event('fancourt:nav-refresh'))

      if (prefersReducedMotion) {
        gsap.set(overlay, { autoAlpha: 0 })
        gsap.set(pageContent, { clearProps: 'all' })
        completeReveal()
        return
      }

      gsap.set(columns, { willChange: 'transform', yPercent: 0 })
      gsap.set(logo, { autoAlpha: 0, scale: 0.82, willChange: 'transform, opacity', y: 18 })
      gsap.set(pageContent, {
        autoAlpha: 0.92,
        willChange: 'opacity',
      })

      timeline = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        onComplete: completeReveal,
      })

      timeline
        .to(logo, {
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power3.out',
          scale: 1,
          y: 0,
        })
        .add('siteReveal', '+=0.18')
        .to(logo, {
          autoAlpha: 0,
          duration: 0.62,
          ease: 'power2.inOut',
          scale: 1.08,
          y: -14,
        }, 'siteReveal')
        .to(columns, {
          duration: 1.08,
          ease: 'expo.inOut',
          stagger: { each: 0.105, from: 'start' },
          yPercent: -101,
        }, 'siteReveal')
        .call(() => {
          window.dispatchEvent(new Event('fancourt:hero-intro-start'))
        }, [], 'siteReveal+=0.34')
        .to(pageContent, {
          autoAlpha: 1,
          clearProps: 'opacity,visibility,willChange',
          duration: 0.38,
          ease: 'power2.out',
        }, 'siteReveal+=0.22')
        .to(overlay, {
          autoAlpha: 0,
          duration: 0.14,
          ease: 'power1.out',
        }, '-=0.1')
    }, overlay)

    return () => {
      timeline?.kill()
      context.revert()
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior
      delete document.documentElement.dataset.pageRevealing
      window.dispatchEvent(new Event('fancourt:nav-refresh'))
    }
  }, [])

  return (
    <div
      aria-label="Fancourt Suites page reveal"
      aria-live="polite"
      className="page-reveal fixed inset-0 z-[1400] overflow-hidden"
      ref={overlayRef}
      role="status"
    >
      <div aria-hidden="true" className="page-reveal-columns">
        {Array.from({ length: 7 }).map((_, index) => (
          <span className="page-reveal-column" data-reveal-column key={index} />
        ))}
      </div>
      <div className="page-reveal-logo-wrap">
        <span aria-hidden="true" className="page-reveal-logo" data-reveal-logo />
        <span className="sr-only">Loading Fancourt Suites</span>
      </div>
    </div>
  )
}

function CustomPageScrollbar() {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    const track = trackRef.current
    const thumb = thumbRef.current
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    let frameId = 0
    let hideTimer = 0
    let isDragging = false
    let dragOffset = 0

    if (!track || !thumb) {
      return undefined
    }

    const hideScrollbar = () => {
      root.classList.remove('scrollbar-visible')
    }

    const showScrollbar = () => {
      root.classList.add('scrollbar-visible')
    }

    const getScrollMetrics = () => {
      const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight)
      const viewportHeight = window.innerHeight
      const maxScroll = Math.max(0, scrollHeight - viewportHeight)
      const trackHeight = track.getBoundingClientRect().height
      const thumbHeight = Math.max(46, Math.min(trackHeight, (viewportHeight / scrollHeight) * trackHeight))

      return {
        maxScroll,
        scrollHeight,
        thumbHeight,
        trackHeight,
        viewportHeight,
      }
    }

    const updateThumb = () => {
      frameId = 0

      const { maxScroll, thumbHeight, trackHeight } = getScrollMetrics()

      if (maxScroll <= 2) {
        root.classList.add('custom-scrollbar-disabled')
        hideScrollbar()
        return
      }

      root.classList.remove('custom-scrollbar-disabled')

      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      const thumbTop = (trackHeight - thumbHeight) * scrollProgress

      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`
    }

    const scheduleUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(updateThumb)
    }

    const scheduleHide = (delay = 720) => {
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(hideScrollbar, delay)
    }

    const scrollToThumbPosition = (clientY) => {
      const { maxScroll, thumbHeight, trackHeight } = getScrollMetrics()
      const travel = Math.max(1, trackHeight - thumbHeight)
      const trackTop = track.getBoundingClientRect().top
      const thumbTop = Math.min(travel, Math.max(0, clientY - trackTop - dragOffset))
      const progress = thumbTop / travel

      window.scrollTo({ top: progress * maxScroll, behavior: 'auto' })
      updateThumb()
    }

    const endDrag = () => {
      if (!isDragging) {
        return
      }

      isDragging = false
      root.classList.remove('custom-scrollbar-dragging')
      scheduleHide(900)
    }

    const handleDragMove = (event) => {
      if (!isDragging) {
        return
      }

      event.preventDefault()
      showScrollbar()
      scrollToThumbPosition(event.clientY)
    }

    const startDrag = (event, offset) => {
      if (!finePointerQuery.matches) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      window.clearTimeout(hideTimer)
      isDragging = true
      dragOffset = offset
      root.classList.add('custom-scrollbar-dragging')
      showScrollbar()
      scrollToThumbPosition(event.clientY)
    }

    const handleThumbPointerDown = (event) => {
      const thumbRect = thumb.getBoundingClientRect()

      startDrag(event, event.clientY - thumbRect.top)
    }

    const handleTrackPointerDown = (event) => {
      if (event.target === thumb) {
        return
      }

      const { thumbHeight } = getScrollMetrics()

      startDrag(event, thumbHeight / 2)
    }

    const revealFromScroll = () => {
      scheduleUpdate()

      if (!finePointerQuery.matches) {
        return
      }

      showScrollbar()
      scheduleHide(900)
    }

    const handlePointerMove = (event) => {
      if (!finePointerQuery.matches) {
        hideScrollbar()
        return
      }

      if (isDragging) {
        showScrollbar()
        return
      }

      scheduleUpdate()
      window.clearTimeout(hideTimer)

      if (window.innerWidth - event.clientX <= 34) {
        showScrollbar()
        return
      }

      scheduleHide(180)
    }

    const handlePointerLeave = () => {
      if (isDragging) {
        return
      }

      window.clearTimeout(hideTimer)
      hideScrollbar()
    }

    const handlePointerChange = () => {
      if (!finePointerQuery.matches) {
        endDrag()
        hideScrollbar()
      }
    }

    updateThumb()
    window.addEventListener('scroll', revealFromScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointermove', handleDragMove)
    document.addEventListener('pointerup', endDrag)
    document.addEventListener('pointercancel', endDrag)
    document.addEventListener('mouseleave', handlePointerLeave)
    track.addEventListener('pointerdown', handleTrackPointerDown)
    thumb.addEventListener('pointerdown', handleThumbPointerDown)
    finePointerQuery.addEventListener('change', handlePointerChange)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.clearTimeout(hideTimer)
      root.classList.remove('custom-scrollbar-disabled')
      root.classList.remove('custom-scrollbar-dragging')
      hideScrollbar()
      window.removeEventListener('scroll', revealFromScroll)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointermove', handleDragMove)
      document.removeEventListener('pointerup', endDrag)
      document.removeEventListener('pointercancel', endDrag)
      document.removeEventListener('mouseleave', handlePointerLeave)
      track.removeEventListener('pointerdown', handleTrackPointerDown)
      thumb.removeEventListener('pointerdown', handleThumbPointerDown)
      finePointerQuery.removeEventListener('change', handlePointerChange)
    }
  }, [])

  return (
    <div aria-hidden="true" className="custom-page-scrollbar">
      <span className="custom-page-scrollbar-track" ref={trackRef}>
        <span className="custom-page-scrollbar-thumb" ref={thumbRef} />
      </span>
    </div>
  )
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  ))

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)

    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)

    return () => {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}

function BookingPanel({
  activeId,
  arrivalDate,
  arrivalMonth,
  departureDate,
  departureMonth,
  guests,
  onArrivalDateChange,
  onArrivalMonthChange,
  onClose,
  onDepartureDateChange,
  onDepartureMonthChange,
  onGuestChange,
  panel,
  today,
}) {
  if (activeId === 'arrival') {
    return (
      <DatePicker
        label="Arrival"
        minDate={today}
        onClose={onClose}
        onMonthChange={onArrivalMonthChange}
        onSelectDate={onArrivalDateChange}
        quickOptions={[
          { label: 'This evening', date: today },
          { label: 'Tomorrow', date: addDays(today, 1) },
          { label: 'Weekend', date: getNextWeekendDate(today) },
        ]}
        selectedDate={arrivalDate}
        visibleMonth={arrivalMonth}
      />
    )
  }

  if (activeId === 'departure') {
    const earliestDeparture = addDays(arrivalDate, 1)

    return (
      <DatePicker
        label="Departure"
        minDate={earliestDeparture}
        onClose={onClose}
        onMonthChange={onDepartureMonthChange}
        onSelectDate={onDepartureDateChange}
        quickOptions={[
          { label: '1 night', date: addDays(arrivalDate, 1) },
          { label: '2 nights', date: addDays(arrivalDate, 2) },
          { label: '3 nights', date: addDays(arrivalDate, 3) },
        ]}
        rangeStartDate={arrivalDate}
        selectedDate={departureDate}
        visibleMonth={departureMonth}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[22px] border border-[#d8c58f]/18 bg-[#f5efe2] p-4 text-[#2c2617] shadow-[0_24px_70px_rgba(0,0,0,.24)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[.1em] text-[#7b6b4b]">{panel.eyebrow}</p>
        <button className="rounded-full px-3 py-1.5 text-xs font-black text-[#7b6b4b] transition hover:bg-white" onClick={onClose} type="button">
          Done
        </button>
      </div>
      <div className="grid gap-3">
        <GuestStepper
          label="Adults"
          max={6}
          min={1}
          onChange={(delta) => onGuestChange('adults', delta)}
          value={guests.adults}
        />
        <GuestStepper
          label="Children"
          max={6}
          min={0}
          onChange={(delta) => onGuestChange('children', delta)}
          value={guests.children}
        />
      </div>
    </div>
  )
}

function BookingSummaryDrawer({
  arrivalDate,
  backView,
  departureDate,
  guests,
  isOpen,
  onBack,
  onBookFromInfo,
  onClose,
  onShowInfo,
  room,
  view,
}) {
  const nights = getStayNights(arrivalDate, departureDate)
  const guestLabel = formatGuestCount(guests)
  const isRoomInfo = view === 'roomInfo'
  const showBackButton = Boolean(backView)
  const roomDescription = getRoomDescription(room)
  const roomOffers = getRoomOffers(room)
  const sleepLabel = getSleepLabel(room)
  const closeLabel = isRoomInfo ? 'Close room details' : 'Close booking summary'
  const isDesktopDrawer = useMediaQuery('(min-width: 1024px)')
  const reserveUrl = createWhatsAppReservationUrl({
    phone: whatsappPhone,
    arrivalDate,
    departureDate,
    guests,
    roomName: room.name,
  })

  return (
    <div
      aria-hidden={!isOpen}
      className={`summary-drawer-root ${isOpen ? 'summary-drawer-open' : ''}`}
      id="booking-summary-drawer"
    >
      <button
        aria-label="Close booking summary"
        className="summary-drawer-backdrop"
        onClick={onClose}
        type="button"
      />
      <aside
        className="summary-drawer-panel"
      >
        {isDesktopDrawer ? (
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(360px,.95fr)_minmax(420px,1fr)] gap-0 overflow-hidden p-5">
            <DrawerImageHeader
              imageClassName="h-full min-h-0"
              room={room}
              showGradient={false}
            >
              <DrawerFloatingControls
                className="absolute inset-x-0 top-0 flex items-start justify-between p-5"
                closeLabel={closeLabel}
                onBack={onBack}
                onClose={onClose}
                showBackButton={showBackButton}
              />
            </DrawerImageHeader>

            <div className="min-h-0 overflow-y-auto px-7 py-2">
              {isRoomInfo ? (
                <RoomInfoContent
                  className="drawer-view"
                  key={`desktop-info-${room.name}`}
                  room={room}
                  roomDescription={roomDescription}
                  roomOffers={roomOffers}
                  sleepLabel={sleepLabel}
                />
              ) : (
                <BookingSummaryContent
                  arrivalDate={arrivalDate}
                  className="drawer-view"
                  departureDate={departureDate}
                  guestLabel={guestLabel}
                  key={`desktop-summary-${room.name}`}
                  nights={nights}
                  onShowInfo={onShowInfo}
                  room={room}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DrawerFloatingControls
              className="sticky top-0 z-40 -mb-[88px] flex items-start justify-between p-5"
              closeLabel={closeLabel}
              onBack={onBack}
              onClose={onClose}
              showBackButton={showBackButton}
            />
            <DrawerImageHeader
              imageClassName={isRoomInfo ? 'h-[360px]' : 'h-[300px]'}
              room={room}
            />
            {isRoomInfo ? (
              <RoomInfoContent
                className="drawer-view px-6 pt-7"
                key={`mobile-info-${room.name}`}
                room={room}
                roomDescription={roomDescription}
                roomOffers={roomOffers}
                sleepLabel={sleepLabel}
              />
            ) : (
              <BookingSummaryContent
                arrivalDate={arrivalDate}
                className="drawer-view px-6 py-6"
                departureDate={departureDate}
                guestLabel={guestLabel}
                key={`mobile-summary-${room.name}`}
                nights={nights}
                onShowInfo={onShowInfo}
                room={room}
              />
            )}
          </div>
        )}

        <div className={`${isRoomInfo ? 'flex items-center gap-4' : 'grid grid-cols-2 gap-3'} border-t border-[#2c2617]/10 bg-[#f6efe2] px-6 py-5`}>
          {isRoomInfo ? (
            <>
              <div className="min-w-0">
                <strong className="block text-2xl font-black leading-none">{room.price}</strong>
                <span className="mt-1 block text-xs font-bold text-[#7b6b4b]">per night</span>
              </div>
              <button
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#2c2617] px-3 text-center text-sm font-black text-white transition hover:bg-[#4d422b]"
                onClick={onBookFromInfo}
                type="button"
              >
                Book now
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </>
          ) : (
            <>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2c2617] px-3 text-center text-xs font-black text-white transition hover:bg-[#4d422b] sm:text-sm"
                href={reserveUrl}
                target="_blank"
                rel="noreferrer"
              >
                Reserve
                <ArrowRight size={16} strokeWidth={3} />
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-3 text-center text-xs font-black text-[#2c2617] shadow-sm transition hover:bg-[#efe7d7] sm:text-sm"
                href={`tel:+${whatsappPhone}`}
              >
                <Phone size={16} strokeWidth={2.5} />
                Call Reception
              </a>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function RoomInfoContent({ className, room, roomDescription, roomOffers, sleepLabel }) {
  return (
    <div className={className}>
      <h4 className="text-center text-3xl font-black tracking-[0] lg:text-left lg:text-[2.15rem]">{room.name}</h4>
      <p className="mx-auto mt-2 max-w-[320px] text-center text-sm font-bold leading-5 text-[#75674b] lg:mx-0 lg:text-left">{room.fit}</p>

      <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
        {room.meta.map((item) => (
          <RoomFeatureChip label={item} key={item} />
        ))}
      </ul>

      <div className="mt-7 grid grid-cols-3 divide-x divide-[#2c2617]/18 border-y border-[#2c2617]/12 py-5 text-center">
        <div>
          <strong className="block text-lg font-black">4.9/5</strong>
          <span className="mt-1 block text-xs font-bold text-[#7b6b4b]">Rated</span>
        </div>
        <div className="px-3">
          <CircleCheck className="mx-auto size-6 text-[#d2b85d]" fill="currentColor" strokeWidth={1.8} />
          <span className="mt-1 block text-xs font-black text-[#5f523b]">Guest favourite</span>
        </div>
        <div>
          <strong className="block text-lg font-black">24hr</strong>
          <span className="mt-1 block text-xs font-bold text-[#7b6b4b]">Power</span>
        </div>
      </div>

      <p className="border-b border-[#2c2617]/12 py-6 text-base font-semibold leading-7 text-[#62563f]">
        {roomDescription}
      </p>

      <section className="border-b border-[#2c2617]/12 py-6">
        <h5 className="text-xl font-black">Where you'll sleep</h5>
        <div className="mt-4 w-40 rounded-[18px] border border-[#2c2617]/22 p-4">
          <BedDouble className="size-8 text-[#5f523b]" strokeWidth={2.2} />
          <p className="mt-4 text-sm font-black text-[#2c2617]">Bedroom</p>
          <p className="mt-1 text-sm font-semibold text-[#7b6b4b]">{sleepLabel}</p>
        </div>
      </section>

      <section className="py-6">
        <h5 className="text-xl font-black">What this room offers</h5>
        <div className="mt-5 grid gap-4">
          {roomOffers.map((offer) => (
            <RoomOfferItem label={offer} key={offer} />
          ))}
        </div>
      </section>
    </div>
  )
}

function BookingSummaryContent({
  arrivalDate,
  className,
  departureDate,
  guestLabel,
  nights,
  onShowInfo,
  room,
}) {
  return (
    <div className={className}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-3xl font-black tracking-[0]">{room.name}</h4>
            <p className="mt-1 text-sm font-bold text-[#75674b]">{room.fit}</p>
            <p className="mt-3 text-xl font-black text-[#2c2617]">
              {room.price}
              <span className="ml-1 text-xs font-bold text-[#7b6b4b]">/night</span>
            </p>
          </div>
          <button
            aria-label={`View ${room.name} details`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[#2c2617]/10 bg-[#f4efe5] text-[#7b6b4b] transition hover:bg-[#2c2617] hover:text-white"
            onClick={onShowInfo}
            type="button"
          >
            <Info size={18} strokeWidth={2.4} />
          </button>
        </div>
        <div className="mt-5 grid gap-2">
          {room.perks.map((perk) => (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#5f523b]" key={perk}>
              <CircleCheck size={16} strokeWidth={2.4} />
              {perk}
            </span>
          ))}
        </div>
      </div>

      <section className="mt-7 border-y border-[#2c2617]/12 py-5">
        <h5 className="text-xl font-black">Stay details</h5>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#62563f]">
          You are booking from <strong className="text-[#2c2617]">{formatBookingDate(arrivalDate)}</strong> to{' '}
          <strong className="text-[#2c2617]">{formatBookingDate(departureDate)}</strong>, which is{' '}
          <strong className="text-[#2c2617]">{nights} night{nights === 1 ? '' : 's'}</strong> for {guestLabel}.
        </p>
        <div className="mt-5 grid gap-4 text-sm">
          <SummaryDetailLine
            icon={<CalendarDays size={19} strokeWidth={2.2} />}
            label="Arrival"
            value={formatBookingDate(arrivalDate)}
          />
          <SummaryDetailLine
            icon={<CalendarDays size={19} strokeWidth={2.2} />}
            label="Departure"
            value={formatBookingDate(departureDate)}
          />
          <SummaryDetailLine
            icon={<UsersRound size={19} strokeWidth={2.2} />}
            label="Guests"
            value={guestLabel}
          />
          <SummaryDetailLine
            icon={<Moon size={19} strokeWidth={2.2} />}
            label="Length of stay"
            value={`${nights} night${nights === 1 ? '' : 's'}`}
          />
        </div>
      </section>

      <p className="mt-5 flex items-start gap-2 text-xs font-bold leading-5 text-[#7b6b4b]">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={2.3} />
        This booking process redirects to WhatsApp so reception can confirm availability and total price.
      </p>
    </div>
  )
}

function DrawerImageHeader({ children, imageClassName, room, showGradient = true }) {
  return (
    <div className="relative lg:h-full lg:min-h-0">
      <img
        className={`${imageClassName} w-full rounded-b-[34px] object-cover lg:rounded-[28px]`}
        src={room.image}
        srcSet={room.imageSrcSet}
        sizes="(min-width: 1024px) 48vw, 100vw"
        alt={`${room.name} bedroom`}
        loading="eager"
        decoding="async"
      />
      {showGradient && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#2c2617]/45 via-[#2c2617]/16 to-transparent lg:hidden" aria-hidden="true" />
      )}
      {children}
    </div>
  )
}

function DrawerFloatingControls({ className, closeLabel, onBack, onClose, showBackButton }) {
  return (
    <div className={className}>
      {showBackButton ? (
        <button
          aria-label="Back"
          className="grid size-12 place-items-center rounded-full bg-white text-[#5f523b] shadow-[0_12px_30px_rgba(0,0,0,.18)] transition hover:bg-[#2c2617] hover:text-white"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
      ) : (
        <span className="size-12" aria-hidden="true" />
      )}
      <button
        aria-label={closeLabel}
        className="grid size-12 place-items-center rounded-full bg-white text-[#5f523b] shadow-[0_12px_30px_rgba(0,0,0,.18)] transition hover:bg-[#2c2617] hover:text-white"
        onClick={onClose}
        type="button"
      >
        <X size={20} strokeWidth={2.6} />
      </button>
    </div>
  )
}

function SummaryDetailLine({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#efe7d7] text-[#5f523b]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-[#7b6b4b]">{label}</span>
        <strong className="mt-0.5 block text-sm font-black text-[#2c2617]">{value}</strong>
      </span>
    </div>
  )
}

function getRoomDescription(room) {
  return `A calm ${room.name.toLowerCase()} at Fancourt Suites with ${room.fit.toLowerCase()}, steady power, breakfast, and quick reception support in Flower Garden GRA, Ilorin.`
}

function getSleepLabel(room) {
  return room.meta.find((item) => item.toLowerCase().includes('bed')) || '1 bed'
}

function getRoomOffers(room) {
  return [
    ...room.perks,
    'WiFi',
    'LCD TV',
    'Restaurant access',
    'Secure parking',
    'Air conditioning',
  ].filter((offer, index, offers) => offers.indexOf(offer) === index)
}

function renderRoomFeatureIcon(label, className, strokeWidth) {
  const normalizedLabel = label.toLowerCase()

  if (normalizedLabel.includes('wifi')) return <Wifi className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('bed')) return <BedDouble className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('tv')) return <Tv className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('water') || normalizedLabel.includes('bath')) return <Bath className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('parking') || normalizedLabel.includes('taxi') || normalizedLabel.includes('location')) return <Car className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('restaurant') || normalizedLabel.includes('bar') || normalizedLabel.includes('food')) return <Utensils className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('breakfast') || normalizedLabel.includes('fridge') || normalizedLabel.includes('kettle')) return <Coffee className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('sitting') || normalizedLabel.includes('lounge')) return <Armchair className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('private') || normalizedLabel.includes('privacy') || normalizedLabel.includes('concierge') || normalizedLabel.includes('reception')) return <ConciergeBell className={className} strokeWidth={strokeWidth} />
  if (normalizedLabel.includes('power') || normalizedLabel.includes('ac') || normalizedLabel.includes('air')) return <Zap className={className} strokeWidth={strokeWidth} />

  return <CircleCheck className={className} strokeWidth={strokeWidth} />
}

function RoomFeatureChip({ label }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-[#2c2617]/16 px-3.5 py-2 text-xs font-black text-[#5f523b]">
      {renderRoomFeatureIcon(label, 'size-3.5 shrink-0', 2.2)}
      {label}
    </li>
  )
}

function RoomOfferItem({ label }) {
  return (
    <span className="inline-flex items-center gap-4 text-base font-semibold text-[#5f6670]">
      {renderRoomFeatureIcon(label, 'size-6 shrink-0 text-[#4f5b64]', 2.1)}
      {label}
    </span>
  )
}

function DatePicker({ label, minDate, onClose, onMonthChange, onSelectDate, quickOptions, rangeStartDate, selectedDate, visibleMonth }) {
  const monthStart = startOfMonth(visibleMonth)
  const minimumDate = startOfDay(minDate)
  const minimumMonth = startOfMonth(minimumDate)
  const canGoPrevious = monthStart > minimumMonth
  const monthDays = getMonthDays(monthStart)
  const leadingBlanks = getMondayStartOffset(monthStart)
  const normalizedRangeStart = rangeStartDate ? startOfDay(rangeStartDate) : null
  const normalizedRangeEnd = selectedDate ? startOfDay(selectedDate) : null

  function goToPreviousMonth() {
    if (canGoPrevious) {
      onMonthChange(addMonths(monthStart, -1))
    }
  }

  function goToNextMonth() {
    onMonthChange(addMonths(monthStart, 1))
  }

  return (
    <div className="mx-auto w-full max-w-[350px] rounded-[22px] border border-[#d8c58f]/18 bg-[#f5efe2] p-3.5 text-[#2c2617] shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-4">
      <div className="mb-3 flex items-center justify-between md:hidden">
        <p className="text-xs font-black uppercase tracking-[.1em] text-[#7b6b4b]">
          {label}
        </p>
        <button
          className="rounded-full bg-white px-3.5 py-2 text-xs font-black text-[#5f523b] shadow-sm transition active:scale-95"
          onClick={onClose}
          type="button"
        >
          Done
        </button>
      </div>
      <p className="mb-3 hidden text-center text-xs font-black uppercase tracking-[.1em] text-[#7b6b4b] md:block">
        {label}
      </p>
      <div className="mb-4 flex items-center justify-between">
        {canGoPrevious ? (
          <button
            className="grid size-8 place-items-center rounded-full border border-[#2c2617]/10 bg-white text-[#7b6b4b] shadow-sm transition hover:bg-[#2c2617] hover:text-white"
            onClick={goToPreviousMonth}
            type="button"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} strokeWidth={2.4} />
          </button>
        ) : (
          <span className="size-8" aria-hidden="true" />
        )}
        <h4 className="text-base font-black tracking-[0] text-[#2c2617]">{monthNames[monthStart.getMonth()]}</h4>
        <button
          className="grid size-8 place-items-center rounded-full border border-[#2c2617]/10 bg-white text-[#7b6b4b] shadow-sm transition hover:bg-[#2c2617] hover:text-white"
          onClick={goToNextMonth}
          type="button"
          aria-label="Next month"
        >
          <ChevronRight size={17} strokeWidth={2.4} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {weekdayLabels.map((day) => (
          <span className="text-[9px] font-black text-[#7b6b4b]/70" key={day}>
            {day}
          </span>
        ))}
        {Array.from({ length: leadingBlanks }).map((_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}
        {monthDays.map((date) => {
          const day = date.getDate()
          const dateStart = startOfDay(date)
          const isSelected = isSameDay(date, selectedDate)
          const isDisabled = date < minimumDate
          const isRangePicker = Boolean(normalizedRangeStart && normalizedRangeEnd && normalizedRangeEnd >= normalizedRangeStart)
          const isRangeStart = Boolean(isRangePicker && isSameDay(date, normalizedRangeStart))
          const isRangeEnd = Boolean(isRangePicker && isSameDay(date, normalizedRangeEnd))
          const isInRange = Boolean(isRangePicker && dateStart >= normalizedRangeStart && dateStart <= normalizedRangeEnd)
          const columnIndex = (leadingBlanks + day - 1) % 7
          const startsRow = columnIndex === 0
          const endsRow = columnIndex === 6

          return (
            <span
              className="relative grid min-h-8 place-items-center sm:min-h-9"
              key={date.toISOString()}
            >
              {isInRange && (
                <span
                  aria-hidden="true"
                  className={`departure-range-trail ${
                    isRangeStart || startsRow ? 'departure-range-trail-start' : ''
                  } ${isRangeEnd || endsRow ? 'departure-range-trail-end' : ''}`}
                />
              )}
              <button
                className={`relative z-10 mx-auto grid size-8 place-items-center rounded-full text-sm font-black transition sm:size-9 ${
                  isSelected
                    ? 'bg-[#2c2617] text-white shadow-[0_0_0_4px_rgba(44,38,23,.12)]'
                    : isRangeStart
                      ? 'bg-white text-[#2c2617] shadow-[0_0_0_1px_rgba(44,38,23,.08),0_6px_18px_rgba(44,38,23,.12)]'
                      : isDisabled
                        ? 'cursor-not-allowed text-[#6e624b]/25'
                        : isInRange
                          ? 'text-[#5f523b]'
                          : 'text-[#6e624b] hover:bg-white hover:text-[#2c2617]'
                }`}
                aria-label={`${monthNames[date.getMonth()]} ${day}`}
                aria-pressed={isSelected}
                disabled={isDisabled}
                onClick={() => onSelectDate(date)}
                type="button"
              >
                {day}
              </button>
            </span>
          )
        })}
      </div>

      <div className="mt-4 flex flex-nowrap gap-2 overflow-x-auto pb-1">
        {quickOptions.map((option) => (
          <button className="shrink-0 rounded-full bg-white px-3.5 py-2 text-xs font-black text-[#5f523b] shadow-sm transition hover:bg-[#2c2617] hover:text-white" key={option.label} onClick={() => onSelectDate(option.date)} type="button">
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function GuestStepper({ label, max, min, onChange, value }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-black">{label}</span>
      <span className="inline-flex items-center gap-3">
        <button
          className="grid size-8 place-items-center rounded-full bg-[#efe7d7] text-lg font-black disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value <= min}
          onClick={() => onChange(-1)}
          type="button"
        >
          -
        </button>
        <span className="min-w-4 text-center text-sm font-black">{value}</span>
        <button
          className="grid size-8 place-items-center rounded-full bg-[#2c2617] text-lg font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value >= max}
          onClick={() => onChange(1)}
          type="button"
        >
          +
        </button>
      </span>
    </div>
  )
}

function TrustStatRow({ stat, variant }) {
  const counterMatch = stat.number.match(/^([\d,]+)(.*)$/)
  const counterValue = counterMatch ? Number(counterMatch[1].replaceAll(',', '')) : 0
  const counterSuffix = counterMatch ? counterMatch[2] : ''
  const copyBlock = (
    <p className="max-w-[290px] text-sm font-semibold leading-6 text-white/58">
      {stat.text}
    </p>
  )
  const statBlock = (
    <div className="min-w-[160px]">
      <strong
        className="block text-4xl font-black tracking-[0] [font-variant-numeric:tabular-nums] sm:text-5xl"
        data-stat-counter
        data-stat-counter-final={stat.number}
        data-stat-counter-suffix={counterSuffix}
        data-stat-counter-value={counterValue}
      >
        {stat.number}
      </strong>
      <span className="mt-2 block text-xs font-black text-[#d2c08e] sm:text-sm">{stat.label}</span>
    </div>
  )
  const imageBlock = (
    <div className="h-44 w-full overflow-hidden rounded-[10px] sm:h-56 md:w-[430px] md:min-w-[430px] md:max-w-[430px]">
      <img
        className="h-44 w-full object-cover opacity-90 sm:h-56"
        src={stat.image}
        srcSet={stat.imageSrcSet}
        sizes="(min-width: 768px) 430px, calc(100vw - 3rem)"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  )
  const rowGridClass = variant === 'stat-image-copy'
    ? 'md:grid-cols-[minmax(180px,1fr)_430px_minmax(220px,1fr)]'
    : variant === 'image-stat-copy'
      ? 'md:grid-cols-[430px_minmax(160px,.62fr)_minmax(220px,1fr)]'
      : 'md:grid-cols-[minmax(220px,1fr)_minmax(160px,.62fr)_430px]'

  let blocks = [copyBlock, statBlock, imageBlock]

  if (variant === 'stat-image-copy') {
    blocks = [statBlock, imageBlock, copyBlock]
  }

  if (variant === 'image-stat-copy') {
    blocks = [imageBlock, statBlock, copyBlock]
  }

  return (
    <div className={`grid items-center gap-5 py-7 md:gap-14 md:py-11 ${rowGridClass}`} data-scroll-row>
      {blocks.map((block, index) => (
        <div
          className={`${index === 2 ? 'md:justify-self-end md:text-right' : ''} ${index === 1 ? 'md:justify-self-center md:text-center' : ''}`}
          key={`${stat.number}-${index}`}
        >
          {block}
        </div>
      ))}
    </div>
  )
}

function TestimonialCard({ active, testimonial }) {
  return (
      <article
        className={`relative h-[360px] w-[min(80vw,500px)] shrink-0 overflow-hidden rounded-[10px] border border-white/8 bg-[#24221c] px-6 py-6 transition duration-300 sm:h-[320px] ${
          active
            ? 'scale-x-100 scale-y-100 opacity-100 blur-0 shadow-[0_34px_95px_rgba(0,0,0,.36)]'
            : 'scale-x-[.88] scale-y-100 opacity-[.42] blur-[.2px] shadow-[0_18px_52px_rgba(0,0,0,.18)]'
        }`}
      data-testimonial-card
    >
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 h-5 w-1 rounded-full [background:radial-gradient(circle,currentColor_1px,transparent_2px)] text-white/35 [background-size:4px_6px]"
      />
      <div className="text-center">
        <img
            className={`${active ? 'size-[72px]' : 'size-14'} mx-auto rounded-full border border-[#d2b85d]/35 object-cover shadow-[0_14px_34px_rgba(0,0,0,.28)] transition-all duration-300`}
          src={testimonial.avatar}
          alt={`${testimonial.name} portrait`}
          loading="lazy"
          decoding="async"
        />
        <h3 className={`${active ? 'mt-5 text-xl' : 'mt-4 text-lg'} font-black tracking-[0] text-white transition-all duration-300`}>
          {testimonial.name}
        </h3>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[.12em] text-[#d2b85d]">{testimonial.role}</p>
      </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-white/72">
        {testimonial.text}
      </p>

        <div className="mt-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1 text-[#d2b85d]" aria-label="Rated 5 out of 5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star className="size-4 fill-current" strokeWidth={1.6} key={index} />
          ))}
        </span>
        <span className="text-[10px] font-bold text-white/38">{testimonial.time}</span>
      </div>
    </article>
  )
}

function ScrollFloatWords({ text }) {
  return text.split(' ').map((word, index, words) => (
    <span aria-hidden="true" className="scroll-float-word inline-block" data-scroll-float-word key={`${word}-${index}`}>
      {word}
      {index < words.length - 1 ? '\u00a0' : ''}
    </span>
  ))
}

function SectionHeading({ title, compact = false, dark = false, showMark = true }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${dark ? 'text-white' : 'text-[#2c2617]'}`}>
      {showMark && (
        <span className={`mx-auto grid ${compact ? 'size-4' : 'size-7'} place-items-center rounded-full ${dark ? 'bg-white/10 text-[#d7c284]' : 'bg-white text-[#d2b85d]'}`}>
          <CircleCheck size={compact ? 10 : 15} fill="currentColor" />
        </span>
      )}
      <h2
        aria-label={title}
        className={`${showMark ? (compact ? 'mt-3' : 'mt-4') : ''} ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-black tracking-[0]`}
        data-scroll-float
      >
        <ScrollFloatWords text={title} />
      </h2>
    </div>
  )
}

function RoomMetaIcon({ Icon }) {
  return <Icon className="size-3.5" strokeWidth={2.1} />
}

export default App
