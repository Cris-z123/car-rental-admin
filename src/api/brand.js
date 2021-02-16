import service from "../utils/request"

export function brandLogo(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/logo/",
        data
    })
}


export function brandAdd(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/add/",
        data
    })
}


export function brandDelete(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/delete/",
        data
    })
}

export function brandEdit(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/edit/",
        data
    })
}


export function brandStatus(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/status/",
        data
    })
}