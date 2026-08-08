import { personal } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const ref = useReveal()

  return (
    <section id="contact" className="section contact-section" ref={ref}>

      <div className="contact-inner">
        <h2 className="contact-heading">
          Birlikte bir şey
          <span className="gradient-text"> yaratmak</span>
          <br />ister misiniz?
        </h2>

        <p className="contact-sub">
          Fırsatlar, projeler veya sadece merhaba demek için.
        </p>

        <a
          href={`mailto:${personal.contact.email}`}
          className="contact-email"
          id="contact-email"
        >
          Bana mail gönderebilirsiniz.
        </a>

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
      </div>
    </section>
  )
}
