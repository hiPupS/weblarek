https://github.com/hiPupS/weblarek

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары,
добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра
деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на
сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение
ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления
генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти
события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для
отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в
интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах,
которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в
момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов
`<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и
опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с
объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными,
которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове
метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра
при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и
возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие
в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия
событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании
события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название
события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается
название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове
которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Товар

```typescript
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

- `id` - id товара
- `description` - описание товара
- `image` - изображение товара
- `title` - заголовок товара
- `category` - категория товара
- `price` - стоимость товара, значение `null` - товар бесценный

#### Покупатель

```typescript
interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

- `payment` - способ оплаты, `card | cash`
- `email` - почта покупателя
- `phone` - телефон покупателя
- `address` - адрес доставки

### Модели данных

#### Каталог `Catalog`

Отображает товары.

Свойства:

- `items: IProduct[]` - массив товаров
- `currentItem: IProduct | null` - выделенный товар для отображения в окне

Методы:

- `setItems(items: IProduct[]): void` - сохраняет товары
- `getItems(): IProduct[]` - получает массив товары
- `getItem(itemId: string): IProduct | null` - получает товар по `id`
- `setCurrentItem(item: IProduct | null): void` - устанавливает товар для отображения
- `getCurrentItem(): IProduct | null` - получает товар для отображения

#### Корзина `Basket`

Отображается список выбранных покупателем товаров.

Свойства:

- `items: IProduct[]` - массив товаров, добавленных в корзину

Методы:

- `getItems(): IProduct[]` - получение массива товаров, которые находятся в корзине
- `addItem(item: IProduct): void` - добавление товара
- `deleteItem(itemToDelete: IProduct): void` - удаление товара
- `clear(): void` - очистка корзины
- `getTotalPrice(): number` - получение стоимости всех товаров в корзине
- `getTotalItems(): number` - получение количества товаров в корзине
- `hasItem(itemId: string): boolean` - проверка наличия товара в корзине по его `id`

#### Покупатель `Customer`

Данные покупателя, необходимые для оформления заказа.

Свойства:

- `payment: TPayment` - способ оплаты
- `address: string` - адрес доставки
- `phone: string` - телефон покупателя
- `email: string` - почта покупателя

Методы:

- `setPayment(payment: TPayment): void` - сохраняет способ оплаты
- `setAddress(address: string): void` - сохраняет адрес доставки
- `setPhone(phone: string): void` - сохраняет телефон покупателя
- `setEmail(email: string): void` - сохраняет почту покупателя
- `getData(): IBuyer` - получает всех данных покупателя
- `clear(): void` - очищает данные покупателя
- `checkValidity(): TBuyerValidityMessages` - проверка данных покупателя

### Слой коммуникации `ProductApi`

Конструктор:

- `constuctor(api: IApi)` - в конструктор передается экземпляр класса, соответсвующий интерфейсу `IApi`

Методы класса:

- `getProducts(): Promise<IGetProductsApiResponse>` - получает с сервера объект с массивом товаров
- `order(data: IOrderApiRequest): Promise<IOrderApiResponse>` - отправляет на сервер данные о покупателе и выбранных
  товарах

### Представление

Все классы представления наследуются от родительского класса `Component`.

#### `HeaderView`

**Назначение:** шапка сайта с кнопкой корзины.  
**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)`  
— принимает контейнер и брокер событий, навешивает обработчик клика на кнопку корзины.

**Свойства:**

- `htmlButtonElement` — кнопка корзины
- `basketCounterElement` — счетчик количества товаров

**Методы:**

- `set count(value: number)` — обновляет число товаров рядом с иконкой корзины

#### `ModalView`

**Назначение:** диалоговое окно для отображения контента.  
**Конструктор:**  
`constructor(container: HTMLElement)` — принимает контейнер.

**Свойства:**

- `modalContentElem` — область для вставки контента
- `closeBtnElem` — кнопка закрытия диалогового окна

**Методы:**

- `modalClickHandler(evt: MouseEvent)` - обработчик клика вне области содержимого окна
- `set content(content: HTMLElement)` - контейнер для отображения контента
- `open()` — открывает диалоговое окно и устанавливает обработчики события на закрытие окна по клику вне области
  содержимого окна и нажатии клавиши `Esc`
- `close()` — закрывает диалоговое окно и удаляет обработчики события

#### `GalleryView`

**Назначение:** контейнер для карточек товаров.  
**Конструктор:**  
`constructor(container: HTMLElement)` — задает контейнер.

**Методы:**

- `set items(catalogItems: HTMLElement[])` — вставляет карточки товаров в контейнер

#### `CardView`

