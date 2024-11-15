const database = 'creative-project-planner';
const collection = 'projects';

// Select the database to use.
use(database);

// Insert a few sample documents into the projects collection.
db.getCollection(collection).insertMany([
  { 
    title: 'New Marketing Plan', 
    description: 'Create and execute a new marketing strategy for Q1.', 
    dueDate: new Date('2024-01-15T00:00:00Z'), 
    status: 'In Progress', 
    createdAt: new Date('2023-11-01T08:00:00Z') 
  },
  { 
    title: 'Website Redesign', 
    description: 'Redesign the company website to improve user experience.', 
    dueDate: new Date('2024-02-20T00:00:00Z'), 
    status: 'Not Started', 
    createdAt: new Date('2023-12-01T09:30:00Z') 
  },
  { 
    title: 'Mobile App Launch', 
    description: 'Launch the mobile app for both Android and iOS.', 
    dueDate: new Date('2024-04-10T00:00:00Z'), 
    status: 'Completed', 
    createdAt: new Date('2024-01-25T11:45:00Z') 
  }
]);

// Run a find command to view projects due in Q1 of 2024.
const projectsInQ1 = db.getCollection(collection).find({
  dueDate: { $gte: new Date('2024-01-01'), $lt: new Date('2024-03-31') }
}).count();

// Print a message to the output window.
console.log(`${projectsInQ1} projects are due in Q1 of 2024.`);

// Aggregate query to calculate total projects by status.
const projectsByStatus = db.getCollection(collection).aggregate([
  { $group: { _id: '$status', totalProjects: { $sum: 1 } } },
  { $sort: { totalProjects: -1 } }
]).toArray();

// Log the aggregation result for clarity
console.log('Projects grouped by status:', projectsByStatus);
