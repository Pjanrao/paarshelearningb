import { Course } from "./types";

export const dataScienceCourse: Course = {
  slug: "data-science",
  title: "Data Science",
  fee: "75,000",

  shortDescription:
    "Become a job-ready data scientist with hands-on projects and mentor-led learning.",

  overview: [
    "This Data Science course equips learners with practical skills in data analysis, machine learning, and statistical modeling through hands-on projects and instructor-paced training. With a strong focus on real-world applications, interview preparation, and placement support, the program prepares students to start or advance their careers in data-driven roles.",
    "Throughout the 6-month program, students will engage in live sessions, complete industry-relevant projects, and receive personalized mentorship to build a strong portfolio. The curriculum is designed to take learners from foundational concepts to advanced techniques, ensuring they are job-ready upon completion.",
    "Instructor-paced live sessions with structured curriculum Hands-on projects and real-world use cases. Resume building, mock interviews & career guidance Placement-focused learning approach"

  ],

  duration: "6 Months",
  benefits: [
    { title: "Hands-on industry projects", description: "Work on real-world projects that mirror industry challenges." },
    { title: "1:1 mentor support", description: "Receive personalized guidance from experienced mentors." },
    { title: "Interview preparation", description: "Prepare for technical interviews with mock sessions and feedback." },
    { title: "Placement-focused learning", description: "Learn skills that are directly aligned with job market demands." },
  ],

  whyJoin: [
    { title: "Live instructor-led sessions", description: "Learn from experienced instructors in real-time interactive sessions." },
    { title: "Career-focused curriculum", description: "Curriculum designed to align with industry job requirements." },
    { title: "Small batch learning", description: "Small group sizes ensure personalized attention and better learning outcomes." },
    { title: "Comprehensive support", description: "Get assistance with resume building, interview prep, and job placements." },
    { title: "Flexible learning", description: "Access course materials and sessions at your convenience." },
    { title: "Community access", description: "Join a community of learners and professionals for networking and support." }
  ],

  syllabus: [
    {
      title: "Introduction to Data Science",
      topics: [
        "What is data science",
        "Data science lifecycle",
        "Difference between data analytics & data science",
        "Applications across industries",
        "Career paths & roles",
      ],
    },
    {
      title: "Python Programming for Data Science",
      topics: [
        "Python environment setup",
        "Python syntax & data types",
        "Control flow & functions",
        "Working with libraries",
        "Writing clean, reusable code",
      ],
    },
    {
      title: "Statistics & Probability",
      topics: [
        "Descriptive statistics",
        "Probability fundamentals",
        "Data distributions",
        "Hypothesis testing",
        "Statistical inference",
      ],
    },
    {
      title: "Data Collection & Data Wrangling",
      topics: [
        "Data sources (CSV, APIs, databases)",
        "Data cleaning techniques",
        "Handling missing & noisy data",
        "Feature transformation",
        "Data validation",
      ],
    },
    {
      title: "Exploratory Data Analysis (EDA)",
      topics: [
        "Data summarization",
        "Visualization techniques",
        "Correlation analysis",
        "Outlier detection",
        "Insights generation",
      ],
    },
    {
      title: "Data Visualization Tools",
      topics: [
        "Matplotlib fundamentals",
        "Seaborn basics",
        "Plotly overview",
        "Storytelling with data",
        "Visualization best practices",
      ],
    },
    {
      title: "Machine Learning Fundamentals",
      topics: [
        "Introduction to machine learning",
        "Supervised vs unsupervised learning",
        "Model training workflow",
        "Bias–variance tradeoff",
        "Evaluation metrics",
      ],
    },
    {
      title: "Supervised Learning Algorithms",
      topics: [
        "Linear & logistic regression",
        "Decision trees",
        "Random forests",
        "K-Nearest Neighbors",
        "Model evaluation",
      ],
    },
    {
      title: "Unsupervised Learning Algorithms",
      topics: [
        "Clustering concepts",
        "K-Means clustering",
        "Hierarchical clustering",
        "Dimensionality reduction",
        "Principal Component Analysis (PCA)",
      ],
    },
    {
      title: "Feature Engineering & Model Optimization",
      topics: [
        "Feature selection",
        "Feature scaling",
        "Hyperparameter tuning",
        "Cross-validation",
        "Model optimization techniques",
      ],
    },
    {
      title: "Introduction to Deep Learning",
      topics: [
        "Neural network basics",
        "Activation functions",
        "Deep learning frameworks overview",
        "Use cases of deep learning",
        "Model training basics",
      ],
    },
    {
      title: "Big Data & Data Science Tools",
      topics: [
        "Introduction to big data",
        "SQL for data science",
        "Cloud platforms overview",
        "Data pipelines basics",
        "Version control with Git",
      ],
    },
    {
      title: "Ethics, Governance & Deployment",
      topics: [
        "Ethical AI & bias",
        "Data privacy & security",
        "Model deployment basics",
        "Monitoring & maintenance",
        "Responsible AI practices",
      ],
    },
    {
      title: "Capstone Project & Industry Readiness",
      topics: [
        "End-to-end data science project",
        "Problem formulation",
        "Model building & evaluation",
        "Final presentation",
        "Resume & interview preparation",
      ],
    },
  ],
  cardImage: "/data-science.png",
  metaTitle: "Best Data Science Course | Python, Machine Learning & AI Training",

  metaDescription:
    "Join the Best Data Science Course and master Python, Machine Learning, Deep Learning, SQL, and Data Visualization with real-world projects. Industry-focused training with certification and placement support.",

  keywords: [
    "Data Science Course",
    "Best Data Science Training",
    "Python for Data Science",
    "Machine Learning Course",
    "AI and Data Science Course",
    "Data Scientist Certification",
    "Deep Learning Training",
    "Data Analytics and Data Science",
    "Data Science Course with Placement",
    "Job Ready Data Science Program"
  ],

  canonicalUrl: "https://paarshelearning.com/courses/data-science",

  ogImage: "/data-science.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Data Science Course",
    description:
      "Industry-oriented Data Science Course covering Python, Machine Learning, Deep Learning, SQL, statistics, and real-world projects with certification and placement assistance.",
    provider: {
      "@type": "Organization",
      name: "Paarshe Learning",
      sameAs: "https://paarshelearning.com"
    }
  }

};
