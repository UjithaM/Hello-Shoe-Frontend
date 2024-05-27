class EmployeeDTO {
    constructor(employeeCode, name, profilePicture, gender, civilStatus, Designation, role, dob, joinedDate, attachedBranch, addressNo, lane, mainCity, mainState, postalCode, contactNumber, email, guardianName, guardianContact) {
        this.employeeCode = employeeCode;
        this.name = name;
        this.profilePicture = profilePicture;
        this.gender = gender;
        this.civilStatus = civilStatus;
        this.Designation = Designation;
        this.role = role;
        this.dob = new Date(dob);
        this.joinedDate = new Date(joinedDate);
        this.attachedBranch = attachedBranch;
        this.addressNo = addressNo;
        this.lane = lane;
        this.mainCity = mainCity;
        this.mainState = mainState;
        this.postalCode = postalCode;
        this.contactNumber = contactNumber;
        this.email = email;
        this.guardianName = guardianName;
        this.guardianContact = guardianContact;
    }
}
