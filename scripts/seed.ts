import connectDB from "../lib/db";
import "@/lib/models";
import { Board, Column, JobApplication } from "../lib/models";

const USER_ID = "6a01cc266f448405a75df47a"; // Replace with a valid user ID from your database

const SAMPLE_JOBS = [
  // Wish List
  {
    company: "MU Company",
    position: "Software Engineer",
    location: "New York, NY",
    tags: "JavaScript, React",
    description: "A great opportunity to work with a dynamic team.",
    notes: "Follow up in 2 weeks.",
    jobUrl: "https://www.mucompany.com/careers/12345",
    salary: "$100,000 - $120,000",
  },
  {
    company: "Tech Innovators",
    position: "Frontend Developer",
    location: "San Francisco, CA",
    tags: "HTML, CSS, Vue.js",
    description:
      "Join our innovative team to build cutting-edge web applications.",
    notes: "Applied on 2024-06-01.",
    jobUrl: "https://www.techinnovators.com/jobs/67890",
    salary: "$90,000 - $110,000",
  },
  {
    company: "Creative Solutions",
    position: "UI/UX Designer",
    location: "Remote",
    tags: ["TypeScript", "React", "Next.js"],
    description: "Work with unqiue purpose and creative mind.",
    jobUrl: "https://www.creativesolutions.com",
    salary: "$60,000 - $100,000",
  },
  {
    company: "Danone",
    position: "DevOps Engineer",
    location: "Paris, France",
    tags: ["promQL", "Full Stack", "Docker"],
    description:
      "Support our infrastructure and ensure smooth deployment processes.",
    jobUrl: "https://danone.com",
    salary: "$60,000 - $100,000",
  },
  {
    company: "Google",
    position: "Software Engineer",
    location: "Mountain View, CA",
    tags: ["Go", "Kubernetes", "Cloud"],
    description: "Work on cutting-edge technology and solve complex problems.",
    jobUrl: "https://careers.google.com/jobs/results/123456-software-engineer/",
    salary: "$120,000 - $150,000",
  },
  {
    company: "Amazon",
    position: "Backend Developer",
    location: "Seattle, WA",
    tags: ["Java", "AWS", "Microservices"],
    description: "Join our team to build scalable backend services.",
    jobUrl: "https://www.amazon.jobs/en/jobs/123456/backend-developer",
    salary: "$110,000 - $140,000",
  },

  // Applied
  {
    company: "Facebook",
    position: "Full Stack Developer",
    location: "Menlo Park, CA",
    tags: ["React", "Node.js", "GraphQL"],
    description:
      "Work on innovative projects and collaborate with talented teams.",
    jobUrl: "https://www.facebook.com/careers/jobs/123456/full-stack-developer",
    salary: "$130,000 - $160,000",
  },
  {
    company: "Microsoft",
    position: "Software Engineer",
    location: "Redmond, WA",
    tags: ["C#", ".NET", "Azure"],
    description: "Join our team to build impactful software solutions.",
    jobUrl: "https://careers.microsoft.com/us/en/job/123456/software-engineer",
    salary: "$115,000 - $145,000",
  },
  {
    company: "Apple",
    position: "iOS Developer",
    location: "Cupertino, CA",
    tags: ["Swift", "iOS", "Mobile Development"],
    description: "Work on innovative mobile applications and user experiences.",
    jobUrl: "https://www.apple.com/careers/jobs/123456/ios-developer",
    salary: "$120,000 - $150,000",
  },
  {
    company: "Netflix",
    position: "Software Engineer",
    location: "Los Gatos, CA",
    tags: ["Java", "Spring", "Cloud"],
    description: "Join our team to build scalable streaming services.",
    jobUrl: "https://jobs.netflix.com/en/jobs/123456/software-engineer",
    salary: "$125,000 - $155,000",
  },
  // Interviewing
  {
    company: "Airbnb",
    position: "Frontend Developer",
    location: "San Francisco, CA",
    tags: ["React", "JavaScript", "Web Development"],
    description: "Work on innovative projects and collaborate with talented teams.",
    jobUrl: "https://www.airbnb.com/careers/jobs/123456/frontend-developer",
    salary: "$110,000 - $140,000",
  },
  {
    company: "Uber",
    position: "Backend Developer",
    location: "San Francisco, CA",
    tags: ["Go", "Microservices", "Cloud"],
    description: "Join our team to build scalable backend services.",
    jobUrl: "https://www.uber.com/careers/jobs/123456/backend-developer",
    salary: "$115,000 - $145,000",
  }, 
  {
    company: "LinkedIn",
    position: "Software Engineer",
    location: "Sunnyvale, CA",
    tags: ["Java", "Spring", "Cloud"],
    description: "Join our team to build impactful software solutions.",
    jobUrl: "https://www.linkedin.com/careers/jobs/123456/software-engineer",
    salary: "$120,000 - $150,000",
  },
  // Offer
  {
    company: "Twitter",
    position: "Full Stack Developer",
    location: "San Francisco, CA",
    tags: ["React", "Node.js", "GraphQL"],
    description: "Work on innovative projects and collaborate with talented teams.",
    jobUrl: "https://careers.twitter.com/en/jobs/123456/full-stack-developer",
    salary: "$110,000 - $140,000",
  },
  {
    company: "Salesforce",
    position: "Software Engineer",
    location: "San Francisco, CA",
    tags: ["Apex", "Java", "Cloud"],
    description: "Join our team to build impactful software solutions.",
    jobUrl: "https://www.salesforce.com/careers/jobs/123456/software-engineer",
    salary: "$120,000 - $150,000",
  },
  // Rejected
  {
    company: "Spotify",
    position: "Backend Developer",
    location: "New York, NY",
    tags: ["Python", "Django", "Cloud"],
    description: "Join our team to build scalable backend services.",
    jobUrl: "https://www.spotify.com/careers/jobs/123456/backend-developer",
    salary: "$100,000 - $130,000",
  },
  {
    company: "Dropbox",
    position: "Software Engineer",
    location: "San Francisco, CA",
    tags: ["Python", "Flask", "Cloud"],
    description: "Join our team to build impactful software solutions.",
    jobUrl: "https://www.dropbox.com/careers/jobs/123456/software-engineer",
    salary: "$110,000 - $140,000",
  },
];


