// ── CV DATA ───────────────────────────────────────────────────────────────────
// Tüm portföy verisi burada merkezi olarak yönetilir.
// Güncelleme yapmak için sadece bu dosyayı düzenleyin.

export const personal = {
  name: "Sema Gül Çelik",
  nameFirst: "Sema Gül",
  nameLast: "Çelik",
  initials: "S.G.Ç.",
  role: "Yazılım Geliştirici & Yapay Zeka Meraklısı",
  tagline:
    "Gerçek problemlere teknolojiyle çözüm üretmeyi seven, araştırmayı ve öğrenmeyi hiç bırakmayan biriyim.",
  bio: [
    "Pamukkale Üniversitesi Bilgisayar Mühendisliği bölümünde lisans eğitimime devam etmekteyim. Yapay zeka, veri bilimi ve makine öğrenmesi alanlarına odaklanarak kariyerimi bu yönde şekillendiriyorum.",
    "Sürekli öğrenmeye açık, araştırmayı seven ve gerçek problemlere teknolojiyle çözüm üretmeyi hedefleyen bir yazılım geliştiricisiyim.",
  ],
  stats: [
    { value: "3+", label: "Deneyim" },
    { value: "8+", label: "Proje" },
    { value: "B2", label: "İngilizce" },
  ],
  contact: {
    email: "segece3308@gmail.com",
    github: "https://github.com/semagllclkk",
    linkedin: "https://www.linkedin.com/in/sema-g%C3%BCl-%C3%A7elik-27a7462a4/",
    medium: "https://medium.com/@semagllclkk",
  },
};

export const skills = [
  {
    category: "Backend",
    items: [
      "C#", "Python", "Dart", "Java", "SQL", "C",
      "ASP.NET Core", "FastAPI", "Nest.js",
      "Entity Framework", "PostgreSQL", "SQLite", "PostGIS",
    ],
  },
  {
    category: "Frontend",
    items: [
      "JavaScript", "TypeScript", "React.js",
      "Next.js", "Flutter", "Tailwind CSS",
    ],
  },
  {
    category: "Tools & DevOps",
    items: [
      "Git", "GitHub", "Postman", "Vercel", "Railway", "Render",
      "Docker", "OpenCV", "NumPy", "Pandas", "Matplotlib",
      "PyTorch", "NetTopologySuite", "Burp Suite",
    ],
  },
  {
    category: "Yabancı Dil",
    items: ["İngilizce — B2 (Upper Intermediate)"],
  },
];

export const experience = [
  {
    id: "exp-1",
    title: "Beyaz Şapkalı Hacker Eğitimi",
    company: "Siber Vatan",
    type: "Eğitim Programı",
    period: "Şubat 2026 — Haziran 2026",
    description:
      "CTF yarışmasında Denizli 3.'sü olarak katılmaya hak kazanılan bu programda siber güvenlik eğitimleri tamamlandı.",
    tags: ["Siber Güvenlik", "CTF", "Penetration Testing"],
  },
  {
    id: "exp-2",
    title: "Yönetim Kurulu Üyesi & Full-Stack Developer",
    company: "PAUSEC Bilgi Güvenliği Topluluğu",
    type: "Gönüllü",
    period: "Kasım 2025 — Haziran 2026",
    description:
      "Topluluğun web sitesinin mimarisi (.NET ve JS) sıfırdan geliştirildi ve üniversite çapında siber güvenlik eğitim etkinlikleri organize edildi.",
    tags: [".NET", "JavaScript", "Etkinlik Organizasyonu"],
  },
  {
    id: "exp-3",
    title: "Yazılım Geliştirme Stajyeri",
    company: "Başarsoft Bilgi Teknolojileri",
    type: "Uzaktan Staj",
    period: "Haziran 2025 — Ağustos 2025",
    description:
      "ASP.NET Core, React ve PostGIS teknolojilerini kullanarak coğrafi veri işleme, geometri kesişim kontrolleri ve arama optimizasyonlarını içeren full-stack bir harita modülü geliştirildi. NetTopologySuite ile snapping ve debounce mekanizmaları sisteme entegre edildi.",
    tags: ["ASP.NET Core", "React", "PostGIS", "NetTopologySuite"],
  },
];

