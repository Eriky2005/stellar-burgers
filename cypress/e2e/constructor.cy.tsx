const testUrl = 'http://localhost:4000';
const burgerConstructorSelector = '[data-cy=burger-constructor]';
const mainsConstructorSelector = '[data-cy=ingredients-mains]';
const saucesConstructorSelector = '[data-cy=ingredients-sauces]';
const closeModalSelector = '[data-cy=modal-close]';
const closeModalOverlay = '[data-cy=modal-overlay]';

describe('Проверяем доступность приложения', () => {
	beforeEach(() => {
		cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' })
		cy.visit(testUrl);
	});

	it('Добавление ингредиента из списка в конструктор', () => {
		cy.get(mainsConstructorSelector).contains('Добавить').click();
		cy.get(saucesConstructorSelector).contains('Добавить').click();
		cy.get(burgerConstructorSelector).contains('Ингредиент 2').should('exist');
		cy.get(burgerConstructorSelector).contains('Ингредиент 4').should('exist');
	});
});

describe('Тестирование модальных окон', () => {
	beforeEach(() => {
		cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' })
		cy.visit(testUrl);
	});

	it('Открытие модального окна ингредиента', () => {
		cy.contains('Детали ингредиента').should('not.exist');
		cy.contains('Ингредиент 1').click();
		cy.contains('Детали ингредиента').should('exist');
		cy.get('#modals').contains('Ингредиент 1').should('exist');
	});

	it('Закрытие модального окна ингредиента по крестику', () => {
		cy.contains('Ингредиент 1').click();
		cy.contains('Детали ингредиента').should('exist');
		cy.get(closeModalSelector).click();
		cy.contains('Детали ингредиента').should('not.exist');
	});

	it('Закрытие модального окна ингредиента по оверлею', () => {
		cy.contains('Ингредиент 1').click();
		cy.contains('Детали ингредиента').should('exist');
		cy.get(closeModalOverlay).click({ force: true });
		cy.contains('Детали ингредиента').should('not.exist');
	});
});

describe('Тестирование создания заказа', () => {
	beforeEach(() => {
		cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
		cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' });
		cy.intercept('POST', 'api/orders', { fixture: 'userOrder.json' }).as('postOrder');
		window.localStorage.setItem('refreshToken', JSON.stringify('fakeRefreshToken'));
		cy.setCookie('accessToken', 'fakeAccessToken');
		cy.visit(testUrl);
	});

	afterEach(() => {
		window.localStorage.clear();
		cy.clearCookies();
	});

	it('Сборка и оформление заказа', () => {
		cy.get('[data-cy=ingredients-buns]').contains('Добавить').click();
		cy.get(mainsConstructorSelector).contains('Добавить').click();
		cy.get(saucesConstructorSelector).contains('Добавить').click();
		cy.get('[data-cy=order-button]').click();
		cy.get('[data-cy=order-number]').contains('1').should('exist');

		cy.get(closeModalSelector).click();
		cy.get('[data-cy=order-number]').should('not.exist');

		cy.get(burgerConstructorSelector)
			.contains('Ингредиент 1')
			.should('not.exist');
		cy.get(burgerConstructorSelector)
			.contains('Ингредиент 2')
			.should('not.exist');
		cy.get(burgerConstructorSelector)
			.contains('Ингредиент 4')
			.should('not.exist');

	});
});
