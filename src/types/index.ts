export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "cash" | "online";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICustomer {
  payment?: TPayment | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface IOrder extends ICustomer {
  total: number;
  items: string[];
}

export interface iOrderResponse {
  id: string;
  total: number;
}