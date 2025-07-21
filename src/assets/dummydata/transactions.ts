import { Transaction } from "../../types/types";

const transactions: Transaction[] = [
  {
    id: 1,
    status_id: 1,
    categories_id: 1,
    amount: 1500,
    date: "2025-07-01",
    image: '',
    description: "July salary"
  },
  {
    id: 2,
    status_id: 2,
    categories_id: 3,
    amount: 50,
    date: "2025-07-02",
    image: "",
    description: "Lunch with colleagues"
  },
  {
    id: 3,
    status_id: 2,
    categories_id: 4,
    amount: 20,
    date: "2025-07-02",
    image: "",
    description: "Bus ticket"
  },
  {
    id: 4,
    status_id: 1,
    categories_id: 2,
    amount: 300,
    date: "2025-07-05",
    image: "",
    description: "Stock dividends"
  },
  {
    id: 5,
    status_id: 2,
    categories_id: 3,
    amount: 50,
    date: "2025-07-05",
    image: "",
    description: "Having dinner"
  }
];

export default transactions;
