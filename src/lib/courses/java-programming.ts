import { Course } from "./types";

export const javaProgrammingCourse: Course = {
  slug: "java-programming",
  title: "Java Programming",
  fee: "45,000",

  shortDescription:
    "Master core Java programming concepts with object-oriented principles, collections, multithreading, and real-world projects.",

  overview: [
    "This Java Programming course is designed to build a strong foundation in core Java concepts, object-oriented programming, and modern Java features used in enterprise and application development.",
    "Learners start from Java fundamentals and gradually progress through OOP, collections, exception handling, multithreading, file I/O, and database connectivity using JDBC.",
    "The course emphasizes hands-on coding, problem-solving, and real-world use cases, preparing learners for Java Developer roles and backend development careers."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Strong programming foundation",
      description:
        "Build solid fundamentals in Java syntax, logic building, and object-oriented programming."
    },
    {
      title: "Industry-relevant concepts",
      description:
        "Learn collections, multithreading, JDBC, and modern Java features."
    },
    {
      title: "Hands-on coding & projects",
      description:
        "Practice through mini projects, real-world problems, and case studies."
    },
    {
      title: "Career-ready skills",
      description:
        "Prepare for Java Developer, Backend Developer, and Software Engineer roles."
    }
  ],

  whyJoin: [
    {
      title: "Beginner-friendly approach",
      description:
        "Step-by-step learning path starting from Java basics."
    },
    {
      title: "OOP-focused curriculum",
      description:
        "Deep understanding of classes, inheritance, polymorphism, and abstraction."
    },
    {
      title: "Practical coding exposure",
      description:
        "Hands-on exercises and real-world programming scenarios."
    },
    {
      title: "Modern Java features",
      description:
        "Learn Java 8+ features like lambdas, streams, and functional programming basics."
    },
    {
      title: "Backend & enterprise readiness",
      description:
        "Covers JDBC, servlets basics, and REST API concepts."
    },
    {
      title: "Project-based learning",
      description:
        "Apply concepts through console, GUI, and real-world projects."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Java",
      topics: [
        "What is Java — history and features",
        "Java editions (SE, EE, ME)",
        "JDK, JRE, and JVM architecture",
        "Writing and running Java programs",
        "Compiling and executing Java programs"
      ]
    }
  ],

  cardImage: "/corejava.png",
  
  metaTitle:
    "Java Programming Course in India | Core Java Training & Certification",

  metaDescription:
    "Enroll in the Java Programming Course at Paarshe Learning and master Core Java, OOP, Collections, Multithreading, JDBC, and Java 8 features. Hands-on training with real-world projects and certification for Java Developer careers.",

  keywords: [
    "Java Programming Course",
    "Core Java Course",
    "Java Training in India",
    "Java Certification Course",
    "OOP in Java Course",
    "Java Developer Training",
    "Backend Java Course",
    "JDBC Training",
    "Java 8 Course",
    "Multithreading in Java",
    "Java Classes for Beginners",
    "Software Development Course Java",
    "Enterprise Java Training",
    "Java Course with Projects",
    "Programming Course in Java"
  ],

  canonicalUrl:
    "https://paarshelearning.com/courses/java-programming",

  ogImage: "/corejava.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Java Programming Course",
    description:
      "Comprehensive Core Java training covering OOP, Collections, Multithreading, JDBC, and real-world project development.",
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
