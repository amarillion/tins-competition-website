import { combineReducers } from "redux";
import currentEvent from "./data/currentEvent.js";
import news from "./data/news.js";
import currentUser from "./data/currentUser.js";

export const reducer = combineReducers({
	news,
	currentEvent,
	currentUser
});