import { useEffect, useLayoutEffect, useState } from "react"
import { Aurora, Particles } from "./components/Ambient/Ambient"
import { Envelope } from "./components/Envelope/Envelope"
import { Footer } from "./components/Footer/Footer"
import { Gallery } from "./components/Gallery/Gallery"
import { Hero } from "./components/Hero/Hero"
import { Nav } from "./components/Nav/Nav"
import { RSVP } from "./components/RSVP/RSVP"
import { Schedule } from "./components/Schedule/Schedule"
import { Story } from "./components/Story/Story"
import { Venue } from "./components/Venue/Venue"
import { WeddingDetails } from "./components/WeddingDetails/WeddingDetails"

export default function App() {
  const [ready, setReady] = useState(false)
  const [finished, setFinished] = useState(false)

  // Load the actual faces before the envelope appears, so no text swaps fonts mid-animation.
  useEffect(() => {
    let cancelled = false
    const show = () => {
      if (!cancelled) setReady(true)
    }
    const timeout = window.setTimeout(show, 2500)
    const faces = [
      '400 1em "Cormorant Garamond"',
      'italic 400 1em "Cormorant Garamond"',
      'italic 500 1em "Cormorant Garamond"',
      '300 1em Outfit',
      '400 1em Outfit',
    ]
    Promise.all(faces.map((face) => document.fonts?.load(face)))
      .catch(() => undefined)
      .then(show)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  // The card hands over to the top of the page, so the page must start there.
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("gated", !finished)
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", finished ? "#F8F4EC" : "#344238")
    document.body.style.overflow = finished ? "" : "hidden"
    return () => {
      root.classList.remove("gated")
      document.body.style.overflow = ""
    }
  }, [finished])

  useEffect(() => {
    if (!finished) return
    document.getElementById("top")?.focus({ preventScroll: true })
  }, [finished])

  if (!ready) return <div className="boot" />

  return (
    <>
      <Aurora />
      <Nav visible={finished} />
      <div
        className={finished ? "world" : "world worldGate"}
        inert={!finished ? true : undefined}
        aria-hidden={!finished}
      >
        <main>
          <Hero variant="page" live={finished} />
          <Story />
          <WeddingDetails />
          <Venue />
          <Schedule />
          <Gallery />
          <RSVP />
        </main>
        <Footer />
      </div>
      {!finished ? <Envelope onFinished={() => setFinished(true)} /> : null}
      <Particles />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
