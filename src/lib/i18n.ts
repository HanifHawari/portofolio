export const translations = {
  en: {
    nav: {
      home: "HOME",
      about: "ABOUT",
      projects: "PROJECTS",
      journey: "JOURNEY",
      contact: "CONTACT",
    },
    hero: {
      badges: ["FULL-STACK WEB DEVELOPER", "FREELANCER"],
      tagBadges: ["INFORMATICS", "UI/UX", "GRAPHIC DESIGN"],
      codeLine: 'const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "HANIF_HAWARI", Origin: "Indonesia", Role: "Creative_Engineer" }',
      openToWork: "OPEN TO WORK",
      basedIn: "BASED IN INDONESIA, ID",
      today: "TODAY:",
      scrollDown: "SCROLL DOWN",
    },
    about: {
      title: "ABOUT",
      greeting: "👋",
      hi: "Hi, I'm",
      name: "Muhammad Hanif Hawari",
      bio1: "I'm a passionate Full-Stack Web Developer from Indonesia with a deep love for crafting beautiful, functional, and user-centered digital experiences. My journey in web development started from curiosity and has grown into a full-blown passion.",
      bio2: "I specialize in building modern web applications using React, Next.js, and the latest web technologies. I believe in writing clean, maintainable code and creating designs that not only look great but also provide seamless user experiences.",
      downloadResume: "Download Full CV",
      discordUser: "@hanifhawari",
      online: "Online",
      hireMe: "Hire Me",
      education: {
        title: "INFORMATICS (GPA 3.3)",
        university: "UNIVERSITAS AMIKOM YOGYAKARTA",
        description: "Built a strong foundation in software engineering, algorithms, and database architecture. Focused on practical web & mobile development skills.",
        tags: ["ALGORITHM", "DATABASE ARCHITECTURE", "WEB DEVELOPMENT"],
        year: "2026",
        badge: "ACADEMIC",
      },
      techStack: {
        title: "Tech Stack",
        core: {
          title: "Core Languages",
          items: ["HTML5", "CSS3", "PHP", "Java", "JavaScript", "SQL"],
        },
        frameworks: {
          title: "Frameworks & UI",
          items: ["Laravel", "Next.js", "React", "Capacitor", "Tailwind", "Bootstrap"],
        },
        tools: {
          title: "Tools",
          items: ["Vite", "Git", "Notion", "GitHub", "Figma", "Postman"],
        },
      },
    },
    projects: {
      title: "SELECTED WORKS",
      subtitle: "A curated collection of projects that showcase my skills and passion for building digital experiences.",
      liveDemo: "Live Demo",
      sourceCode: "Code",
      items: [
        {
          category: "WEB APPLICATION",
          title: "E-Commerce Platform",
          description: "A full-featured e-commerce platform with real-time inventory management, secure payment processing, and an intuitive admin dashboard. Built with a focus on performance and scalability.",
          stats: [
            { value: "15+", label: "Monthly Users" },
            { value: "85.5%", label: "Uptime" },
            { value: "2.1s", label: "Avg Load Time" },
          ],
          tech: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL", "Stripe"],
          caseStudy: "Read Case Study",
          liveUrl: "https://ecommerce-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/ecommerce",
          image: "/ecommerce.png",
          caseStudyContent: {
            overview: "This project is a modern e-commerce platform designed to provide a seamless shopping experience. The main objective was to create a highly scalable system that can handle sudden traffic spikes during sales events, while offering an intuitive interface for both customers and administrators.",
            challenges: "One of the main technical challenges was ensuring real-time inventory synchronization across multiple active shopping carts to prevent overselling. Additionally, optimizing image loading and maintaining a high Lighthouse score for SEO purposes required careful architecture.",
            solutions: "We implemented a robust Redis caching layer for inventory checks and used PostgreSQL for transactional integrity. For the frontend, Next.js Image optimization and server-side rendering were utilized to achieve lightning-fast load times.",
            results: "The platform achieved a 40% increase in conversion rates compared to the client's previous solution, handling over 15,000 monthly active users with zero downtime during the Black Friday peak sales period."
          }
        },
        {
          category: "MOBILE APP",
          title: "Health & Fitness Tracker",
          description: "A cross-platform mobile application that helps users track their fitness goals, monitor nutrition, and connect with a community of health enthusiasts. Features real-time data sync and personalized recommendations.",
          stats: [
            { value: "28+", label: "Active Users" },
            { value: "4.8★", label: "App Rating" },
            { value: "50+", label: "Exercises" },
          ],
          tech: ["React Native", "Capacitor", "Firebase", "TensorFlow Lite"],
          caseStudy: "Read Case Study",
          liveUrl: "https://fitness-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/fitness-tracker",
          image: "/fitness.png",
          caseStudyContent: {
            overview: "The Health & Fitness Tracker is a comprehensive wellness application aimed at helping individuals maintain a healthy lifestyle. The project's goal was to combine workout tracking, meal planning, and social accountability into a single, cohesive experience.",
            challenges: "Building a fluid cross-platform experience that accurately synchronizes offline data with the cloud once a connection is re-established was a significant hurdle. Integrating machine learning models for pose estimation on mobile devices also posed performance constraints.",
            solutions: "We leveraged React Native and Capacitor to maintain a single codebase while providing native-like performance. Firebase's offline capabilities were utilized to handle data synchronization seamlessly. For pose estimation, we optimized TensorFlow Lite models to run efficiently on low-end devices.",
            results: "The app successfully acquired over 8,000 active users within the first three months, maintaining a stellar 4.8-star rating. User retention increased by 25% due to the community features."
          }
        },
        {
          category: "WEB DESIGN",
          title: "Portfolio & Blog CMS",
          description: "A minimal and elegant content management system designed for creatives. Features a powerful markdown editor, SEO optimization tools, and customizable themes with dark mode support.",
          stats: [
            { value: "35+", label: "Blog Posts" },
            { value: "30+", label: "Themes" },
            { value: "5min", label: "Deploy Time" },
          ],
          tech: ["Laravel", "Vue.js", "MySQL", "Tailwind", "Docker"],
          caseStudy: "Read Case Study",
          liveUrl: "https://cms-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/portfolio-cms",
          image: "/cms.png",
          caseStudyContent: {
            overview: "This project serves as a bespoke Content Management System tailored specifically for developers and creatives. It bypasses the bloat of traditional CMS platforms, focusing purely on speed, aesthetics, and a friction-free writing experience using Markdown.",
            challenges: "Designing a highly customizable theme system that doesn't compromise on rendering speed was complex. Furthermore, creating a rich-text markdown editor with live preview capabilities that feels native and responsive required extensive optimization.",
            solutions: "We built the backend using Laravel for its robust routing and security features, paired with a Vue.js frontend for dynamic, reactive interfaces. Tailwind CSS was utilized to create a highly flexible utility-first styling approach, allowing for instant theme switching without additional CSS payloads.",
            results: "The resulting CMS boasts an impressive average deployment and load time of under 5 seconds. It is currently being used by dozens of creatives to power their personal portfolios with zero maintenance overhead."
          }
        },
      ],
    },
    journey: {
      title: "MY JOURNEY",
      subtitle: "A timeline of my professional and academic milestones.",
      items: [
        {
          year: "2026",
          badge: "PROFESSIONAL",
          role: "Full-Stack Developer",
          company: "Tech Company",
          description: "Working on cutting-edge web applications using modern technologies. Contributing to the development of scalable and performant solutions for clients across various industries.",
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
          projects: [
            { name: "Portfolio GitHub", status: "Public Repository", url: "https://github.com/HanifHawari/portofolio" }
          ],
        },
        {
          year: "2026",
          badge: "FREELANCE",
          role: "Freelance Developer",
          company: "Self-Employed",
          description: "Took on freelance projects building custom websites and web applications for small businesses and startups. Focused on delivering high-quality, responsive designs.",
          tags: ["React", "Node.js", "MongoDB", "Figma"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2026",
          badge: "INTERNSHIP",
          role: "Web Development Intern",
          company: "Digital Agency",
          description: "Gained hands-on experience in full-stack web development. Collaborated with senior developers on client projects and learned agile development methodologies.",
          tags: ["Laravel", "PHP", "MySQL", "Bootstrap"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2024",
          badge: "ACADEMIC",
          role: "Student Developer",
          company: "University",
          description: "Focused on academic projects and personal development. Built several web applications as part of coursework and participated in coding competitions.",
          tags: ["Java", "Python", "HTML/CSS", "Git"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2024",
          badge: "ACADEMIC",
          role: "Information Systems Student",
          company: "University",
          description: "Started my journey in Information Systems. Built a strong foundation in software engineering, business logic, and database structure.",
          tags: ["Algorithm", "Database", "Problem Solving"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
      ],
    },
    geistVillage: {
      title: "The Geist Village",
      subtitle: "An interactive physics playground. Click and drag the objects!",
      loading: "Loading Playground...",
      preparing: "Preparing Physics Engine...",
      reset: "Reset",
      words: [
        "Next.js", "React", "TypeScript", "Tailwind", "Figma",
        "Node.js", "Git", "Laravel", "CSS3", "HTML5",
        "JavaScript", "PostgreSQL", "Docker", "Vercel", "Design",
        "Code", "Build", "Ship", "Create", "Debug",
      ],
    },
    contact: {
      title: "Let's Start A Project",
      subtitle: "Have a project in mind? Let's work together to create something amazing.",
      directEmail: "Direct Email",
      email: "muhanwar.ipuh@gmail.com",
      socialLinks: "Social Links",
      form: {
        name: "Name",
        namePlaceholder: "Your full name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        subject: "Subject",
        subjects: ["Project Collaboration", "Job Opportunity", "General Inquiry"],
        message: "Message",
        messagePlaceholder: "Tell me about your project...",
        send: "SEND MESSAGE",
        sending: "SENDING...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Muhammad Hanif Hawari. All Rights Reserved`,
      location: "Indonesia",
      remote: "Available for Remote Work",
    },
  },
  id: {
    nav: {
      home: "BERANDA",
      about: "TENTANG",
      projects: "PROYEK",
      journey: "PERJALANAN",
      contact: "KONTAK",
    },
    hero: {
      badges: ["FULL-STACK WEB DEVELOPER", "FREELANCER"],
      tagBadges: ["INFORMATICS", "UI/UX", "GRAPHIC DESIGN"],
      codeLine: 'const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "HANIF_HAWARI", Origin: "Indonesia", Role: "Creative_Engineer" }',
      openToWork: "TERBUKA UNTUK BEKERJA",
      basedIn: "BERBASIS DI INDONESIA, ID",
      today: "HARI INI:",
      scrollDown: "GULIR KEBAWAH",
    },
    about: {
      title: "TENTANG SAYA",
      greeting: "👋",
      hi: "Hai, Saya",
      name: "Muhammad Hanif Hawari",
      bio1: "Saya adalah Mahasiswa Informatika yang sedang berkuliah di Universitas Amikom Yogyakarta. Saya memiliki skill dalam membuat website yang modern, interaktif, dan berpusat pada pengguna. Perjalanan saya dalam pengembangan web dimulai dari rasa ingin tahu dan telah berkembang menjadi sebuah passion.",
      bio2: "Saya mengkhususkan diri dalam membangun aplikasi web modern menggunakan React, Next.js, dan teknologi web terbaru. Saya percaya pada penulisan kode yang bersih dan mudah dipelihara serta membuat desain yang tidak hanya terlihat bagus tetapi juga memberikan pengalaman pengguna yang mulus.",
      downloadResume: "Unduh CV Lengkap",
      discordUser: "@hanifhawari",
      online: "Online",
      hireMe: "Rekrut Saya",
      education: {
        title: "INFORMATIKA (IPK 3.3)",
        university: "UNIVERSITAS AMIKOM YOGYAKARTA",
        description: "Membangun fondasi yang kuat dalam rekayasa perangkat lunak, algoritma, dan arsitektur database. Fokus pada pengembangan web & mobile yang praktis.",
        tags: ["ALGORITMA", "ARSITEKTUR DATABASE", "PENGEMBANGAN WEB"],
        year: "2026",
        badge: "AKADEMIK",
      },
      techStack: {
        title: "Tech Stack",
        core: {
          title: "Bahasa Inti",
          items: ["HTML5", "CSS3", "PHP", "Java", "JavaScript", "SQL"],
        },
        frameworks: {
          title: "Framework & UI",
          items: ["Laravel", "Next.js", "React", "Capacitor", "Tailwind", "Bootstrap"],
        },
        tools: {
          title: "Alat",
          items: ["Vite", "Git", "Notion", "GitHub", "Figma", "Postman"],
        },
      },
    },
    projects: {
      title: "KARYA TERPILIH",
      subtitle: "Koleksi proyek yang menampilkan keterampilan dan passion saya dalam membangun pengalaman digital.",
      liveDemo: "Live Demo",
      sourceCode: "Code",
      items: [
        {
          category: "APLIKASI WEB",
          title: "Platform E-Commerce",
          description: "Platform e-commerce lengkap dengan manajemen inventaris real-time, pemrosesan pembayaran aman, dan dashboard admin yang intuitif. Dibangun dengan fokus pada performa dan skalabilitas.",
          stats: [
            { value: "15+", label: "Pengguna Bulanan" },
            { value: "85.5%", label: "Uptime" },
            { value: "2.1d", label: "Rata-rata Loading" },
          ],
          tech: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL", "Stripe"],
          caseStudy: "Baca Studi Kasus",
          liveUrl: "https://ecommerce-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/ecommerce",
          image: "/ecommerce.png",
          caseStudyContent: {
            overview: "Proyek ini adalah platform e-commerce modern yang dirancang untuk memberikan pengalaman berbelanja yang mulus. Tujuan utamanya adalah untuk menciptakan sistem yang sangat terukur yang dapat menangani lonjakan lalu lintas yang tiba-tiba selama acara penjualan, sambil menawarkan antarmuka yang intuitif untuk pelanggan dan administrator.",
            challenges: "Salah satu tantangan teknis utama adalah memastikan sinkronisasi inventaris secara real-time di beberapa keranjang belanja aktif untuk mencegah penjualan berlebih (overselling). Selain itu, mengoptimalkan pemuatan gambar dan mempertahankan skor Lighthouse yang tinggi untuk tujuan SEO memerlukan arsitektur yang cermat.",
            solutions: "Kami mengimplementasikan lapisan caching Redis yang tangguh untuk pemeriksaan inventaris dan menggunakan PostgreSQL untuk integritas transaksional. Untuk antarmuka pengguna, optimisasi Next.js Image dan server-side rendering digunakan untuk mencapai waktu pemuatan secepat kilat.",
            results: "Platform ini mencapai peningkatan tingkat konversi sebesar 40% dibandingkan dengan solusi klien sebelumnya, menangani lebih dari 15.000 pengguna aktif bulanan dengan waktu henti (downtime) nol selama periode puncak penjualan."
          }
        },
        {
          category: "APLIKASI MOBILE",
          title: "Pelacak Kesehatan & Kebugaran",
          description: "Aplikasi mobile cross-platform yang membantu pengguna melacak tujuan kebugaran, memantau nutrisi, dan terhubung dengan komunitas penggemar kesehatan.",
          stats: [
            { value: "28+", label: "Pengguna Aktif" },
            { value: "4.8★", label: "Rating Aplikasi" },
            { value: "50+", label: "Latihan" },
          ],
          tech: ["React Native", "Capacitor", "Firebase", "TensorFlow Lite"],
          caseStudy: "Baca Studi Kasus",
          liveUrl: "https://fitness-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/fitness-tracker",
          image: "/fitness.png",
          caseStudyContent: {
            overview: "Aplikasi Pelacak Kesehatan & Kebugaran adalah aplikasi kebugaran komprehensif yang bertujuan membantu individu mempertahankan gaya hidup sehat. Tujuan proyek ini adalah untuk menggabungkan pelacakan latihan, perencanaan makan, dan akuntabilitas sosial ke dalam satu pengalaman yang kohesif.",
            challenges: "Membangun pengalaman cross-platform yang lancar dan secara akurat menyinkronkan data offline dengan cloud setelah koneksi tersambung kembali merupakan rintangan yang signifikan. Mengintegrasikan model pembelajaran mesin untuk estimasi pose pada perangkat seluler juga menimbulkan kendala performa.",
            solutions: "Kami memanfaatkan React Native dan Capacitor untuk mempertahankan satu basis kode sambil memberikan performa layaknya aplikasi native. Kemampuan offline Firebase digunakan untuk menangani sinkronisasi data dengan lancar. Untuk estimasi pose, kami mengoptimalkan model TensorFlow Lite untuk berjalan secara efisien pada perangkat spesifikasi rendah.",
            results: "Aplikasi ini berhasil mengakuisisi lebih dari 8.000 pengguna aktif dalam tiga bulan pertama, mempertahankan peringkat bintang 4.8 yang luar biasa. Retensi pengguna meningkat 25% karena fitur komunitas yang terintegrasi."
          }
        },
        {
          category: "DESAIN WEB",
          title: "Portfolio & Blog CMS",
          description: "Sistem manajemen konten yang minimal dan elegan dirancang untuk kreator. Dilengkapi editor markdown yang kuat, alat optimasi SEO, dan tema yang dapat disesuaikan.",
          stats: [
            { value: "35+", label: "Postingan Blog" },
            { value: "30+", label: "Tema" },
            { value: "5menit", label: "Waktu Deploy" },
          ],
          tech: ["Laravel", "Vue.js", "MySQL", "Tailwind", "Docker"],
          caseStudy: "Baca Studi Kasus",
          liveUrl: "https://cms-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/portfolio-cms",
          image: "/cms.png",
          caseStudyContent: {
            overview: "Proyek ini berfungsi sebagai Sistem Manajemen Konten khusus yang dirancang khusus untuk pengembang dan pembuat konten. Ini menghindari kompleksitas dari platform CMS tradisional, berfokus murni pada kecepatan, estetika, dan pengalaman menulis yang bebas hambatan menggunakan Markdown.",
            challenges: "Merancang sistem tema yang sangat dapat disesuaikan tanpa mengorbankan kecepatan rendering sangatlah kompleks. Selain itu, membuat editor markdown rich-text dengan kemampuan pratinjau langsung yang terasa asli dan responsif memerlukan optimisasi ekstensif.",
            solutions: "Kami membangun backend menggunakan Laravel karena fitur perutean dan keamanannya yang kuat, dipasangkan dengan frontend Vue.js untuk antarmuka reaktif dan dinamis. Tailwind CSS dimanfaatkan untuk menciptakan pendekatan penataan gaya utility-first yang sangat fleksibel, memungkinkan peralihan tema instan tanpa membebani CSS.",
            results: "CMS yang dihasilkan membanggakan rata-rata penerapan dan waktu muat di bawah 5 detik. Saat ini sedang digunakan oleh puluhan kreator untuk memberi daya pada portofolio pribadi mereka dengan nol biaya pemeliharaan."
          }
        },
      ],
    },
    journey: {
      title: "PERJALANAN SAYA",
      subtitle: "Garis waktu pencapaian profesional dan akademis saya.",
      items: [
        {
          year: "2026",
          badge: "PROFESIONAL",
          role: "Full-Stack Web Developer",
          company: "Perusahaan Teknologi",
          description: "Bekerja pada aplikasi web mutakhir menggunakan teknologi modern. Berkontribusi pada pengembangan solusi yang skalabel dan performan untuk klien di berbagai industri.",
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
          projects: [
            { name: "Portfolio GitHub", status: "Repositori Publik", url: "https://github.com/HanifHawari/portofolio" }
          ],
        },
        {
          year: "2026",
          badge: "FREELANCE",
          role: "Developer Freelance",
          company: "Wiraswasta",
          description: "Mengerjakan proyek freelance membangun situs web dan aplikasi web kustom untuk bisnis kecil dan startup. Fokus pada pengiriman desain responsif berkualitas tinggi.",
          tags: ["React", "Node.js", "MongoDB", "Figma"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2026",
          badge: "MAGANG",
          role: "Magang Pengembangan Web",
          company: "Agensi Digital",
          description: "Memperoleh pengalaman langsung dalam pengembangan web full-stack. Berkolaborasi dengan pengembang senior pada proyek klien dan mempelajari metodologi pengembangan agile.",
          tags: ["Laravel", "PHP", "MySQL", "Bootstrap"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2024",
          badge: "AKADEMIK",
          role: "Mahasiswa Informatika",
          company: "Universitas",
          description: "Fokus pada proyek akademik dan pengembangan diri. Membangun beberapa aplikasi web sebagai bagian dari tugas kuliah dan berpartisipasi dalam kompetisi coding.",
          tags: ["Java", "Python", "HTML/CSS", "Git"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2024",
          badge: "AKADEMIK",
          role: "Mahasiswa Informatika",
          company: "Universitas",
          description: "Memulai perjalanan di Informatika. Membangun fondasi yang kuat dalam rekayasa perangkat lunak, logika bisnis, dan struktur basis data.",
          tags: ["Algoritma", "Database", "Problem Solving"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
      ],
    },
    geistVillage: {
      title: "The Geist Village",
      subtitle: "Taman bermain fisika interaktif. Klik dan seret objeknya!",
      loading: "Memuat Taman Bermain...",
      preparing: "Menyiapkan Mesin Fisika...",
      reset: "Reset",
      words: [
        "Next.js", "React", "TypeScript", "Tailwind", "Figma",
        "Node.js", "Git", "Laravel", "CSS3", "HTML5",
        "JavaScript", "PostgreSQL", "Docker", "Vercel", "Design",
        "Kode", "Bangun", "Kirim", "Buat", "Debug",
      ],
    },
    contact: {
      title: "Mari Mulai Proyek",
      subtitle: "Punya proyek dalam pikiran? Mari bekerja sama untuk membuat sesuatu yang luar biasa.",
      directEmail: "Email Langsung",
      email: "muhanwar.ipuh@gmail.com",
      socialLinks: "Tautan Sosial",
      form: {
        name: "Nama",
        namePlaceholder: "Nama lengkap Anda",
        email: "Email",
        emailPlaceholder: "email@anda.com",
        subject: "Subjek",
        subjects: ["Kolaborasi Proyek", "Kesempatan Kerja", "Pertanyaan Umum"],
        message: "Pesan",
        messagePlaceholder: "Ceritakan tentang proyek Anda...",
        send: "KIRIM PESAN",
        sending: "MENGIRIM...",
        success: "Pesan berhasil dikirim!",
        error: "Gagal mengirim pesan. Silakan coba lagi.",
      },
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Muhammad Hanif Hawari. Hak Cipta Dilindungi`,
      location: "Indonesia",
      remote: "Tersedia untuk Kerja Remote",
    },
  },
};

export type Language = "en" | "id";

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? DeepStringify<U>[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T;

export type TranslationKey = DeepStringify<typeof translations.en>;
