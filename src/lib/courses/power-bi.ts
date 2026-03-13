import { Course } from "./types";

export const powerBiCourse: Course = {
  slug: "power-bi",
  title: "Power BI",
  fee: "45,000",

  shortDescription:
    "Master Business Intelligence and data visualization using Power BI with hands-on dashboards, DAX, and real-world analytics projects.",

  overview: [
    "This Power BI course provides a comprehensive understanding of Business Intelligence concepts and practical skills to analyze, visualize, and share data-driven insights using Microsoft Power BI.",
    "Learners will gain hands-on experience with Power BI Desktop, Power Query for data transformation, data modeling, DAX calculations, and interactive dashboard creation aligned with real business scenarios.",
    "The program focuses on real-world analytics use cases, performance optimization, collaboration through Power BI Service, and end-to-end dashboard projects to make learners job-ready for BI and data analyst roles."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "End-to-end BI skills",
      description:
        "Learn data extraction, transformation, modeling, visualization, and sharing using Power BI."
    },
    {
      title: "Strong DAX foundation",
      description:
        "Master DAX formulas for calculations, time intelligence, and advanced analytics."
    },
    {
      title: "Hands-on dashboards",
      description:
        "Build interactive, business-ready dashboards using real-world datasets."
    },
    {
      title: "Industry-relevant projects",
      description:
        "Work on sales, finance, HR, and operations analytics use cases."
    }
  ],

  whyJoin: [
    {
      title: "Business-focused curriculum",
      description:
        "Curriculum designed around real business intelligence and analytics needs."
    },
    {
      title: "Self-service BI expertise",
      description:
        "Learn modern self-service BI techniques used by analysts and decision-makers."
    },
    {
      title: "Job-ready analytics skills",
      description:
        "Prepare for roles like Power BI Developer, BI Analyst, and Data Analyst."
    },
    {
      title: "Hands-on learning approach",
      description:
        "Practical labs, dashboards, and mini projects for every major concept."
    },
    {
      title: "Enterprise-level concepts",
      description:
        "Understand performance optimization, security, and collaboration in Power BI."
    },
    {
      title: "Portfolio-ready dashboards",
      description:
        "Create professional dashboards suitable for interviews and portfolios."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Business Intelligence & Power BI",
      topics: [
        "What is Business Intelligence (BI)?",
        "Evolution of BI: Traditional vs Self-Service BI",
        "Why Power BI in Business Analytics",
        "Power BI products: Desktop, Service, Mobile, Gateway",
        "Power BI ecosystem and architecture basics",
        "Power BI vs other BI tools (e.g., Tableau)"
      ]
    },
    {
      title: "Power BI Desktop Setup & Interface",
      topics: [
        "Installing Microsoft Power BI Desktop",
        "Getting started with Power BI workspace",
        "Fields, Visualizations, Filters, and Relationships panes",
        "Ribbon and views (Report, Data, Model)",
        "Report pages and canvas understanding",
        "Data types, fields, tables, and metadata handling"
      ]
    },
    {
      title: "Data Extraction & Power Query (ETL)",
      topics: [
        "Connecting to data sources (Excel, CSV, databases, web APIs)",
        "Power Query Editor basics",
        "Data cleaning and shaping techniques",
        "Merge, append, pivot and unpivot transformations",
        "Data type conversion and column operations",
        "Parameters and query folding concepts"
      ]
    },
    {
      title: "Data Modeling",
      topics: [
        "Understanding relationships between tables",
        "Cardinality and cross-filter direction",
        "Star schema and snowflake schema concepts",
        "Creating hierarchies (Year → Month → Day)",
        "Default summarization and role-playing dimensions",
        "Model view and table property management"
      ]
    },
    {
      title: "DAX (Data Analysis Expressions)",
      topics: [
        "Introduction to DAX and its role in Power BI",
        "Calculated columns vs measures",
        "Basic functions (SUM, AVERAGE, COUNT, DISTINCT)",
        "Logical functions (IF, SWITCH)",
        "Time intelligence (YTD, MTD, previous periods)",
        "FILTER, ALL, CALCULATE and context filtering",
        "Variables (VAR) and optimized DAX formulas"
      ]
    },
    {
      title: "Data Visualization & Reporting",
      topics: [
        "Core visuals (bar, line, area, pie, donut, cards, KPIs)",
        "Tables, matrix visuals, and combo charts",
        "Maps and geo-visuals (ArcGIS, Bing maps)",
        "Custom visuals from marketplace",
        "Slicers and filters",
        "Conditional formatting and visual interactions"
      ]
    },
    {
      title: "Reports, Dashboards & Interactivity",
      topics: [
        "Designing multi-page reports",
        "Drill-down, drill-through, and tooltips",
        "Bookmarks, buttons, and navigation",
        "Dashboards and KPIs in Power BI Service",
        "Pinning visuals and setting alerts",
        "Exporting and printing reports"
      ]
    },
    {
      title: "Power BI Service & Collaboration",
      topics: [
        "Publishing reports to Power BI Service",
        "Workspaces, apps, and datasets",
        "Sharing reports and managing permissions",
        "Scheduled refresh and gateways",
        "Row-Level Security (RLS)",
        "Application lifecycle and deployment concepts"
      ]
    },
    {
      title: "Advanced Features & Optimization",
      topics: [
        "Performance optimization techniques",
        "Usage metrics and query diagnostics",
        "Incremental refresh and large datasets",
        "Integrating R and Python scripts",
        "AI/ML insights and Copilot features",
        "Custom analytics scenarios"
      ]
    },
    {
      title: "Mini Projects & Capstone",
      topics: [
        "Sales performance dashboard",
        "Financial reporting and profit/loss dashboard",
        "Customer segmentation and market insights",
        "HR analytics: attrition and KPI tracking",
        "Inventory and operations BI use-cases",
        "Portfolio dashboards with business storytelling"
      ]
    }
  ],

  cardImage: "/power-bi.png",
  
  metaTitle: "Power BI Course | Data Analytics & Dashboard Training in India",

 metaDescription:
  "Join our Power BI Course and master Business Intelligence, DAX, data modeling, and interactive dashboard creation. Hands-on training with real-world analytics projects to prepare you for Power BI Developer and Data Analyst roles.",

 keywords: [
  "Power BI Course",
  "Power BI Training India",
  "Data Analytics Course",
  "Business Intelligence Course",
  "DAX Training",
  "Power BI Certification Course",
  "Power BI Developer Training",
  "Data Visualization Course",
  "BI Analyst Course",
  "Microsoft Power BI Training",
  "Dashboard Development Course",
  "Data Modeling Course",
  "ETL with Power Query",
  "Power BI Online Course",
  "Data Analyst Training"
],

canonicalUrl: "https://paarshelearning.com/courses/power-bi",

ogImage: "/power-bi.png",

structuredData: {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Power BI Course",
  description:
    "Comprehensive Power BI training covering data modeling, DAX, Power Query, interactive dashboards, BI reporting, and real-world analytics projects.",
  provider: {
    "@type": "Organization",
    name: "Paarshe Learning",
    sameAs: "https://paarshelearning.com"
  }
}

};
