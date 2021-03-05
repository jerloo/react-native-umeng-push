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
}

export interface PdaReadDataDtoHolder {
  item: PdaReadDataDto;
  showExtra: boolean;
}
