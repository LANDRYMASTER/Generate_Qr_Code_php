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

        const formData = new FormData();
        formData.append('Name_Activity', Name_Activity);
        formData.append('URL_Form', URL_Form);
        formData.append('Message_Qr', Message_Qr);

        form['Name_Activity'].value = '';
        form['URL_Form'].value = '';
        form['Message_Qr'].value = '';

        console.log(Name_Activity, URL_Form, Message_Qr);

        fetch('traitement.php', {
            method: 'POST',
            body: formData 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du serveur n\'est pas OK.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('qr-code-image').innerHTML = `<img src="${data.image_url}" alt="QR Code" class="max-w-full h-auto block bg-white" />`;
                    document.getElementById('qr-code-image').classList.add('bg-white', 'p-2', 'rounded', 'shadow-md');

                    const downloadBtn = document.getElementById('download-qr-btn');
                    downloadBtn.href = data.pdf_url;
                    
                    document.getElementById('Message').classList.add('bg-white');
                    document.getElementById('Message').innerHTML = `<p class="text-center text-gray-700 mt-2 font-bold"> ${data.Name_Activity} </p> 
                                                                    <hr class="my-2 border-gray-300 w-full">
                                                                    <p class="text-center text-gray-700 mb-2"> ${data.Message_Qr} </p>`;  
                                                          
                } else {
                    console.error('Erreur du serveur:', data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById('qr-code-image').innerHTML = `<p>Une erreur est survenue. Veuillez réessayer.</p>`;
            });
  }
    });
