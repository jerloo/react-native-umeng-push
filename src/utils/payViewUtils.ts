import { PdaChargeListDto } from '../../apiclient/src/models';
import { sumNoFixed } from './sumUtils';

export interface PayViewModel {
  fees: number;
  money: number;
  showDeposit: boolean;
  canClickPay: boolean;
  canEditMoney: boolean;
}

export const getPayViewModel = (
  paymentBills: PdaChargeListDto[],
  deposit: number,
  canDeposit: boolean,
  canDepositShow: boolean,
) => {
  const viewModel: PayViewModel = {
    money: 0,
    showDeposit: true,
    canClickPay: true,
    canEditMoney: true,
  };
  const payBillsTotal = sumNoFixed([
    ...(paymentBills?.map((it) => it.extendedAmount || 0) || []),
    ...(paymentBills?.map((it) => it.lateFee || 0) || []),
  ]);
  if (canDeposit) {
    if (canDepositShow) {
      viewModel.fees = payBillsTotal;
      viewModel.money = payBillsTotal - deposit;
      viewModel.canEditMoney = true;
      viewModel.canClickPay = viewModel.money > 0;
    } else {
      viewModel.fees = payBillsTotal;
      viewModel.money = payBillsTotal;
      viewModel.canEditMoney = true;
      viewModel.canClickPay = false;
    }
  } else {
    viewModel.showDeposit = false;
    viewModel.canEditMoney = false;
    viewModel.money = payBillsTotal;
    viewModel.fees = payBillsTotal;
    viewModel.canClickPay = true;
  }
  return viewModel;
};
