var loginService = {
  init: function () {
    $("#loginForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
      },
      messages: {
        email: "Please enter a valid email address",
        password: {
          required: "Please enter a password",
          minlength: "Password must be at least 6 characters long",
        },
      },
      submitHandler: function (form, event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        /*var hcaptchaResponse = hcaptcha.getResponse();
        if (!hcaptchaResponse) {
          toastr.error("Please complete the captcha");
          return;
        }*/

        $("body").block({
          message:
            '<div class="spinner-border text-primary" role="status"></div>',
          css: {
            backgroundColor: "transparent",
            color: "0",
            border: "none",
          },
          overlayCSS: {
            backgroundColor: "#000",
            opacity: 0.25,
          },
        });

        let data = loginService.serializeForm(form);
        //data["h-captcha-response"] = hcaptchaResponse;
        $.ajax({
          type: "POST",
          url: "../rest/customers/login",
          data: data,
          headers: {
            Authentication: localStorage.getItem("token"),
          },
          success: function (response) {
            $("body").unblock();
            if (response.token) {
              // Clear form
              $("#loginForm")[0].reset();
              event.preventDefault();
              localStorage.setItem("token", response.token);
              toastr.success("Logged in successfully");
              // Redirect to #home
              window.location.href = "#home";
              location.reload();
            } else if (response.message) {
              toastr.error(response.message);
            } else {
              toastr.error("Token not received");
            }
          },
          error: function (xhr, status, error) {
            $("body").unblock();
            var errorMessage;
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            } else {
              errorMessage = "An error occurred.";
            }
            toastr.error(errorMessage);
            console.log(xhr.responseText);
          },
        });
      },
    });
  },

  serializeForm: function (form) {
    let jsonResult = {};
    $.each($(form).serializeArray(), function () {
      jsonResult[this.name] = this.value;
    });
    return jsonResult;
  },
};
