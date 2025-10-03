<?php 

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/traitement.php';

if (isset($_GET['refresh']) && $_GET['refresh'] === 'Ok') {
    $historique = fetchHistory();
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'historique' => $historique]);
    exit;
}

function fetchHistory() {
    $servername = "localhost";
    $username = "u242529393_LANDRYMASTER";
    $password = "Haveela@Davy2000";
    $dbname = "u242529393_QR_GENERATE";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT * FROM history_generate ORDER BY id DESC";
        $stmp = $conn->prepare($sql);
        $stmp->execute();
        $historique = $stmp->fetchAll(PDO::FETCH_ASSOC);
        return $historique;
    }
    catch (PDOException $e) {
        echo "Erreur lors de la connexion à la base de données: " . $e->getMessage();
        return [];
    }
}

if (isset($_GET['ref_unique'])) {
    $ref_unique = htmlspecialchars($_GET['ref_unique']);
    
    $donnees_historique = recupererDonneesParRef($ref_unique); 

    if ($donnees_historique) {
        
        afficheapercu($donnees_historique);
        generezPDF($donnees_historique,);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true, 
            'image_url' => $GLOBALS['Svgfilepath'],
            'Name_Activity' => $donnees_historique['name_activite'],
            'Message_Qr' => $donnees_historique['message_qr'],
            'pdf_url' => $GLOBALS['Doawnloadpdffilepath']
        ]);
        exit;
    }
}

function recupererDonneesParRef(string $ref_unique): ?array {
    $servername = "localhost";
    $username = "u242529393_LANDRYMASTER";
    $password = "Haveela@Davy2000";
    $dbname = "u242529393_QR_GENERATE";

    try {
        $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT * FROM history_generate WHERE ref_unique = :ref_unique";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ref_unique', $ref_unique);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Erreur BD: " . $e->getMessage());
        return null;
    }
}

fetchHistory();

?>

