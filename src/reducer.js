import { combineReducers } from "redux";
import currentEvent from "./data/currentEvent.js";

export const reducer = combineReducers({
	currentEvent,
});