const Links = document.querySelectorAll('.items-links');
const Contents_Section = document.querySelectorAll('.content_section');
const historiquesection = document.getElementById('Historique_Code');

function updatePreview(data) {
    document.getElementById('qr-code-image').innerHTML = `<img src="${data.image_url}" alt="QR Code" class="max-w-full h-auto block bg-white" />`;
    document.getElementById('qr-code-image').classList.add('bg-white', 'p-2', 'rounded', 'shadow-md');

    const downloadBtn = document.getElementById('download-qr-btn');
    downloadBtn.href = data.pdf_url;
    
    document.getElementById('Message').classList.add('bg-white');
    document.getElementById('Message').innerHTML = `<p class="text-center text-gray-700 mt-2 font-bold"> ${data.Name_Activity} </p> 
                                                    <hr class="my-2 border-gray-300 w-full">
                                                    <p class="text-center text-gray-700 mb-2"> ${data.Message_Qr} </p>`;
}

function actualiserHistorique(data) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    data.forEach(element => {
        historyList.innerHTML += `<li class=" w-full historique-element bg-white hover:bg-[f3f3f3] p-3 rounded-2xl cursor-pointer transition duration-150 ease-in-out flex justify-between items-center" 
                                    data-ref=${element.ref_unique}>
                                    <div>
                                        <div class="text-black font-semibold text-base">
                                            ${element.name_activite}                                      
                                        </div>                                     
                                        <div class="text-gray-800 text-xs ">   
                                            ${element.form_url}                                
                                        </div>
                                    </div>                                   
                                    <div class="text-right">
                                        <span class="text-gray-700 text-sm block">  
                                            ${element.ref_unique}                                   
                                        </span>
                                        <span class="text-gray-600 text-xs block">    
                                            ${element.date_inscrit.substring(0, 10)}
                                            <br>
                                            ${element.date_inscrit.substring(11, 19)}                         
                                        </span>
                                    </div>
                                </li>`        
        
    });
}

window.addEventListener('load', () => {
    Contents_Section[0].classList.add('visible');
    Links[0].classList.add('active');

    setTimeout(() => {
        // 
        document.querySelector('.nav-link').classList.remove('FromRight');
        Contents_Section.forEach(section => {
            section.classList.remove('FromLeft');
        });
        document.querySelector('.upload-Qr').classList.remove('FromLeft');
    },400);
});

historiquesection.addEventListener('click', () => {
    fetch('historique.php?refresh=Ok') 
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    actualiserHistorique(data.historique);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'historique :', error);
            });
});

Links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetId = link.getAttribute('data-target');

        Contents_Section.forEach(section => {
            section.classList.remove('visible');
            section.classList.add('invisible');
        });

        fetch('historique.php?refresh=Ok') 
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    actualiserHistorique(data.historique);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'historique :', error);
            });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.remove('invisible');
            targetSection.classList.add('visible');
        }

        Links.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');

        refreshhistory();
    });
});

const form = document.getElementById('Form_Qr');
const history = document.getElementById('Form_History');

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
                    updatePreview(data);                                  
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

refreshhistory = () => {
    const historyList = document.getElementById('history-list');

    historyList.addEventListener('click', function(event) {
        let clickedItem = event.target.closest('.historique-element');
        
        if (!clickedItem) return;

        document.querySelectorAll('.historique-element').forEach(item => {
            item.classList.remove('border-l-4', 'border-blue-500'); 
        });

        clickedItem.classList.add('border-l-4', 'border-blue-500'); 
        const refUnique = clickedItem.getAttribute('data-ref');
        
        if (refUnique) {
            fetchDetails(refUnique);
        }
});

function fetchDetails(ref) {
    fetch(`historique.php?ref_unique=${ref}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updatePreview(data); 
            } else {
                console.log(data.message) ;
            }
        })
        .catch(error => {
            console.error('Erreur AJAX:', error);
            console.log('Impossible de récupérer les détails du QR Code.');
        });
    }
}


