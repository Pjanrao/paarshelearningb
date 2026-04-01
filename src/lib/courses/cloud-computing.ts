import { Course } from "./types";

export const cloudComputingCourse: Course = {
  slug: "cloud-computing",
  title: "Cloud Computing",
  fee: "45,000",

  shortDescription:
    "Learn cloud computing fundamentals, architecture, security, and hands-on deployment across AWS, Azure, and GCP, with DevOps automation and modern cloud practices.",

  overview: [
    "This Cloud Computing course introduces learners to the core concepts, architectures, and service models that power modern cloud platforms.",
    "Students will gain hands-on experience with virtualization, cloud storage, security, and major cloud providers including AWS, Microsoft Azure, and Google Cloud Platform.",
    "The program also covers DevOps, automation, serverless computing, containers, and emerging cloud trends, preparing learners for cloud engineer and DevOps roles."
  ],

  duration: "6 Months",

  benefits: [
    {
      title: "Multi-Cloud Knowledge",
      description:
        "Gain exposure to AWS, Azure, and Google Cloud Platform services."
    },
    {
      title: "Hands-on Cloud Labs",
      description:
        "Practice deploying VMs, storage, web apps, and security configurations."
    },
    {
      title: "DevOps & Automation Skills",
      description:
        "Learn CI/CD, Infrastructure as Code, and cloud automation tools."
    },
    {
      title: "Career-Ready Cloud Skills",
      description:
        "Curriculum aligned with cloud engineer, DevOps, and system administrator roles."
    }
  ],

  whyJoin: [
    {
      title: "Strong Cloud Fundamentals",
      description:
        "Build a solid foundation in cloud concepts, service models, and architectures."
    },
    {
      title: "Practical Cloud Experience",
      description:
        "Work with real cloud platforms and industry-standard tools."
    },
    {
      title: "Security & Governance Focus",
      description:
        "Learn cloud security best practices, IAM, and compliance fundamentals."
    },
    {
      title: "DevOps-Ready Learning Path",
      description:
        "Understand automation, CI/CD pipelines, and Infrastructure as Code."
    },
    {
      title: "Future-Oriented Topics",
      description:
        "Explore serverless, Kubernetes, cost optimization, and edge computing."
    },
    {
      title: "Beginner to Intermediate Friendly",
      description:
        "Designed for students, IT professionals, and beginners entering cloud computing."
    }
  ],

  syllabus: [
    {
      title: "Introduction to Cloud Computing",
      topics: [
        "What is cloud computing",
        "Characteristics and benefits of cloud",
        "Cloud vs traditional computing",
        "Cloud deployment models: public, private, hybrid, community",
        "Service models: IaaS, PaaS, and SaaS"
      ]
    },
    {
      title: "Cloud Computing Architecture",
      topics: [
        "Cloud reference models",
        "Core components of cloud computing",
        "Cloud ecosystem and business drivers",
        "Scalability, elasticity, and fault tolerance",
        "Multi-tenancy and resource pooling"
      ]
    },
    {
      title: "Virtualization Technology",
      topics: [
        "Introduction to virtualization",
        "Type 1 and Type 2 hypervisors",
        "Virtual machines vs containers",
        "Virtual networks and storage virtualization",
        "Load balancing and high availability",
        "Installing and configuring VMs using VirtualBox and VMware"
      ]
    },
    {
      title: "Cloud Security & Governance",
      topics: [
        "Cloud security fundamentals",
        "Identity and Access Management (IAM)",
        "Encryption in cloud environments",
        "Privacy, compliance, and legal considerations",
        "Cloud security best practices"
      ]
    },
    {
      title: "Cloud Storage & Data Management",
      topics: [
        "Cloud storage concepts",
        "Block, file, and object storage",
        "Cloud database services: SQL and NoSQL",
        "Data replication and backup strategies",
        "Content Delivery Networks (CDN)"
      ]
    },
    {
      title: "Major Cloud Platforms & Services",
      topics: [
        "AWS overview and core services",
        "EC2 virtual servers",
        "S3 cloud storage",
        "AWS IAM fundamentals",
        "Microsoft Azure VMs",
        "Azure Blob Storage",
        "Azure Functions",
        "Google Cloud Compute Engine",
        "Google Cloud Storage",
        "BigQuery analytics",
        "Hands-on labs across cloud platforms"
      ]
    },
    {
      title: "DevOps & Cloud Automation",
      topics: [
        "DevOps fundamentals",
        "CI/CD concepts and tools",
        "Infrastructure as Code (IaC)",
        "Automation in cloud deployments",
        "Monitoring and logging tools"
      ]
    },
    {
      title: "Advanced Topics & Cloud Trends",
      topics: [
        "Serverless computing and FaaS",
        "Kubernetes and container orchestration",
        "Cloud cost optimization strategies",
        "Edge and fog computing",
        "Big data and machine learning in the cloud"
      ]
    },
    {
      title: "Practical Labs & Capstone",
      topics: [
        "Create, configure, and deploy virtual machines",
        "Upload and manage data on AWS S3 and Azure Blob",
        "Deploy a simple web application on cloud platforms",
        "Implement basic cloud security and IAM policies",
        "Use DevOps tools like GitHub Actions, Jenkins, and Terraform"
      ]
    }
  ],

  cardImage: "/Cloud Computing.png",

  metaTitle: "Cloud Computing Course | AWS, Azure & DevOps Training",

  metaDescription:
    "Enroll in our Cloud Computing Course and master AWS, Microsoft Azure, cloud architecture, virtualization, DevOps fundamentals, and deployment strategies with real-world projects. 100% practical training with certification and placement support.",

  keywords: [
    "Cloud Computing Course",
    "AWS Training",
    "Microsoft Azure Course",
    "Cloud Architecture Training",
    "DevOps and Cloud Course",
    "Cloud Certification Training",
    "Infrastructure as a Service",
    "Cloud Engineer Training",
    "Best Cloud Computing Institute",
    "Cloud Course with Placement"
  ],

  canonicalUrl: "https://paarshelearning.com/courses/cloud-computing",

  ogImage: "/cloud-computing.png",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Cloud Computing Course",
    description:
      "Comprehensive Cloud Computing training covering AWS, Azure, cloud architecture, virtualization, DevOps fundamentals, and real-world deployment projects with certification.",
    provider: {
      "@type": "Organization",
      name: "Paarshe Learning",
      sameAs: "https://paarshelearning.com"
    }
  }

};

