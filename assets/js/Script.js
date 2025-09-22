const Links = document.querySelectorAll('.items-links');
const Contents_Section = document.querySelectorAll('.content_section');

window.addEventListener('load', () => {
    Contents_Section[0].classList.add('visible');
    Links[0].classList.add('active');

    setTimeout(() => {
        document.querySelector('.nav-link').classList.remove('FromRight');
        Contents_Section.forEach(section => {
            section.classList.remove('FromLeft');
        });
        document.querySelector('.upload-Qr').classList.remove('FromLeft');
    },400);
});

Links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetId = link.getAttribute('data-target');
        console.log(targetId);

        Contents_Section.forEach(section => {
            section.classList.remove('visible');
            section.classList.add('invisible');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.remove('invisible');
            targetSection.classList.add('visible');
        }

        Links.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
    });
});

const form = document.getElementById('Form_Qr');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (form.checkValidity()) {
        
        Name_Activity = form['Name_Activity'].value;
        URL_Form = form['URL_Form'].value;
        Message_Qr = form['Message_Qr'].value || '';

        form['Name_Activity'].value = '';
        form['URL_Form'].value = '';
        form['Message_Qr'].value = '';

        console.log(Name_Activity,URL_Form, Message_Qr,);

        const formData = new FormData();
        formData.append('Name_Activity', Name_Activity);
        formData.append('URL_Form', URL_Form);
        formData.append('Message_Qr', Message_Qr);

        fetch('traitement.php', {
            method: 'POST',
            body: formData 
            })
            .then(response => {
                // Le script PHP renvoie du JSON, donc on le parse en tant que tel.
                if (!response.ok) {
                    throw new Error('La réponse du serveur n\'est pas OK.');
                }
                return response.json();
            })
            .then(data => {
                // Si la réponse JSON est un succès
                if (data.success) {
                    // Créez le chemin d'accès complet à l'image
                    const imageUrl = data.image_url;

                    // Mettez à jour la balise <img> avec l'URL du fichier
                    document.getElementById('qr-code-image').innerHTML = ``;
                    document.getElementById('qr-code-image').innerHTML = `<img src="${imageUrl}" alt="QR Code" class="max-w-full h-auto block" />`;

                    // Mettez à jour le lien de téléchargement
                    const downloadBtn = document.getElementById('download-qr-btn');
                    downloadBtn.href = imageUrl;
                } else {
                    // Gérez le cas où le script PHP renvoie une erreur
                    console.error('Erreur du serveur:', data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById('qr-code-image').innerHTML = `<p>Une erreur est survenue. Veuillez réessayer.</p>`;
            });
        }
        
    });
