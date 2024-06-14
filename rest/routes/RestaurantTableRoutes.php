<?php

Flight::route("GET /restauranttables", function () {
    Flight::json(Flight::restauranttableService()->getAll());
});

Flight::route("GET /restauranttable/@id", function ($id) {
    Flight::json(Flight::restauranttableService()->getById($id));
});

Flight::route("DELETE /restauranttables/@id", function ($id) {
    Flight::json(["message" => "restauranttable Deleted Succesfully", "data" => Flight::restauranttableService()->delete($id)]);
});

Flight::route("POST /restauranttables", function () {
    Flight::json(["message" => "restauranttable added Succesfully", "data" => Flight::restauranttableService()->add(Flight::request()->data->getData())]);
});

Flight::route("PUT /restauranttables/@id", function ($id) {
    Flight::json(["message" => "restauranttable changed Successfully", "data" => Flight::restauranttableService()->update($id, Flight::request()->data->getData())]);
});
