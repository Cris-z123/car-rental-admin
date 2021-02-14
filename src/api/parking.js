import service from "../utils/request"

export function parkingAdd(data = {}) {
    return service.request({
        method: "post",
        url: "/parking/add",
        data
    })
}

export function parkingList(data = {}) {
    return service.request({
        method: "post",
        url: "/parking/list",
        data
    })
}

export function parkingDetailed(data = {}) {
    return service.request({
        method: "post",
        url: "/parking/detailed",
        data
    })
}