<?php
require_once __DIR__ . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use TCPDF as PDF;

if (isset($_POST['URL_Form']) && isset($_POST['Name_Activity']) && isset($_POST['Message_Qr'])) {
    $URL_Form = htmlspecialchars($_POST['URL_Form']);
    $Name_Form = htmlspecialchars($_POST['Name_Activity']);
    $Message_Form = htmlspecialchars($_POST['Message_Qr']);
    inscrielaBD($Name_Form, $URL_Form, $Message_Form);
    afficheapercu($GLOBALS['last_Data']);
    generezPDF($GLOBALS['last_Data']);
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'image_url' => $GLOBALS['Svgfilepath'], 'Name_Activity' => $Name_Form, 'Message_Qr' => $Message_Form, 'pdf_url' => $GLOBALS['Doawnloadpdffilepath']]);
}


function couperChaine($lien): array {
    $longueurdulien = mb_strlen($lien, 'UTF-8');
    if ($longueurdulien > 45) {
        $partie_1 = mb_substr($lien, 0, 45, 'UTF-8');
        $partie_2 = mb_substr($lien, 45, 90, 'UTF-8'); 
        $partie_3 = mb_substr($lien, 90, null, 'UTF-8');
    } else {
        $partie_1 = $lien;
        $partie_2 = '';
        $partie_3 = '';
    }
    return [
        'partie_1' => $partie_1,
        'partie_2' => $partie_2,
        'partie_3' => $partie_3 ?? '',
    ];
}

function inscrielaBD($donnee1, $donnee2, $donnee3,) {
    $servername = "localhost";
    $username = "u242529393_LANDRYMASTER";
    $password = "Haveela@Davy2000";
    $dbname = "u242529393_QR_GENERATE";

    $hachage = hash('sha256', $donnee2);
    $donnee4 = 'REF-' . substr($hachage, 0, 10);

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql_select = "SELECT * FROM history_generate WHERE ref_unique = :ref_unique";
        $stmp = $conn->prepare($sql_select);
        $stmp->bindParam(':ref_unique', $donnee4);
        $stmp->execute();
        $donneetrue = $stmp->fetch(PDO::FETCH_ASSOC);

        if ($donneetrue) {
            $GLOBALS['last_Data'] = $donneetrue;
            return;
        }

        $sql = "INSERT INTO history_generate ( name_activite , form_url , message_qr, ref_unique) VALUES ( :valeur1, :valeur2, :valeur3, :valeur4)";
        $stmp = $conn->prepare($sql);
        $stmp->bindParam(':valeur1', $donnee1);
        $stmp->bindParam(':valeur2', $donnee2);
        $stmp->bindParam(':valeur3', $donnee3);
        $stmp->bindParam(':valeur4', $donnee4);
        $stmp->execute();

        $last_Id = $conn->lastInsertId();
        $sql = "SELECT * FROM history_generate WHERE id = :last_Id";
        $stmp = $conn->prepare($sql);
        $stmp->bindParam(':last_Id', $last_Id);
        $stmp->execute();
        $GLOBALS['last_Data'] = $stmp->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $e) {
        echo "erreur lors de l'insertion des données: " . $e->getMessage();
    }
    $conn = null;
}

function afficheapercu($donnee1) {
    $tempDir = 'temp_qrcodes/';
    $Svgfilename = $donnee1['ref_unique'] . '.svg';
    $GLOBALS['Svgfilepath'] = $tempDir . $Svgfilename;

    if (file_exists($GLOBALS['Svgfilepath'])) {
        return;
    }

    $qrCode = new QrCode($donnee1['form_url']);
    $writer = new Svgwriter();
    $result = $writer->write($qrCode);
    $SvgData = $result->getString();
    file_put_contents($GLOBALS['Svgfilepath'], $SvgData);
}

function generezPDF($donnee1) {
    $pdf = new PDF('P', 'mm', 'A4', true, 'UTF-8', false);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);
    $pdf->SetAuthor('LANDRYMASTER');
    $pdf->SetTitle($donnee1['name_activite']);
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'BI', 25);
    $pdf->Cell(0,10,"",0,2,'C');
    $pdf->Cell(0,35, strtoupper($donnee1['name_activite']),0,120,'C');
    $pdf->ImageSVG($GLOBALS['Svgfilepath'], 50, 80, 120, 120, "", "", "C", 1, false);
    $pdf->SetFont('helvetica', 'I', 20);
    $pdf->MultiCell(0, 10, ucwords($donnee1['message_qr']), 0, 'C', 0, 1, '', '', true);
    $pdf->SetY(230);
    $pdf->SetFont('helvetica', 'I', 12);
    $urlForm = couperChaine($donnee1['form_url']);
    $pdf->Cell(0, 10, $urlForm['partie_1'], 0, 1, 'C');
    if ($urlForm['partie_2']) {
        $pdf->Cell(0, 10, $urlForm['partie_2'], 0, 1, 'C');
    }
    if ($urlForm['partie_3']) {
        $pdf->Cell(0, 10, $urlForm['partie_3'], 0, 1, 'C');
    }
    $UploadDir = '/' . 'temp_Pdf/';
    $Pdffilename = $donnee1['ref_unique'] . '.pdf';
    $GLOBALS['Pdffilepath'] = $UploadDir . $Pdffilename;
    $pdf->Output( __DIR__ . $GLOBALS['Pdffilepath'], 'F');   
    $GLOBALS['Doawnloadpdffilepath'] = "temp_Pdf/" . $Pdffilename;
}

?>