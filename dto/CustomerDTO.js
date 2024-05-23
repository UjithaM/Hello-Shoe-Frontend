class CustomerDTO {
    constructor(customerCode, name, gender, joinDate, level, totalPoints, dob, addressNo, lane, mainCity, mainState, postalCode, contactNumber, email, recentPurchaseDate) {
        this.customerCode = customerCode;
        this.name = name;
        this.gender = gender;
        this.joinDate = new Date(joinDate);
        this.level = level;
        this.totalPoints = totalPoints;
        this.dob = new Date(dob);
        this.addressNo = addressNo;
        this.lane = lane;
        this.mainCity = mainCity;
        this.mainState = mainState;
        this.postalCode = postalCode;
        this.contactNumber = contactNumber;
        this.email = email;
        if (recentPurchaseDate === null) {
            this.recentPurchaseDate = null;
        } else this.recentPurchaseDate = new Date(recentPurchaseDate);
    }
}
