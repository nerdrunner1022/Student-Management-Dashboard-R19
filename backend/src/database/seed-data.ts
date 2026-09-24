export interface SeedStudent {
  name: string;
  email: string;
  course: string;
  gpa: number;
  status: 'Active' | 'Suspended';
}

export const SEED_STUDENTS: SeedStudent[] = [
  { name: "SpongeBob SquarePants", email: "spongebob@boating.edu", course: "Boating Safety", gpa: 2.1, status: "Active" },
  { name: "Sandy Cheeks", email: "sandy@science.org", course: "Marine Biology", gpa: 4.0, status: "Active" },
  { name: "Squidward Tentacles", email: "squidward@clarinet.net", course: "Classical Music", gpa: 3.4, status: "Suspended" },
  { name: "Patrick Star", email: "patrick@rock.com", course: "Underwater Studies", gpa: 1.5, status: "Active" },
  { name: "Mr. Krabs", email: "mrkrabs@money.com", course: "Business Management", gpa: 3.8, status: "Active" },
  { name: "Plankton", email: "plankton@evil.com", course: "Chemistry", gpa: 2.8, status: "Suspended" },
  { name: "Mrs. Puff", email: "mrspuff@boating.edu", course: "Driver Education", gpa: 3.9, status: "Active" },
  { name: "Pearl Krabs", email: "pearl@money.com", course: "Marine Biology", gpa: 3.6, status: "Active" },
  { name: "Larry Lobster", email: "larry@fitness.edu", course: "Kinesiology", gpa: 3.2, status: "Active" },
  { name: "Karen Plankton", email: "karen@evil.com", course: "Computer Science", gpa: 4.0, status: "Active" },
  { name: "Bubble Bass", email: "bubblebass@food.edu", course: "Culinary Arts", gpa: 2.4, status: "Suspended" },
  { name: "Mermaid Man", email: "merman@heroism.edu", course: "Heroic Studies", gpa: 3.1, status: "Active" },
  { name: "Barnacle Boy", email: "barnacleboy@heroism.edu", course: "Emergency Response", gpa: 3.5, status: "Active" },
  { name: "Squilliam Fancyson", email: "squilliam@music.edu", course: "Classical Music", gpa: 3.9, status: "Active" }
];