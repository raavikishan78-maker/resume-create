export type TemplateLayout =
  | "sidebar-left"
  | "sidebar-right"
  | "classic-single"
  | "two-column"
  | "top-bar"
  | "minimal"
  | "bold-header"
  | "infographic"
  | "executive"
  | "creative-split";

export interface Template {
  id: string;
  name: string;
  description: string;
  profession: string;
  category: string;
  layout: TemplateLayout;
}

export interface ColorTheme {
  id: string;
  name: string;
  hex: string;
}

const LAYOUTS: TemplateLayout[] = [
  "sidebar-left",
  "sidebar-right",
  "classic-single",
  "two-column",
  "top-bar",
  "minimal",
  "bold-header",
  "infographic",
  "executive",
  "creative-split",
];

const professions: { name: string; category: string }[] = [
  // Design & Creative
  { name: "Graphic Designer", category: "Design & Creative" },
  { name: "UX Designer", category: "Design & Creative" },
  { name: "UI Designer", category: "Design & Creative" },
  { name: "Web Designer", category: "Design & Creative" },
  { name: "Product Designer", category: "Design & Creative" },
  { name: "Motion Graphics Designer", category: "Design & Creative" },
  { name: "Brand Designer", category: "Design & Creative" },
  { name: "Logo Designer", category: "Design & Creative" },
  { name: "Illustrator", category: "Design & Creative" },
  { name: "3D Artist", category: "Design & Creative" },
  { name: "Visual Artist", category: "Design & Creative" },
  { name: "Art Director", category: "Design & Creative" },
  { name: "Creative Director", category: "Design & Creative" },
  { name: "Interior Designer", category: "Design & Creative" },
  { name: "Fashion Designer", category: "Design & Creative" },
  { name: "Industrial Designer", category: "Design & Creative" },
  { name: "Packaging Designer", category: "Design & Creative" },
  { name: "Typographer", category: "Design & Creative" },
  { name: "Print Designer", category: "Design & Creative" },
  { name: "Game Artist", category: "Design & Creative" },

  // Technology & Engineering
  { name: "Software Engineer", category: "Technology" },
  { name: "Frontend Developer", category: "Technology" },
  { name: "Backend Developer", category: "Technology" },
  { name: "Full Stack Developer", category: "Technology" },
  { name: "Mobile App Developer", category: "Technology" },
  { name: "iOS Developer", category: "Technology" },
  { name: "Android Developer", category: "Technology" },
  { name: "React Developer", category: "Technology" },
  { name: "Node.js Developer", category: "Technology" },
  { name: "Python Developer", category: "Technology" },
  { name: "Data Scientist", category: "Technology" },
  { name: "Machine Learning Engineer", category: "Technology" },
  { name: "AI Engineer", category: "Technology" },
  { name: "DevOps Engineer", category: "Technology" },
  { name: "Cloud Architect", category: "Technology" },
  { name: "Cybersecurity Analyst", category: "Technology" },
  { name: "Database Administrator", category: "Technology" },
  { name: "Systems Analyst", category: "Technology" },
  { name: "QA Engineer", category: "Technology" },
  { name: "Blockchain Developer", category: "Technology" },
  { name: "Embedded Systems Engineer", category: "Technology" },
  { name: "Network Engineer", category: "Technology" },
  { name: "IT Support Specialist", category: "Technology" },

  // Marketing & Communications
  { name: "Digital Marketer", category: "Marketing" },
  { name: "Social Media Manager", category: "Marketing" },
  { name: "SEO Specialist", category: "Marketing" },
  { name: "Content Marketer", category: "Marketing" },
  { name: "Email Marketing Specialist", category: "Marketing" },
  { name: "Brand Manager", category: "Marketing" },
  { name: "Marketing Manager", category: "Marketing" },
  { name: "Growth Hacker", category: "Marketing" },
  { name: "Copywriter", category: "Marketing" },
  { name: "Content Creator", category: "Marketing" },
  { name: "PR Specialist", category: "Marketing" },
  { name: "Influencer Manager", category: "Marketing" },
  { name: "Performance Marketer", category: "Marketing" },

  // Business & Management
  { name: "Product Manager", category: "Business" },
  { name: "Project Manager", category: "Business" },
  { name: "Business Analyst", category: "Business" },
  { name: "Operations Manager", category: "Business" },
  { name: "Strategy Consultant", category: "Business" },
  { name: "Entrepreneur", category: "Business" },
  { name: "CEO / Founder", category: "Business" },
  { name: "COO", category: "Business" },
  { name: "Business Development Manager", category: "Business" },
  { name: "Account Executive", category: "Business" },
  { name: "General Manager", category: "Business" },
  { name: "Supply Chain Manager", category: "Business" },
  { name: "Procurement Manager", category: "Business" },

  // Finance & Accounting
  { name: "Financial Analyst", category: "Finance" },
  { name: "Accountant", category: "Finance" },
  { name: "Investment Banker", category: "Finance" },
  { name: "Financial Planner", category: "Finance" },
  { name: "Auditor", category: "Finance" },
  { name: "Tax Consultant", category: "Finance" },
  { name: "CFO", category: "Finance" },
  { name: "Portfolio Manager", category: "Finance" },
  { name: "Risk Analyst", category: "Finance" },
  { name: "Actuary", category: "Finance" },
  { name: "Bookkeeper", category: "Finance" },
  { name: "Credit Analyst", category: "Finance" },

  // Healthcare & Medical
  { name: "Physician", category: "Healthcare" },
  { name: "Nurse", category: "Healthcare" },
  { name: "Surgeon", category: "Healthcare" },
  { name: "Pharmacist", category: "Healthcare" },
  { name: "Dentist", category: "Healthcare" },
  { name: "Physical Therapist", category: "Healthcare" },
  { name: "Mental Health Counselor", category: "Healthcare" },
  { name: "Radiologist", category: "Healthcare" },
  { name: "Medical Researcher", category: "Healthcare" },
  { name: "Public Health Specialist", category: "Healthcare" },
  { name: "Nutritionist", category: "Healthcare" },
  { name: "Veterinarian", category: "Healthcare" },
  { name: "Optometrist", category: "Healthcare" },

  // Education & Academia
  { name: "Teacher", category: "Education" },
  { name: "Professor", category: "Education" },
  { name: "Tutor", category: "Education" },
  { name: "School Counselor", category: "Education" },
  { name: "Curriculum Designer", category: "Education" },
  { name: "E-Learning Developer", category: "Education" },
  { name: "Academic Researcher", category: "Education" },
  { name: "School Principal", category: "Education" },
  { name: "Training Specialist", category: "Education" },

  // Legal & Compliance
  { name: "Lawyer", category: "Legal" },
  { name: "Paralegal", category: "Legal" },
  { name: "Compliance Officer", category: "Legal" },
  { name: "Legal Consultant", category: "Legal" },
  { name: "Judge", category: "Legal" },
  { name: "Contract Specialist", category: "Legal" },
  { name: "Intellectual Property Specialist", category: "Legal" },

  // Engineering
  { name: "Mechanical Engineer", category: "Engineering" },
  { name: "Civil Engineer", category: "Engineering" },
  { name: "Electrical Engineer", category: "Engineering" },
  { name: "Chemical Engineer", category: "Engineering" },
  { name: "Aerospace Engineer", category: "Engineering" },
  { name: "Structural Engineer", category: "Engineering" },
  { name: "Environmental Engineer", category: "Engineering" },
  { name: "Manufacturing Engineer", category: "Engineering" },
  { name: "Petroleum Engineer", category: "Engineering" },

  // Sales
  { name: "Sales Manager", category: "Sales" },
  { name: "Sales Representative", category: "Sales" },
  { name: "Account Manager", category: "Sales" },
  { name: "Sales Executive", category: "Sales" },
  { name: "Business Development Rep", category: "Sales" },
  { name: "Real Estate Agent", category: "Sales" },
  { name: "Insurance Sales Agent", category: "Sales" },

  // Human Resources
  { name: "HR Manager", category: "Human Resources" },
  { name: "Recruiter", category: "Human Resources" },
  { name: "Talent Acquisition Specialist", category: "Human Resources" },
  { name: "Payroll Specialist", category: "Human Resources" },
  { name: "HR Business Partner", category: "Human Resources" },
  { name: "Learning & Development Specialist", category: "Human Resources" },

  // Media & Entertainment
  { name: "Photographer", category: "Media & Entertainment" },
  { name: "Videographer", category: "Media & Entertainment" },
  { name: "Film Director", category: "Media & Entertainment" },
  { name: "Video Editor", category: "Media & Entertainment" },
  { name: "Sound Engineer", category: "Media & Entertainment" },
  { name: "Journalist", category: "Media & Entertainment" },
  { name: "Podcast Producer", category: "Media & Entertainment" },
  { name: "Game Designer", category: "Media & Entertainment" },
  { name: "Animator", category: "Media & Entertainment" },
  { name: "Screenwriter", category: "Media & Entertainment" },
  { name: "Author / Writer", category: "Media & Entertainment" },
  { name: "Music Producer", category: "Media & Entertainment" },

  // Hospitality & Tourism
  { name: "Hotel Manager", category: "Hospitality" },
  { name: "Chef", category: "Hospitality" },
  { name: "Event Planner", category: "Hospitality" },
  { name: "Travel Agent", category: "Hospitality" },
  { name: "Restaurant Manager", category: "Hospitality" },
  { name: "Barista", category: "Hospitality" },
  { name: "Tour Guide", category: "Hospitality" },

  // Science & Research
  { name: "Biologist", category: "Science" },
  { name: "Chemist", category: "Science" },
  { name: "Physicist", category: "Science" },
  { name: "Data Analyst", category: "Science" },
  { name: "Environmental Scientist", category: "Science" },
  { name: "Geologist", category: "Science" },
  { name: "Lab Technician", category: "Science" },

  // Architecture & Construction
  { name: "Architect", category: "Architecture" },
  { name: "Urban Planner", category: "Architecture" },
  { name: "Landscape Architect", category: "Architecture" },
  { name: "Construction Manager", category: "Architecture" },
  { name: "Quantity Surveyor", category: "Architecture" },
  { name: "CAD Technician", category: "Architecture" },

  // Social Work & Non-Profit
  { name: "Social Worker", category: "Social Work" },
  { name: "Non-Profit Manager", category: "Social Work" },
  { name: "Community Organizer", category: "Social Work" },
  { name: "Fundraiser", category: "Social Work" },
  { name: "Grant Writer", category: "Social Work" },

  // Logistics & Transport
  { name: "Logistics Manager", category: "Logistics" },
  { name: "Warehouse Manager", category: "Logistics" },
  { name: "Fleet Manager", category: "Logistics" },
  { name: "Supply Chain Analyst", category: "Logistics" },
  { name: "Import/Export Coordinator", category: "Logistics" },

  // Administrative
  { name: "Executive Assistant", category: "Administrative" },
  { name: "Office Manager", category: "Administrative" },
  { name: "Administrative Coordinator", category: "Administrative" },
  { name: "Receptionist", category: "Administrative" },
  { name: "Data Entry Specialist", category: "Administrative" },
];

