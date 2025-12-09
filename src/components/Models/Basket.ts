import {IProduct} from '../../types';
import {IEvents} from '../base/Events.ts';
import {eventNames} from '../../utils/constants.ts';

export class Basket {
    private items: IProduct[] = [];

    constructor(protected readonly events: IEvents) {
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit(eventNames.BASKET_ADD_ITEM);
    }

    deleteItem(itemToDelete: IProduct): void {
        this.items = this.items.filter(({id}) => id !== itemToDelete.id);
        this.events.emit(eventNames.BASKET_DELETE_ITEM);
    }

    clear(): void {
        this.items = [];
        this.events.emit(eventNames.BASKET_CLEAR);
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, {price}) => {
            if (price) {
                sum += price;
            }

            return sum;
        }, 0);
    }

    getTotalItems(): number {
        return this.items.length;
    }

    hasItem(itemId: string): boolean {
        return this.items.some(({id}) => id === itemId);
    }
}
