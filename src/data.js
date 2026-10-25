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
  game: {
    title: "Sema'nın Çiftliği",
    places: {
      about: "Çiftlik Evi · Hakkımda",
      experience: "Görev Panosu · Deneyim",
      projects: "Proje Tarlası",
      skills: "Sandık · Beceriler",
      contact: "Posta Kutusu · İletişim",
      cv: "Satış Kutusu · CV",
      sign: "Tabela",
      fish: "İskele · Balık tut",
      npc: "Sema ile konuş",
    },
    keyHint: "E",
    tapHint: "Dokun",
    hotbar: { about: "Hakkımda", experience: "Deneyim", projects: "Projeler", skills: "Beceriler", contact: "İletişim", cv: "CV" },
    hotbarLabel: "Hızlı menü",
    seasons: ["İlkbahar", "Yaz", "Sonbahar", "Kış"],
    seasonHint: "Mevsimi değiştir",
    goldLabel: "commit",
    gold: "1.337",
    close: "Kapat",
    help: "Nasıl oynanır?",
    classic: "Klasik site",
    welcome: {
      title: "Sema'nın Çiftliğine Hoş Geldin!",
      text: "Burası bir portfolyo… ama biraz farklı. Çiftlikte dolaş, nesnelerle etkileşime geç: her köşede başka bir bölüm seni bekliyor.",
      controls: [
        ["WASD / Ok tuşları", "Yürü"],
        ["E / Boşluk", "Etkileşim"],
        ["Tıkla / Dokun", "Oraya yürü ve aç"],
        ["1 – 6", "Hızlı menü"],
        ["Esc", "Pencereyi kapat"],
      ],
      tip: "İpucu: “!” balonları henüz keşfetmediğin yerleri gösterir. Sağ üstteki tarihe tıklayarak mevsimi değiştirebilirsin.",
      start: "Keşfetmeye başla",
    },
    profile: {
      friendship: "Dostluk",
      class: "Sınıf",
      classValue: "Bilgisayar Mühendisi",
      trait: "Özellik",
      traitValue: "Meraklı",
      perk: "Yetenek",
      perkValue: "Bug Avcısı",
      needs: "İhtiyaçlar",
      needsList: ["Kahve", "Yeni bir problem"],
      stats: "İstatistikler",
    },
    quests: { title: "Görev Panosu", sub: "Tamamlanan görevler", done: "Tamamlandı", reward: "Ödüller" },
    field: {
      title: "Proje Tarlası",
      sub: "Her ekin bir proje. Hasat etmek için birine dokun.",
      harvest: "Hasat edildi!",
      back: "← Tarlaya dön",
      prev: "Önceki",
      next: "Sonraki",
      code: "Kaynak kod",
      live: "Canlı site",
      featured: "Altın yıldızlı",
    },
    chest: { title: "Sandık", sub: "Envanter", items: "eşya" },
    mail: {
      title: "Posta Kutusu",
      greeting: "Sevgili ziyaretçi,",
      text: "Çiftliğime uğradığın için teşekkürler! Bir fırsat, proje fikri ya da sadece merhaba demek için bana buradan ulaşabilirsin.",
      sign: "— Sema",
      copy: "Kopyala",
      copied: "Kopyalandı!",
    },
    bin: {
      title: "Satış Kutusu",
      text: "Kutuya ne atarsan sabah karşılığını alırsın. Bu kutudan ise CV'm çıkıyor.",
      button: "CV'yi İndir",
    },
    fish: {
      title: "Yakaladın!",
      again: "Tekrar at",
      catches: [
        { name: "Race Condition", rarity: "★★★ Efsanevi", note: "Bir kere yakalandı, bir daha görülmedi… yoksa?" },
        { name: "Null Pointer", rarity: "★★ Nadir", note: "Tam yakaladım derken elinden kayıyor." },
        { name: "Off-by-one", rarity: "★ Sıradan", note: "Ya bir eksik ya bir fazla. Hiç tam değil." },
        { name: "Merge Conflict", rarity: "★★ Nadir", note: "İki balık aynı anda oltaya geldi. Hangisini tutacaksın?" },
        { name: "Memory Leak", rarity: "★★★ Efsanevi", note: "Kovaya koydukça kova büyüyor." },
        { name: "Eski Çizme", rarity: "Çöp", note: "Üstünde “legacy code” yazıyor. Geri atmaya kıyamadın." },
      ],
    },
    npc: {
      name: "Sema",
      greeting: "Selam çiftçi! Ben Sema. Bilgisayar mühendisliği okuyorum, yapay zekaya bayılıyorum. Ne hakkında konuşmak istersin?",
      choices: {
        about: "Biraz kendinden bahset",
        experience: "Neler yaptın?",
        projects: "Projelerini göster",
        skills: "Hangi araçları kullanıyorsun?",
        contact: "Seninle nasıl iletişime geçerim?",
        bye: "Sonra görüşürüz!",
      },
    },
  },
  memes: {
    hero: {
      kind: "hud",
      label: "Oyun saati",
      days: ["Paz.", "Pzt.", "Sal.", "Çar.", "Per.", "Cum.", "Cmt."],
      gold: "1.337",
      goldLabel: "commit",
    },
    heroToast: {
      kind: "toast",
      icon: "cap",
      title: "Yeni eşya alındı!",
      name: "Bilgisayar Mühendisliği Diploması",
      note: "Teslim tarihi: Haziran 2027. Şimdilik envanterde boş slot.",
    },
    experienceBundle: {
      kind: "bundle",
      title: "Topluluk Merkezi",
      name: "PAUSEC Paketi tamamlandı!",
      items: [
        { icon: "laptop", label: ".NET" },
        { icon: "scroll", label: "JavaScript" },
        { icon: "mic", label: "Etkinlik" },
        { icon: "teapot", label: "Bolca çay" },
      ],
      reward: "Ödül: Ekip ruhu ×∞",
    },
    skillsCatch: {
      kind: "catch",
      title: "Yakaladın!",
      icon: "bug",
      name: "Race Condition",
      rarity: "★★★ Efsanevi",
      size: "Uzunluk: 2 saatlik debug",
      note: "Bir kere yakalandı, bir daha görülmedi… yoksa?",
    },
    worksMail: {
      kind: "mail",
      greeting: "Sevgili Sema,",
      text: "Build'in yine başarısız oldu. Ama merak etme, yerelde çalıştığını biliyoruz.",
      sign: "— CI Botu",
      attachment: "Ek: 1 adet kırmızı ✗",
    },
    contactShipping: {
      kind: "shipping",
      title: "Günün satışları",
      rows: [
        { icon: "crate", item: "Commit", price: "0g" },
        { icon: "merge", item: "Merge edilen PR", price: "0g" },
        { icon: "ladybug", item: "Kapanan issue", price: "0g" },
        { icon: "moon", item: "Uykusuz gece", price: "0g" },
      ],
      totalLabel: "Toplam",
      total: "0g · açık kaynak ♥",
    },
    about: {
      kind: "calendar",
      title: "Takvim · 1. Yıl",
      entries: [
        { day: "İlkbahar 1", text: "“Bu projeyi hafta sonu bitiririm.”" },
        { day: "Yaz 14", text: "Hafta sonu bitti. Proje bitmedi." },
        { day: "Kış 28", text: "README yazıldı. Proje hâlâ “neredeyse” bitti." },
      ],
    },
    experience: {
      kind: "levelup",
      title: "Seviye atladın!",
      icon: "shield",
      skill: "Siber Güvenlik · Seviye 3",
      text: "CTF Denizli 3.'lüğü kazanıldı.",
      note: "Yeni yetenek: Açık portu 3 km öteden sezmek.",
    },
    works: {
      kind: "item",
      icon: "coffee",
      name: "Kahve",
      category: "İçecek",
      text: "Derleyicinin çalışması için gerekli. Bilim bunu açıklayamıyor.",
      buffs: ["+1 Hız (2s 00dk)", "+3 Debug", "−2 Uyku"],
      quality: "İridyum kalite",
    },
    skills: {
      kind: "energy",
      label: "Enerji",
      value: 9,
      time: "Gece 02:00",
      text: "Çok yorgunsun… Bayıldın.",
      note: "Bug hâlâ orada. Stack Overflow sekmesi de.",
    },
    contact: {
      kind: "npc",
      speaker: "Sema",
      text: "Mesajına dönerim, söz! Hediye olarak kahve kabul ediyorum. Sevmediğim tek şey: cuma akşamı production'a deploy. ♥",
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
  game: {
    title: "Sema's Farm",
    places: {
      about: "Farmhouse · About",
      experience: "Quest Board · Experience",
      projects: "Project Field",
      skills: "Chest · Skills",
      contact: "Mailbox · Contact",
      cv: "Shipping Bin · CV",
      sign: "Sign",
      fish: "Dock · Go fishing",
      npc: "Talk to Sema",
    },
    keyHint: "E",
    tapHint: "Tap",
    hotbar: { about: "About", experience: "Experience", projects: "Projects", skills: "Skills", contact: "Contact", cv: "CV" },
    hotbarLabel: "Quick menu",
    seasons: ["Spring", "Summer", "Fall", "Winter"],
    seasonHint: "Change season",
    goldLabel: "commits",
    gold: "1,337",
    close: "Close",
    help: "How to play",
    classic: "Classic site",
    welcome: {
      title: "Welcome to Sema's Farm!",
      text: "This is a portfolio… just a little different. Walk around the farm and interact with things: every corner holds a different section.",
      controls: [
        ["WASD / Arrow keys", "Walk"],
        ["E / Space", "Interact"],
        ["Click / Tap", "Walk there and open"],
        ["1 – 6", "Quick menu"],
        ["Esc", "Close window"],
      ],
      tip: "Tip: “!” bubbles mark places you haven't explored yet. Click the date in the top corner to change the season.",
      start: "Start exploring",
    },
    profile: {
      friendship: "Friendship",
      class: "Class",
      classValue: "Computer Engineer",
      trait: "Trait",
      traitValue: "Curious",
      perk: "Perk",
      perkValue: "Bug Hunter",
      needs: "Needs",
      needsList: ["Coffee", "A new problem"],
      stats: "Stats",
    },
    quests: { title: "Quest Board", sub: "Completed quests", done: "Complete", reward: "Rewards" },
    field: {
      title: "Project Field",
      sub: "Every crop is a project. Tap one to harvest it.",
      harvest: "Harvested!",
      back: "← Back to the field",
      prev: "Previous",
      next: "Next",
      code: "Source code",
      live: "Live site",
      featured: "Gold star",
    },
    chest: { title: "Chest", sub: "Inventory", items: "items" },
    mail: {
      title: "Mailbox",
      greeting: "Dear visitor,",
      text: "Thanks for stopping by my farm! Reach out here for opportunities, project ideas, or just to say hi.",
      sign: "— Sema",
      copy: "Copy",
      copied: "Copied!",
    },
    bin: {
      title: "Shipping Bin",
      text: "Whatever goes in the bin pays off by morning. This one ships my CV.",
      button: "Download CV",
    },
    fish: {
      title: "You caught it!",
      again: "Cast again",
      catches: [
        { name: "Race Condition", rarity: "★★★ Legendary", note: "Caught once, never seen again… or was it?" },
        { name: "Null Pointer", rarity: "★★ Rare", note: "Slips away right when you think you've got it." },
        { name: "Off-by-one", rarity: "★ Common", note: "Always one too many or one too few." },
        { name: "Merge Conflict", rarity: "★★ Rare", note: "Two fish bit at once. Which one do you keep?" },
        { name: "Memory Leak", rarity: "★★★ Legendary", note: "The more you put in the bucket, the bigger it gets." },
        { name: "Old Boot", rarity: "Trash", note: "It says “legacy code” on it. You couldn't throw it back." },
      ],
    },
    npc: {
      name: "Sema",
      greeting: "Hi farmer! I'm Sema. I study computer engineering and I love AI. What would you like to talk about?",
      choices: {
        about: "Tell me about yourself",
        experience: "What have you been up to?",
        projects: "Show me your projects",
        skills: "Which tools do you use?",
        contact: "How can I reach you?",
        bye: "See you later!",
      },
    },
  },
  memes: {
    hero: {
      kind: "hud",
      label: "Game clock",
      days: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
      gold: "1,337",
      goldLabel: "commits",
    },
    heroToast: {
      kind: "toast",
      icon: "cap",
      title: "New item received!",
      name: "Computer Engineering Degree",
      note: "Due: June 2027. Inventory slot reserved for now.",
    },
    experienceBundle: {
      kind: "bundle",
      title: "Community Center",
      name: "PAUSEC Bundle complete!",
      items: [
        { icon: "laptop", label: ".NET" },
        { icon: "scroll", label: "JavaScript" },
        { icon: "mic", label: "Events" },
        { icon: "teapot", label: "Lots of tea" },
      ],
      reward: "Reward: Team spirit ×∞",
    },
    skillsCatch: {
      kind: "catch",
      title: "You caught it!",
      icon: "bug",
      name: "Race Condition",
      rarity: "★★★ Legendary",
      size: "Length: 2 hours of debugging",
      note: "Caught once, never seen again… or was it?",
    },
    worksMail: {
      kind: "mail",
      greeting: "Dear Sema,",
      text: "Your build failed again. Don't worry, we know it works locally.",
      sign: "— CI Bot",
      attachment: "Attached: 1 red ✗",
    },
    contactShipping: {
      kind: "shipping",
      title: "Today's shipments",
      rows: [
        { icon: "crate", item: "Commits", price: "0g" },
        { icon: "merge", item: "Merged PRs", price: "0g" },
        { icon: "ladybug", item: "Closed issues", price: "0g" },
        { icon: "moon", item: "Sleepless nights", price: "0g" },
      ],
      totalLabel: "Total",
      total: "0g · open source ♥",
    },
    about: {
      kind: "calendar",
      title: "Calendar · Year 1",
      entries: [
        { day: "Spring 1", text: "“I'll finish this project over the weekend.”" },
        { day: "Summer 14", text: "The weekend is over. The project isn't." },
        { day: "Winter 28", text: "README written. Project is still “almost” done." },
      ],
    },
    experience: {
      kind: "levelup",
      title: "Level up!",
      icon: "shield",
      skill: "Cybersecurity · Level 3",
      text: "Placed 3rd in CTF Denizli.",
      note: "New skill: sensing an open port from 3 km away.",
    },
    works: {
      kind: "item",
      icon: "coffee",
      name: "Coffee",
      category: "Drink",
      text: "Required for the compiler to work. Science can't explain it.",
      buffs: ["+1 Speed (2h 00m)", "+3 Debugging", "−2 Sleep"],
      quality: "Iridium quality",
    },
    skills: {
      kind: "energy",
      label: "Energy",
      value: 9,
      time: "2:00 AM",
      text: "You're exhausted… You passed out.",
      note: "The bug is still there. So is the Stack Overflow tab.",
    },
    contact: {
      kind: "npc",
      speaker: "Sema",
      text: "I'll get back to you, promise! Coffee is an accepted gift. The only thing I dislike: deploying to production on a Friday night. ♥",
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
