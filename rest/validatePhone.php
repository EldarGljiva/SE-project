<?php

function validateMobilePhoneNumber($phone_number, $country_code = 'BA')
{
    $phone_util = \libphonenumber\PhoneNumberUtil::getInstance();
    try {
        $number_proto = $phone_util->parse($phone_number, $country_code);
        if ($phone_util->getNumberType($number_proto) === \libphonenumber\PhoneNumberType::MOBILE) {
            return "it's Mobile phone number";
        } else {
            return "Not mobile phone number";
        }
    } catch (\libphonenumber\NumberParseException $e) {
        return $e->getMessage();
    }
}
