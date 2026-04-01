import { Course } from "./types";

export const dataArchitectureCourse: Course = {
  slug: "data-architecture",
  title: "Data Architecture",
  fee: "45,000",

  shortDescription:
    "Learn how to design scalable, reliable, and governed data architectures that support analytics, reporting, and AI-driven decision making in modern organizations.",

  overview: [
    "This Data Architecture course provides a deep understanding of how enterprise data systems are designed, structured, and governed to support analytics, business intelligence, and AI initiatives.",
    "Learners will explore data modeling, data warehousing, ETL/ELT pipelines, modern lakehouse architectures, and cloud-based data platforms.",
    "The program emphasizes real-world architectural patterns, data governance, quality frameworks, and hands-on projects to prepare learners for data architect, analytics engineer, and data engineering roles."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "End-to-End Data Architecture Skills",
      description:
        "Understand data flow from source systems to analytics and reporting layers."
    },
    {
      title: "Modern & Cloud-Based Architectures",
      description:
        "Learn lakehouse, medallion architecture, and cloud-native data pipelines."
    },
    {
      title: "Strong Data Modeling Foundation",
      description:
        "Master dimensional modeling, schemas, and performance optimization techniques."
    },
    {
      title: "Enterprise Governance Focus",
      description:
        "Gain knowledge of data quality, governance, metadata, and compliance."
    }
  ],

  whyJoin: [
    {
      title: "Architect-Level Understanding",
      description:
        "Move beyond tools and learn how to design scalable data systems."
    },
    {
      title: "Analytics & AI Readiness",
      description:
        "Design architectures that support BI, advanced analytics, and AI workloads."
    },
    {
      title: "Industry-Standard Practices",
      description:
        "Learn Kimball, Inmon, ETL/ELT, OLAP, and lakehouse design patterns."
    },
    {
      title: "Hands-on Architecture Projects",
      description:
        "Apply concepts through real-world data warehouse and pipeline designs."
    },
    {
      title: "Tool-Agnostic Approach",
      description:
        "Concept-focused learning applicable across AWS, Azure, and GCP platforms."
    },
    {
      title: "Career-Oriented Curriculum",
      description:
        "Ideal for data analysts, engineers, BI professionals, and aspiring data architects."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Data Architecture",
      topics: [
        "What is data architecture",
        "Role of data architecture in analytics and AI",
        "Structured, semi-structured, and unstructured data",
        "Relational vs non-relational systems",
        "Data lifecycle in organizations"
      ]
    },
    {
      title: "Data Modeling Fundamentals",
      topics: [
        "Conceptual, logical, and physical data models",
        "Entity-Relationship (ER) modeling",
        "Dimensional modeling overview",
        "Star schema and snowflake schema",
        "Fact and dimension tables",
        "Slowly changing dimensions (SCD)",
        "Normalization vs denormalization",
        "Data dictionary and metadata concepts"
      ]
    },
    {
      title: "Data Warehouse Architecture",
      topics: [
        "What is a data warehouse",
        "Batch vs real-time analytics systems",
        "Staging, integration, and presentation layers",
        "Three-tier data warehouse architecture",
        "Operational Data Store (ODS)",
        "Data marts",
        "OLTP vs OLAP systems",
        "Metadata repositories"
      ]
    },
    {
      title: "ETL / ELT Concepts",
      topics: [
        "ETL vs ELT processes",
        "Data extraction from heterogeneous sources",
        "Data transformation and enrichment",
        "Batch vs incremental loading strategies",
        "Change data capture (CDC)",
        "ETL tools overview: Talend, SSIS, Informatica, dbt",
        "Scheduling and workflow orchestration"
      ]
    },
    {
      title: "Data Warehousing Design & Implementation",
      topics: [
        "Data warehouse development lifecycle",
        "Kimball vs Inmon architecture approaches",
        "Schema design for performance",
        "Data cubes and multidimensional models",
        "OLAP operations: slice, dice, drill-down and roll-up",
        "Partitioning and indexing strategies",
        "Data quality and governance practices"
      ]
    },
    {
      title: "Data Pipelines & Modern Architectures",
      topics: [
        "Fundamentals of data pipelines",
        "Batch vs real-time pipelines",
        "Pipeline tools: Kafka, NiFi, Airflow",
        "Medallion and lakehouse architecture",
        "Cloud data pipelines on AWS, Azure, and GCP",
        "Pipeline monitoring, error handling, and retries"
      ]
    },
    {
      title: "Big Data & Lakehouse Concepts",
      topics: [
        "Data lakes vs data warehouses",
        "Lakehouse fundamentals",
        "Delta Lake, Apache Iceberg, and Apache Hudi",
        "Integration with warehouse systems",
        "Data cataloging and governance",
        "Security and compliance considerations"
      ]
    },
    {
      title: "Data Governance & Quality",
      topics: [
        "Importance of data governance",
        "Data quality frameworks",
        "Master data management (MDM)",
        "Data lineage and metadata management",
        "Regulatory compliance and GDPR basics"
      ]
    },
    {
      title: "Tools & Platforms",
      topics: [
        "SQL and relational database systems",
        "Data modeling tools: ERwin and PowerDesigner",
        "ETL tools: Talend and SSIS",
        "Workflow orchestration using Airflow",
        "Cloud services: AWS Glue and Azure Data Factory",
        "Data warehouse platforms: Redshift, Snowflake, BigQuery"
      ]
    },
    {
      title: "Mini Projects & Capstone",
      topics: [
        "Design a data warehouse for business requirements",
        "Build ETL/ELT pipelines from real data sources",
        "Implement staging and presentation layers",
        "Model and optimize analytics schemas",
        "Document data architecture and governance plan"
      ]
    }
  ],

  cardImage: "/data-science.png",

  metaTitle: "Data Architecture Course | Data Modeling, Warehousing & Big Data Training",

  metaDescription:
    "Enroll in our Data Architecture Course and master data modeling, data warehousing, ETL processes, database design, and big data fundamentals. 100% practical training with real-world projects and industry-focused curriculum.",

  keywords: [
    "Data Architecture Course",
    "Data Modeling Training",
    "Data Warehousing Course",
    "ETL Training",
    "Big Data Architecture",
    "Database Design Course",
    "Data Engineer Training",
    "Cloud Data Architecture",
    "Data Management Course",
    "Enterprise Data Architecture"
  ],

  canonicalUrl: "https://paarshelearning.com/courses/data-architecture",

  ogImage: "/data-architecture.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Data Architecture Course",
    description:
      "Comprehensive Data Architecture training covering data modeling, data warehousing, ETL processes, database systems, and big data concepts with real-world projects.",
    provider: {
      "@type": "Organization",
      name: "Paarshe Learning",
      sameAs: "https://paarshelearning.com"
    }
  }
};

