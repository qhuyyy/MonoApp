import { Transaction } from "../../types/types";

const transactions: Transaction[] = [
  {
    id: 1,
    status_id: 1,
    categories_id: 1,
    amount: 1500,
    date: "2025-07-01",
    image: "https://example.com/income1.jpg",
    description: "July salary"
  },
  {
    id: 2,
    status_id: 2,
    categories_id: 3,
    amount: 50,
    date: "2025-07-02",
    image: "https://example.com/food1.jpg",
    description: "Lunch with colleagues"
  },
  {
    id: 3,
    status_id: 2,
    categories_id: 4,
    amount: 20,
    date: "2025-07-02",
    image: "https://example.com/transport1.jpg",
    description: "Bus ticket"
  },
  {
    id: 4,
    status_id: 1,
    categories_id: 2,
    amount: 300,
    date: "2025-07-05",
    image: "https://example.com/investment1.jpg",
    description: "Stock dividends"
  }
];

export default transactions;
