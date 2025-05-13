"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"

export default function PhotoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLUListElement>(null)
  const cardsItemsRef = useRef<HTMLLIElement[]>([])
  const seamlessLoopRef = useRef<gsap.core.Timeline | null>(null)
  const scrubRef = useRef<gsap.core.Tween | null>(null)
  const iterationRef = useRef(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const initializedRef = useRef(false)

  const initializeGallery = () => {
    if (!galleryRef.current || !cardsRef.current || initializedRef.current) return
    initializedRef.current = true

    try {
      // Get card elements directly from the DOM instead of using gsap.utils.toArray
      const cardElements = Array.from(cardsRef.current.querySelectorAll("li"))
      if (!cardElements.length) return

      cardsItemsRef.current = cardElements as HTMLLIElement[]

      const spacing = 0.25 // spacing of the cards (stagger) - increased for 2rem spacing
      const snap = gsap.utils.snap(spacing)

      // Build the seamless loop
      seamlessLoopRef.current = buildSeamlessLoop(cardsItemsRef.current, spacing)
      if (!seamlessLoopRef.current) return

      // Ensure the gallery starts at the 0th card
      const initialTime = findTimeForCard(0, spacing)
      seamlessLoopRef.current.time(initialTime)

      // Create the scrub tween
      scrubRef.current = gsap.to(seamlessLoopRef.current, {
        totalTime: initialTime, // Start from the position showing card 0
        duration: 0.5,
        ease: "power3",
        paused: true,
      })

      // Initialize draggable
      if (cardsRef.current) {
        const draggable = Draggable.create(cardsRef.current, {
          type: "x",
          inertia: true,
          onDrag: function () {
            // Map the drag position to the timeline position
            if (seamlessLoopRef.current && scrubRef.current) {
              // Calculate how much to scrub based on drag position
              const dragProgress = this.x / 500 // Adjust divisor to control sensitivity
              const totalTime =
                iterationRef.current * seamlessLoopRef.current.duration() +
                initialTime + // Start from the position showing card 0
                dragProgress * seamlessLoopRef.current.duration()

              scrubRef.current.vars.totalTime = snap(totalTime)
              scrubRef.current.invalidate().restart()
            }
          },
          onDragEnd: function () {
            // Reset the draggable position
            gsap.to(this.target, { x: 0, duration: 0.5, ease: "power2.out" })
          },
        })[0]
      }

      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing gallery:", error)
    }
  }

  useEffect(() => {
    // Safe check for browser environment
    if (typeof window === "undefined") return

    // Register plugins safely
    try {
      gsap.registerPlugin(Draggable)
    } catch (error) {
      console.error("Error registering GSAP plugins:", error)
      return
    }

    // Wait for next tick to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      initializeGallery()
    }, 0)

    return () => {
      clearTimeout(timer)
      // Clean up animations when component unmounts
      if (scrubRef.current) scrubRef.current.kill()
      if (seamlessLoopRef.current) seamlessLoopRef.current.kill()
    }
  }, [])

  // Function to find the time in the timeline for a specific card
  const findTimeForCard = (cardIndex: number, spacing: number) => {
    // Calculate the time in the timeline where the specified card is centered
    // This is based on the structure of the seamless loop
    const overlap = Math.ceil(1 / spacing)
    const startTime = cardsItemsRef.current.length * spacing + 0.5

    // Calculate the time for the specific card
    // We add a small offset to ensure the card is perfectly centered
    return startTime + cardIndex * spacing + 0
  }

  // Function to scrub to a specific time
  const scrubTo = (totalTime: number) => {
    if (!seamlessLoopRef.current || !scrubRef.current) return

    const progress =
      (totalTime - seamlessLoopRef.current.duration() * iterationRef.current) / seamlessLoopRef.current.duration()

    if (progress > 1) {
      // Handle forward wrap
      iterationRef.current++
      if (scrubRef.current) {
        scrubRef.current.vars.totalTime = totalTime
        scrubRef.current.invalidate().restart()
      }
    } else if (progress < 0) {
      // Handle backward wrap
      iterationRef.current--
      if (iterationRef.current < 0) {
        iterationRef.current = 9
        if (seamlessLoopRef.current) {
          seamlessLoopRef.current.totalTime(
            seamlessLoopRef.current.totalTime() + seamlessLoopRef.current.duration() * 10,
          )
        }
      }
      if (scrubRef.current) {
        scrubRef.current.vars.totalTime = totalTime
        scrubRef.current.invalidate().restart()
      }
    } else {
      // Normal scrub
      if (scrubRef.current) {
        scrubRef.current.vars.totalTime = totalTime
        scrubRef.current.invalidate().restart()
      }
    }
  }

  // Handle next button click
  const handleNext = () => {
    if (scrubRef.current) {
      scrubTo(scrubRef.current.vars.totalTime + 0.25)
    }
  }

  // Handle prev button click
  const handlePrev = () => {
    if (scrubRef.current) {
      scrubTo(scrubRef.current.vars.totalTime - 0.25)
    }
  }

  // Function to build the seamless loop
  const buildSeamlessLoop = (items: HTMLLIElement[], spacing: number) => {
    if (!items.length) return null

    try {
      const overlap = Math.ceil(1 / spacing) // number of EXTRA animations on either side of the start/end
      const startTime = items.length * spacing + 0.5 // the time on the rawSequence at which we'll start the seamless loop
      const loopTime = (items.length + overlap) * spacing + 1 // the spot at the end where we loop back to the startTime

      const rawSequence = gsap.timeline({ paused: true }) // this is where all the "real" animations live

      const seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1, // to accommodate infinite scrolling/looping
        onRepeat() {
          // works around a super rare edge case bug that's fixed GSAP 3.6.1
          if (this._time === this._dur) {
            this._tTime += this._dur - 0.01
          }
        },
      })

      const l = items.length + overlap * 2
      let time = 0
      let i, index, item

      // set initial state of items
      gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 })

      // now loop through and create all the animations in a staggered fashion
      for (i = 0; i < l; i++) {
        index = i % items.length
        item = items[index]
        time = i * spacing

        rawSequence
          .fromTo(
            item,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              zIndex: 100,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.in",
              immediateRender: false,
            },
            time,
          )
          .fromTo(item, { xPercent: 200 }, { xPercent: -200, duration: 1, ease: "none", immediateRender: false }, time)

        i <= items.length && seamlessLoop.add("label" + i, time)
      }

      // set up the scrubbing of the playhead to make it appear seamless
      rawSequence.time(startTime)
      seamlessLoop
        .to(rawSequence, {
          time: loopTime,
          duration: loopTime - startTime,
          ease: "none",
        })
        .fromTo(
          rawSequence,
          { time: overlap * spacing + 1 },
          {
            time: startTime,
            duration: startTime - (overlap * spacing + 1),
            immediateRender: false,
            ease: "none",
          },
        )

      return seamlessLoop
    } catch (error) {
      console.error("Error building seamless loop:", error)
      return null
    }
  }

  return (
    <div ref={galleryRef} className="gallery relative w-full h-screen overflow-hidden flex flex-col justify-end">
      <ul
        ref={cardsRef}
        className="cards absolute w-80 h-[28rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {Array.from({ length: 31 }, (_, i) => (
          <li
            key={i}
            className="list-none p-0 m-0 w-80 h-[28rem] text-center leading-[28rem] text-2xl bg-[#9d7cce] absolute top-0 left-0 rounded-[0.8rem]"
          >
            {i}
          </li>
        ))}
      </ul>

      {/* Drag indicator that appears on hover */}
      {isHovering && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-[28rem] pointer-events-none z-10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-sm font-medium shadow-lg">
            Drag
          </div>
        </div>
      )}

      <div className="actions w-full flex justify-center absolute left-1/2 bottom-8 -translate-x-1/2">
        <button
          onClick={handlePrev}
          className="inline-block outline-none border-none py-3 px-6 bg-[#414141] bg-gradient-to-b from-[#575757] to-[#414141] text-shadow-[0px_1px_0px_#414141] shadow-[0px_1px_0px_#414141] text-white no-underline m-0 mb-[10px] rounded-[4px] font-normal uppercase font-semibold cursor-pointer text-xl leading-[18px] hover:bg-[#57a818] hover:bg-gradient-to-b hover:from-[#57a818] hover:to-[#4d9916] hover:text-shadow-[0px_1px_0px_#32610e] hover:shadow-[0px_1px_0px_#fefefe] hover:text-white hover:no-underline"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="inline-block outline-none border-none py-3 px-6 bg-[#414141] bg-gradient-to-b from-[#575757] to-[#414141] text-shadow-[0px_1px_0px_#414141] shadow-[0px_1px_0px_#414141] text-white no-underline m-0 mb-[10px] rounded-[4px] font-normal uppercase font-semibold cursor-pointer text-xl leading-[18px] hover:bg-[#57a818] hover:bg-gradient-to-b hover:from-[#57a818] hover:to-[#4d9916] hover:text-shadow-[0px_1px_0px_#32610e] hover:shadow-[0px_1px_0px_#fefefe] hover:text-white hover:no-underline ml-2"
        >
          Next
        </button>
      </div>
    </div>
  )
} 