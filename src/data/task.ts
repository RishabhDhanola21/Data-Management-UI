export type Task = {
  id: string;
  job: string;
  submitted: string;
  status: string;
  submitter: string;
  assigned: string;
  priority: string;
  dueDate: string;
  value: string;
  url:string;
};

export const tasks: Task[] = [
  {
    id: "1",
    job: "Launch social media campaign for product X",
    submitted: "15-11-2024",
    status: "In-process",
    submitter: "Aisha Patel",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    value: "6,200,000 ₹",
    url:"www.aishapatel.com",
  },
  {
    id: "2",
    job: "Update press kit for company redesign",
    submitted: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    value: "3,500,000 ₹",
   url :"www.irfankhanp...",
  },
  {
    id: "3",
    job: "Finalize user testing feedback for app",
    submitted: "05-12-2024",
    status: "In-process",
    submitter: "Mark Johnson",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    value: "4,750,000 ₹",
    url :"www.markjohns...",
  },
  {
    id: "4",
    job: "Design new features for the website",
    submitted: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    value: "5,900,000 ₹",
   url :"www.emilygreen...",
  },
  {
    id: "5",
    job: "Prepare financial report for Q4",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    value: "2,800,000 ₹",
    url :"www.jessicabro...",
  },
];
