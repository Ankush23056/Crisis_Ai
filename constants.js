// FIX: Add 'as const' to infer a more specific type for the icon property.
// This ensures that the icon values are treated as literal types (e.g., "TriangleAlert")
// rather than the general 'string' type, matching the expected props for the StatCard component.
export const statCardData = [
  {
    title: "Active Alerts",
    value: "12",
    change: "+3 in last hour",
    icon: "TriangleAlert",
  },
  {
    title: "People Evacuated",
    value: "2,847",
    change: "+247 since morning",
    icon: "Users",
  },
  {
    title: "Resources Deployed",
    value: "15",
    change: "85% capacity",
    icon: "LineChart",
  },
  { title: "Response Teams", value: "8", change: "All active", icon: "Zap" },
];

export const initialAlerts = [];

export const nearbyServices = {
  Hyderabad: {
    health: [
      {
        name: "Apollo Hospital Jubilee Hills",
        address: "Road No. 72, Jubilee Hills",
        distance: "2.5 km",
      },
      {
        name: "Yashoda Hospital Somajiguda",
        address: "Raj Bhavan Road, Somajiguda",
        distance: "3.1 km",
      },
      {
        name: "KIMS Hospital",
        address: "1-8-31/1, Minister Rd, Krishna Nagar Colony",
        distance: "4.5 km",
      },
    ],
    finance: [
      {
        name: "HDFC Bank ATM",
        address: "Banjara Hills, Road No. 1",
        distance: "1.2 km",
      },
      {
        name: "ICICI Bank Branch",
        address: "Panjagutta Circle",
        distance: "2.8 km",
      },
      {
        name: "State Bank of India",
        address: "Abids Main Road",
        distance: "5.0 km",
      },
    ],
    transport: [
      { name: "MG Bus Station", address: "Gowliguda", distance: "6.2 km" },
      {
        name: "Secunderabad Railway Station",
        address: "Secunderabad",
        distance: "8.1 km",
      },
      {
        name: "Jubilee Hills Check Post Metro",
        address: "Jubilee Hills",
        distance: "1.8 km",
      },
    ],
  },
  Pune: {
    health: [
      {
        name: "Ruby Hall Clinic",
        address: "40, Sassoon Rd",
        distance: "1.5 km",
      },
      {
        name: "Jehangir Hospital",
        address: "32, Sassoon Rd",
        distance: "1.8 km",
      },
    ],
    finance: [
      { name: "Axis Bank ATM", address: "FC Road", distance: "0.5 km" },
    ],
    transport: [
      {
        name: "Pune Railway Station",
        address: "Station Road",
        distance: "2.0 km",
      },
      { name: "Swargate Bus Depot", address: "Swargate", distance: "4.5 km" },
    ],
  },
  Bangalore: {
    health: [
      {
        name: "Fortis Hospital",
        address: "Bannerghatta Road",
        distance: "3.0 km",
      },
      {
        name: "Manipal Hospital",
        address: "Old Airport Road",
        distance: "5.5 km",
      },
    ],
    finance: [{ name: "Citibank ATM", address: "MG Road", distance: "1.0 km" }],
    transport: [
      {
        name: "Majestic Bus Terminal",
        address: "Majestic",
        distance: "7.0 km",
      },
    ],
  },
  Chennai: {
    health: [
      {
        name: "Apollo Hospital Greams Road",
        address: "Greams Road",
        distance: "2.2 km",
      },
    ],
    finance: [
      { name: "Indian Bank Branch", address: "T. Nagar", distance: "3.5 km" },
    ],
    transport: [
      {
        name: "Chennai Central Railway Station",
        address: "Kannappar Thidal",
        distance: "4.0 km",
      },
    ],
  },
  Mumbai: {
    health: [
      { name: "Lilavati Hospital", address: "Bandra West", distance: "2.8 km" },
      {
        name: "Breach Candy Hospital",
        address: "Warden Road",
        distance: "7.2 km",
      },
    ],
    finance: [
      { name: "Bank of Baroda ATM", address: "Dadar", distance: "1.5 km" },
    ],
    transport: [
      {
        name: "Chhatrapati Shivaji Maharaj Terminus",
        address: "Fort",
        distance: "10.0 km",
      },
    ],
  },
  Delhi: {
    health: [
      {
        name: "AIIMS - All India Institute Of Medical Sciences",
        address: "Ansari Nagar",
        distance: "8.0 km",
      },
      {
        name: "Sir Ganga Ram Hospital",
        address: "Rajinder Nagar",
        distance: "5.5 km",
      },
    ],
    finance: [
      {
        name: "Punjab National Bank",
        address: "Connaught Place",
        distance: "3.0 km",
      },
    ],
    transport: [
      {
        name: "New Delhi Railway Station",
        address: "Paharganj",
        distance: "4.0 km",
      },
    ],
  },
};
