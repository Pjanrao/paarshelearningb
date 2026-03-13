import { Course } from "./types";

export const kotlinDevelopmentCourse: Course = {
  slug: "kotlin-development",
  title: "Kotlin Development",
  fee: "45,000",

  shortDescription:
    "Build modern Android applications using Kotlin with hands-on projects and industry best practices.",

  overview: [
    "This Kotlin Development course is designed to provide a strong foundation in Kotlin programming along with practical Android application development. Learners start from basic programming concepts and gradually move towards building complete Android apps.",
    "The course covers Kotlin fundamentals, Android framework components, UI design, data storage, networking, and modern Android development practices using Jetpack libraries and MVVM architecture.",
    "With hands-on labs, real-world Android use cases, and deployment guidance, this program prepares learners for Android Developer roles using Kotlin."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Modern Android development",
      description:
        "Learn Kotlin, the official language for Android development, with real-world app building."
    },
    {
      title: "Hands-on Android projects",
      description:
        "Build functional Android applications from scratch using industry tools."
    },
    {
      title: "Jetpack & MVVM basics",
      description:
        "Understand modern Android architecture using ViewModel, LiveData, and Jetpack libraries."
    },
    {
      title: "Play Store deployment guidance",
      description:
        "Learn how to prepare, test, and publish Android apps to Google Play."
    }
  ],

  whyJoin: [
    {
      title: "Official Android language",
      description:
        "Kotlin is officially supported by Google and widely used in Android apps."
    },
    {
      title: "Beginner-friendly learning path",
      description:
        "Start from programming basics and progress to full Android applications."
    },
    {
      title: "Industry-relevant curriculum",
      description:
        "Covers Android Studio, APIs, storage, UI design, and deployment."
    },
    {
      title: "Practical app development",
      description:
        "Focus on real-world Android use cases, not just theory."
    },
    {
      title: "Strong career scope",
      description:
        "Prepare for roles such as Android Developer and Kotlin Developer."
    },
    {
      title: "Hands-on practice",
      description:
        "Practical exercises and mini projects reinforce every concept."
    }
  ],

  syllabus: [
  {
    title: "1. Introduction & Setup",
    topics: [
      "Course Overview & Objectives",
      "Android Ecosystem & Market Overview",
      "Installing Tools: Java JDK / Android Studio",
      "SDK & Environment Setup",
      "First Android Project: Project Structure",
      "First Android Project: Hello World App"
    ]
  },
  {
    title: "2. Kotlin Fundamentals",
    topics: [
      "Overview of Kotlin & Features",
      "Basic Syntax, Variables & Data Types",
      "Control Flow (if/else, loops, when)",
      "Functions & Parameters",
      "Collections & Arrays",
      "Null Safety & Exception Handling",
      "OOP in Kotlin (Classes, Objects, Inheritance, Interfaces)",
      "Lambdas & Higher-Order Functions"
    ]
  },
  {
    title: "3. Android Framework & App Components",
    topics: [
      "Android Architecture",
      "Activities & Lifecycle",
      "Intents & Navigation",
      "Fragments & Lifecycle",
      "Views & ViewGroups",
      "Layouts (XML & ConstraintLayout)"
    ]
  },
  {
    title: "4. UI Design & Interaction",
    topics: [
      "UI Elements (Buttons, TextViews, EditTexts)",
      "Handling User Input & Events",
      "Scrollable Lists (RecyclerView)",
      "Menus, Dialogs, Toasts & Notifications",
      "Material Design Principles"
    ]
  },
  {
    title: "5. Data Handling & Storage",
    topics: [
      "SharedPreferences",
      "SQLite Basics",
      "Room Persistence Library",
      "JSON Parsing",
      "Data Binding & View Binding"
    ]
  },
  {
    title: "6. Networking & APIs",
    topics: [
      "RESTful APIs & Web Services",
      "Retrofit & OkHttp Clients",
      "Coroutines for Async Calls",
      "Handling Responses & Errors"
    ]
  },
  {
    title: "7. Advanced Android Concepts",
    topics: [
      "Navigation Component",
      "LiveData & ViewModel (MVVM Basics)",
      "Jetpack Libraries Overview",
      "Background Services",
      "Notifications & Broadcast Receivers"
    ]
  },
  {
    title: "8. Testing, Debugging & Deployment",
    topics: [
      "Debugging Techniques",
      "Unit Testing (JUnit)",
      "UI Testing (Espresso)",
      "Preparing for Google Play Release",
      "App Publishing Checklist"
    ]
  },
  {
    title: "Practical Implementation",
    topics: [
      "Writing, compiling, and running basic Rust programs",
      "Variables, data types, mutability, and control flow exercises",
      "Functions, modules, and ownership–borrowing based programs",
      "Structs, enums, traits, and implementation blocks",
      "Error handling, generics, collections, and file I/O programs",
      "Mini projects using Rust standard library and advanced features"
    ]
  }
],

  cardImage: "/kotlin.png",

  /* =========================
     ✅ SEO OPTIMIZATION START
  ========================== */

  metaTitle:
    "Kotlin Development Course in India | Android Kotlin Training & Certification",

  metaDescription:
    "Enroll in the Kotlin Development Course at Paarshe Learning and master Android app development using Kotlin. Learn Android Studio, Jetpack, MVVM, APIs, and Play Store deployment with hands-on projects and certification.",

  keywords: [
    "Kotlin Course",
    "Kotlin Development Training",
    "Android Kotlin Course",
    "Kotlin Certification Course",
    "Android Development with Kotlin",
    "Kotlin Training in India",
    "Android App Development Course",
    "Kotlin Programming Course",
    "Android Studio Course",
    "MVVM Android Course",
    "Jetpack Android Training",
    "Mobile App Development Course",
    "Google Play Store Publishing Course",
    "Kotlin Classes",
    "Android Developer Training"
  ],

  canonicalUrl:
    "https://paarshelearning.com/courses/kotlin-development",

  ogImage: "/kotlin.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Kotlin Development Course",
    description:
      "Comprehensive Kotlin training covering Android Studio, Jetpack, MVVM, APIs, and real-world Android app development projects.",
    provider: {
      "@type": "Organization",
      name: "Paarshe Learning",
      sameAs: "https://paarshelearning.com"
    },
    offers: {
      "@type": "Offer",
      price: "45000",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock"
    }
  }

};
