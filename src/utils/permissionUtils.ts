export const PERMISSION_TASK = 'MeterReading.MobileReading.Task';
export const PERMISSION_ARREARAGES = 'MeterReading.MobileReading.Arrearages';
export const PERMISSION_CHARGE_DETAILS =
  'MeterReading.MobileReading.ChargeDetail';
export const PERMISSION_READ_TOTAL = 'MeterReading.MobileReading.ReadTotal';
export const PERMISSION_CHARGE_TOTAL = 'MeterReading.MobileReading.ChargeTotal';

export interface Permission {
  code: string;
  icon: any;
  title: string;
  route: string;
}

const taskAsset = require('../assets/shouye-chaobiaorengwu.png');
const arrearageAsset = require('../assets/shouye_qianfeichaxun.png');
const chargeDetailsAsset = require('../assets/shouye-shoufeimingxi.png');
const readTotalAsset = require('../assets/shouye-chaobiaohuizong.png');
const chargeTotalAsset = require('../assets/shouye-shoufeihuizong.png');

export const Permissions = [
  {
    code: PERMISSION_TASK,
    icon: taskAsset,
    title: '抄表任务',
    route: 'Books',
  },
  {
    code: PERMISSION_ARREARAGES,
    icon: arrearageAsset,
    title: '欠费查询',
    route: 'Arrearages',
  },
  {
    code: PERMISSION_CHARGE_DETAILS,
    icon: chargeDetailsAsset,
    title: '收费明细',
    route: 'PaymentSubtotal',
  },
  {
    code: PERMISSION_READ_TOTAL,
    icon: readTotalAsset,
    title: '抄表汇总',
    route: 'ReadingCollect',
  },
  {
    code: PERMISSION_CHARGE_TOTAL,
    icon: chargeTotalAsset,
    title: '收费汇总',
    route: 'PaymentCollect',
  },
];
