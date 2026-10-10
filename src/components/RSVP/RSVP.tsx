import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { FormEvent } from "react"
import { wedding } from "../../data/wedding"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import styles from "./RSVP.module.css"

const storageKey = "tania-ramy-rsvp"
const guestOptions = ["1", "2", "3", "4", "5"]

type Attendance = "accepts" | "declines"

type Reply = {
  name: string
  email: string
  attendance: Attendance
  guests: string
  message: string
}

type Errors = Partial<Record<"name" | "email" | "attendance", string>>

function readReply(): Reply | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Reply
    if (!parsed.name || !parsed.attendance) return null
    return parsed
  } catch {
    return null
  }
}

export function RSVP() {
  const { rsvp } = wedding
  const [name, setName] = useState(() => readReply()?.name ?? "")
  const [email, setEmail] = useState(() => readReply()?.email ?? "")
  const [attendance, setAttendance] = useState<Attendance | "">(() => readReply()?.attendance ?? "")
  const [guests, setGuests] = useState(() => readReply()?.guests || "1")
  const [message, setMessage] = useState(() => readReply()?.message ?? "")
  const [errors, setErrors] = useState<Errors>({})
  const [reply, setReply] = useState<Reply | null>(readReply)

  function validate() {
    const next: Errors = {}
    if (!name.trim()) next.name = "Please add your name."
    if (!email.trim()) next.email = "Please add an email."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "That email does not look complete."
    }
    if (!attendance) next.attendance = "Let us know if you can come."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate() || !attendance) return
    const next: Reply = {
      name: name.trim(),
      email: email.trim(),
      attendance,
      guests: attendance === "accepts" ? guests : "",
      message: message.trim(),
    }
    localStorage.setItem(storageKey, JSON.stringify(next))
    setReply(next)
  }

  function edit() {
    localStorage.removeItem(storageKey)
    setReply(null)
  }

  return (
    <section className={styles.section} id="rsvp" aria-labelledby="rsvp-title">
      <div className={`wrap ${styles.inner}`}>
        <SectionHeading
          index={rsvp.index}
          kicker={rsvp.kicker}
          title={rsvp.title}
          intro={rsvp.intro}
          headingId="rsvp-title"
        />

        <AnimatePresence mode="wait">
          {reply ? (
            <motion.div
              key="thanks"
              className={styles.thanks}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
            >
              <p className={styles.thanksTitle}>{rsvp.successTitle}</p>
              <p className={styles.thanksName}>{reply.name}</p>
              <p className={styles.thanksBody}>
                {reply.attendance === "accepts" ? rsvp.successAccept : rsvp.successDecline}
              </p>
              <button type="button" className={styles.textButton} onClick={edit}>
                {rsvp.changeLabel}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className={styles.form}
              onSubmit={onSubmit}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className={styles.field}>
                <span>{rsvp.nameLabel}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>

              <label className={styles.field}>
                <span>{rsvp.emailLabel}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </label>

              <fieldset className={styles.field}>
                <legend>{rsvp.attendanceLabel}</legend>
                <div className={styles.choices}>
                  <button
                    type="button"
                    className={styles.choice}
                    aria-pressed={attendance === "accepts"}
                    onClick={() => setAttendance("accepts")}
                  >
                    {rsvp.acceptLabel}
                  </button>
                  <button
                    type="button"
                    className={styles.choice}
                    aria-pressed={attendance === "declines"}
                    onClick={() => setAttendance("declines")}
                  >
                    {rsvp.declineLabel}
                  </button>
                </div>
                {errors.attendance ? <small>{errors.attendance}</small> : null}
              </fieldset>

              {attendance === "accepts" ? (
                <div className={styles.field}>
                  <span id="guest-count">{rsvp.guestsLabel}</span>
                  <div className={styles.guests} role="group" aria-labelledby="guest-count">
                    {guestOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.guest}
                        aria-pressed={guests === option}
                        onClick={() => setGuests(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className={styles.field}>
                <span>{rsvp.messageLabel}</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={rsvp.messagePlaceholder}
                  rows={4}
                />
              </label>

              <button type="submit" className={styles.submit}>
                {rsvp.submitLabel}
              </button>
              <p className={styles.disclaimer}>{rsvp.disclaimer}</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
