import './scss/styles.scss';
import { Catalog } from './components/models/Catalog.ts';
import { Basket } from './components/models/Basket.ts';
import { Customer } from './components/models/Customer.ts';
import { ProductApi } from './components/api/ProtuctApi.ts';
import { Api } from './components/base/Api.ts';
import { API_URL, eventNames } from './utils/constants.ts';
import { cloneTemplate, ensureElement, isErrorApiResponse } from './utils/utils.ts';
import { HeaderView } from './components/views/HeaderView.ts';
import { EventEmitter } from './components/base/Events.ts';
import { GalleryView } from './components/views/GalleryView.ts';
import { CardCatalogView } from './components/views/Card/CardCatalogView.ts';
import { IBuyer, IOrderApiResponse, IProduct } from './types';
import { ModalView } from './components/views/ModalView.ts';
import { CardPreviewView } from './components/views/Card/CardPreviewView.ts';
import { BasketView } from './components/views/BasketView.ts';
import { CardBasketView } from './components/views/Card/CardBasketView.ts';
import { OrderFormView } from './components/views/Form/OrderFormView.ts';
import { ContactsFormView } from './components/views/Form/ContactsFormView.ts';
import { OrderSuccessView } from './components/views/OrderSuccessView.ts';

// --- создаем экземпляры API и моделей ---
const productApi = new ProductApi(new Api(API_URL));
const eventEmitter = new EventEmitter();

const catalogModel = new Catalog(eventEmitter);
const basketModel = new Basket(eventEmitter);
const customerModel = new Customer(eventEmitter);

// --- DOM ---
const headerElem = ensureElement<HTMLElement>('.header');
const galleryElem = ensureElement<HTMLElement>('.gallery');
const modalElem = ensureElement<HTMLTemplateElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// --- создаем view ---
const headerView = new HeaderView(headerElem, eventEmitter);
const galleryView = new GalleryView(galleryElem);
const modalView = new ModalView(modalElem); // теперь без isOpened на прототипе
const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmitter);
const orderFormView = new OrderFormView(cloneTemplate<HTMLFormElement>(orderFormTemplate), eventEmitter);
const contactsFormView = new ContactsFormView(cloneTemplate<HTMLFormElement>(contactsFormTemplate), eventEmitter);
const orderSuccessView = new OrderSuccessView(cloneTemplate<HTMLElement>(successTemplate), eventEmitter);

// --- локальное свойство для отслеживания состояния модалки ---
let isModalOpened = false;

// обертки для модалки, чтобы корректно отслеживать открытие/закрытие
const openModal = (content: HTMLElement) => {
    isModalOpened = true;
    modalView.render({ content });
};

// --- события ---
eventEmitter.on(eventNames.CATALOG_SET_ITEMS, () => {
    galleryView.render({
        items: catalogModel.getItems().map(renderCardCatalogView),
    });
});

eventEmitter.on<IProduct>(eventNames.CARD_CATALOG_SELECTED, (item) => {
    catalogModel.setCurrentItem(item);
});

eventEmitter.on(eventNames.CATALOG_SET_CURRENT_ITEM, () => {
    const item = catalogModel.getCurrentItem();
    if (!item) return;

    openModal(renderCardPreviewView(item));
});

eventEmitter.on(eventNames.BASKET_OPEN, () => {
    openModal(renderBasketView());
});

eventEmitter.on<IProduct>(eventNames.CARD_BASKET_DELETE_ITEM, (item) => {
    basketModel.deleteItem(item);
});

eventEmitter.on(eventNames.BASKET_CHECKOUT, () => {
    openModal(renderOrderFormView());
});

[eventNames.BASKET_ADD_ITEM, eventNames.BASKET_DELETE_ITEM].forEach((eventName) => {
    eventEmitter.on(eventName, () => {
        renderHeaderView();

        if (isModalOpened) {
            modalView.render({
                content: renderBasketView(),
            });
        }
    });
});

eventEmitter.on<Pick<IBuyer, 'payment'>>(eventNames.ORDER_FORM_SET_PAYMENT, ({ payment }) => {
    customerModel.setPayment(payment);
});

eventEmitter.on<Pick<IBuyer, 'address'>>(eventNames.ORDER_FORM_SET_ADDRESS, ({ address }) => {
    customerModel.setAddress(address);
});

