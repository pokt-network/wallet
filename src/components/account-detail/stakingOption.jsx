import React from "react";
import IconAccount from "../../icons/iconAccount";
import IconStatus from "../../icons/iconStatus";

export default function StakingOption({
  className,
  token,
  status,
  accountType,
  ...props
}) {
  return (
    <div className={`staking-options ${className}`} {...props}>
      <div className="option-pokt">
        <h3>{token}</h3>
        <p>POKT Staked</p>
      </div>
      <div className="option-status">
        <h3>
          <IconStatus type={status.toLowerCase()} /> {status.toLowerCase()}
        </h3>
        <p className="p-near-icon">Staking Status</p>
      </div>
      <div className="option-type">
        <h3>
          <IconAccount type={accountType.toLowerCase()} /> {accountType}
        </h3>
        <p className="p-near-icon">Account Type</p>
      </div>
    </div>
  );
}
