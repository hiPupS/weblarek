import { IApi, IProduct, IOrder, iOrderResponse } from "../../types/index.ts";

export class ApiService {
  private api: IApi;

  constructor(Api: IApi) {
    this.api = Api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const data = await this.api.get<{ items: IProduct[] }>("/product");
      return data.items;
    } catch (error) {
      console.log("Ошибка получения данных: ", error);
      return [];
    }
  }

  postOrder(order: IOrder): Promise<iOrderResponse> {
      return this.api.post<iOrderResponse>("/order", order);
  }
}

export default ApiService;