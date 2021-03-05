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
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { UploadMobileLogFileDto } from '../models';
import { UploadReadingDataDto } from '../models';
import { UploadReadingFileDto } from '../models';
import { UploadTrajectoryDto } from '../models';
/**
 * MobileReadingApi - axios parameter creator
 * @export
 */
export const MobileReadingApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary pda日志上传
         * @param {UploadMobileLogFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadMobileLogFilePost: async (body: UploadMobileLogFileDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling apiAppMobileReadingUploadMobileLogFilePost.');
            }
            const localVarPath = `/api/app/mobileReading/uploadMobileLogFile`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["Authorization"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json-patch+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary pda抄表数据上传
         * @param {UploadReadingDataDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadReadingDatePost: async (body: UploadReadingDataDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling apiAppMobileReadingUploadReadingDatePost.');
            }
            const localVarPath = `/api/app/mobileReading/uploadReadingDate`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["Authorization"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json-patch+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary pda抄表附件上传
         * @param {UploadReadingFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadReadingFilePost: async (body: UploadReadingFileDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling apiAppMobileReadingUploadReadingFilePost.');
            }
            const localVarPath = `/api/app/mobileReading/uploadReadingFile`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["Authorization"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json-patch+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary 抄表员轨迹上传
         * @param {UploadTrajectoryDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadTrajectoryPost: async (body: UploadTrajectoryDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling apiAppMobileReadingUploadTrajectoryPost.');
            }
            const localVarPath = `/api/app/mobileReading/uploadTrajectory`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["Authorization"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json-patch+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * MobileReadingApi - functional programming interface
 * @export
 */
export const MobileReadingApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary pda日志上传
         * @param {UploadMobileLogFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAppMobileReadingUploadMobileLogFilePost(body: UploadMobileLogFileDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await MobileReadingApiAxiosParamCreator(configuration).apiAppMobileReadingUploadMobileLogFilePost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary pda抄表数据上传
         * @param {UploadReadingDataDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAppMobileReadingUploadReadingDatePost(body: UploadReadingDataDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await MobileReadingApiAxiosParamCreator(configuration).apiAppMobileReadingUploadReadingDatePost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary pda抄表附件上传
         * @param {UploadReadingFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAppMobileReadingUploadReadingFilePost(body: UploadReadingFileDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await MobileReadingApiAxiosParamCreator(configuration).apiAppMobileReadingUploadReadingFilePost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary 抄表员轨迹上传
         * @param {UploadTrajectoryDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAppMobileReadingUploadTrajectoryPost(body: UploadTrajectoryDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await MobileReadingApiAxiosParamCreator(configuration).apiAppMobileReadingUploadTrajectoryPost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * MobileReadingApi - factory interface
 * @export
 */
export const MobileReadingApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary pda日志上传
         * @param {UploadMobileLogFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadMobileLogFilePost(body: UploadMobileLogFileDto, options?: any): AxiosPromise<void> {
            return MobileReadingApiFp(configuration).apiAppMobileReadingUploadMobileLogFilePost(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary pda抄表数据上传
         * @param {UploadReadingDataDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadReadingDatePost(body: UploadReadingDataDto, options?: any): AxiosPromise<void> {
            return MobileReadingApiFp(configuration).apiAppMobileReadingUploadReadingDatePost(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary pda抄表附件上传
         * @param {UploadReadingFileDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadReadingFilePost(body: UploadReadingFileDto, options?: any): AxiosPromise<void> {
            return MobileReadingApiFp(configuration).apiAppMobileReadingUploadReadingFilePost(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary 抄表员轨迹上传
         * @param {UploadTrajectoryDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAppMobileReadingUploadTrajectoryPost(body: UploadTrajectoryDto, options?: any): AxiosPromise<void> {
            return MobileReadingApiFp(configuration).apiAppMobileReadingUploadTrajectoryPost(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * MobileReadingApi - object-oriented interface
 * @export
 * @class MobileReadingApi
 * @extends {BaseAPI}
 */
export class MobileReadingApi extends BaseAPI {
    /**
     * 
     * @summary pda日志上传
     * @param {UploadMobileLogFileDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MobileReadingApi
     */
    public apiAppMobileReadingUploadMobileLogFilePost(body: UploadMobileLogFileDto, options?: any) {
        return MobileReadingApiFp(this.configuration).apiAppMobileReadingUploadMobileLogFilePost(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary pda抄表数据上传
     * @param {UploadReadingDataDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MobileReadingApi
     */
    public apiAppMobileReadingUploadReadingDatePost(body: UploadReadingDataDto, options?: any) {
        return MobileReadingApiFp(this.configuration).apiAppMobileReadingUploadReadingDatePost(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary pda抄表附件上传
     * @param {UploadReadingFileDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MobileReadingApi
     */
    public apiAppMobileReadingUploadReadingFilePost(body: UploadReadingFileDto, options?: any) {
        return MobileReadingApiFp(this.configuration).apiAppMobileReadingUploadReadingFilePost(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary 抄表员轨迹上传
     * @param {UploadTrajectoryDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MobileReadingApi
     */
    public apiAppMobileReadingUploadTrajectoryPost(body: UploadTrajectoryDto, options?: any) {
        return MobileReadingApiFp(this.configuration).apiAppMobileReadingUploadTrajectoryPost(body, options).then((request) => request(this.axios, this.basePath));
    }
}
