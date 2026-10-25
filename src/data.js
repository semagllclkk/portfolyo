// ── CV DATA ───────────────────────────────────────────────────────────────────
// Tüm portföy verisi burada merkezi olarak yönetilir.
// Dilden bağımsız alanlar (linkler, etiketler, görseller) bir kez yazılır;
// metinler `tr` ve `en` altında ayrı tutulur. Güncellemek için sadece bu dosyayı düzenleyin.

const contact = {
  email: "segece3308@gmail.com",
  github: "https://github.com/semagllclkk",
  linkedin: "https://www.linkedin.com/in/sema-g%C3%BCl-%C3%A7elik-27a7462a4/",
  medium: "https://medium.com/@semagllclkk",
};

// CV dosyası public/ altında; dile göre farklı dosya verilebilir
const cv = { tr: "/cv.pdf", en: "/cv.pdf" };

// ── Projeler: ortak alanlar ──────────────────────────────────────────────────
const projectBase = [
  {
    id: "proj-carettatrack",
    tags: ["PyTorch", "FastAPI", "JavaScript", "ResNet-18"],
    github: "https://github.com/semagllclkk/caretta-takibi-uygulamasi",
    live: null,
    featured: true,
    photo: "/projects/caretta.webp",
    photoFit: "contain", // logo: kırpmadan sığdır
    photoBg: "#005ab6",
  },
  {
    id: "proj-data-middleware",
    tags: ["C#", "Docker", "TCP Sockets", "Design Patterns"],
    github: "https://github.com/semagllclkk/data-middleware",
    live: null,
    featured: false,
  },
  {
    id: "proj-visionstrike",
    tags: ["Python", "Pygame", "MediaPipe", "OpenCV"],
    github: "https://github.com/semagllclkk/VisionStrike",
    live: null,
    featured: false,
  },
  {
    id: "proj-fingerjump",
    tags: ["Flutter", "Flame", "MediaPipe"],
    github: "https://github.com/semagllclkk/fingerjump-mobile",
    live: null,
    featured: false,
    photo: "/projects/finger-jump.webp",
  },
  {
    id: "proj-techvolt",
    tags: ["Next.js", "Nest.js", "Tailwind", "Railway"],
    github: null,
    live: "https://www.techvoltsolutions.com.tr",
    featured: true,
    photo: "/projects/techvolt_light.webp",
    photoFit: "contain",
    photoBg: "#ffffff",
  },
  {
    id: "proj-kitap",
    tags: ["Next.js", "SQLite"],
    github: "https://github.com/semagllclkk/kitap-satis-uygulamasi",
    live: null,
    featured: false,
    photo: "/projects/kitap-satis.webp",
    photoFit: "contain",
    photoBg: "#170e19",
  },
  {
    id: "proj-dietitian-client",
    tags: ["Nest.js", "React", "JWT", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/semagllclkk/dietitian-client",
    live: "https://dietitian-client-epxaw6mgq-sema-guls-projects.vercel.app/",
    featured: false,
    photo: "/projects/dietitian-client.webp",
    photoFit: "contain",
    photoBg: "#ffffff",
  },
  {
    id: "proj-kirmizi-baslikli-kiz",
    tags: ["Python", "Pygame"],
    github: "https://github.com/semagllclkk/pdl_oyun_projesi",
    live: null,
    featured: false,
    photo: "/projects/kirmizi-baslikli-kiz.webp",
  },
];

// ── Deneyim: ortak alanlar ───────────────────────────────────────────────────
const experienceBase = [
  { id: "exp-1" },
  { id: "exp-2" },
  { id: "exp-3", tags: ["ASP.NET Core", "React", "PostGIS", "NetTopologySuite"] },
];

const skillItems = [
  ["Python", "PyTorch", "Deep Learning", "Machine Learning"],
  ["OpenCV", "YOLO", "MediaPipe", "Image Processing"],
  ["FastAPI", "REST API"],
  ["C#", "ASP.NET Core", "JavaScript", "TypeScript"],
  ["PostgreSQL", "Git", "GitHub", "Docker", "Postman"],
];

// ── Türkçe ───────────────────────────────────────────────────────────────────
const tr = {
  personal: {
    name: "Sema Gül Çelik",
    nameFirst: "Sema Gül",
    nameLast: "Çelik",
    roleLead: "Yazılım Geliştirici &",
    roleHighlight: "Yapay Zeka Meraklısı",
    tagline:
      "Gerçek problemlere teknolojiyle çözüm üretmeyi seven, araştırmayı ve öğrenmeyi hiç bırakmayan biriyim.",
    bio: [
      "Pamukkale Üniversitesi Bilgisayar Mühendisliği bölümünde lisans eğitimime devam etmekteyim. Yapay zeka, veri bilimi ve makine öğrenmesi alanlarına odaklanarak kariyerimi bu yönde şekillendiriyorum.",
      "Sürekli öğrenmeye açık, araştırmayı seven ve gerçek problemlere teknolojiyle çözüm üretmeyi hedefleyen bir yazılım geliştiricisiyim.",
    ],
    stats: [
      { value: "8+", label: "Tamamlanan Proje" },
      { value: "3.", label: "CTF · Denizli" },
      { value: "B2", label: "İngilizce" },
    ],
    contact,
    cv: cv.tr,
  },
  education: {
    badge: "Eğitim",
    degree: "Bilgisayar Mühendisliği",
    university: "Pamukkale Üniversitesi",
    city: "Denizli",
    period: "Eylül 2023 — Haziran 2027",
  },
  skillCategories: [
    "Yapay Zeka & Makine Öğrenmesi",
    "Bilgisayarlı Görü",
    "Backend & Model Dağıtımı",
    "Yazılım",
    "Veritabanı & Araçlar",
  ],
  experience: {
    "exp-1": {
      title: "Beyaz Şapkalı Hacker Eğitimi",
      company: "Siber Vatan",
      type: "Eğitim Programı",
      period: "Şubat 2026 — Haziran 2026",
      description:
        "CTF yarışmasında Denizli 3.'sü olarak katılmaya hak kazanılan bu programda siber güvenlik eğitimleri tamamlandı.",
      tags: ["Siber Güvenlik", "CTF", "Sızma Testi"],
    },
    "exp-2": {
      title: "Yönetim Kurulu Üyesi & Full-Stack Developer",
      company: "PAUSEC Bilgi Güvenliği Topluluğu",
      type: "Gönüllü",
      period: "Kasım 2025 — Haziran 2026",
      description:
        "Topluluğun web sitesinin mimarisi (.NET ve JS) sıfırdan geliştirildi ve üniversite çapında siber güvenlik eğitim etkinlikleri organize edildi.",
      tags: [".NET", "JavaScript", "Etkinlik Organizasyonu"],
    },
    "exp-3": {
      title: "Yazılım Geliştirme Stajyeri",
      company: "Başarsoft Bilgi Teknolojileri",
      type: "Uzaktan Staj",
      period: "Haziran 2025 — Ağustos 2025",
      description:
        "ASP.NET Core, React ve PostGIS teknolojilerini kullanarak coğrafi veri işleme, geometri kesişim kontrolleri ve arama optimizasyonlarını içeren full-stack bir harita modülü geliştirildi. NetTopologySuite ile snapping ve debounce mekanizmaları sisteme entegre edildi.",
    },
  },
  projects: {
    "proj-carettatrack": {
      title: "CarettaTrack",
      subtitle: "Yapay Zeka Destekli Kaplumbağa Tanıma Sistemi",
      description:
        "8700+ fotoğrafla eğitilmiş, 438 farklı deniz kaplumbağasını tanıyan ResNet-18 tabanlı derin öğrenme modeli. SOLID prensiplerine uygun FastAPI backend ve asenkron web arayüzü.",
    },
    "proj-data-middleware": {
      title: "Data Middleware",
      subtitle: "Log İşleme Mimarisi",
      description:
        "Chain of Responsibility, Strategy ve Factory tasarım kalıplarıyla kurgulanmış; KVKK veri maskeleme ve log zenginleştirme özelliklerine sahip dağıtık ara katman servisi.",
    },
    "proj-visionstrike": {
      title: "VisionStrike",
      subtitle: "El Takipli Fizik Oyunu",
      description:
        "Bilgisayarlı görü tabanlı fizik oyunu. Delta-time odaklı render döngüsü, asenkron UI geçişleri ve dinamik ses motoru entegrasyonu ile geliştirildi.",
    },
    "proj-fingerjump": {
      title: "Finger Jump",
      subtitle: "Sonsuz Tırmanma Oyunu",
      description:
        "MediaPipe el takibi (Hand Landmarker) modeli ve cihaz jiroskop verileri asenkron olarak işlenerek geliştirilen Flutter tabanlı sonsuz tırmanma oyunu.",
    },
    "proj-techvolt": {
      title: "TechVolt Solutions",
      subtitle: "Kurumsal Web Çözümü",
      description:
        "Yüksek performanslı ve SEO uyumlu kurumsal web platformu. Vercel + Railway dağıtık mimarisi, CI/CD süreçleri ile kesintisiz dağıtım.",
    },
    "proj-kitap": {
      title: "Kitap Satış Uygulaması",
      subtitle: "Admin Panelli Full-Stack E-Ticaret",
      description:
        "Clean code ve single responsibility prensiplerine uyan, admin panelli, kitap işlemlerini kapsayan full-stack web uygulaması.",
    },
    "proj-dietitian-client": {
      title: "Diyetisyen Danışan Takip Sistemi",
      subtitle: "Rol Tabanlı Danışan Yönetimi",
      description:
        "NestJS ve React kullanılarak geliştirilmiş, rol tabanlı yetkilendirme ile çalışan kapsamlı bir diyetisyen-danışan takip ve yönetim sistemi.",
    },
    "proj-kirmizi-baslikli-kiz": {
      title: "Kırmızı Başlıklı Kız",
      subtitle: "2D Platform Oyunu",
      description:
        "Pygame ile geliştirilmiş 2D platform oyunu. Kırmızı Başlıklı Kız, kurtla karşılaşmadan engelleri aşıp bulmacayı çözmeye çalışır.",
    },
  },
  ui: {
    nav: { about: "Hakkımda", experience: "Deneyim", works: "Projeler", skills: "Beceriler", contact: "İletişim" },
    themeToLight: "Açık moda geç",
    themeToDark: "Koyu moda geç",
    langSwitch: "Switch to English",
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    eyebrow: "Merhaba, ben",
    ctaProjects: "Projeleri Gör",
    ctaContact: "İletişime Geç",
    ctaCv: "CV İndir",
    rpgHeader: "KARAKTER BİLGİSİ",
    rpgLines: [
      { label: "İSİM", value: "Sema Gül Çelik" },
      { label: "BÖLÜM", value: "Bilgisayar Mühendisliği" },
      { label: "DURUM", value: "İş Tekliflerine Açık" },
    ],
    memeAlt: "Karakter görseli",
    aboutTitle: "Hakkımda",
    experienceTitle: "Deneyim",
    worksTitle: "Projeler",
    worksSub: "Öne çıkan çalışmalardan bazıları",
    live: "Canlı",
    skillsTitle: ["Beceriler", "& Araçlar"],
    skillsIntro: ["Öğrenmeyi hiç bırakmadım,", "bırakmayacağım da."],
    contactHeading: ["Birlikte bir şey", " yaratmak", "ister misiniz?"],
    contactSub: "Fırsatlar, projeler veya sadece merhaba demek için.",
    copy: "Kopyala",
    copied: "Kopyalandı!",
    footerRights: "Tüm haklar saklıdır.",
    backToTop: "↑ Yukarı",
  },
  memes: {
    experience: {
      kind: "achievement",
      title: "BAŞARIM AÇILDI",
      text: "CTF Denizli 3.'lüğü · +500 XP",
      sub: "Flag bulundu, kahve bitti.",
    },
    works: {
      kind: "dialog",
      speaker: "CarettaTrack",
      text: "438 kaplumbağayı tek tek tanıyorum. Hiçbiri beni tanımıyor.",
    },
    skills: {
      kind: "quest",
      title: "YAN GÖREV",
      text: "Stack Overflow'a bakmadan regex yaz",
      progress: 12,
      status: "Devam ediyor…",
    },
    contact: {
      kind: "dialog",
      speaker: "Sema",
      text: "Mesajına dönerim. Söz, “bende çalışıyordu” demeyeceğim.",
    },
  },
};

// ── English ──────────────────────────────────────────────────────────────────
const en = {
  personal: {
    ...tr.personal,
    roleLead: "Software Developer &",
    roleHighlight: "AI Enthusiast",
    tagline:
      "I love solving real problems with technology, and I never stop researching and learning.",
    bio: [
      "I'm pursuing my bachelor's degree in Computer Engineering at Pamukkale University, shaping my career around artificial intelligence, data science and machine learning.",
      "I'm a software developer who is always open to learning, enjoys research and aims to solve real-world problems with technology.",
    ],
    stats: [
      { value: "8+", label: "Projects Built" },
      { value: "3rd", label: "CTF · Denizli" },
      { value: "B2", label: "English" },
    ],
    cv: cv.en,
  },
  education: {
    badge: "Education",
    degree: "B.Sc. Computer Engineering",
    university: "Pamukkale University",
    city: "Denizli, Türkiye",
    period: "Sep 2023 — Jun 2027",
  },
  skillCategories: [
    "AI & Machine Learning",
    "Computer Vision",
    "Backend & AI Deployment",
    "Software",
    "Database & Tools",
  ],
  experience: {
    "exp-1": {
      title: "White Hat Hacker Training",
      company: "Siber Vatan",
      type: "Training Program",
      period: "Feb 2026 — Jun 2026",
      description:
        "Completed cybersecurity training in a program I qualified for by placing 3rd in Denizli in a CTF competition.",
      tags: ["Cybersecurity", "CTF", "Penetration Testing"],
    },
    "exp-2": {
      title: "Board Member & Full-Stack Developer",
      company: "PAUSEC Information Security Community",
      type: "Volunteer",
      period: "Nov 2025 — Jun 2026",
      description:
        "Built the community website's architecture (.NET and JS) from scratch and organized university-wide cybersecurity training events.",
      tags: [".NET", "JavaScript", "Event Organization"],
    },
    "exp-3": {
      title: "Software Development Intern",
      company: "Başarsoft Information Technologies",
      type: "Remote Internship",
      period: "Jun 2025 — Aug 2025",
      description:
        "Developed a full-stack map module with ASP.NET Core, React and PostGIS covering geospatial data processing, geometry intersection checks and search optimizations. Integrated snapping and debounce mechanisms with NetTopologySuite.",
    },
  },
  projects: {
    "proj-carettatrack": {
      title: "CarettaTrack",
      subtitle: "AI-Powered Sea Turtle Recognition",
      description:
        "A ResNet-18 based deep learning model trained on 8,700+ photos that recognizes 438 individual sea turtles. SOLID-compliant FastAPI backend with an asynchronous web interface.",
    },
    "proj-data-middleware": {
      title: "Data Middleware",
      subtitle: "Log Processing Architecture",
      description:
        "A distributed middleware service built with Chain of Responsibility, Strategy and Factory patterns, featuring GDPR/KVKK data masking and log enrichment.",
    },
    "proj-visionstrike": {
      title: "VisionStrike",
      subtitle: "Hand-Tracking Physics Game",
      description:
        "A computer-vision based physics game with a delta-time driven render loop, asynchronous UI transitions and a dynamic sound engine.",
    },
    "proj-fingerjump": {
      title: "Finger Jump",
      subtitle: "Endless Climbing Game",
      description:
        "A Flutter endless climber that processes MediaPipe Hand Landmarker tracking and device gyroscope data asynchronously.",
    },
    "proj-techvolt": {
      title: "TechVolt Solutions",
      subtitle: "Corporate Web Platform",
      description:
        "A high-performance, SEO-friendly corporate website on a distributed Vercel + Railway setup with CI/CD for seamless deployments.",
    },
    "proj-kitap": {
      title: "Bookstore App",
      subtitle: "Full-Stack E-Commerce with Admin Panel",
      description:
        "A full-stack web app for book sales with an admin panel, built following clean code and single responsibility principles.",
    },
    "proj-dietitian-client": {
      title: "Dietitian Client Tracker",
      subtitle: "Role-Based Client Management",
      description:
        "A comprehensive dietitian–client tracking and management system built with NestJS and React, using role-based authorization.",
    },
    "proj-kirmizi-baslikli-kiz": {
      title: "Little Red Riding Hood",
      subtitle: "2D Platformer",
      description:
        "A 2D platformer built with Pygame: Little Red Riding Hood must clear obstacles and solve the puzzle without running into the wolf.",
    },
  },
  ui: {
    nav: { about: "About", experience: "Experience", works: "Projects", skills: "Skills", contact: "Contact" },
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    langSwitch: "Türkçe'ye geç",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    eyebrow: "Hi, I'm",
    ctaProjects: "View Projects",
    ctaContact: "Get in Touch",
    ctaCv: "Download CV",
    rpgHeader: "CHARACTER INFO",
    rpgLines: [
      { label: "NAME", value: "Sema Gül Çelik" },
      { label: "CLASS", value: "Computer Engineering" },
      { label: "STATUS", value: "Open to Work" },
    ],
    memeAlt: "Character artwork",
    aboutTitle: "About",
    experienceTitle: "Experience",
    worksTitle: "Projects",
    worksSub: "A few highlights from my work",
    live: "Live",
    skillsTitle: ["Skills", "& Tools"],
    skillsIntro: ["Never stopped learning,", "never will."],
    contactHeading: ["Want to build", " something", "together?"],
    contactSub: "For opportunities, projects, or just to say hi.",
    copy: "Copy",
    copied: "Copied!",
    footerRights: "All rights reserved.",
    backToTop: "↑ Top",
  },
  memes: {
    experience: {
      kind: "achievement",
      title: "ACHIEVEMENT UNLOCKED",
      text: "3rd place · CTF Denizli · +500 XP",
      sub: "Flag captured, coffee depleted.",
    },
    works: {
      kind: "dialog",
      speaker: "CarettaTrack",
      text: "I can recognize 438 sea turtles. None of them recognize me.",
    },
    skills: {
      kind: "quest",
      title: "SIDE QUEST",
      text: "Write a regex without checking Stack Overflow",
      progress: 12,
      status: "In progress…",
    },
    contact: {
      kind: "dialog",
      speaker: "Sema",
      text: "I'll get back to you. Promise I won't say “works on my machine”.",
    },
  },
};

// Ortak alanları dil metinleriyle birleştir
function build(lang) {
  return {
    ...lang,
    skills: skillItems.map((items, i) => ({ category: lang.skillCategories[i], items })),
    experience: experienceBase.map((e) => ({ ...e, ...lang.experience[e.id], tags: lang.experience[e.id].tags ?? e.tags })),
    projects: projectBase.map((p) => ({ ...p, ...lang.projects[p.id] })),
  };
}

export const content = { tr: build(tr), en: build(en) };
