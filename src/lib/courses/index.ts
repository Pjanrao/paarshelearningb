import { dataScienceCourse } from "./data-science";
import { sqlForDataScienceCourse } from "./sql-data-science";
import { pythonFullStackDevelopmentCourse } from "./python-full-stack";
import { salesforceCourse } from "./salesforce";
import { ethicalHackingCourse } from "./ethical-hacking";
import { projectManagerCourse} from "./project-manager"
import { softwareTestingCourse } from "./software-testing";
import { uiUxDesignCourse } from "./ui-ux-design";
import { mernStackDevelopmentCourse } from "./mern-stack-development";
import { mobileAppDevelopmentCourse } from "./mobile-app-development";
import{ kotlinDevelopmentCourse } from "./kotlin-development";
import { reactNativeDevelopmentCourse } from "./react-native-development";
import { reactDevelopmentCourse } from "./react-development";
import { fullStackWebDevelopmentCourse } from "./full-stack-web-development";
import { machineLearningCourse } from "./machine-learning";
import { apiAutomationTestingCourse } from "./api-automation-testing";
import { artificialIntelligenceCourse  } from "./artificial-intelligence"; 
import { backEndDevelopmentCourse } from "./backend-development";
import { cLanguageCourse } from "./c-language";
import { cppLanguageCourse } from "./cpp-language";
import { dataArchitectureCourse } from "./data-architecture";
import { cloudComputingCourse } from "./cloud-computing";
import { digitalMarketingCourse } from "./digital-marketing";
import { dotNetDevelopmentCourse } from "./dot-net-development";
import { flutterDevelopmentCourse } from "./flutter-development";
import { frontEndDevelopmentCourse } from "./front-end-development";
import { gameDevelopmentCourse } from "./game-development";
import { iosDevelopmentCourse } from "./ios-development";
import { javaFullStackDevelopmentCourse } from "./java-full-stack";
import { javaProgrammingCourse } from "./java-programming";
import { networkSecurityCourse } from "./network-security";
import { phpWebDevelopmentCourse } from "./php-web-development";
import { powerBiCourse } from "./power-bi";
import { pythonProgrammingCourse } from "./python-programming";
import { rustProgrammingCourse } from "./rust-programmin";
import { chatGPTForScrumMastersCourse } from "./scrum-master";
import { tableauCourse } from "./table-au";
import { wordpressDevelopmentCourse } from "./wordpress-development";
import { generativeAICourse } from "./generative-ai";
import { dataAnalyticsCourse } from "./data-analytics";
import { nlpWithDeepLearningCourse } from "./nlp-deep-learning";

export const coursesMap = {
  "data-science": dataScienceCourse,
  "sql-for-data-science": sqlForDataScienceCourse,
  "python-full-stack": pythonFullStackDevelopmentCourse,
  "salesforce-development": salesforceCourse,
  "ethical-hacking": ethicalHackingCourse,
  "project-manager": projectManagerCourse,
  "software-testing": softwareTestingCourse,
  "ui-ux-design": uiUxDesignCourse,
  "mern-stack-development" : mernStackDevelopmentCourse,
  "mobile-app-development": mobileAppDevelopmentCourse,
  "kotlin-development": kotlinDevelopmentCourse,
  "react-native-development": reactNativeDevelopmentCourse,   
  "react-development": reactDevelopmentCourse,
  "full-stack-web-development": fullStackWebDevelopmentCourse,
  "machine-learning": machineLearningCourse,
  "api-automation-testing": apiAutomationTestingCourse,
  "artificial-intelligence": artificialIntelligenceCourse,
  "backend-development": backEndDevelopmentCourse,
  "c-programming-language": cLanguageCourse,
  "cpp-language": cppLanguageCourse,
  "data-architecture": dataArchitectureCourse,
  "cloud-computing": cloudComputingCourse,  
  "digital-marketing": digitalMarketingCourse,
  "dot-net-development": dotNetDevelopmentCourse,
  "flutter-development": flutterDevelopmentCourse,
  "front-end-development": frontEndDevelopmentCourse,
  "game-development": gameDevelopmentCourse,
  "ios-development": iosDevelopmentCourse,
  "java-full-stack-development": javaFullStackDevelopmentCourse,
  "java-programming": javaProgrammingCourse,
  "network-security": networkSecurityCourse,
  "php-web-development": phpWebDevelopmentCourse,
  "power-bi": powerBiCourse,
  "python-programming": pythonProgrammingCourse,
  "rust-programming": rustProgrammingCourse,
  "chatgpt-for-scrum-masters": chatGPTForScrumMastersCourse,
  "tableau": tableauCourse,
  "wordpress-development": wordpressDevelopmentCourse,
  "generative-ai": generativeAICourse,
  "data-analytics": dataAnalyticsCourse,
  "nlp-with-deep-learning": nlpWithDeepLearningCourse,
  
};

export type CourseSlug = keyof typeof coursesMap;