import { createPinia } from 'pinia';
import { useCurrentUserStore } from './currentUser.js';
import { useCurrentEventStore } from './currentEvent.js';

export const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);

export const currentEventStore = useCurrentEventStore(pinia);