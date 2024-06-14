<?php

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

require 'validateEmail.php';
require 'validateMX.php';
require 'validatePhone.php';

// Route used to get all customers from db
/**
 * @OA\Get(
 *      path="/customers",
 *      tags={"customers"},
 *      summary="Get all customers",
 *      security={
 *          {"ApiKey": {}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Get all customers"
 *      ),
 * )
 */
Flight::route("GET /customers", function () {
    Flight::json(Flight::customerService()->getAll());
});

// Route used to get customer by id from db
/**
 * @OA\Get(
 *      path="/customers/{id}",
 *      tags={"customers"},
 *      summary="Get a customer by id",
 *      security={
 *          {"ApiKey": {}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Get a customer by id"
 *      ),
 *   @OA\Parameter(@OA\Schema(type="number"), in="path", name="id", example="1", description="Patient ID"),
 * )
 */
Flight::route("GET /customers/@id", function ($id) {
    Flight::json(Flight::customerService()->getById($id));
});

// Route used to delete customer by id from db
/**
 * @OA\Delete(
 *      path="/customers/{id}",
 *      tags={"customers"},
 *      summary="Delete a customer by id",
 *      security={
 *          {"ApiKey": {}}
 *      },
 *      @OA\Response(
 *           response=200,
 *           description="Deleted Customer Data"
 *      ),
 *   @OA\Parameter(@OA\Schema(type="number"), in="path", name="id", example="1", description="Patient ID"),
 * )
 */
Flight::route("DELETE /customers/@id", function ($id) {
    Flight::json(["message" => "Customer Deleted Succesfully", "data" => Flight::customerService()->delete($id)]);
});

// Route used to add customer to db
/**
 * @OA\Post(
 *      path="/customers/register",
 *      tags={"customers"},
 *      summary="Register a customer",
 *      security={
 *          {"ApiKey": {}}
 *      },
 *      @OA\RequestBody(
 *          required=true,
 *          description="Customer data payload",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(
 *                  property="fName",
 *                  type="string",
 *                  example="web",
 *                  description="Customer First Name"
 *              ),
 *              @OA\Property(
 *                  property="lName",
 *                  type="string",
 *                  example="programming",
 *                  description="Customer Last Name"
 *              ),
 *              @OA\Property(
 *                  property="email",
 *                  type="string",
 *                  example="web@gmail.com",
 *                  description="Customer Email"
 *              ),
 *              @OA\Property(
 *                  property="password",
 *                  type="string",
 *                  example="web123",
 *                  description="Customer Password"
 *              ),
 *              @OA\Property(
 *                  property="phone",
 *                  type="string",
 *                  example="123456789",
 *                  description="Customer Phone Number"
 *              ),
 *              @OA\Property(
 *                  property="role",
 *                  type="string",
 *                  example="customer",
 *                  description="Customer Role"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *           response=200,
 *           description="Customer registered successfully"
 *      ),
 *      @OA\Response(
 *           response=400,
 *           description="Invalid phone number, Invalid email TLD, Password found in the pwned database, Email already exists in the database, Phone is already registered"
 *      ),
 *      @OA\Response(
 *           response=500,
 *           description="Failed to register customer, cURL Error: <error message>"
 *      )
 * )
 */

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

/**
 * @OA\Post(
 *      path="/customers/login",
 *      tags={"customers"},
 *      summary="Customer login",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Customer login credentials",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(
 *                  property="email",
 *                  type="string",
 *                  example="web@gmail.com",
 *                  description="Customer Email"
 *              ),
 *              @OA\Property(
 *                  property="password",
 *                  type="string",
 *                  example="web123",
 *                  description="Customer Password"
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *           response=200,
 *           description="Customer logged in successfully"
 *      ),
 *      @OA\Response(
 *           response=400,
 *           description="Email and password are required"
 *      ),
 *      @OA\Response(
 *           response=401,
 *           description="Invalid email or password"
 *      )
 * )
 */

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
