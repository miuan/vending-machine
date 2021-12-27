import { Button } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { addDepositToUser, resetUserDeposit, selectDeposit } from "../../../../app/reducers/depositSlice";

export const CreditPanel = () => {
  const dispatch = useAppDispatch();
  const deposit = useAppSelector(selectDeposit);

  const addToDeposit = (add) => () => {
    dispatch(addDepositToUser(add));
  };

  const resetDeposit = () => {
    dispatch(resetUserDeposit());
  };

  return (
    <div className="Credit">
      <h2>Credit: {deposit}</h2>
      {[5, 10, 20, 50, 100].map((c) => (
        <Button key={`button-add-to-deposit-${c}`} variant="success" onClick={addToDeposit(c)}>
          {c}c
        </Button>
      ))}
      <Button variant="danger" onClick={() => resetDeposit()}>
        Reset
      </Button>
    </div>
  );
};
