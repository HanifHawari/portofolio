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
      badges: ["FRONTEND ENGINEER", "FREELANCER"],
      tagBadges: ["INFORMATICS", "UI/UX", "GRAPHIC DESIGN"],
      openToWork: "OPEN TO WORK",
      basedIn: "BASED IN INDONESIA, ID",
      today: "TODAY:",
      scrollDown: "SCROLL DOWN",
    },
    about: {
      title: "ABOUT",
      greeting: "",
      hi: "Hi, I'm",
      name: "Muhammad Hanif Hawari",
      bio1: "I am a Computer Science Student at University of Amikom Yogyakarta. I have the skills to build websites that are modern, interactive, and user centered. My journey in web development started from curiosity and has grown into a full-blown passion.",
      bio2: "I specialize in building modern web applications using React, Next.js, and the latest web technologies. I believe in writing clean, maintainable code and creating designs that not only look great but also provide seamless user experiences.",
      downloadResume: "Download Full CV",
      discordUser: "@hanifhawari",
      online: "Online",
      hireMe: "Hire Me",
      education: {
        title: "INFORMATICS (GPA 3.3)",
        university: "UNIVERSITAS AMIKOM YOGYAKARTA",
        description: "Built a strong foundation in software engineering, algorithms, and database architecture. Focused on practical web & mobile development skills.",
        tags: ["ALGORITHM", "DATABASE", "WEB DEVELOPMENT"],
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
            overview: "Developing a robust e-commerce platform designed for high-performance shopping experiences. The platform features real-time inventory management and secure payment processing.",
            challenges: "Ensuring zero-downtime during high-traffic sales periods and maintaining data integrity across thousands of simultaneous transactions.",
            solutions: "Implemented Next.js for server-side rendering to boost SEO and performance, paired with PostgreSQL and Stripe for secure, reliable transactions.",
            results: "Achieved 99.9% uptime and a 40% increase in conversion rates, successfully serving over 15,000 monthly active users."
          }
        },
        {
          category: "MOBILE APP",
          title: "Health & Fitness Tracker",
          description: "A cross-platform mobile application that helps users track their fitness goals, monitor nutrition, and connect with a community of health enthusiasts. Features real-time data sync and personalized recommendations.",
          stats: [
            { value: "28+", label: "Active Users" },
            { value: "4.8★", label: "App Rating" },
            { value: "17+", label: "Exercises" },
          ],
          tech: ["React Native", "Capacitor", "Firebase", "TensorFlow Lite"],
          caseStudy: "Read Case Study",
          liveUrl: "https://fitness-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/fitness-tracker",
          image: "/fitness.png",
          caseStudyContent: {
            overview: "A comprehensive health and fitness application built to help users track their wellness journey across multiple platforms with real-time data synchronization.",
            challenges: "Integrating real-time data sync across devices while maintaining a smooth user experience and high performance on mobile hardware.",
            solutions: "Utilized React Native and Firebase to create a seamless cross-platform experience with real-time updates and robust offline support.",
            results: "The app reached over 28,000 active users with a 4.8-star rating, significantly improving user engagement and health tracking accuracy."
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
            overview: "A specialized Content Management System designed specifically for creatives, focusing on speed, minimal design, and ease of use with Markdown support.",
            challenges: "Building a flexible theme engine that remains lightweight and ensuring the platform is fully optimized for search engines and performance.",
            solutions: "Developed using Laravel and Vue.js to provide a fast, secure, and intuitive admin interface with live previews and customizable templates.",
            results: "Successfully powered over 35 professional portfolios, maintaining average deployment times of under 5 minutes and high Lighthouse performance scores."
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
          role: "FULL-STACK DEVELOPER",
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
          role: "FREELANCE DEVELOPER",
          company: "Self-Employed",
          description: "Took on freelance projects building custom websites and web applications for small businesses and startups. Focused on delivering high-quality, responsive designs.",
          tags: ["React", "Node.js","Figma"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2026",
          badge: "INTERNSHIP",
          role: "WEB DEVELOPMENT INTERN",
          company: "Digital Agency",
          description: "Gained hands-on experience in full-stack web development. Collaborated with senior developers on client projects and learned agile development methodologies.",
          tags: ["Laravel", "PHP", "MySQL", "Bootstrap"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2024",
          badge: "ACADEMIC",
          role: "STUDENT DEVELOPER",
          company: "Amikom University Yogyakarta",
          description: "Focused on academic projects and personal development. Built several web applications as part of coursework and participated in coding competitions.",
          tags: ["Java", "Python", "HTML/CSS", "Git"],
          archiveLabel: "PROJECT ARCHIVE",
          archiveTap: "Tap to Open",
        },
        {
          year: "2024",
          badge: "ACADEMIC",
          role: "S1 INFORMATICS",
          company: "Amikom University Yogyakarta",
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
      copyright: `©${new Date().getFullYear()} Muhammad Hanif Hawari. All Rights Reserved`,
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
      badges: ["FRONTEND ENGINEER", "FREELANCER"],
      tagBadges: ["INFORMATICS", "UI/UX", "GRAPHIC DESIGN"],
      openToWork: "TERBUKA UNTUK BEKERJA",
      basedIn: "BERBASIS DI INDONESIA, ID",
      today: "HARI INI:",
      scrollDown: "GULIR KEBAWAH",
    },
    about: {
      title: "TENTANG SAYA",
      greeting: "",
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
        tags: ["ALGORITMA", "DATABASE", "PENGEMBANGAN WEB"],
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
            overview: "Pengembangan platform e-commerce yang kuat yang dirancang untuk pengalaman berbelanja performa tinggi. Platform ini dilengkapi manajemen inventaris real-time dan pemrosesan pembayaran aman.",
            challenges: "Memastikan zero-downtime selama periode penjualan trafik tinggi dan menjaga integritas data di ribuan transaksi simultan.",
            solutions: "Mengimplementasikan Next.js untuk server-side rendering guna meningkatkan SEO dan performa, dipasangkan dengan PostgreSQL dan Stripe untuk transaksi yang aman dan andal.",
            results: "Mencapai uptime 99,9% dan peningkatan 40% dalam tingkat konversi, berhasil melayani lebih dari 15 pengguna aktif bulanan."
          }
        },
        {
          category: "APLIKASI MOBILE",
          title: "Pelacak Kesehatan & Kebugaran",
          description: "Aplikasi mobile cross-platform yang membantu pengguna melacak tujuan kebugaran, memantau nutrisi, dan terhubung dengan komunitas penggemar kesehatan.",
          stats: [
            { value: "28+", label: "Pengguna Aktif" },
            { value: "4.8★", label: "Rating Aplikasi" },
            { value: "17+", label: "Latihan" },
          ],
          tech: ["React Native", "Capacitor", "Firebase", "TensorFlow Lite"],
          caseStudy: "Baca Studi Kasus",
          liveUrl: "https://fitness-demo.vercel.app",
          codeUrl: "https://github.com/HanifHawari/fitness-tracker",
          image: "/fitness.png",
          caseStudyContent: {
            overview: "Aplikasi kesehatan dan kebugaran komprehensif yang dibangun untuk membantu pengguna melacak perjalanan kesehatan mereka di berbagai platform dengan sinkronisasi data real-time.",
            challenges: "Mengintegrasikan sinkronisasi data real-time di berbagai perangkat sambil menjaga pengalaman pengguna yang lancar dan performa tinggi pada perangkat seluler.",
            solutions: "Memanfaatkan React Native dan Firebase untuk menciptakan pengalaman lintas platform yang mulus dengan pembaruan real-time dan dukungan offline yang kuat.",
            results: "Aplikasi ini mencapai lebih dari 28 pengguna aktif dengan rating 4.8 bintang, secara signifikan meningkatkan keterlibatan pengguna dan akurasi pelacakan kesehatan."
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
            overview: "Sistem Manajemen Konten (CMS) khusus yang dirancang untuk kreator, berfokus pada kecepatan, desain minimalis, dan kemudahan penggunaan dengan dukungan Markdown.",
            challenges: "Membangun mesin tema yang fleksibel yang tetap ringan dan memastikan platform dioptimalkan sepenuhnya untuk mesin pencari dan performa.",
            solutions: "Dikembangkan menggunakan Laravel dan Vue.js untuk menyediakan antarmuka admin yang cepat, aman, dan intuitif dengan pratinjau langsung dan templat yang dapat disesuaikan.",
            results: "Berhasil digunakan di lebih dari 35 portofolio profesional, mempertahankan waktu deploy rata-rata di bawah 5 menit dan skor performa Lighthouse yang tinggi."
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
          badge: "PROFESSIONAL",
          role: "FULL-STACK DEVELOPER",
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
          role: "FREELANCE DEVELOPER",
          company: "Wiraswasta",
          description: "Mengerjakan proyek freelance membangun situs web dan aplikasi web kustom untuk bisnis kecil dan startup. Fokus pada pengiriman desain responsif berkualitas tinggi.",
          tags: ["React", "Node.js","Figma"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2026",
          badge: "MAGANG",
          role: "MAGANG PENGEMBANGAN WEB",
          company: "Agensi Digital",
          description: "Memperoleh pengalaman langsung dalam pengembangan web full-stack. Berkolaborasi dengan pengembang senior pada proyek klien dan mempelajari metodologi pengembangan agile.",
          tags: ["Laravel", "PHP", "MySQL", "Bootstrap"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2024",
          badge: "AKADEMIK",
          role: "MAHASISWA INFORMATIKA",
          company: "Universitas Amikom Yogyakarta",
          description: "Fokus pada proyek akademik dan pengembangan diri. Membangun beberapa aplikasi web sebagai bagian dari tugas kuliah dan berpartisipasi dalam kompetisi coding.",
          tags: ["Java", "Python", "HTML/CSS", "Git"],
          archiveLabel: "ARSIP PROYEK",
          archiveTap: "Ketuk untuk Buka",
        },
        {
          year: "2024",
          badge: "AKADEMIK",
          role: "S1 INFORMATIKA",
          company: "Universitas Amikom Yogyakarta",
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
        namePlaceholder: "Nama lengkap",
        email: "Email",
        emailPlaceholder: "email@.com",
        subject: "Subjek",
        subjects: ["Kolaborasi Proyek", "Kesempatan Kerja", "Pertanyaan Umum"],
        message: "Pesan",
        messagePlaceholder: "Ceritakan tentang proyek ...",
        send: "KIRIM PESAN",
        sending: "MENGIRIM...",
        success: "Pesan berhasil dikirim!",
        error: "Gagal mengirim pesan. Silakan coba lagi.",
      },
    },
    footer: {
      copyright: `©${new Date().getFullYear()} Muhammad Hanif Hawari. Hak Cipta Dilindungi`,
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
