import { PdaChargeListDto } from '../../apiclient/src/models';
import { l } from './logUtils';
import { sumNoFixed } from './sumUtils';

export interface PayViewModel {
  /**
   * 费用总和
   */
  fees: number;
  /**
   * 应缴总金额
   */
  money: number;
  /**
   * 是否先死预存余额
   */
  showDeposit: boolean;
  /**
   * 是否可以点击去收费
   */
  canClickPay: boolean;
  /**
   * 是否可以编辑现金缴费金额
   */
  canEditMoney: boolean;
}

/**
 * 5、是否启用预存（IS_OPEN_DEPOSIT），手机操作时，当参数为1时候，显示预存余额，点击缴费时，实际缴费金额可大于应缴金额；否则实际缴费金额不允许修改；
6、是否允许预存抵扣（IS_SHOW_DEPOSIT_PAY），只有当参数5是否启用预存款配置值为1的时候，该参数才有效；
如客户A，202012月欠费金额为100，预存款余额为10
 若参数5配置值为1，参数6配置值为1，则点击缴费时应该缴纳金额为100-10=90；金额可修改，但是要大于等于90；应缴金额=账单金额+违约金-预存款，若值小于等0，则不能点击缴费；
 若参数5配置值为1，参数6配置值为0，则点击缴费时应该缴纳金额为100；金额可修改，但是要大于等于100；应缴金额=账单金额+违约金
 若参数5配置值为0，则参数6配置值无效，页面不显示预存余额，应缴金额不能修改；应缴金额=账单金额+违约金
 * @param paymentBills
 * @param deposit 预存
 * @param canDeposit 是否启用预存
 * @param canDepositPay 是否允许预存抵扣
 * @returns
 */
export const getPayViewModel = (
  paymentBills: PdaChargeListDto[],
  deposit: number,
  canDeposit: boolean,
  canDepositPay: boolean,
) => {
  const viewModel: PayViewModel = {
    fees: 0,
    money: 0,
    showDeposit: true,
    canClickPay: true,
    canEditMoney: true,
  };
  let payBillsTotal = sumNoFixed([
    ...(paymentBills?.map((it) => it.extendedAmount || 0) || []),
    ...(paymentBills?.map((it) => it.lateFee || 0) || []),
  ]);
  if (canDeposit) {
    l.info('启用预存');
    if (canDepositPay) {
      l.info('允许预存抵扣');
      viewModel.fees = payBillsTotal;
      viewModel.money = payBillsTotal - deposit;
      viewModel.canEditMoney = true;
      viewModel.canClickPay = viewModel.money > 0;
    } else {
      l.info('不允许预存抵扣');
      viewModel.fees = payBillsTotal;
      viewModel.money = payBillsTotal;
      viewModel.canEditMoney = true;
      viewModel.canClickPay = viewModel.money > 0;
    }
  } else {
    l.info('不启用预存');
    viewModel.showDeposit = false;
    viewModel.canEditMoney = false;
    viewModel.money = payBillsTotal;
    viewModel.fees = payBillsTotal;
    viewModel.canClickPay = true;
  }
  return viewModel;
};
