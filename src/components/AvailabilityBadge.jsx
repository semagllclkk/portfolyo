// Sabit sağ-alt köşede "İş tekliflerine açığım" badge
// Sayfa boyutundan bağımsız, her zaman görünür
export default function AvailabilityBadge() {
  return (
    <a
      href="#contact"
      className="avail-badge"
      id="availability-badge"
      aria-label="İş tekliflerine açığım, iletişime geç"
    >
      <span className="avail-dot" aria-hidden="true" />
      <span className="avail-text">İş tekliflerine açığım</span>
    </a>
  )
}
