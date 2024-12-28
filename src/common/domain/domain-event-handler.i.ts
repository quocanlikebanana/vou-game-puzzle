import { IDomainEvent } from "./domain-event.i";

export interface DomainEventHandler<T extends IDomainEvent> {
    handle(event: T): void;
}