var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

$("#registerButton").click(async function () {
    $("#sign_section").css("display", "block");
    $("#login_section").css("display", "none");
});

$("#loginButton").click(async function () {
    
    var userName = $("#email").val();
    var password = $("#password").val();
    let isEmailValid = emailPattern.test(userName);

    if (userName && isEmailValid) {

        if (password) {

            try {
                const response = await $.ajax({
                    type: "POST",
                    url: "http://localhost:8080/helloShoes/api/v1/auth/signin",
                    data: JSON.stringify({
                        email: userName,
                        password: password
                    }),
                    contentType: "application/json"
                });

                const tokenString = response.token;
                const [accessToken, refreshToken] = tokenString.split(':').map(token => token.trim());

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                $('#login_section').fadeOut('slow', function () {
                    $("#dashboard").css("display", "block");
                    $("header").show();
                    $("main").show();
                    $('#dashboard').fadeIn('slow');
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.responseText,
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your Password or Email is invalid!",
            });
        }
    } else {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your Password or Email is invalid!",
        });

    }

});
