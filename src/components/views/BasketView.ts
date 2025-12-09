import {Component} from '../base/Component.ts';
import {ensureElement} from '../../utils/utils.ts';
import {IEvents} from '../base/Events.ts';
import {eventNames} from '../../utils/constants.ts';

type TBasketViewData = {
    items: HTMLElement[];
    total: number;
};

export class BasketView extends Component<TBasketViewData> {
    protected readonly listElem: HTMLUListElement;
    protected readonly btnElem: HTMLButtonElement;
    protected readonly priceElem: HTMLElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);

        this.listElem = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this.btnElem = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.priceElem = ensureElement<HTMLElement>('.basket__price', this.container);

        this.btnElem.addEventListener('click', () => {
            this.events.emit(eventNames.BASKET_CHECKOUT);
        });
    }

    set items(items: HTMLElement[]) {
        this.listElem.replaceChildren(...items);
    }

    set total(total: number) {
        if (total === 0) {
            this.btnElem.disabled = true;
        }

        this.priceElem.textContent = `${total} синапсов`;
    }
}
