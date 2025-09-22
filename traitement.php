<?php
// 1. Inclusions et configurations initiales
require_once __DIR__ . '/vendor/autoload.php';

// Utilisez les classes de la nouvelle bibliothèque
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;

if (isset($_POST['URL_Form'])) {
    $URL_Form = htmlspecialchars($_POST['URL_Form']);
    $data = $URL_Form;

    // 3. Création et configuration du QR code avec Endroid
    $qrCode = new QrCode($data);


    // 4. Choix du "Writer" (le moteur de rendu)
    $writer = new SvgWriter();

    // 5. Génération de l'image en mémoire
    $result = $writer->write($qrCode);
    $imageData = $result->getString();

    // 6. Création d'un nom de fichier unique et de son chemin
    $tempDir = 'temp_qrcodes/';
    $filename = 'qrcode' . uniqid() . '.svg';
    $filepath = $tempDir . $filename;

    // Assurez-vous que le dossier temporaire existe et est inscriptible
    if (!is_dir($tempDir) || !is_writable($tempDir)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur: Le dossier de destination n\'existe pas ou n\'est pas inscriptible.']);
        exit;
    }

    // 7. Sauvegarde de l'image avec gestion des erreurs
    if (file_put_contents($filepath, $imageData) === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde du fichier.']);
        exit;
    }

    // 8. Renvoi de l'URL du fichier au format JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'image_url' => $filepath]);
} else {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Requête invalide.']);
}
?>