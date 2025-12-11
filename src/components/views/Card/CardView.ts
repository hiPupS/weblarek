import { Component } from '../../base/Component.ts';
import { IProduct, TCategoryNames } from '../../../types';
import { ensureElement } from '../../../utils/utils.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants.ts';

type TCardViewData = Pick<IProduct, 'title' | 'price'>;

export class CardView<T> extends Component<TCardViewData & T> {
    protected readonly titleElem: HTMLElement;
    protected readonly priceElem: HTMLElement;

    // Чтобы наследники могли подключать эти элементы
    protected categoryElem?: HTMLElement;
    protected imageElem?: HTMLImageElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.titleElem = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElem = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(title: string) {
        this.titleElem.textContent = title;
    }

    set price(price: number | null) {
        this.priceElem.textContent = price
            ? `${price} синапсов`
            : 'Бесценно';
    }

    /** Возвращает модификатор класса по названию категории */
    static getCategoryClassByCategoryName(categoryName: TCategoryNames): string {
        return categoryMap[categoryName];
    }

    // === ВЫНЕСЕННЫЕ ОБЩИЕ СЕТТЕРЫ ===

    set category(category: TCategoryNames) {
        if (!this.categoryElem) return;

        const modifier = CardView.getCategoryClassByCategoryName(category);
        this.categoryElem.textContent = category;
        this.categoryElem.className = `card__category ${modifier}`;
    }

    set image(imageSrc: string) {
        if (!this.imageElem) return;

        this.imageElem.src = CDN_URL + imageSrc;
        this.imageElem.alt = 'product image';
    }
}
