export interface CourseSyllabusModule {
  title: string;
  topics: string[];
}

export interface benefits{
    title:string;
    description:string;
}

export interface whyJoin{
    title:string;
    description:string;
}
export interface Course {
  slug: string;
  title: string;
  fee: string;
  shortDescription: string;
  overview: string[];
  duration: string;

  benefits: benefits[]
  whyJoin: whyJoin[];

  syllabus: CourseSyllabusModule[];
  
  cardImage: string;


  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  
}