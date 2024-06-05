class OrderDTO {
    constructor(orderNo, purchaseDate, paymentMethod, totalPrice, orderItems, orderAccessories, customerCode, employeeCode) {
        this.orderNo = orderNo;
        this.purchaseDate = purchaseDate;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
        this.orderAccessories = orderAccessories;
        this.customerCode = customerCode;
        this.employeeCode = employeeCode;
    }
}