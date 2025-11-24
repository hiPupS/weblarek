
import "./scss/styles.scss";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { Product } from "./components/Models/Product";
import { apiProducts } from "../src/utils/data";
import { ICustomer } from "./types";
import { ApiService } from "./components/Models/ApiService";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { IOrder } from "./types";

const newProduct = new Product();
const newCart = new Cart();
const newCustomer = new Customer();

//проверка методов Product

newProduct.setItem(apiProducts.items);
console.log("Массив товаров из каталога: ", newProduct.getItem());
console.log(
  "Товар, найденный по id: ",
  newProduct.getItemByID(apiProducts.items[3].id)
);
newProduct.setSelectedItem(apiProducts.items[1]);
console.log(
  "Товар, выбранный для подробного отображения",
  newProduct.getSelectedItem()
);

//проверка методов Cart

newCart.addToCart(apiProducts.items[0]);
newCart.addToCart(apiProducts.items[1]);
newCart.addToCart(apiProducts.items[2]);
console.log("Корзина выбранных товаров: ", newCart.getItems());
const removedItem = newCart.getItems()[0].id;
console.log("Из корзины удален", removedItem);
newCart.removeFromCart(removedItem);
console.log("Обновленная корзина", newCart.getItems());
console.log("Полная стоимость заказа: ", newCart.getTotalCost());
console.log("Всего в корзине: ", newCart.getAmountOfItems());
const availableItem = apiProducts.items[0].id;
console.log(
  "Данный товар в корзине? ",
  newCart.isAvailable(availableItem) ? "да" : "нет"
);
console.log(
  "А этот? ",
  newCart.isAvailable(apiProducts.items[2].id) ? "да" : "нет"
);
console.log("Очистим всю корзину");
newCart.removeAllItems();
console.log("Теперь в нашей корзине лежит: ", newCart.getItems());

//Проверка методов Customer

const firstCustomer: ICustomer = {
  payment: "cash",
  email: "lady@mail.ru",
  phone: "88005553535",
  address: "Улица Пушкина, дом Колотушкина, квартира №5",
};

const secondCustomer: ICustomer = {
  payment: null,
  email: "lady@mail.ru",
  phone: "88005553535",
  address: null,
};

newCustomer.setCustomerInfo(firstCustomer);
console.log("Новый покупатель", newCustomer.getCustomerInfo());
console.log("Данные нового покупателя валидны?", newCustomer.isCorrect());
newCustomer.setCustomerInfo(secondCustomer);
console.log("Второй покупатель", newCustomer.getCustomerInfo());
console.log("Данные второго покупателя валидны?", newCustomer.isCorrect());
newCustomer.setCustomerInfo({ payment: "cash", address: "Мирный поселок" });
console.log("Данные второго покупателя валидны?", newCustomer.isCorrect());
newCustomer.eraseCustomerInfo();
console.log("Удаляем данные пользователя");
console.log(
  "Теперь у пользователя видны следующие данные",
  newCustomer.getCustomerInfo()
);

//Проверка методов класса ApiService

const newApi = new Api(API_URL);
const newApiService = new ApiService(newApi);
let firstOrder: IOrder = {
  payment: "online",
  email: "test@test.ru",
  phone: "+71234567890",
  address: "Spb Vosstania 1",
  total: 2200,
  items: [
    "854cef69-976d-4c2a-a18c-2aa45046c390",
    "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  ],
};


const products = await newApiService.getProducts();
console.log(products);
console.log(newApiService.postOrder(firstOrder).catch(err => console.log(err)));