[
    eventNames.CUSTOMER_SET_PAYMENT,
    eventNames.CUSTOMER_SET_ADDRESS,
].forEach((eventName) => {
    eventEmitter.on(eventName, () => renderOrderFormView());
});

eventEmitter.on(eventNames.ORDER_FORM_SUBMIT, () => {
    openModal(renderContactsFormView());
});

eventEmitter.on<Pick<IBuyer, 'email'>>(eventNames.CONTACTS_FORM_SET_EMAIL, ({ email }) => {
    customerModel.setEmail(email);
});

eventEmitter.on<Pick<IBuyer, 'phone'>>(eventNames.CONTACTS_FORM_SET_PHONE, ({ phone }) => {
    customerModel.setPhone(phone);
});

[
    eventNames.CUSTOMER_SET_EMAIL,
    eventNames.CUSTOMER_SET_PHONE,
].forEach((eventName) => {
    eventEmitter.on(eventName, () => renderContactsFormView());
});

eventEmitter.on(eventNames.CONTACTS_FORM_SUBMIT, async () => {
    try {
        const response = await productApi.order({
            ...customerModel.getData(),
            total: basketModel.getTotalPrice(),
            items: basketModel.getItems().map(({ id }) => id),
        });

        basketModel.clear();
        customerModel.clear();

        openModal(renderOrderSuccessView(response));
    } catch (e) {
        if (isErrorApiResponse(e)) console.error(e.error);
        else console.error(e);
    }
});

// --- загрузка товаров ---
try {
    const products = await productApi.getProducts();
    catalogModel.setItems(products.items);
} catch (e) {
    if (isErrorApiResponse(e)) console.error(e.error);
}

renderHeaderView();

// --- рендер функции ---
function renderHeaderView(): HTMLElement {
    return headerView.render({
        count: basketModel.getTotalItems(),
    });
}

function renderBasketView(): HTMLElement {
    const items = basketModel.getItems().map(renderCardBasketView);

    return basketView.render({
        items,
        total: basketModel.getTotalPrice(),
        valid: items.length > 0,
    });
}

function renderCardBasketView(item: IProduct, index: number): HTMLElement {
    const view = new CardBasketView(
        cloneTemplate(cardBasketTemplate),
        {
            onClick: () => eventEmitter.emit(eventNames.CARD_BASKET_DELETE_ITEM, item),
        }
    );

    return view.render({ ...item, index: index + 1 });
}

function renderCardPreviewView(item: IProduct): HTMLElement {
    const view = new CardPreviewView(
        cloneTemplate(cardPreviewTemplate),
        {
            onClick: () => {
                if (basketModel.hasItem(item.id)) {
                    basketModel.deleteItem(item);
                    eventEmitter.emit(eventNames.BASKET_DELETE_ITEM, item);
                } else {
                    basketModel.addItem(item);
                    eventEmitter.emit(eventNames.BASKET_ADD_ITEM, item);
                }

                modalView.render({
                    content: renderCardPreviewView(item),
                });
            },
        }
    );

    return view.render({
        ...item,
        canBuy: !!item.price,
        buttonText: item.price
            ? basketModel.hasItem(item.id)
                ? 'Удалить из корзины'
                : 'В корзину'
            : 'Недоступно',
    });
}

function renderCardCatalogView(item: IProduct): HTMLElement {
    const view = new CardCatalogView(
        cloneTemplate(cardCatalogTemplate),
        {
            onClick: () => eventEmitter.emit(eventNames.CARD_CATALOG_SELECTED, item),
        }
    );

    return view.render(item);
}

function renderOrderFormView(): HTMLElement {
    const { payment, address } = customerModel.getData();
    const { payment: pErr, address: aErr } = customerModel.checkValidity();

    return orderFormView.render({
        payment,
        address,
        error: pErr || aErr || '',
    });
}

function renderContactsFormView(): HTMLElement {
    const { email, phone } = customerModel.getData();
    const { email: eErr, phone: pErr } = customerModel.checkValidity();

    return contactsFormView.render({
        email,
        phone,
        error: eErr || pErr || '',
    });
}

function renderOrderSuccessView({ total }: IOrderApiResponse): HTMLElement {
    return orderSuccessView.render({ total });
}
