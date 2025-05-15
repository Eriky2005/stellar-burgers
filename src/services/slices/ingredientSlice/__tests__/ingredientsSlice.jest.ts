import { getIngredients, ingredientsSliceReducer, initialState } from "../ingredientSlice";
import { ingredients } from "../mockIngredientsData";

describe('Тесты асинхронных экшенов', () => {
	const expectedResult = ingredients;

	test('Тестирование загрузки ингридиентов при fulfilled', () => {
		const state = ingredientsSliceReducer(initialState, getIngredients.fulfilled(expectedResult, 'fulfilled'));
		expect(state.loadingData).toBe(false)
		expect(state.ingredients).toBe(expectedResult)
	});

	test('Тестирование выдачи ошибки при rejected', () => {
		const state = ingredientsSliceReducer(initialState, getIngredients.rejected(new Error('error'), 'rejected'));
		expect(state.loadingData).toBe(false);
		expect(state.error).toBe('error');
	});

	test('Тестирование состояния загрузки при pending', () => {
		const state = ingredientsSliceReducer(initialState, getIngredients.pending('pending'));
		expect(state.loadingData).toBe(true);
	});
});