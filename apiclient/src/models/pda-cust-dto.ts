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

import { PdaBillingInfo } from "./pda-billing-info";
import { PdaCustInfo } from "./pda-cust-info";
import { PdaPayRecord } from "./pda-pay-record";
import { PdaReadingRecord } from "./pda-reading-record";

/**
 * 客户详情
 * @export
 * @interface PdaCustDto
 */
export interface PdaCustDto {
    /**
     * 客户编号
     * @type {number}
     * @memberof PdaCustDto
     */
    custId?: number;
    /**
     * 
     * @type {PdaCustInfo}
     * @memberof PdaCustDto
     */
    custInfo?: PdaCustInfo;
    /**
     * 
     * @type {Array&lt;PdaReadingRecord&gt;}
     * @memberof PdaCustDto
     */
    readingRecords?: PdaReadingRecord[];
    /**
     * 
     * @type {Array&lt;PdaBillingInfo&gt;}
     * @memberof PdaCustDto
     */
    billingInfos?: PdaBillingInfo[];
    /**
     * 
     * @type {Array&lt;PdaPayRecord&gt;}
     * @memberof PdaCustDto
     */
    payRecords?: PdaPayRecord[];
}
