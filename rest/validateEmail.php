<?php

function getValidTLDs($filename = 'validTLDs.txt')
{
    $filePath = __DIR__ . DIRECTORY_SEPARATOR . $filename;
    if (!file_exists($filePath)) {
        die("Error: TLD file not found. Looking for file at: $filePath");
    }
    $validTLDs = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    return $validTLDs;
}


function getTLD($email)
{
    // Split the email to get the domain part
    $parts = explode('@', $email);
    if (count($parts) < 2) {
        return false;
    }
    $domain = $parts[1];

    // Split the domain to get the TLD
    $domainParts = explode('.', $domain);
    return end($domainParts);
}

function validateEmailTLD($email, $tldFile = 'validTLDs.txt')
{
    // Get the valid TLDs
    $validTLDs = getValidTLDs($tldFile);

    // Get the TLD from the email
    $tld = getTLD($email);
    if ($tld === false) {
        return false;
    }

    // Check if the TLD is in the list of valid TLDs
    return in_array(strtoupper($tld), $validTLDs);
}

// Example usage:
/*
$email = "user@example.com";
if (validateEmailTLD($email)) {
    echo "Valid email TLD.";
} else {
    echo "Invalid email TLD.";
}
*/