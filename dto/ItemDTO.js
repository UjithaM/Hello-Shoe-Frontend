class ItemDTO {
    constructor(itemCode, itemDescription, itemPicture, itemCategory, size, unitPriceSell, unitPriceBuy, expectedProfit, profitMargin, quantity, itemStatus, occasion, verities, gender, supplierCode) {
        this.itemCode = itemCode;
        this.itemDescription = itemDescription;
        this.itemPicture = itemPicture;
        this.itemCategory = itemCategory;
        this.size = size;
        this.unitPriceSell = unitPriceSell;
        this.unitPriceBuy = unitPriceBuy;
        this.expectedProfit = expectedProfit;
        this.profitMargin = profitMargin;
        this.quantity = quantity;
        this.itemStatus = itemStatus;
        this.occasion = occasion;
        this.verities = verities;
        this.gender = gender;
        this.supplierCode = supplierCode;
    }
}