import { IProduct } from '../../../types';
import { CardView } from './CardView.ts';
import { ensureElement } from '../../../utils/utils.ts';

type TCardCatalogViewData = Pick<IProduct, 'image' | 'category'>;
type TCardCatalogViewActions = {
    onClick?: () => void;
};

export class CardCatalogView extends CardView<TCardCatalogViewData> {
    protected readonly categoryElem: HTMLElement;
    protected readonly imageElem: HTMLImageElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly actions?: TCardCatalogViewActions,
    ) {
        super(container);

        // Подключаем DOM элементы — теперь родительские сеттеры могут работать
        this.categoryElem = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElem = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (this.actions?.onClick) {
            this.container.addEventListener('click', this.actions.onClick);
        }
    }
}
