
export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  dailyIncome: number;
  cycleDays?: number;
  viewCount: number;
  locked: boolean;
  requiredProductId?: number;
}
