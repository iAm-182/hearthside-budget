// Hearthside seed data — a fictional household's November 2026 budget.
// Every figure below is invented for this demo household; nothing is copied
// from any other budget site. Category spending is derived from the
// transactions list, so the dashboard, budget page and reports always agree.
export const HOUSEHOLD = {
  name: "The Hartley Household",
  members: ["Maya Hartley", "Jordan Hartley", "Noah (10)", "Lily (7)"],
  currency: "USD",
  month: "2026-11",
};

export const CATEGORIES = [
  { id: "housing", name: "Housing", budget: 1850, color: "#234636", icon: "home" },
  { id: "groceries", name: "Groceries", budget: 720, color: "#4d7c5f", icon: "cart" },
  { id: "utilities", name: "Utilities", budget: 310, color: "#c98a2e", icon: "bolt" },
  { id: "transport", name: "Transport", budget: 420, color: "#3e6b8e", icon: "car" },
  { id: "dining", name: "Dining Out", budget: 240, color: "#c96f3f", icon: "fork" },
  { id: "entertainment", name: "Entertainment", budget: 160, color: "#7a5a8e", icon: "ticket" },
  { id: "health", name: "Health", budget: 200, color: "#b0483f", icon: "cross" },
  { id: "kids", name: "Kids & School", budget: 280, color: "#2e8b8b", icon: "book" },
  { id: "clothing", name: "Clothing", budget: 120, color: "#8e6b3e", icon: "shirt" },
  { id: "savings", name: "Savings", budget: 900, color: "#234636", icon: "piggy" },
  { id: "misc", name: "Miscellaneous", budget: 150, color: "#6b6b6b", icon: "dots" },
];

// November 2026 transactions. Amounts are expenses unless type is "income".
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", desc: "Rent — Maple Court Apartments", category: "housing", amount: 1850.0 },
  { id: "t02", date: "2026-11-01", desc: "Transfer to emergency fund", category: "savings", amount: 900.0 },
  { id: "t03", date: "2026-11-01", desc: "Salary — Maya Hartley", category: "income", amount: 4200.0, type: "income" },
  { id: "t04", date: "2026-11-02", desc: "Fuel — Shell, Oak Avenue", category: "transport", amount: 52.1 },
  { id: "t05", date: "2026-11-03", desc: "Whole Foods Market", category: "groceries", amount: 148.2 },
  { id: "t06", date: "2026-11-03", desc: "School supplies — Noah & Lily", category: "kids", amount: 68.4 },
  { id: "t07", date: "2026-11-04", desc: "Metro cards — monthly top-up", category: "transport", amount: 60.0 },
  { id: "t08", date: "2026-11-05", desc: "Internet — Northgate Broadband", category: "utilities", amount: 86.7 },
  { id: "t09", date: "2026-11-05", desc: "Pharmacy — Cedar Street Drugs", category: "health", amount: 42.3 },
  { id: "t10", date: "2026-11-06", desc: "Dinner — Rosa's Trattoria", category: "dining", amount: 34.5 },
  { id: "t11", date: "2026-11-07", desc: "Trader Joe's", category: "groceries", amount: 96.4 },
  { id: "t12", date: "2026-11-07", desc: "School lunch top-up", category: "kids", amount: 30.0 },
  { id: "t13", date: "2026-11-08", desc: "Electric — City Power", category: "utilities", amount: 132.4 },
  { id: "t14", date: "2026-11-08", desc: "Cinema — family matinee", category: "entertainment", amount: 42.0 },
  { id: "t15", date: "2026-11-09", desc: "Fuel — Shell, Oak Avenue", category: "transport", amount: 48.75 },
  { id: "t16", date: "2026-11-09", desc: "Birthday gift — Aunt Priya", category: "misc", amount: 45.0 },
  { id: "t17", date: "2026-11-10", desc: "Costco — weekly shop", category: "groceries", amount: 122.75 },
  { id: "t18", date: "2026-11-10", desc: "Swimming lessons — November term", category: "kids", amount: 90.0 },
  { id: "t19", date: "2026-11-11", desc: "Lunch — Banh Mi cart", category: "dining", amount: 48.2 },
  { id: "t20", date: "2026-11-12", desc: "Water — City Utilities", category: "utilities", amount: 48.9 },
  { id: "t21", date: "2026-11-12", desc: "Bookshop — three paperbacks", category: "entertainment", amount: 26.5 },
  { id: "t22", date: "2026-11-13", desc: "Parking — downtown garage", category: "transport", amount: 28.5 },
  { id: "t23", date: "2026-11-14", desc: "Farmers market", category: "groceries", amount: 84.3 },
  { id: "t24", date: "2026-11-14", desc: "Dentist copay — Lily", category: "health", amount: 85.0 },
  { id: "t25", date: "2026-11-15", desc: "Salary — Jordan Hartley", category: "income", amount: 2650.0, type: "income" },
  { id: "t26", date: "2026-11-15", desc: "Brunch — The Corner Cafe", category: "dining", amount: 27.8 },
  { id: "t27", date: "2026-11-16", desc: "Fuel — Shell, Oak Avenue", category: "transport", amount: 55.3 },
  { id: "t28", date: "2026-11-16", desc: "Trainers — Noah", category: "kids", amount: 57.6 },
  { id: "t29", date: "2026-11-17", desc: "Board game — Settlers night", category: "entertainment", amount: 38.75 },
  { id: "t30", date: "2026-11-18", desc: "Whole Foods Market", category: "groceries", amount: 110.55 },
  { id: "t31", date: "2026-11-18", desc: "Winter coats — Lily", category: "clothing", amount: 89.0 },
  { id: "t32", date: "2026-11-19", desc: "Dinner — Sakura Sushi", category: "dining", amount: 62.4 },
  { id: "t33", date: "2026-11-20", desc: "Fuel — Shell, Oak Avenue", category: "transport", amount: 47.9 },
  { id: "t34", date: "2026-11-20", desc: "Replacement kettle", category: "misc", amount: 51.0 },
  { id: "t35", date: "2026-11-21", desc: "Pharmacy — Cedar Street Drugs", category: "health", amount: 47.7 },
  { id: "t36", date: "2026-11-21", desc: "Ride share — airport run", category: "transport", amount: 22.15 },
  { id: "t37", date: "2026-11-22", desc: "Corner grocery — top-up", category: "groceries", amount: 49.8 },
  { id: "t38", date: "2026-11-23", desc: "Science museum — family day", category: "entertainment", amount: 30.75 },
  { id: "t39", date: "2026-11-24", desc: "Takeaway — Thai Garden", category: "dining", amount: 39.1 },
  { id: "t40", date: "2026-11-25", desc: "Fuel — Shell, Oak Avenue", category: "transport", amount: 40.3 },
];

