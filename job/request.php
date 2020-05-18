<?php

require_once 'functions/covid_id.php';
require_once 'functions/covid_prov.php';

date_default_timezone_set('Asia/Jakarta');


/* ---------------------- Data Nasional ---------------------- */

// Ambil data terakhir di tabel nasional
$dataDBNasional = CovidID\getTodayData();

// Ambil statistik kasus di Indonesia
$dataApiNasional = CovidID\fetchUpdateStatistik();

if (!(array) $dataDBNasional) :
    // Jika data kosong, lakukan insert
    CovidID\insertNewRowToday($dataApiNasional);
elseif (CovidID\isDBExpired($dataDBNasional, $dataApiNasional)) :
    // Jika data hari ini sudah usang, update
    CovidID\updateTodayData($dataDBNasional->id, $dataApiNasional);
endif;

/* ---------------------- End of Data Nasional ---------------------- */


/* ---------------------- Data Provinsi ---------------------- */

// Ambil data terakhir di tabel pengambilan_provinsi & detail_penambilang_provinsi
$dataDBProvinsi = CovidProv\getTodayData();

// Ambil statistik kasus di tiap provinsi
$dataApiProvinsi = CovidProv\fetchUpdateStatistik();

// Ambil data terakhir di tabel pengambilan_provinsi
$dataDBProvinsi_Peng = CovidProv\getTodayData_Peng();

if ($dataDBProvinsi->num_rows == 0) :
    CovidProv\insertNewDataToday($dataApiProvinsi);
elseif (\CovidProv\isDBExpired($dataDBProvinsi, $dataApiProvinsi, $dataDBProvinsi_Peng)) :
    CovidProv\updateTodayData($dataApiProvinsi);
endif;

/* ---------------------- End of Data Provinsi ---------------------- */
