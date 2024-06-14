<?php

require_once "BaseService.php";
require __DIR__ . '/../dao/CustomersDao.class.php';

class CustomerService extends BaseService
{
    private $customersDao;

    public function __construct()
    {
        $this->customersDao = new CustomersDao();
        parent::__construct($this->customersDao);
    }

    public function add($entity)
    {
        return parent::add($entity);
    }

    // Add the getByEmail method
    public function getByEmail($email)
    {
        return $this->customersDao->getByEmail($email);
    }
}
