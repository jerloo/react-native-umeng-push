/* tslint:disable */
/* eslint-disable */
/**
 * 抄表系统 - Pda抄表
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 账单明细
 * @export
 * @interface PdaChargeDetails
 */
export interface PdaChargeDetails {
    /**
     * 费用组成
     * @type {string}
     * @memberof PdaChargeDetails
     */
    feeItem?: any;
    /**
     * 费用代码
     * @type {string}
     * @memberof PdaChargeDetails
     */
    feeItemCode?: any;
    /**
     * 单价
     * @type {string}
     * @memberof PdaChargeDetails
     */
    price?: any;
    /**
     * 水量
     * @type {number}
     * @memberof PdaChargeDetails
     */
    water?: any;
    /**
     * 金额
     * @type {number}
     * @memberof PdaChargeDetails
     */
    money?: any;
}
