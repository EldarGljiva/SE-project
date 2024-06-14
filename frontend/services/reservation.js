var reservationService = {
  // Get today's date in the format YYYY-MM-DD
  today: new Date().toISOString().split("T")[0],

  // Set the minimum date for the input field
  setMinDate: function () {
    var reservationDateInput = document.getElementById("reservationDate");
    if (reservationDateInput) {
      reservationDateInput.setAttribute("min", this.today);
    }
  },

  // Get all tables and populate the select dropdown
  getAllTables: function () {
    $.ajax({
      url: "../rest/restauranttables",
      type: "GET",
      headers: {
        Authentication: localStorage.getItem("token"),
      },
      success: function (data) {
        let html = "";
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.reserved !== 1) {
            html +=
              '<option value="' +
              item.tableNumber +
              '">' +
              item.tableNumber +
              "</option>";
          }
        }
        $("#table").html(html);
      },
      error: function (xhr, status, error) {
        // handle error
      },
    });
  },

  // Initialize form validation and handle form submission for making reservations
  initFormValidation: function () {
    $("#reservationForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
          equalToTokenEmail: true, // Custom validation method to check against token email
        },
        tableNumber: {
          required: true,
        },
        reservationDate: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address",
          equalToTokenEmail: "Entered email must match your logged-in email",
        },
        tableNumber: "Please select a table",
        reservationDate: "Please select a date",
      },
      submitHandler: function (form, event) {
        event.preventDefault();
        event.stopImmediatePropagation();
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

        let data = reservationService.serializeForm(form);
        $.ajax({
          type: "POST",
          url: "../rest/reservations",
          data: data,
          headers: {
            Authentication: localStorage.getItem("token"),
          },
          success: function (response) {
            $("body").unblock();
            if (response.message) {
              toastr.success(response.message);
              // Clear form
              $("#reservationForm")[0].reset();
              // Update the displayed reservations after successful reservation
              reservationService.getReservations();
              location.reload();
            } else {
              toastr.error(response.error);
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

    // Custom validation method to check if entered email matches token email
    $.validator.addMethod("equalToTokenEmail", function (value, element) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        const tokenEmail = decodedToken.customer.email;
        return value === tokenEmail;
      }
      return false;
    });
  },

  // Serialize form data into JSON
  serializeForm: function (form) {
    let jsonResult = {};
    $.each($(form).serializeArray(), function () {
      jsonResult[this.name] = this.value;
    });
    return jsonResult;
  },

  // Display existing reservations
  getReservations: function () {
    const token = localStorage.getItem("token");

    const decodedToken = jwt_decode(token);
    const email = decodedToken.customer.email;
    $.ajax({
      url: "../rest/reservations/" + email,
      type: "GET",
      headers: {
        Authentication: localStorage.getItem("token"),
      },
      success: function (data) {
        let html = "";
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            html +=
              '<div class="booking-box col-lg-3 col-md-4 col-sm-6 col-xs-6 mb-2">' +
              '<div class="card">' +
              '<div class="card-body">' +
              '<p class="card-text"> Table Number: ' +
              item.tableNumber +
              "</p>" +
              '<p class="card-text"> <span style="color: green; font-weight: bold; display:block">Reservation Date</span> ' +
              item.reservationDate +
              "</p>" +
              '<button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editReservationModal" style="margin-right:5px" onclick="populateEditReservationForm(' +
              item.id +
              ')" data-id="' +
              item.id +
              '">Edit</button>' +
              '<button type="button" class="btn btn-danger btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deleteReservationModal" onclick="openConfirmationReservationDialog(' +
              item.id +
              ')" data-id="' +
              item.id +
              '">Cancel</button>' +
              "</div>" +
              "</div>" +
              "</div>";
          }
        } else {
          html = "No reservations found.";
        }
        $("#reservationsContent").html(html);
      },
      error: function (xhr, status, error) {
        // handle error
      },
    });
  },

  editReservation: function () {
    var id = $("#edit_reservation_id").val();
    var reservationDate = $("#edit_reservationDate").val();

    var updatedReservation = {
      id: id,
      reservationDate: reservationDate,
    };

    $.ajax({
      url: "../rest/reservations/" + id,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedReservation),
      headers: {
        Authentication: localStorage.getItem("token"),
      },
      success: function () {
        toastr.success("Reservation Updated Successfully");
        console.log("Reservation Updated Successfully");
        $("#editReservationModal").modal("hide");
        reservationService.getReservations();
      },
      error: function (xhr, status, error) {
        toastr.error("Error updating reservation");
        console.log("Error updating reservation" + xhr.responseText);
      },
    });
  },

  deleteReservation: function () {
    let itemId = $("#delete_reservation_id").val();
    console.log("Deleting item with ID:", itemId);

    $.ajax({
      url: "../rest/reservations/" + itemId,
      type: "DELETE",
      headers: {
        Authentication: localStorage.getItem("token"),
      },
      success: function () {
        toastr.success("Reservation Deleted Successfully");
        console.log("Reservation Deleted Successfully");
        $("#deleteReservationModal").modal("hide");
        reservationService.getReservations();
      },
      error: function () {
        toastr.error("Error deleting reservation");
        console.log("Error deleting reservation");
      },
    });
  },
};

function populateEditReservationForm(reservationId) {
  console.log("Editing reservation with ID:", reservationId);
  $("#edit_reservation_id").val(reservationId);
}

function openConfirmationReservationDialog(itemId) {
  $("#deleteReservationModal").modal("show");
  $("#delete_reservation_id").val(itemId);
}

// Ensure the form validations and other functions are initialized
reservationService.setMinDate();
reservationService.getAllTables();
reservationService.initFormValidation();
