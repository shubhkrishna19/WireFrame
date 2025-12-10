// Helper script to seed test data
// You can call this from the browser console or create a button in the UI
// Usage: After setting up Convex, you can call the seed function from the Convex dashboard

export const seedInstructions = `
To seed test data:

1. Make sure Convex is running (npm run convex:dev)
2. Go to your Convex dashboard
3. Navigate to Functions
4. Find "seed:seedTestData"
5. Click "Run" to execute

Or use the Convex dashboard API:
- Open browser console on your app
- The seed function will be available through the Convex client
`;

// Test accounts that will be created:
export const testAccounts = {
  customer: {
    email: "customer@test.com",
    password: "customer123",
  },
  admin: {
    email: "admin@test.com",
    password: "admin123",
  },
};

