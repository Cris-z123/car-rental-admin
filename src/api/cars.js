import service from "../utils/request"

export function addCars(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/add/",
        data
    })
}

export function carsStatus(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/status/",
        data
    })
}


export function carsDelete(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/delete/",
        data
    })
}

export function carsDetailed(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/detailed/",
        data
    })
}

export function carsEdit(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/edit/",
        data
    })
}