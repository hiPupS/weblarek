import {IBuyer, TBuyerValidityMessages, TPayment} from '../../types';
import {eventNames} from '../../utils/constants.ts';
import {IEvents} from '../base/Events.ts';

export class Customer {
    private payment: TPayment = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(protected readonly events: IEvents) {
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit(eventNames.CUSTOMER_SET_PAYMENT);
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit(eventNames.CUSTOMER_SET_ADDRESS);
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit(eventNames.CUSTOMER_SET_PHONE);
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit(eventNames.CUSTOMER_SET_EMAIL);
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    checkValidity(): TBuyerValidityMessages {
        const errors: TBuyerValidityMessages = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }

        return errors;
    }
}
