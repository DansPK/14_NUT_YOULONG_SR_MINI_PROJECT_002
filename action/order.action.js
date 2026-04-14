"use server";

import { createOrderService, getOrdersService } from "../service/order.service";

export async function createOrderAction(orderDetailRequests) {
    try {
        const res = await createOrderService(orderDetailRequests);
        return { success: true, payload: res?.payload };
    } catch (error) {
        console.log("Error creating order:", error);
        return { success: false, error: error.message };
    }
}

export async function getOrdersAction() {
    try {
        const res = await getOrdersService();
        return res?.payload ?? [];
    } catch (error) {
        console.log("Error fetching orders:", error);
        return [];
    }
}

