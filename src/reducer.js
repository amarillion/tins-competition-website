import { combineReducers } from "redux";
import currentEvent from "./data/currentEvent.js";
import currentUser from "./data/currentUser.js";

export const reducer = combineReducers({
	currentEvent,
	currentUser
});