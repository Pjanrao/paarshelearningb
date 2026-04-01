import { Course } from "./types";

export const salesforceCourse: Course = {
  slug: "salesforce-development",
  title: "Salesforce Development",
  fee: "45,000",

  shortDescription:
    "Become a job-ready Salesforce Developer with hands-on CRM customization, automation, and real-world projects.",

  overview: [
    "This Salesforce Development course is designed to provide learners with a strong foundation in CRM concepts, Salesforce architecture, and end-to-end application development on the Salesforce platform. The program focuses on both declarative and programmatic development approaches used in real-world Salesforce implementations.",
    "Throughout the course, students gain hands-on experience with Salesforce configuration, automation tools, Apex programming, Lightning Web Components (LWC), and integrations. With practical labs, capstone projects, and industry best practices, learners build the skills required for Salesforce Administrator and Developer roles.",
    "Instructor-led live sessions, real-world CRM use cases, hands-on projects, interview preparation, and placement-focused learning ensure students are job-ready upon course completion.",
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Hands-on Salesforce projects",
      description:
        "Work on real-world CRM customization, automation, and Salesforce development projects.",
    },
    {
      title: "Declarative & programmatic learning",
      description:
        "Learn both no-code tools like Flows and advanced coding using Apex and LWC.",
    },
    {
      title: "1:1 mentor support",
      description:
        "Get personalized guidance from experienced Salesforce professionals.",
    },
    {
      title: "Interview & certification prep",
      description:
        "Prepare for Salesforce Admin and Developer interviews with mock sessions.",
    },
  ],

  whyJoin: [
    {
      title: "Live instructor-led sessions",
      description:
        "Interactive live classes conducted by certified Salesforce experts.",
    },
    {
      title: "Industry-aligned curriculum",
      description:
        "Curriculum designed to match real-world Salesforce job requirements.",
    },
    {
      title: "Hands-on automation & coding",
      description:
        "Build workflows, flows, Apex classes, and Lightning Web Components.",
    },
    {
      title: "Real-world CRM use cases",
      description:
        "Solve practical business problems using Salesforce CRM solutions.",
    },
    {
      title: "Small batch learning",
      description:
        "Limited batch sizes ensure better interaction and personal attention.",
    },
    {
      title: "Career & placement support",
      description:
        "Resume building, mock interviews, and job placement assistance.",
    },
  ],

  syllabus: [
    {
      title: "Introduction to Salesforce & CRM Fundamentals",
      topics: [
        "What is CRM and why Salesforce is widely used",
        "Salesforce overview, editions, licenses, and multi-tenant architecture",
        "Business use cases for CRM customization and automation",
      ],
    },
    {
      title: "Salesforce Architecture & Environment Setup",
      topics: [
        "Salesforce platform basics and org setup",
        "Developer Edition configuration",
        "Salesforce UI navigation and setup menu",
        "Sandbox environments and release management",
      ],
    },
    {
      title: "Data Modelling: Objects, Fields & Relationships",
      topics: [
        "Standard vs custom objects",
        "Field types and field-level security",
        "Lookup, master-detail, and many-to-many relationships",
        "Schema Builder usage",
      ],
    },
    {
      title: "Security Model & Access Control",
      topics: [
        "Profiles, roles, and permission sets",
        "Sharing rules and organization-wide defaults",
        "Record types and login access policies",
        "Manual sharing and data access control",
      ],
    },
    {
      title: "Declarative Customization & UI Configuration",
      topics: [
        "Page layouts and record types",
        "Compact layouts and Lightning App Builder",
        "Custom apps, tabs, and navigation customization",
      ],
    },
    {
      title: "Workflow Automation & Process Builder",
      topics: [
        "Workflow rules, criteria, and actions",
        "Email alerts, tasks, and field updates",
        "Approval processes in Salesforce",
      ],
    },
    {
      title: "Salesforce Flow & Advanced Automation",
      topics: [
        "Introduction to Flow Builder",
        "Record-triggered and scheduled flows",
        "Screen flows and auto-launched flows",
        "Automation best practices",
      ],
    },
    {
      title: "Reports, Dashboards & Analytics",
      topics: [
        "Creating custom reports and dashboards",
        "Report types, filters, and formulas",
        "Dynamic dashboards and analytics snapshots",
      ],
    },
    {
      title: "Apex Programming Fundamentals",
      topics: [
        "Introduction to Apex and Developer Console",
        "Object-oriented programming concepts in Apex",
        "Variables, classes, methods, and collections",
      ],
    },
    {
      title: "SOQL, SOSL & Data Handling",
      topics: [
        "Writing SOQL queries and SOSL searches",
        "Relationship queries and query filters",
        "DML operations and data handling",
      ],
    },
    {
      title: "Triggers & Asynchronous Apex",
      topics: [
        "Apex triggers and execution context",
        "Trigger frameworks and best practices",
        "Future methods, Queueable, and Batch Apex",
      ],
    },
    {
      title: "Lightning Web Components (LWC) Development",
      topics: [
        "Introduction to Lightning Web Components",
        "Component structure and HTML/JavaScript basics",
        "Data binding and component communication",
      ],
    },
    {
      title: "Integration & APIs",
      topics: [
        "Salesforce REST and SOAP APIs",
        "External system integration use cases",
        "Authentication and API data exchange patterns",
      ],
    },
    {
      title: "Deployment, Testing & Real-World Projects",
      topics: [
        "Writing unit tests and testing best practices",
        "Deployment using Change Sets and Salesforce DX",
        "Capstone project: CRM customization with automation and code",
      ],
    },
  ],
  
  cardImage: "/salesforce.png",

  metaTitle:
  "Salesforce Development Course | CRM Customization, Apex & LWC Training",

metaDescription:
  "Join our Salesforce Development Course and master CRM customization, automation tools, Apex programming, Lightning Web Components, integrations, and real-world projects. 100% practical training with placement support.",

keywords: [
  "Salesforce Development Course",
  "Salesforce Developer Training",
  "Salesforce CRM Course",
  "Apex Programming Training",
  "Lightning Web Components Course",
  "Salesforce Admin Course",
  "Salesforce Automation Training",
  "CRM Development Course"
],

canonicalUrl:
  "https://paarshelearning.com/courses/salesforce-development",

ogImage: "/salesforce.png",

structuredData: {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Salesforce Development Course",
  description:
    "Master Salesforce CRM customization, Apex programming, Lightning Web Components, automation tools, and integrations with real-world projects.",
  provider: {
    "@type": "Organization",
    name: "Paarsh elearning",
    sameAs: "https://paarshelearning.com",
  }
}

};
