<?php


function checkMXRecords($domain)
{
    if (getmxrr($domain, $mx_details)) {
        return [
            'status' => 'success',
            'mx_records' => $mx_details
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'No MX records found for the domain. Cannot accept email.'
        ];
    }
}

// Example usage:
/*
$domain = "stu.ibu.edu.ba";
$result = checkMXRecords($domain);
echo json_encode($result);
*/