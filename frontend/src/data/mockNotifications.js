export const mockNotifications = [
  {
    id: "notif-1",
    message: "Welcome to PlacementConnect! Please fill out and complete your profile to check job eligibility.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-2",
    message: "New Job Drive Posted: Tesla is looking for Mechanical & Robotics Engineers (32 LPA). Check eligibility!",
    type: "job",
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif-3",
    message: "Application Update: Your application for Google Intern is currently under review.",
    type: "status",
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];
