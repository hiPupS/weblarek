import { IProduct } from "../../types/index.ts";

export class Cart { 
  private addedProducts: IProduct[] = [];

  getItems(): IProduct[] {
    return this.addedProducts;
  }

  addToCart(addedProduct: IProduct): void {
    this.addedProducts.push(addedProduct);
  }

  removeFromCart(productID: string): void {
    this.addedProducts = this.addedProducts.filter(
      (product) => product.id !== productID
    );
  }

  removeAllItems(): void {
    this.addedProducts = [];
  }

  getTotalCost(): number {
    return this.addedProducts.reduce(
      (total, product) =>
        typeof product.price === "number" ? total + product.price : total,
      0
    );
  }

  getAmountOfItems(): number {
    return this.addedProducts.length;
  }

  isAvailable(productID: string): boolean {
    return this.addedProducts.some((product) => product.id === productID);
  }
}

export default Cart;