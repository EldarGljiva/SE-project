<?php

use \Firebase\JWT\JWT;

require 'validateEmail.php';
require 'validateMX.php';
require 'validatePhone.php';


Flight::route("GET /customers", function () {
    Flight::json(Flight::customerService()->getAll());
});

Flight::route("GET /customers/@id", function ($id) {
    Flight::json(Flight::customerService()->getById($id));
});


Flight::route("DELETE /customers/@id", function ($id) {
    Flight::json(["message" => "Customer Deleted Succesfully", "data" => Flight::customerService()->delete($id)]);
});

Flight::route("POST /customers/register", function () {
    $data = Flight::request()->data->getData();

    // Get a customer from database by email
    $customer = Flight::customerService()->getByEmail($data['email']);

    if (
        isset($data['fName']) && strlen($data['fName']) > 3 &&
        isset($data['lName']) && strlen($data['lName']) > 3 &&
        isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL) &&
        isset($data['password']) && strlen($data['password']) >= 8 &&
        isset($data['phone'])
    ) {
        // Validate the phone number format and type
        $phoneValidationResult = validateMobilePhoneNumber($data['phone']);
        if ($phoneValidationResult !== "it's Mobile phone number") {
            Flight::json(['message' => "Invalid phone number"], 400);
            return;
        }

        // Validate email TLD
        $emailTLDValidationResult = validateEmailTLD($data['email']);
        if (!$emailTLDValidationResult) {
            Flight::json(['message' => 'Invalid email TLD'], 400);
            return;
        }

        // Validate MX Records
        $domain = substr(strrchr($data['email'], "@"), 1);
        checkMXRecords($domain);

        // Pwned Password check
        $password = $data['password'];
        $sha1Password = strtoupper(sha1($password));
        $prefix = substr($sha1Password, 0, 5);
        $suffix = substr($sha1Password, 5);

        $ch = curl_init("https://api.pwnedpasswords.com/range/" . $prefix);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            Flight::json(['message' => "cURL Error: " . $error], 500);
            return;
        }

        curl_close($ch);
        if (str_contains($response, $suffix)) {
            Flight::json(['message' => "Password found in the pwned database. Choose another one."], 400);
            return;
        } else {
            // Check if email already exists in the database
            if ($customer && $customer['email'] == $data['email']) {
                // Email already exists, return an error response
                Flight::json(["message" => "Email already exists in the database"], 400);
            } else if ($customer && $customer['phone'] == $data['phone']) {
                Flight::json(["message" => "Phone is already registered"], 400);
            } else {

                $result = Flight::customerService()->add($data);
                if ($result) {
                    // Registration successful
                    Flight::json(["message" => "Customer registered successfully", "data" => $result]);
                } else {
                    // Registration failed
                    Flight::json(["message" => "Failed to register customer"], 500);
                }
            }
        }
    }
});

Flight::route("POST /customers/login", function () {
    $data = Flight::request()->data->getData();

    try {

        // Check if email and password are provided
        if (!empty($data['email']) && !empty($data['password'])) {
            // Get customer by email from db
            $customer = Flight::customerService()->getByEmail($data['email']);

            // Verify the password 
            if ($customer && password_verify($data['password'], $customer['password'])) {
                if ($customer['email'] == $data['email']) {

                    // JWT secret key
                    $secretKey = Config::JWT_SECRET();

                    // JWT payload data
                    $payload = [
                        'customer' => $customer,
                        'iat' => time(),
                        'exp' => time() + (60 * 60 * 24), // valid for a day
                    ];
                    // Generate JWT
                    $jwt = JWT::encode($payload, $secretKey, 'HS256');

                    // Send the JWT to the client
                    Flight::json([
                        "message" => "Customer Logged In Successfully",
                        "token" => $jwt
                    ], 200);
                }
            } else {
                Flight::json(["message" => "Invalid email or password"], 401);
            }
        } else {
            Flight::json(["message" => "Email and password are required"], 400);
        }
    } catch (Exception $e) {
        Flight::json(["message" => "Captcha verification error: " . $e->getMessage()], 500);
        return;
    }
});
