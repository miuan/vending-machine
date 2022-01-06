import { Button } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { addDepositToUser, resetUserDeposit, selectChange, selectDeposit, takeChange } from "../../../../app/reducers/depositSlice";
import ResetChangeModal from "./ResetChangeModal";

export const CreditPanel = () => {
  const dispatch = useAppDispatch();
  const deposit = useAppSelector(selectDeposit);
  const change = useAppSelector(selectChange);

  const addToDeposit = (add) => () => {
    dispatch(addDepositToUser(add));
  };

  const resetDeposit = () => {
    dispatch(resetUserDeposit());
  };

  const onHideChange = () => {
    dispatch(takeChange());
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
      <ResetChangeModal change={change} onHide={onHideChange} />
    </div>
  );
};