// October 2026 totals, for the reports page's month-to-month comparison.
export const LAST_MONTH = {
  month: "2026-10",
  income: 6850,
  spentByCategory: {
    housing: 1850, groceries: 688, utilities: 291, transport: 402,
    dining: 265, entertainment: 171, health: 143, kids: 210,
    clothing: 156, savings: 900, misc: 44,
  },
};

export const BILLS = [
  { id: "b01", name: "Rent — Maple Court Apartments", amount: 1850.0, dueDay: 1, paid: true, category: "housing" },
  { id: "b02", name: "Internet — Northgate Broadband", amount: 86.7, dueDay: 5, paid: true, category: "utilities" },
  { id: "b03", name: "Electric — City Power", amount: 132.4, dueDay: 8, paid: true, category: "utilities" },
  { id: "b04", name: "Water — City Utilities", amount: 48.9, dueDay: 12, paid: true, category: "utilities" },
  { id: "b05", name: "Mobile phones — two lines", amount: 74.0, dueDay: 15, paid: true, category: "utilities" },
  { id: "b06", name: "Car insurance — Hartley Motors", amount: 118.0, dueDay: 20, paid: true, category: "transport" },
  { id: "b07", name: "Streaming — River+ family plan", amount: 15.49, dueDay: 22, paid: true, category: "entertainment" },
  { id: "b08", name: "Gym — Riverside Fitness", amount: 39.0, dueDay: 25, paid: true, category: "health" },
  { id: "b09", name: "Car payment — Hartley Motors", amount: 320.0, dueDay: 28, paid: false, category: "transport" },
];

export const GOALS = [
  { id: "g01", name: "Emergency fund", target: 8000, saved: 5200, note: "Six months of essentials, kept in a separate savings account." },
  { id: "g02", name: "Summer holiday — Lakeside cabin", target: 2400, saved: 1150, note: "Two weeks at the lake in July, cabin already shortlisted." },
  { id: "g03", name: "Next family car", target: 12000, saved: 3800, note: "Down payment for a used seven-seater before school starts." },
  { id: "g04", name: "Kids' school fund", target: 1500, saved: 640, note: "Trips, clubs and supplies for the spring term." },
];
