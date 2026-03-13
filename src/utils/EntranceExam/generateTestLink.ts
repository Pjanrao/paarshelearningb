// utils/EntranceExam/generateTestLink.js
import { customAlphabet } from "nanoid";

export const generateTestLink = (): string => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  const testId = nanoid();
  return testId;
};

export const getBrowserInfo = () => {
  if (typeof window === "undefined") return {
    name: "Server",
    version: "N/A",
    platform: "Node.js"
  };

  const ua = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";

  if (ua.includes("Chrome")) {
    browserName = "Chrome";
    browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (ua.includes("Firefox")) {
    browserName = "Firefox";
    browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (ua.includes("Safari")) {
    browserName = "Safari";
    browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
  } else if (ua.includes("Edge")) {
    browserName = "Edge";
    browserVersion = ua.match(/Edge\/([0-9.]+)/)?.[1] || "Unknown";
  }

  return {
    name: browserName,
    version: browserVersion,
    platform: navigator.platform,
  };
};