const layoutDescriptions: Record<TemplateLayout, string> = {
  "sidebar-left": "Elegant left sidebar with photo and contact details",
  "sidebar-right": "Modern right sidebar with skills panel",
  "classic-single": "Traditional single-column professional layout",
  "two-column": "Balanced two-column layout for full profiles",
  "top-bar": "Bold colored header bar with two-column body",
  "minimal": "Clean minimal whitespace-focused design",
  "bold-header": "Bold name header with circular photo accent",
  "infographic": "Visual infographic-style with skill bars",
  "executive": "Premium executive-grade serif typography",
  "creative-split": "Dynamic diagonal-split creative layout",
};

function generateTemplates(): Template[] {
  const result: Template[] = [];
  professions.forEach((prof) => {
    LAYOUTS.forEach((layout) => {
      const id = `${prof.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${layout}`;
      result.push({
        id,
        name: `${prof.name} — ${layout.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}`,
        description: layoutDescriptions[layout],
        profession: prof.name,
        category: prof.category,
        layout,
      });
    });
  });
  return result;
}

export const templates: Template[] = generateTemplates();

export const categories: string[] = [
  "All",
  ...Array.from(new Set(professions.map((p) => p.category))),
];

export const colorThemes: ColorTheme[] = [
  { id: "blue", name: "Professional Blue", hex: "#2563eb" },
  { id: "emerald", name: "Growth Emerald", hex: "#059669" },
  { id: "slate", name: "Neutral Slate", hex: "#475569" },
  { id: "violet", name: "Creative Violet", hex: "#7c3aed" },
  { id: "rose", name: "Bold Rose", hex: "#e11d48" },
  { id: "amber", name: "Warm Amber", hex: "#d97706" },
  { id: "teal", name: "Ocean Teal", hex: "#0d9488" },
  { id: "orange", name: "Energy Orange", hex: "#ea580c" },
  { id: "indigo", name: "Deep Indigo", hex: "#4338ca" },
  { id: "pink", name: "Modern Pink", hex: "#db2777" },
  { id: "cyan", name: "Tech Cyan", hex: "#0891b2" },
  { id: "lime", name: "Fresh Lime", hex: "#65a30d" },
];

export function getTemplateById(id: string): Template {
  return templates.find((t) => t.id === id) || templates[0];
}