async function seed() {
  if (!USER_ID) {
    console.error(" X Error: Please set a valid USER_ID in the seed script.");
    console.log("You can find a valid user ID by checking your database for existing users.");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    console.log("Seeding data for user ID:", USER_ID);

    await connectDB();
    console.log(`Seeding data for user ID: ${USER_ID}`);

    // Find the User's board
    let board = await Board.findOne({ userId: USER_ID, name: "Job Hunt" });

    if (!board) {
      console.log("No existing board found. Creating new board...");
      const {initializeUserBoard} = await import("../lib/init-user-board");
      board = await initializeUserBoard(USER_ID);
      console.log(" Board Created");
    } else {
      console.log("Existing board found. Clearing existing columns and job applications...");
      
    }

    // Get all columns for the board
    const columns = await Column.find({ boardId: board._id }).sort({
      order:1,
    });
    console.log(`Found ${columns.length} columns`);

    if (columns.length === 0) {
      console.error(
        "No columns found. Please ensure the board has default columns."
      );
      process.exit(1);
    }

    // Map column names to their IDs for easy reference
    const columnMap: Record<string, string> = {};
    columns.forEach((col) => {
      columnMap[col.name] = col._id.toString();
    });

    // Clear existing job applications for this user
    const existingJobs = await JobApplication.find({ userId: USER_ID });
    if (existingJobs.length > 0) {
      await JobApplication.deleteMany({ userId: USER_ID });

      // Clear job applications from columns
      for (const col of columns) {
        col.jobApplications = [];
        await col.save();
      }
    }

    // Distribute sample jobs into columns based on their status
    const jobByColumn: Record<string, typeof SAMPLE_JOBS> = {
      "Wish List": SAMPLE_JOBS.slice(0, 3),
      Applied: SAMPLE_JOBS.slice(3, 8),
      Interviewing: SAMPLE_JOBS.slice(8, 12),
      Offer: SAMPLE_JOBS.slice(12, 14),
      Rejected: SAMPLE_JOBS.slice(14, 16),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        console.warn(`Column "${columnName}" not found for user ${USER_ID}. Skipping jobs for this column.`);
        continue;
      }

      const column = columns.find((col) => col.name === columnName);
      if (!column) continue;

      for (let i = 0; i < jobs.length; i++) {
        const jobData = jobs[i];
        const jobApplication = await JobApplication.create({
          company: jobData.company,
          position: jobData.position,
          location: jobData.location,
          tags: jobData.tags,
          description: jobData.description,
          salary: jobData.salary,
          jobUrl: jobData.jobUrl,
          userId: USER_ID,
          columnId: column._id,
          boardId: board._id,
          status: columnName.toLowerCase().replace(" ", "-"),
          order: i,
        });

        column.jobApplications.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
    
    }

    console.log(`Seeded ${totalCreated} job applications.`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();

