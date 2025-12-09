import {IProduct} from '../../types';
import {IEvents} from '../base/Events.ts';
import {eventNames} from '../../utils/constants.ts';

export class Catalog {
    private items: IProduct[] = [];
    private currentItem: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit(eventNames.CATALOG_SET_ITEMS);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(itemId: string): IProduct | null {
        return this.items.find(({id}) => id === itemId) ?? null;
    }

    setCurrentItem(item: IProduct): void {
        this.currentItem = item;
        this.events.emit(eventNames.CATALOG_SET_CURRENT_ITEM);
    }

    getCurrentItem(): IProduct | null {
        return this.currentItem;
    }
}
