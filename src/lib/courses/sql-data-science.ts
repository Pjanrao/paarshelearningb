import { Course } from "./types";

export const sqlForDataScienceCourse: Course = {
  slug: "sql-for-data-science",
  title: "SQL for Data Science",
  fee: "45,000",

  shortDescription:
    "Master SQL for data querying, analysis, and reporting with real-world datasets and analytical use cases.",

  overview: [
    "The SQL for Data Science course is designed to help learners use SQL effectively for data querying, analysis, and reporting. This course focuses on how SQL is used by data scientists and analysts to extract insights from structured data.",
    "Learners will work with real-world datasets to perform filtering, aggregation, joins, and analytical queries commonly used in data-driven decision making. The course emphasizes practical SQL skills required in analytics, BI, and data science roles.",
    "By the end of the program, students will be able to write optimized SQL queries, build analytical datasets, and integrate SQL outputs with visualization and data science workflows."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Industry-relevant SQL skills",
      description: "Learn SQL exactly as used in data science and analytics roles."
    },
    {
      title: "Hands-on analytical queries",
      description: "Practice real-world querying, aggregation, and reporting scenarios."
    },
    {
      title: "Strong foundation for analytics & BI",
      description: "Prepare datasets for dashboards, reports, and data visualization tools."
    },
    {
      title: "Career-ready knowledge",
      description: "Gain SQL skills required for data analyst and data scientist roles."
    }
  ],

  whyJoin: [
    {
      title: "Data science focused SQL curriculum",
      description: "Learn SQL with a strong emphasis on analysis, not just CRUD operations."
    },
    {
      title: "Practical, hands-on approach",
      description: "Solve real analytical problems using real datasets."
    },
    {
      title: "Covers advanced SQL concepts",
      description: "Includes CTEs, window functions, and performance concepts."
    },
    {
      title: "Project-based learning",
      description: "Build SQL-based data reports and analytical outputs."
    },
    {
      title: "Beginner-friendly",
      description: "Starts from database fundamentals and progresses to advanced queries."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Databases & SQL",
      topics: [
        "What are databases and RDBMS",
        "Role of SQL in data science and analytics",
        "Relational model, tables, primary & foreign keys",
        "SQL standards and tools (MySQL, PostgreSQL, SQL Server)",
        "Installing DBMS and environment setup"
      ]
    },
    {
      title: "Basic SQL Querying",
      topics: [
        "SELECT statements and result sets",
        "Filtering data using WHERE clause",
        "Sorting results with ORDER BY",
        "Handling NULL values and data types",
        "Logical operators (AND, OR, NOT)"
      ]
    },
    {
      title: "Aggregation & Grouping",
      topics: [
        "Aggregate functions (COUNT, SUM, AVG, MIN, MAX)",
        "GROUP BY and HAVING clauses",
        "DISTINCT usage",
        "LIMIT and OFFSET",
        "Creating analytical summaries"
      ]
    },
    {
      title: "Joins & Multi-Table Queries",
      topics: [
        "INNER JOIN",
        "LEFT, RIGHT & FULL OUTER JOIN",
        "Self join and cross join",
        "Combining data across multiple tables",
        "Analytical joins for reporting"
      ]
    },
    {
      title: "Advanced SQL Techniques for Analysis",
      topics: [
        "Subqueries and nested SELECT statements",
        "Common Table Expressions (CTEs)",
        "UNION and set operations",
        "Window functions (ROW_NUMBER, RANK, PARTITION)",
        "CASE expressions and conditional logic"
      ]
    },
    {
      title: "String & Date Manipulation",
      topics: [
        "String functions (CONCAT, TRIM, UPPER, LOWER)",
        "Date and time functions",
        "Formatting query outputs"
      ]
    },
    {
      title: "Data Modification & Transactions",
      topics: [
        "INSERT, UPDATE, DELETE statements",
        "Transaction control (COMMIT, ROLLBACK)",
        "Understanding data integrity and consistency"
      ]
    },
    {
      title: "Reporting & Performance Concepts",
      topics: [
        "Creating views for reporting",
        "Indexes and performance basics",
        "Query optimization techniques",
        "Exporting query results for dashboards"
      ]
    },
    {
      title: "Practical Data Science with SQL",
      topics: [
        "SQL queries for analytical use cases",
        "Building datasets for visualization and BI tools",
        "Using SQL in data pipelines",
        "Integrating SQL results with Python/Pandas (optional)"
      ]
    },
    {
      title: "Hands-on Practice & Capstone Project",
      topics: [
        "Filtering and sorting exercises",
        "Aggregation and grouping analysis tasks",
        "Join-based analytical queries",
        "Subqueries, CTEs, and window function practice",
        "Project: Data reporting using SQL with visualization"
      ]
    }
  ],

  cardImage: "/sql-data-science.png",

  metaTitle:
  "SQL for Data Science Course | Data Querying & Reporting Training",

metaDescription:
  "Master SQL for data querying, reporting and analytics with real datasets. Learn joins, subqueries, CTEs, window functions, and reporting techniques used in data science and business intelligence roles.",

keywords: [
  "SQL for Data Science Course",
  "SQL Training for Data Analysts",
  "Data Querying Course",
  "SQL Reporting Course",
  "Advanced SQL Training",
  "SQL for Analytics",
  "SQL Joins and Subqueries",
  "Data Science SQL Course"
],

canonicalUrl:
  "https://paarshelearning.com/courses/sql-for-data-science",

ogImage: "/sql-data-science.png",

structuredData: {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "SQL for Data Science Course",
  description:
    "Comprehensive SQL course focused on data querying, analytical reporting, joins, subqueries, window functions, and real-world datasets for data science and BI roles.",
  provider: {
    "@type": "Organization",
    name: "Paarsh Elearning",
    sameAs: "https://paarshelearning.com",
  }
}

};