export const projects = [
  {
    id: "proj-carettatrack",
    title: "CarettaTrack",
    subtitle: "Yapay Zeka Destekli Kaplumbağa Tanıma Sistemi",
    description:
      "8700+ fotoğrafla eğitilmiş 438 farklı deniz kaplumbağasını tanıyan ResNet-18 tabanlı derin öğrenme modeli. SOLID prensiplere uygun FastAPI backend ve asenkron web arayüzü.",
    tags: ["PyTorch", "FastAPI", "JavaScript", "ResNet-18"],
    github: "https://github.com/semagllclkk/caretta-takibi-uygulamasi",
    live: null,
    featured: true,
  },
  {
    id: "proj-data-middleware",
    title: "Data Middleware",
    subtitle: "Log İşleme Mimarisi",
    description:
      "Chain of Responsibility, Strategy ve Factory tasarım kalıplarıyla kurgulanmış KVKK veri maskeleme ve log zenginleştirme özelliklerine sahip dağıtık açık katman servisi.",
    tags: ["C#", "Docker", "TCP Sockets", "Design Patterns"],
    github: "https://github.com/semagllclkk/data-middleware",
    live: null,
    featured: false,
  },
  {
    id: "proj-visionstrike",
    title: "VisionStrike",
    subtitle: "Hand-Tracking Physics Game",
    description:
      "Bilgisayarlı görü tabanlı fizik oyunu. Delta-time odaklı render döngüsü, asenkron UI geçişleri ve dinamik ses motoru entegrasyonu ile geliştirildi.",
    tags: ["Python", "Pygame", "MediaPipe", "OpenCV"],
    github: "https://github.com/semagllclkk/VisionStrike",
    live: null,
    featured: false,
  },
  {
    id: "proj-fingerjump",
    title: "Finger Jump",
    subtitle: "Sonsuz Tırmanma Oyunu",
    description:
      "MediaPipe el takibi (Hand Landmarker) modeli ve cihaz jiroskop verileri asenkron olarak işlenerek geliştirilen Flutter tabanlı sonsuz tırmanma oyunu.",
    tags: ["Flutter", "Flame", "MediaPipe"],
    github: "https://github.com/semagllclkk/fingerjump-mobile",
    live: null,
    featured: false,
  },
  {
    id: "proj-techvolt",
    title: "TechVolt Solutions",
    subtitle: "Kurumsal Web Çözümü",
    description:
      "Yüksek performanslı ve SEO uyumlu kurumsal web platformu. Vercel + Railway dağıtık mimarisi, CI/CD süreçleri ile kesintisiz dağıtım.",
    tags: ["Next.js", "Nest.js", "Tailwind", "Railway"],
    github: null,
    live: "https://www.techvoltsolutions.com.tr",
    featured: true,
  },
  {
    id: "proj-kitap",
    title: "Kitap Satış Uygulaması",
    subtitle: "Demo",
    description:
      "Clean code ve single responsibility prensiplere uyan, admin panelli, kitap işlemlerini kapsayan full-stack web uygulaması.",
    tags: ["Next.js", "SQLite"],
    github: "https://github.com/semagllclkk/kitap-satis-uygulamasi",
    live: null,
    featured: false,
  },
  {
    id: "proj-dietitian-client",
    title: "Diyetisyen Danışan Takip Sistemi",
    subtitle: "Demo",
    description: "NestJS ve React kullanılarak geliştirilmiş, rol tabanlı yetkilendirme ile çalışan kapsamlı bir diyetisyen-danışan takip ve yönetim sistemi.",
    tags: ["Nest.js", "React", "JWT", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/semagllclkk/dietitian-client",
    live: "https://dietitian-client-epxaw6mgq-sema-guls-projects.vercel.app/",
    featured: false,
  },
  {
    id: "proj-kirmizi-baslikli-kiz",
    title: "Kırmızı Başlıklı Kız",
    subtitle: "Kırmızı Başlıklı Kız Oyunu",
    description: "Bu proje, Pygame kullanılarak geliştirilmiş bir 2D platform oyunudur. Oyunun temel karakteri Kırmızı Başlıklı Kız'dır ve amacı, kurtla karşılaşmadan engelleri aşıp bulmacayı çözmektir.",
    tags: ["Python", "Pygame"],
    github: "https://github.com/semagllclkk/pdl_oyun_projesi",
    live: null,
    featured: false,
  },
];

export const education = {
  degree: "Bilgisayar Mühendisliği",
  university: "Pamukkale Üniversitesi",
  city: "Denizli",
  period: "Eylül 2023 — Haziran 2027",
};
