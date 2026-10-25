import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import Meme from './Meme'

export default function Contact() {
  const ref = useReveal()
  const { c } = useLang()
  const { personal } = c
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${personal.contact.email}`
    }
  }

  return (
    <section id="contact" className="section contact-section" ref={ref}>

      <div className="contact-inner">
        <Meme meme={c.memes.contact} className="meme-contact" />

        <h2 className="contact-heading">
          {c.ui.contactHeading[0]}
          <span className="gradient-text">{c.ui.contactHeading[1]}</span>
          <br />{c.ui.contactHeading[2]}
        </h2>

        <p className="contact-sub">{c.ui.contactSub}</p>

        <div className="contact-email-row">
          <a
            href={`mailto:${personal.contact.email}`}
            className="contact-email"
            id="contact-email"
          >
            {personal.contact.email}
          </a>
          <button type="button" className="contact-copy" onClick={copyEmail} aria-live="polite">
            {copied ? c.ui.copied : c.ui.copy}
          </button>
        </div>

        <div className="contact-socials">
          {[
            { label: 'GitHub',   href: personal.contact.github   },
            { label: 'LinkedIn', href: personal.contact.linkedin  },
            { label: 'Medium',   href: personal.contact.medium    },
          ].map((s, i, arr) => (
            <span key={s.label} className="social-item">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                id={`contact-${s.label.toLowerCase()}`}
              >
                {s.label}
              </a>
              {i < arr.length - 1 && <span className="social-sep">·</span>}
            </span>
          ))}
        </div>

        <Meme meme={c.memes.contactShipping} className="meme-shipping-pos" />
      </div>
    </section>
  )
}
