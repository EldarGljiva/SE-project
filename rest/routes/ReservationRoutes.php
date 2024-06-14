<?php


Flight::route("GET /reservations", function () {
    Flight::json(Flight::reservationService()->getAll());
});

Flight::route("GET /reservations/@email", function ($email) {
    Flight::json(Flight::reservationService()->getAllReservationsByEmail($email));
});

Flight::route("GET /reservations/customers/@email", function ($email) {
    Flight::json(Flight::reservationService()->getAllBookingsById($email));
});

Flight::route("DELETE /reservations/@id", function ($id) {
    Flight::json(["message" => "reservation Deleted Succesfully", "data" => Flight::reservationService()->delete($id)]);
});

Flight::route("POST /reservations", function () {
    $data = Flight::request()->data->getData();

    // Validate if reservationDate is provided in the request data
    if (!isset($data['reservationDate'])) {
        Flight::json(["error" => "Reservation date is required"], 400);
        return;
    }

    // Check if reservationDate is already taken
    $existingReservation = Flight::reservationService()->findByDate($data['reservationDate']);

    if ($existingReservation) {
        Flight::json(["error" => "Date for that reservation is already taken!"]);
        return;
    }

    // If not taken, proceed to add reservation
    $reservation = Flight::reservationService()->add($data);

    if ($reservation) {
        Flight::json(["message" => "Reservation added successfully", "data" => $reservation]);
    } else {
        Flight::json(["error" => "Failed to add reservation"], 500);
    }
});


Flight::route("PUT /reservations/@id", function ($id) {
    Flight::json(["message" => "reservation updated Successfully", "data" => Flight::reservationService()->update($id, Flight::request()->data->getData())]);
});
