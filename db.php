<?php

require_once("rest/dao/CustomersDao.class.php");
$customersDao = new CustomersDao();
$results = $customersDao->getAll();
print_r($results);
