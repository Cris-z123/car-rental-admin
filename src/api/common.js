import service from "../utils/request";
import requestUrl from "./requestURL"
/**
 * 获取城市列表
 */
export function GetCity(data = {}) {
    return service.request({
        method: "post",
        url: "/cityPicker/",
        data
    })
}


export function GetTableData(params = {}) {
    return service.request({
        method: "post",
        url: requestUrl[params.url],
        data: params.data
    })
}

export function getCarsBrand(data = {}) {
    return service.request({
        method: "post",
        url: "/common/getCarsBrand",
        data
    })
}

export function getParking(data = {}) {
    return service.request({
        method: "post",
        url: "/common/getParking/",
        data
    })
}