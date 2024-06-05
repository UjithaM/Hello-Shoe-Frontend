$("#login").click(async function () {
    $("#sign_section").css("display", "none");
    $("#login_section").css("display", "block");
});

var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var stringPattern = /^[a-zA-Z]+$/;

$("#signInButton").click(async function (event) {

    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#signInEmail").val();
    var password = $("#signInPassword").val();
    var role = $("#roleSelector").val();


        let isFirstNameValid = stringPattern.test(firstName);
        
        
        if (firstName && isFirstNameValid){
            let isLastNameValid = stringPattern.test(lastName);
            if (lastName && isLastNameValid){
                
                let isEmailValid = emailPattern.test(email);
                if (email && isEmailValid){
                    if (password){
                     if (role !== ""){
                         try {
                             const response = await $.ajax({
                                 type: "POST",
                                 url: "http://localhost:8080/helloShoes/api/v1/auth/signup",
                                 data: JSON.stringify({
                                     firstName: firstName,
                                     lastName: lastName,
                                     email: email,
                                     password: password,
                                     role: role
                                 }),
                                 contentType: "application/json"
                             });
                             
                             

                             const tokenString = response.token;
                             const [accessToken, refreshToken] = tokenString.split(':').map(token => token.trim());

                             localStorage.setItem('accessToken', accessToken);
                             localStorage.setItem('refreshToken', refreshToken);
                             localStorage.setItem('employeeCode', response.employeeCode);

                             $('#sign_section').fadeOut('slow', function () {
                                 $("#dashboard").css("display", "block");
                                 $('#dashboard').fadeIn('slow');
                                 $("header").show();
                                 $("main").show();
                             });
                         } catch (error) {
                             console.log(error.responseText);
                             Swal.fire({
                                 icon: "error",
                                 title: "Oops...",
                                 text: "Your Password or Email is invalid!",
                             });
                         }
                         
                     }else {
                         Swal.fire({
                             icon: "error",
                             title: "Oops...",
                             text: "select a role!",
                         });
                     }
                     
                    }else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Your Password is invalid!",
                        });
                    }

                }else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Your Email is invalid!",
                    });
                }
            }else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Your Last Name is invalid!",
                });
            }
            
        }else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your First Name is invalid!",
            });
        }
        
        

});

