import { Course } from "./types";

export const backEndDevelopmentCourse: Course = {
  slug: "back-end-development",
  title: "Back-End Development",
  fee: "45,000",

  shortDescription:
    "Learn how to build secure, scalable, and high-performance server-side applications using Node.js, Python (Django), Java (Spring Boot), databases, APIs, and modern deployment practices.",

  overview: [
    "This Back-End Development course focuses on designing and developing the server-side logic that powers modern web and mobile applications.",
    "Learners will work with popular back-end technologies including Node.js with Express, Python with Django, and Java with Spring Boot, along with SQL and NoSQL databases.",
    "The course emphasizes API development, authentication, security, deployment, and performance optimization, preparing learners for professional back-end and full-stack roles."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Multi-Technology Back-End Skills",
      description:
        "Gain hands-on experience with Node.js, Django, and Spring Boot."
    },
    {
      title: "API-First Development",
      description:
        "Design and build RESTful APIs used by web and mobile applications."
    },
    {
      title: "Database & Data Management Expertise",
      description:
        "Work with SQL and NoSQL databases and design scalable schemas."
    },
    {
      title: "Production-Ready Backend Knowledge",
      description:
        "Learn security, deployment, monitoring, and performance optimization."
    }
  ],

  whyJoin: [
    {
      title: "End-to-End Backend Understanding",
      description:
        "Learn everything from request handling to database persistence and deployment."
    },
    {
      title: "Industry-Relevant Frameworks",
      description:
        "Work with frameworks widely used in enterprise and startup environments."
    },
    {
      title: "Security-Focused Development",
      description:
        "Understand authentication, authorization, and API security best practices."
    },
    {
      title: "Real-World Project Experience",
      description:
        "Build backend systems similar to real production applications."
    },
    {
      title: "DevOps & Deployment Exposure",
      description:
        "Get hands-on exposure to Docker, CI/CD, and cloud deployment basics."
    },
    {
      title: "Career-Oriented Curriculum",
      description:
        "Ideal for aspiring backend developers, API developers, and full-stack engineers."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Back-End Development",
      topics: [
        "What is back-end development",
        "Client-server architecture and HTTP basics",
        "Web servers and middleware concepts",
        "API basics: REST vs SOAP",
        "Deployment and hosting overview"
      ]
    },
    {
      title: "Server-Side Languages & Runtime Environments",
      topics: [
        "JavaScript runtime with Node.js",
        "Python for backend development",
        "Java and the Spring ecosystem",
        "Language comparison and use cases"
      ]
    },
    {
      title: "Node.js and Express",
      topics: [
        "Introduction to Node.js and event-driven architecture",
        "Setting up Node.js projects and NPM modules",
        "Express.js routing and middleware",
        "REST API development and CRUD operations",
        "Handling requests, responses, and errors",
        "Asynchronous programming with callbacks, promises, and async/await",
        "MongoDB integration using Mongoose"
      ]
    },
    {
      title: "Python & Django Framework",
      topics: [
        "Introduction to Python web backends",
        "Django project setup and app structure",
        "Models, Views, and Templates (MVT)",
        "URL routing and middleware",
        "Form handling and validation",
        "Django ORM and database integration",
        "Authentication and authorization mechanisms"
      ]
    },
    {
      title: "Java & Spring Boot",
      topics: [
        "Introduction to the Spring ecosystem",
        "Spring Boot project setup and annotations",
        "Dependency injection and inversion of control",
        "Spring MVC and REST controllers",
        "Data persistence with Spring Data JPA",
        "Unit and integration testing",
        "Spring Security and JWT/OAuth basics"
      ]
    },
    {
      title: "Databases & Data Management",
      topics: [
        "SQL databases: MySQL and PostgreSQL",
        "NoSQL databases: MongoDB",
        "Designing schemas for web applications",
        "ORM concepts and query building",
        "Transactions and ACID properties"
      ]
    },
    {
      title: "Building and Testing APIs",
      topics: [
        "REST API design standards",
        "HTTP verbs and request methods",
        "API versioning strategies",
        "API documentation with Swagger and OpenAPI",
        "Testing APIs using Postman",
        "JSON handling and serialization"
      ]
    },
    {
      title: "Security & Authentication",
      topics: [
        "Authentication strategies: sessions, JWT, OAuth2",
        "Password hashing with bcrypt",
        "Role-based access control",
        "Protecting APIs using CORS and rate limiting"
      ]
    },
    {
      title: "Deployment & DevOps Basics",
      topics: [
        "Deploying backend applications to cloud platforms",
        "Introduction to Docker and containers",
        "CI/CD fundamentals using GitHub Actions and Jenkins",
        "Monitoring and logging basics"
      ]
    },
    {
      title: "Advanced Topics & Best Practices",
      topics: [
        "Introduction to microservices architecture",
        "Caching fundamentals using Redis",
        "WebSockets and real-time communication",
        "Backend performance optimization and profiling"
      ]
    },
    {
      title: "Mini Projects & Capstone",
      topics: [
        "RESTful service for an e-commerce backend",
        "User management system with authentication and profiles",
        "Booking scheduler backend with notifications",
        "Frontend and backend integration using JSON APIs",
        "Deployment and scaling demonstration"
      ]
    }
  ],

  cardImage: "/full-stack1.png",

  metaTitle: "Backend Development Course | Node.js, Express, MongoDB & APIs Training",

  metaDescription:
    "Enroll in our Backend Development Course and master Node.js, Express.js, MongoDB, REST APIs, authentication, and database management. 100% practical training with real-world projects and placement support.",

  keywords: [
    "Backend Development Course",
    "Node.js Course",
    "Express.js Training",
    "MongoDB Course",
    "REST API Development",
    "Server Side Development Course",
    "Full Stack Backend Training",
    "API Development Course",
    "Backend Developer Training",
    "Web Development Course"
  ],

  canonicalUrl: "https://paarshelearning.com/courses/backend-development",

  ogImage: "/backend-development.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Backend Development Course",
    description:
      "Comprehensive Backend Development training covering Node.js, Express.js, MongoDB, REST API development, authentication, and real-world server-side projects.",
    provider: {
      "@type": "Organization",
      name: "Paarshe Learning",
      sameAs: "https://paarshelearning.com"
    }
  }

};