**Назначение:** Базовый класс карточки товара.  
**Конструктор:**  
`constructor(container: HTMLElement)` — принимает контейнер.

**Свойства:**

- `titleElem: HTMLElement` — заголовок товара
- `priceElem: HTMLElement` — цена товара

**Методы:**

- `set title(value: string)` — устанавливает название
- `set price(value: string)` — устанавливает цену
- `static getCategoryClassByCategoryName(categoryName: TCategoryNames): string` - получает модификатор класса в
  соответствии с категорией товара

#### `CardBasketView`

**Назначение:** Карточки товара в корзине. `CardView <- CardBasketView`  
**Конструктор:**  
`constructor(container: HTMLElement, actions?: TActions)` — принимает контейнер и объект событий

**Свойства:**

- `indexElem: HTMLSpanElement` — порядковый номер в корзине
- `btnElem: HTMLButtonElement` — кнопка удаления товара из корзины

**Методы:**

- `set index(index: number)` — устанавливает порядковый номер

#### `CardCatalogView`

**Назначение:** Карточки товара в каталоге. `CardView <- CardCatalogView`  
**Конструктор:**  
`constructor(container: HTMLElement, actions?: TActions)` — принимает контейнер и объект событий

**Свойства:**

- `categoryElem: HTMLElement` — категория товара
- `imageElem: HTMLImageElement` — изображение товара

**Методы:**

- `set category(category: TCategoryNames)` — задает категорию и соответствующий модификатор
- `set image(imageSrc: string)` — устанавливает адрес изображения товара

#### `CardPreviewView`

**Назначение:** Карточки товара в каталоге. `CardView <- CardPreviewView`  
**Конструктор:**  
`constructor(container: HTMLElement, actions?: TActions)` — принимает контейнер и объект событий

**Свойства:**

- `descriptionElement: HTMLParagraphElement` — описание товара
- `buttonElement: HTMLButtonElement` — кнопка добавления или удаления товара из корзины
- `categoryElem: HTMLElement` — категория товара
- `imageElem: HTMLImageElement` — изображение товара

**Методы:**

- `set canBuy(canBuy: boolean)` — блокирует кнопку добавления в корзину, если товар уже в корзине
- `set buttonText(buttonText: string)` — устанавливает текст кнопки
- `set description(description: string)` — устанавливает описание товара
- `set category(category: TCategoryNames)` — задает категорию и соответствующий модификатор
- `set image(imageSrc: string)` — устанавливает адрес изображения товара

#### `BasketView`

**Назначение:** Корзина.  
**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает контейнер и брокер событий.

**Свойства:**

- `listElem` — контейнер для отображения списка товаров
- `btnElem` — кнопка оформления товаров из корзины
- `priceElem` — итоговая сумма

**Методы:**

- `set items(value: HTMLElement[])` — выводит список товаров
- `set total(value: number)` — обновляет итоговую сумму

#### `FormView`

**Назначение:** Базовый класс формы.  
**Конструктор:**  
`constructor(container: HTMLElement, actions: TFormViewActions)` — принимает контейнер и объект с действиями

**Свойства:**

- `submitBtnElem: HTMLButtonElement` — кнопка отправки формы
- `errorsElem: HTMLElement` — элемент для вывода ошибки

**Методы:**

- `set error(error: string)` — устанавливает ошибку

#### `OrderFormView`

**Назначение:** Первый шаг оформления заказа. `FormView <- OrderFormView`  
**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает контейнер и брокер событий

**Свойства:**

- `paymentBtnElems: HTMLButtonElement[]` — кнопка выбора способа оплаты
- `addressInputElem: HTMLInputElement` — инпут ввода адреса

**Методы:**

- `set payment(payment: TPayment)` — делает активной кнопку выбора оплаты
- `set address(address: string)` — заполняет инпут с адресом

#### `ContactsFormView`

**Назначение:** Второй шаг оформления заказа. `FormView <- ContactsFormView`  
**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает контейнер и брокер событий

**Свойства:**

- `emailInputElem: HTMLInputElement` — инпут ввода почты
- `phoneInputElem: HTMLInputElement` — инпут ввода телефона

**Методы:**

- `set email(email: string)` — заполняет инпут с почтой
- `set phone(phone: string)` — заполняет инпут с телефоном

#### `OrderSuccessView`

**Назначение:** Сообщение об успешной оплате  
**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает контейнер и брокер событий

**Свойства:**

- `descriptionElem: HTMLParagraphElement` — элемент отображает, на какую сумму был оформлен заказ
- `closeBtnElem: HTMLButtonElement` — кнопка закрытия

**Методы:**

- `set total(total: number)` — устанавливает общую сумму заказа
