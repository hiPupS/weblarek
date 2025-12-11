import { Component } from '../base/Component.ts';
import { ensureElement } from '../../utils/utils.ts';

interface IModalViewData {
    content: HTMLElement;
}

export class ModalView extends Component<IModalViewData> {
    protected readonly modalContentElem: HTMLElement;
    protected readonly closeBtnElem: HTMLButtonElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.modalContentElem = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeBtnElem = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeBtnElem.addEventListener('click', () => this.close());
        this.container.addEventListener('click', this.modalClickHandler);
    }

    protected modalClickHandler = (evt: MouseEvent) => {
        const target = evt.target as HTMLElement;
        const currentTarget = evt.currentTarget as HTMLElement;

        if (target === currentTarget) {
            this.close();
        }
    };

    // === Обработчик Escape, как в замечании ===
    protected _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    protected set content(content: HTMLElement) {
        this.modalContentElem.replaceChildren(content);
        this.open();
    }

    protected open() {
        this.container.classList.add('modal_active');

        // Навешиваем обработчик Escape
        document.addEventListener('keydown', this._handleEscape);
    }

    public close() {
        this.container.classList.remove('modal_active');

        // Удаляем обработчик Escape
        document.removeEventListener('keydown', this._handleEscape);
    }
}
