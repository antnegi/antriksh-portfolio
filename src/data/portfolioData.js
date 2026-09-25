/**
 * ==============================================================================
 * PORTFOLIO DATA CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * ==============================================================================
 * 
 * Verified Professional Details for Antriksh Negi
 * Client Partner | Technology & Digital Transformation
 */

export const portfolioData = {
  // 1. Personal Identity & Hero Typography
  greeting: "Hi, I'm",
  name: "Antriksh", // Displayed in large, elegant cursive script on the hero
  fullName: "Antriksh Negi",
  currentRole: "Manager - Sales / Client Partner",
  company: "Movate",
  professionalTitle: "Client Partner | Technology & Digital Transformation",

  // 2. Hero Section Bio
  heroBio: "I work with businesses to solve complex technology and digital transformation challenges through consultative partnerships and solution-led selling.",

  // 3. Availability Badge (Top Navigation Bar)
  availability: {
    status: "Client Partner",
    subtext: "Technology & Digital Transformation",
    isAvailable: true, // Shows active status dot
  },

  // 4. Navigation Labels (Header Pill)
  navigation: {
    work: "WORK",
    about: "ABOUT",
    contact: "CONTACT",
  },

  // 5. Work Section Header
  work: {
    title: "Client Engagements",
    subtitle: "Enterprise partnerships, technology solutions & transformation initiatives",
  },

  // 6. Resume & CV Settings
  resume: {
    filename: "resume.pdf", // Located in public/resume.pdf
    downloadFilename: "Antriksh-Negi-CV.pdf", // Exact download filename
    ctaLabel: "Download CV", // Primary CTA text
    title: "Curriculum Vitae",
    subtitle: "Client Partner | Technology & Digital Transformation",
    skillsSummary: "Consultative Selling, Client Relationship Management, Solution Selling, Digital Transformation, Technology Services, Account Management, Business Development, Enterprise Sales",
    statusNote: "Manager - Sales / Client Partner at Movate",
    philosophyNote: "Helping enterprises solve business and technology problems through consultative client partnerships.",
  },

  // 7. Contact Information & Socials
  contact: {
    email: "antrikshigen@gmail.com",
    phone: "+91 7980801931",
    linkedinUrl: "https://www.linkedin.com/in/the-tech-leader/",
    location: "Chandigarh, India",
    modalTitle: "Connect & Collaborate",
    modalSubtitle: "Reach out directly for enterprise partnerships, digital transformation discussions, or technology advisory.",
  },

  // 8. About Section Content
  about: {
    title: "About Me",
    subtitle: "Client Partner | Technology & Digital Transformation",
    bioParagraphs: [
      "I am a Manager - Sales / Client Partner at Movate, working at the intersection of business strategy, technology services, and digital transformation.",
      "My professional focus centers on consultative selling, solution-led engagement, and establishing trusted enterprise partnerships that help organizations solve pressing business and technology challenges.",
      "With a consultative and relationship-driven approach, I work closely with enterprise leadership to align strategic business objectives with scalable technology solutions."
    ],
    highlights: [
      { label: "Current Role", value: "Manager - Sales / Client Partner" },
      { label: "Company", value: "Movate" },
      { label: "Specialization", value: "Technology & Digital Transformation" },
      { label: "Location", value: "Chandigarh, India" },
    ],
  },

  // 9. Work & Projects (Empty array - no fictional projects)
  projects: [],
};
