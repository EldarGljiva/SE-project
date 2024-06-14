<?php

require_once "BaseService.php";
require __DIR__ . '/../dao/ReservationsDao.class.php';

class ReservationService extends BaseService
{
    private $reservationsDao;
    public function __construct()
    {
        $this->reservationsDao = new ReservationsDao();
        parent::__construct(new ReservationsDao);
    }
    public function findByDate($date)
    {
        return $this->reservationsDao->findByDate($date);
    }
}
