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
 * Pda抄表附件
 * @export
 * @interface ReadingFileDto
 */
export interface ReadingFileDto {
    /**
     * 抄表年月
     * @type {number}
     * @memberof ReadingFileDto
     */
    billMonth?: any;
    /**
     * 客户编号
     * @type {number}
     * @memberof ReadingFileDto
     */
    custId?: any;
    /**
     * 抄次
     * @type {number}
     * @memberof ReadingFileDto
     */
    readTimes?: any;
    /**
     * 附件列表
     * @type {Array&lt;MobileFileDto&gt;}
     * @memberof ReadingFileDto
     */
    files?: any;
}
