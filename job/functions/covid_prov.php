<?php

namespace CovidProv;

require_once $_SERVER['DOCUMENT_ROOT'] . 'job/database/config.php';

date_default_timezone_set('Asia/Jakarta');


/* ------------- Keperluan request Cron Job ------------- */

/**
 * Fungsi ini mengambil data statistik terakhir dari API
 */
function fetchUpdateStatistik()
{
    $response = json_decode(file_get_contents('http://api.kawalcorona.com/indonesia/provinsi/'));

    $provinces = array();

    foreach ($response as $provinsi) {
        $newProvinsi = new \stdClass();

        $newProvinsi->kode_provinsi   = $provinsi->attributes->Kode_Provi;
        $newProvinsi->nama_provinsi   = $provinsi->attributes->Provinsi;
        $newProvinsi->positif         = $provinsi->attributes->Kasus_Posi;
        $newProvinsi->sembuh          = $provinsi->attributes->Kasus_Semb;
        $newProvinsi->meninggal       = $provinsi->attributes->Kasus_Meni;
        $newProvinsi->dalam_perawatan = $newProvinsi->positif - ($newProvinsi->sembuh + $newProvinsi->meninggal);

        $provinces[] = $newProvinsi;
    }

    return $provinces;
}

/**
 * Fungsi ini mengambil data statistik terakhir (hari ini) dari database
 */
function getTodayData()
{
    global $connection;

    $querySelectLastData = "SELECT 
                                pengambilan_provinsi.id AS id_pengambilan,
                                created_at,
                                updated_at,
                                detail_pengambilan_provinsi.id AS id_detail_pengambilan,
                                kode_provinsi,
                                nama_provinsi,
                                positif,
                                sembuh,
                                dalam_perawatan,
                                meninggal
                            FROM pengambilan_provinsi
                            LEFT JOIN detail_pengambilan_provinsi
                            ON pengambilan_provinsi.id = detail_pengambilan_provinsi.id_pengambilan_provinsi
                            WHERE DATE(pengambilan_provinsi.created_at) = CURDATE()";

    return mysqli_query($connection, $querySelectLastData);
}

function getTodayData_Peng()
{
    global $connection;

    $querySelectLastData = "SELECT 
                                id,
                                created_at,
                                updated_at
                            FROM pengambilan_provinsi
                            WHERE DATE(pengambilan_provinsi.created_at) = CURDATE()";

    return mysqli_query($connection, $querySelectLastData);
}

/**
 * Fungsi ini memasukan data baru ke dalam database
 * Dieksekusi ketika hari sudah berganti
 * 
 * Param 1: data terbaru dari API
 */
function insertNewDataToday($dataApiProvinsi)
{
    global $connection;

    // Insert tabel parent
    $queryInsertPrimary = "INSERT INTO pengambilan_provinsi (created_at)
                           VALUES (CURRENT_TIMESTAMP())";
    mysqli_query($connection, $queryInsertPrimary);

    // Insert tabel child
    $inserted_id = mysqli_insert_id($connection);
    foreach ($dataApiProvinsi as $provinsi) {
        $queryInsertChild = "INSERT INTO detail_pengambilan_provinsi (
                                id_pengambilan_provinsi,
                                kode_provinsi,
                                nama_provinsi,
                                positif,
                                sembuh,
                                dalam_perawatan,
                                meninggal
                            )
                            VALUES (
                                $inserted_id,
                                $provinsi->kode_provinsi,
                                '$provinsi->nama_provinsi',
                                $provinsi->positif,
                                $provinsi->sembuh,
                                $provinsi->dalam_perawatan,
                                $provinsi->meninggal
                            )";

        mysqli_query($connection, $queryInsertChild);
    }
}

/**
 * Fungsi ini mengecek apakah data di database sama barunya dengan yang di API
 * 
 * Param 1: List data provinsi dari database (result object)
 * Param 2: List data provinsi dari API
 */
function isDBExpired($dataDBProvinsi, $dataApiProvinsi, $dataDBProvinsi_Peng)
{
    $current_time = time();
    $convert_current_time = date('Y:m:d H:i:s', $current_time);

    $i = 0;
    while ($provinsi = mysqli_fetch_assoc($dataDBProvinsi)) {
        if (
            $provinsi['positif'] < $dataApiProvinsi[$i]->positif ||
            $provinsi['sembuh'] < $dataApiProvinsi[$i]->sembuh ||
            $provinsi['meninggal'] < $dataApiProvinsi[$i]->meninggal ||
            $dataDBProvinsi_Peng->updated_at < $convert_current_time
        ) {
            return true;
        }

        $i++;
    }

    return false;
}

/**
 * Fungsi ini mengupdate data hari ini yang tersimpan di database
 * Dieksekusi ketika ada perubahan dari API
 * 
 * Param 1: id row yang akan diupdate
 * Param 2: data terbaru dari API
 */
function updateTodayData($dataApiNasional)
{
    global $connection;

    // Mengambil id data hari ini
    $queryGetID     = "SELECT id FROM pengambilan_provinsi WHERE DATE(created_at) = CURDATE() LIMIT 1";
    $resultQuery    = mysqli_query($connection, $queryGetID, MYSQLI_ASSOC);
    $id_pengambilan = mysqli_fetch_assoc($resultQuery)['id'];

    mysqli_free_result($resultQuery);

    // Update detail pengambilan provinsi
    foreach ($dataApiNasional as $provinsiApi) {
        $queryUpdateChild = "UPDATE detail_pengambilan_provinsi 
                             SET positif         = $provinsiApi->positif,
                                 sembuh          = $provinsiApi->sembuh,
                                 meninggal       = $provinsiApi->meninggal,
                                 dalam_perawatan = $provinsiApi->dalam_perawatan
                             WHERE 
                                 id_pengambilan_provinsi = $id_pengambilan AND 
                                 kode_provinsi = $provinsiApi->kode_provinsi";

        mysqli_query($connection, $queryUpdateChild);
    }

    // Update pengambilan provinsi
    $queryUpdateParent = "UPDATE pengambilan_provinsi
                          SET updated_at = CURRENT_TIMESTAMP()
                          WHERE id = $id_pengambilan";
    mysqli_query($connection, $queryUpdateParent);
}

/* ------------- End of Keperluan request Cron Job ------------- */
