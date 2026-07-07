import { mockJobs } from '../data/mockJobs';
import { mockNotifications } from '../data/mockNotifications';

const KEYS = {
  USERS: 'pc_users',
  CURRENT_USER: 'pc_current_user',
  APPLICATIONS: 'pc_applications',
  NOTIFICATIONS: 'pc_notifications',
};

// Seed initial data if database doesn't exist
export const initDb = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    // Default student user for quick testing
    const defaultStudent = {
      id: "stud-1",
      name: "Rahul Sharma",
      email: "student@pc.com",
      password: "password123", // Simulated hashing
      rollNumber: "2022CSE1042",
      branch: "CSE",
      year: 4,
      cgpa: 8.2,
      skills: ["React.js", "Node.js", "Express", "MongoDB", "Data Structures", "Tailwind CSS"],
      projects: [
        {
          id: "proj-1",
          title: "PlacementConnect",
          description: "A Placement Management System that connects eligible students with top hiring companies. Includes drive tracking and profiles.",
          techStack: ["React.js", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
          link: "https://github.com/rahul/placementconnect"
        },
        {
          id: "proj-2",
          title: "E-Commerce App",
          description: "Full-stack e-commerce web platform with stripe payment integration and user reviews.",
          techStack: ["React.js", "Redux Toolkit", "Node.js", "MongoDB"],
          link: "https://github.com/rahul/shopwise"
        }
      ],
      certifications: ["AWS Certified Cloud Practitioner", "Responsive Web Design - freeCodeCamp"],
      resumeUrl: "https://res.cloudinary.com/placementconnect/image/upload/v12345/sample-resume.pdf",
      resumeName: "Rahul_Sharma_Resume.pdf",
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([defaultStudent]));
  }

  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }

  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    // Empty default list
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([]));
  }
};

// Helper getters/setters
const getFromStorage = (key) => {
  initDb();
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
};

const saveToStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const getUsers = () => getFromStorage(KEYS.USERS) || [];
export const getCurrentUser = () => getFromStorage(KEYS.CURRENT_USER);
export const getApplications = () => getFromStorage(KEYS.APPLICATIONS) || [];
export const getNotifications = () => getFromStorage(KEYS.NOTIFICATIONS) || [];

// Mock APIs
export const registerUser = (userData) => {
  const users = getUsers();
  if (users.find(u => u.email === userData.email)) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: `stud-${Date.now()}`,
    skills: [],
    projects: [],
    certifications: [],
    resumeUrl: "",
    resumeName: "",
    ...userData
  };

  users.push(newUser);
  saveToStorage(KEYS.USERS, users);
  saveToStorage(KEYS.CURRENT_USER, newUser);

  // Add welcome notification
  addNotification(
    newUser.id,
    `Welcome ${newUser.name} to PlacementConnect! Setup your profile and explore opportunities.`,
    'info'
  );

  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  saveToStorage(KEYS.CURRENT_USER, user);
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

export const updateProfile = (profileData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Not logged in");

  const updatedUser = { ...currentUser, ...profileData };
  
  // Sync to current user
  saveToStorage(KEYS.CURRENT_USER, updatedUser);

  // Sync back to users array
  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveToStorage(KEYS.USERS, users);
  }

  // Create notifications about profile update if something major changed
  if (profileData.cgpa !== currentUser.cgpa) {
    addNotification(
      currentUser.id,
      `Your CGPA has been updated to ${profileData.cgpa}. Eligible job listings will change accordingly.`,
      'info'
    );
  }

  return updatedUser;
};

export const addNotification = (userId, message, type = 'info') => {
  const notifs = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifs.unshift(newNotif);
  saveToStorage(KEYS.NOTIFICATIONS, notifs);
  return newNotif;
};

export const markNotificationRead = (id) => {
  const notifs = getNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
  saveToStorage(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const markAllNotificationsRead = () => {
  const notifs = getNotifications();
  const updated = notifs.map(n => ({ ...n, read: true }));
  saveToStorage(KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const applyJob = (jobId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("Not logged in");

  const apps = getApplications();
  
  // Check if already applied
  if (apps.find(a => a.studentId === currentUser.id && a.jobId === jobId)) {
    throw new Error("Already applied to this drive");
  }

  const job = mockJobs.find(j => j.id === jobId);
  if (!job) throw new Error("Job not found");

  // Validate eligibility before applying
  if (currentUser.cgpa < job.eligibility.minCgpa) {
    throw new Error(`Ineligible: Minimum CGPA required is ${job.eligibility.minCgpa}`);
  }
  const isBranchEligible = job.eligibility.eligibleBranches.some(
    b => b.toUpperCase() === currentUser.branch.toUpperCase()
  );
  if (!isBranchEligible) {
    throw new Error(`Ineligible: Eligible branches are ${job.eligibility.eligibleBranches.join(", ")}`);
  }

  const newApp = {
    id: `app-${Date.now()}`,
    studentId: currentUser.id,
    jobId,
    status: 'Applied', // Applied | Aptitude | GD | HR | Selected | Rejected
    appliedAt: new Date().toISOString(),
  };

  apps.unshift(newApp);
  saveToStorage(KEYS.APPLICATIONS, apps);

  // Add confirmation notification
  addNotification(
    currentUser.id,
    `Application submitted successfully for ${job.title} at ${job.companyName}. Track your progress on the Applications tab.`,
    'success'
  );

  return newApp;
};
