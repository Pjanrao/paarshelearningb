import { Course } from "./types";

export const rustProgrammingCourse: Course = {
  slug: "rust-programming",
  title: "Rust Programming Language",
  fee: "45,000",

  shortDescription:
    "Master Rust programming with a strong focus on performance, memory safety, concurrency, and real-world system-level applications.",

  overview: [
    "This Rust Programming course is designed to introduce learners to Rust as a modern, system-level programming language focused on safety, speed, and concurrency without a garbage collector. The program covers Rust fundamentals, ownership model, and advanced language features used in real-world applications.",
    "Throughout the course, students will gain hands-on experience with Rust syntax, ownership and borrowing, error handling, concurrency, and memory management. Emphasis is placed on writing safe, efficient, and scalable code using Rust’s unique programming paradigm.",
    "With practical exercises, mini projects, and a capstone application, learners will be prepared for roles involving system programming, backend services, high-performance applications, and modern software development using Rust."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "System-level programming expertise",
      description:
        "Learn to build fast, memory-safe, and reliable applications without garbage collection."
    },
    {
      title: "Strong ownership & memory safety skills",
      description:
        "Master Rust’s ownership, borrowing, and lifetime concepts that prevent common bugs."
    },
    {
      title: "Concurrency without data races",
      description:
        "Understand safe concurrency patterns using Rust’s powerful type system."
    },
    {
      title: "Hands-on projects & real use cases",
      description:
        "Work on command-line tools, system utilities, and performance-focused applications."
    }
  ],

  whyJoin: [
    {
      title: "Modern & in-demand language",
      description:
        "Rust is widely used in system software, cloud infrastructure, blockchain, and backend services."
    },
    {
      title: "Beginner to advanced learning path",
      description:
        "Structured curriculum suitable for programmers transitioning from C/C++, Java, or other languages."
    },
    {
      title: "Focus on performance & safety",
      description:
        "Learn how Rust achieves speed comparable to C/C++ with guaranteed memory safety."
    },
    {
      title: "Practical, project-based approach",
      description:
        "Every concept is reinforced with hands-on exercises and mini projects."
    },
    {
      title: "Industry-relevant tooling",
      description:
        "Gain experience with Cargo, Rust toolchain, and popular third-party crates."
    },
    {
      title: "Career-ready skills",
      description:
        "Prepare for roles in systems programming, backend engineering, and performance-critical software."
    }
  ],

  syllabus: [
    {
      title: "Introduction & Setup",
      topics: [
        "What is Rust and system-level programming overview",
        "Rust history, features, and motivations",
        "Comparison with C, C++, Java, and other languages",
        "Installing Rust toolchain using rustup",
        "Using Cargo as build tool and package manager",
        "IDE setup with VSCode, IntelliJ Rust, and Rust Analyzer"
      ]
    },
    {
      title: "Basic Language Concepts",
      topics: [
        "Rust syntax and program structure",
        "Comments, formatting, and compiling",
        "Variables, mutability, scope, and shadowing",
        "Scalar and compound data types",
        "Constants and static variables",
        "Expressions vs statements",
        "Printing and basic input/output"
      ]
    },
    {
      title: "Control Flow",
      topics: [
        "Conditional statements (if, else)",
        "Match expressions and pattern matching",
        "Loops: loop, while, for",
        "Early exit and conditional expressions",
        "Flow control using enums and patterns"
      ]
    },
    {
      title: "Functions & Modules",
      topics: [
        "Defining functions",
        "Function parameters and return types",
        "Modules, packages, and crates",
        "Visibility and pub keyword",
        "Cargo workspace and project structure"
      ]
    },
    {
      title: "Ownership, Borrowing & Lifetimes",
      topics: [
        "Ownership rules and Rust memory model",
        "Borrowing and references",
        "Mutable and immutable references",
        "Lifetimes and lifetime elision rules",
        "Move vs Copy semantics",
        "Slices and string basics"
      ]
    },
    {
      title: "Structs and Enums",
      topics: [
        "Defining and using structs",
        "Tuple structs and unit structs",
        "Enums and matching with enums",
        "Option and Result types",
        "Data modeling using enums"
      ]
    },
    {
      title: "Traits and Generics",
      topics: [
        "Generic functions and data types",
        "Trait definitions and implementations",
        "Trait bounds",
        "Associated types",
        "Default implementations",
        "Using derive for common traits"
      ]
    },
    {
      title: "Error Handling",
      topics: [
        "panic! macro and error handling concepts",
        "Result type and pattern matching",
        "Error propagation using ? operator",
        "Creating custom error types",
        "Logging and debugging basics"
      ]
    },
    {
      title: "Collections & Iterators",
      topics: [
        "Standard collections: Vec, String, HashMap",
        "Iterator trait and iterator patterns",
        "Functional programming with iterators",
        "Closures and anonymous functions"
      ]
    },
    {
      title: "Smart Pointers & Memory Management",
      topics: [
        "Box pointers",
        "Reference counting with Rc and Arc",
        "Interior mutability using RefCell",
        "Avoiding reference cycles",
        "Comparison with manual memory management"
      ]
    },
    {
      title: "Concurrency",
      topics: [
        "Safe concurrency principles in Rust",
        "Threads and std::thread",
        "Shared state concurrency",
        "Mutex and message passing",
        "Send and Sync traits"
      ]
    },
    {
      title: "Advanced Topics",
      topics: [
        "Asynchronous programming with async/await",
        "Macros",
        "Unsafe Rust and FFI (Foreign Function Interface)",
        "Testing and benchmarking",
        "Cargo features and build profiles",
        "Documentation using rustdoc"
      ]
    },
    {
      title: "Project Work & Applications",
      topics: [
        "Building command-line applications",
        "Creating system utility tools",
        "Basic web or network services using Rust",
        "Performance benchmarking and optimization",
        "Using third-party crates like Serde and Tokio"
      ]
    }
  ],

  cardImage: "/rust.png",

  metaTitle:
  "Rust Programming Course | High-Performance & System-Level Applications",

metaDescription:
  "Learn Rust programming for system-level and performance-oriented applications. Master Rust fundamentals, memory safety, concurrency, and build high-performance software with hands-on projects.",

keywords: [
  "Rust Programming Course",
  "Rust Training",
  "Rust System Programming",
  "Memory Safe Programming",
  "Rust Concurrency Course",
  "High Performance Programming",
  "Rust Developer Training",
  "Rust Backend Development"
],

canonicalUrl:
  "https://paarshelearning.com/courses/rust-programming",

ogImage: "/rust.png",

structuredData: {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Rust Programming Course",
  description:
    "Comprehensive Rust programming course covering memory safety, concurrency, ownership model, and high-performance system-level applications.",
  provider: {
    "@type": "Organization",
    name: "Paarsh Elearning",
    sameAs: "https://paarshelearning.com",
  }
}

};
