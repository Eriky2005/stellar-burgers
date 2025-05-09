import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getLastOrder,
  getOrderRequestStatus,
  getUserAuthStatus,
  newUserOrder,
  setLastOrder
} from '../../services/slices/userSlice/userSlice';
import {
  getConstructorBun,
  getConstructorIngredients,
  resetConstructor
} from '../../services/slices/constructorSlice/constructorSlice';
import { getAllFeeds } from '../../services/slices/feedSlice/feedSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getUserAuthStatus);
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorIngredients = useSelector(getConstructorIngredients);
  const constructorBun = useSelector(getConstructorBun);
  const dispatch = useDispatch();
  const constructorItems = {
    bun: constructorBun,
    ingredients: constructorIngredients
  };
  const orderRequest = useSelector(getOrderRequestStatus);

  const orderModalData = useSelector(getLastOrder);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientsId: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      )
    ];

    dispatch(newUserOrder(ingredientsId));
    dispatch(resetConstructor());
    dispatch(getAllFeeds());
  };
  const closeOrderModal = () => dispatch(setLastOrder(null));

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
