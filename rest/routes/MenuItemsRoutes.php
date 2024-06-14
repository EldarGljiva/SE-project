<?php

Flight::route("GET /menuitems", function () {
    Flight::json(Flight::menuitemsService()->getAll());
});

Flight::route("GET /menuitems/@id", function ($id) {
    Flight::json(Flight::menuitemsService()->getById($id));
});

Flight::route("DELETE /menuitems/@id", function ($id) {
    Flight::json(["message" => "menuitems Deleted Succesfully", "data" => Flight::menuitemsService()->delete($id)]);
});

Flight::route("POST /menuitems", function () {
    Flight::json(["message" => "menuitems added Succesfully", "data" => Flight::menuitemsService()->add(Flight::request()->data->getData())]);
});

Flight::route("PUT /menuitems/@id", function ($id) {
    Flight::json(["message" => "menuitems changed Successfully", "data" => Flight::menuitemsService()->update($id, Flight::request()->data->getData())]);
});
