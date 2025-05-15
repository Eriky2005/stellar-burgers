import { combineReducers } from "@reduxjs/toolkit";
import { ingredientsSliceReducer } from "../slices/ingredientSlice/ingredientSlice";
import { burgerConstructorSliceReducer } from "../slices/constructorSlice/constructorSlice";
import { feedsSliceReducer } from "../slices/feedSlice/feedSlice";
import { userSliceReducer } from "../slices/userSlice/userSlice";

describe('Тестирование rootReducer', () => {
	it('Проверка правильной настройки', () => {
		const rootReducer = combineReducers({
			ingredients: ingredientsSliceReducer,
			constructorItems: burgerConstructorSliceReducer,
			feeds: feedsSliceReducer,
			user: userSliceReducer
		});

		const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' })

		expect(initialState).toEqual({
			ingredients: ingredientsSliceReducer(undefined, { type: 'UNKNOWN_ACTION' }),
			constructorItems: burgerConstructorSliceReducer(undefined, { type: 'UNKNOWN_ACTION' }),
			feeds: feedsSliceReducer(undefined, { type: 'UNKNOWN_ACTION' }),
			user: userSliceReducer(undefined, { type: 'UNKNOWN_ACTION' })
		});
	});
});