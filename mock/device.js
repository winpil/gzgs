const Mock = require('mockjs')

module.exports = [
    {
        url: '/api/v1/device_gt_list',
        type: 'get',
        response: _ => {
            return {
                retcode: 200,
                status: "success",
                "result|20": [
                    {
                        id: "@integer(1, 9999)",
                        gt_id: "@string(lower, 8)",
                        area_id: "@integer(1000, 9999)",
                        area_name: "@string(lower, 6)",
                        name: "@string(lower, 8)",
                        length: "@string(lower, 10)",
                        longitude: '@string(lower, 6)',
                        latitude: '@string(lower, 6)'
                    }
                ]
            }
        }
    },

    {
        url: '/api/v1/device_smt_list',
        type: 'get',
        response: _ => {
            return {
                retcode: 200,
                status: "success",
                "result|20": [
                    {
                        "id": "@integer(1000, 9999)",
                        "smt_id": "@guid",
                        "gt_id": "@guid",
                        "area_id": "@integer(1000, 9999)",
                        "area_name": "@string(lower, 10)",
                        "name": "@string(lower, 10)",
                        longitude: '@string(lower, 6)',
                        latitude: '@string(lower, 6)',
                        "blocks|5-10": [
                            {
                                "id": "@integer(1000, 9999)",
                                "interval_start": "@integer(1000, 9999)",
                                "interval_end": "@integer(1000, 9999)",
                                "field_id": "@guid",
                                "zone": "@string(lower, 10)",
                                "smt_field": "@integer(1, 8)"
                            }
                        ]
                    }
                ]
            }
        }
    },

    {
        url: '/api/v1/device_query',
        type: 'get',
        response: _ => {
            return {
                retcode: 200,
                status: "success",
                result: [
                    {
                        device_id: 1,
                        lng: '116.361',
                        lat: '39.914'
                    },
                    {
                        device_id: 1,
                        lng: '116.364',
                        lat: '39.899'
                    },
                    {
                        device_id: 1,
                        lng: '116.382',
                        lat: '39.909'
                    },
                    {
                        device_id: 1,
                        lng: '116.404',
                        lat: '39.920'
                    },
                    {
                        device_id: 1,
                        lng: '116.423',
                        lat: '39.914'
                    }
                ]
            }
        }
    },

    {
        url: '/api/v1/area_gps_list',
        type: 'get',
        response: _ => {
            return {
                retcode: 200,
                status: "success",
                result: [
                    {
                        id: "1",
                        field: [ // 单个责任区
                            [
                                {
                                    "lng": "116.351",
                                    "lat": "39.911",
                                    "num": "1"
                                },
                                {
                                    "lng": "116.364",
                                    "lat": "39.930",
                                    "num": "2"
                                },
                                {
                                    "lng": "116.378",
                                    "lat": "39.899",
                                    "num": "3"
                                }
                            ],
                            [
                                {
                                    "lng": "116.378",
                                    "lat": "39.899",
                                    "num": "1"
                                },
                                {
                                    "lng": "116.382",
                                    "lat": "39.921",
                                    "num": "2"
                                },
                                {
                                    "lng": "116.395",
                                    "lat": "39.909",
                                    "num": "3"
                                }
                            ]
                        ]
                    },
                    {
                        id: "2",
                        field: [ // 单个责任区
                            [
                                {
                                    "lng": "116.395",
                                    "lat": "39.909",
                                    "num": "1"
                                },
                                {
                                    "lng": "116.404",
                                    "lat": "39.915",
                                    "num": "2"
                                },
                                {
                                    "lng": "116.405",
                                    "lat": "39.920",
                                    "num": "3"
                                },
                                {
                                    "lng": "116.423",
                                    "lat": "39.907",
                                    "num": "4"
                                }
                            ],
                            [
                                {
                                    "lng": "116.423",
                                    "lat": "39.907",
                                    "num": "1"
                                },
                                {
                                    "lng": "116.428",
                                    "lat": "39.914",
                                    "num": "2"
                                },
                                {
                                    "lng": "116.431",
                                    "lat": "39.919",
                                    "num": "3"
                                },
                                {
                                    "lng": "116.4345",
                                    "lat": "39.913",
                                    "num": "4"
                                },
                                {
                                    "lng": "116.447",
                                    "lat": "39.921",
                                    "num": "5"
                                },
                            ]
                        ]
                    }
                ]
            }
        }
    }
]