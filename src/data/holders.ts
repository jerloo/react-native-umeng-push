import { PdaReadDataDto } from '../../apiclient/src/models';

export interface PdaMeterBookDtoHolder {
  /**
   * 账务年月
   * @type {number}
   * @memberof PdaMeterBookDto
   */
  billMonth?: any;
  /**
   * 册本编号
   * @type {number}
   * @memberof PdaMeterBookDto
   */
  bookId?: any;
  /**
   * 册本编码 创建由[Sequence]获取
   * @type {string}
   * @memberof PdaMeterBookDto
   */
  bookCode?: any;
  /**
   * 册本名称
   * @type {string}
   * @memberof PdaMeterBookDto
   */
  bookName?: any;
  /**
   * 抄表周期
   * @type {number}
   * @memberof PdaMeterBookDto
   */
  readCycle?: any;
  /**
   * 备注
   * @type {string}
   * @memberof PdaMeterBookDto
   */
  remark?: any;
  /**
   * 已抄数
   * @type {number}
   * @memberof PdaMeterBookDto
   */
  readingNumber?: any;
  /**
   * 应抄数
   * @type {number}
   * @memberof PdaMeterBookDto
   */
  totalNumber?: any;

  checked: boolean;

  downloaded: boolean;
  uploadedNumber?: number;
}

export interface PdaReadDataDtoHolder {
  item: PdaReadDataDto;
  showExtra: boolean;
}

/**
 * 账单信息
 * @export
 * @interface PdaBillingInfo
 */
export interface PdaBillingInfoHolder {
  custId: number;
  /**
   * 账务年月
   * @type {number}
   * @memberof PdaBillingInfo
   */
  billMonth?: any;
  /**
   * 开账水量
   * @type {number}
   * @memberof PdaBillingInfo
   */
  billWater?: any;
  /**
   * 账单金额
   * @type {number}
   * @memberof PdaBillingInfo
   */
  extendedAmount?: any;
  /**
   * 违约金
   * @type {number}
   * @memberof PdaBillingInfo
   */
  lateFee?: any;
  /**
   * 欠费标志  0：欠费
   * @type {number}
   * @memberof PdaBillingInfo
   */
  payState?: any;
}

/**
 * 缴费记录
 * @export
 * @interface PdaPayRecord
 */
export interface PdaPayRecordHolder {
  custId: number;
  /**
   * 缴费时间
   * @type {string}
   * @memberof PdaPayRecord
   */
  payDate?: any;
  /**
   * 收费员
   * @type {string}
   * @memberof PdaPayRecord
   */
  cashier?: any;
  /**
   * 实缴金额
   * @type {number}
   * @memberof PdaPayRecord
   */
  actualMoney?: any;
  /**
   * 余额
   * @type {number}
   * @memberof PdaPayRecord
   */
  deposit?: any;
}

/**
 * 抄表记录
 * @export
 * @interface PdaReadingRecord
 */
export interface PdaReadingRecordHolder {
  custId: number;
  /**
   * 抄表年月
   * @type {number}
   * @memberof PdaReadingRecord
   */
  billMonth?: any;
  /**
   * 抄表时间
   * @type {string}
   * @memberof PdaReadingRecord
   */
  readingDate?: any;
  /**
   * 上期抄码
   * @type {number}
   * @memberof PdaReadingRecord
   */
  lastReading?: any;
  /**
   * 本期抄码
   * @type {number}
   * @memberof PdaReadingRecord
   */
  reading?: any;
  /**
   * 本期水量
   * @type {number}
   * @memberof PdaReadingRecord
   */
  readWater?: any;
}

/**
 * 基础信息
 * @export
 * @interface PdaCustInfo
 */
export interface PdaCustInfoHolder {
  custId: number;
  /**
   * 客户名称
   * @type {string}
   * @memberof PdaCustInfo
   */
  custName?: any;
  /**
   * 客户地址
   * @type {string}
   * @memberof PdaCustInfo
   */
  custAddress?: any;
  /**
   * 营业站点
   * @type {string}
   * @memberof PdaCustInfo
   */
  orgName?: any;
  /**
   * 联系电话
   * @type {string}
   * @memberof PdaCustInfo
   */
  mobile?: any;
  /**
   * 人口数
   * @type {number}
   * @memberof PdaCustInfo
   */
  population?: any;
  /**
   * 缴费方式
   * @type {string}
   * @memberof PdaCustInfo
   */
  payMethod?: any;
  /**
   * 用户类型
   * @type {string}
   * @memberof PdaCustInfo
   */
  custType?: any;
  /**
   * 用水性质
   * @type {string}
   * @memberof PdaCustInfo
   */
  priceCode?: any;
  /**
   * 预存余额
   * @type {number}
   * @memberof PdaCustInfo
   */
  deposit?: any;
  /**
   * 年度使用量
   * @type {number}
   * @memberof PdaCustInfo
   */
  yearTotalWater?: any;
  /**
   * 当前底码
   * @type {number}
   * @memberof PdaCustInfo
   */
  reading?: any;
  /**
   * 安装位置
   * @type {string}
   * @memberof PdaCustInfo
   */
  installLocation?: any;
  /**
   * 钢印号
   * @type {string}
   * @memberof PdaCustInfo
   */
  steelMark?: any;
  /**
   * 水表口径
   * @type {string}
   * @memberof PdaCustInfo
   */
  caliber?: any;
  /**
   * 水表厂家
   * @type {string}
   * @memberof PdaCustInfo
   */
  producer?: any;
  /**
   * 换表日期
   * @type {string}
   * @memberof PdaCustInfo
   */
  replaceDate?: any;
  /**
   * 立户日期
   * @type {string}
   * @memberof PdaCustInfo
   */
  buildDate?: any;
}
