import { createPinia } from "pinia";
import { useCurrentUserStore } from "./currentUser.js";

export const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);