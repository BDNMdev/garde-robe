// viewFiles.js

// Fonction qui filtre les fichiers en fonction de la recherche et du type de fichier sélectionné
function filterFiles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const fileFilter = document.getElementById('fileFilter').value;
    const fileList = JSON.parse(localStorage.getItem('files')) || [];
  
    // Filtrer les fichiers par nom et type
    const filteredFiles = fileList.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchInput);
      const matchesType = fileFilter ? file.type === fileFilter : true;
      return matchesSearch && matchesType;
    });
  
    displayFiles(filteredFiles); // Afficher les fichiers filtrés
  }
  
  // Fonction qui affiche les fichiers dans le DOM
  function displayFiles(files) {
    const fileListContainer = document.getElementById('fileList');
    fileListContainer.innerHTML = ''; // Réinitialiser la liste
  
    // Si aucun fichier ne correspond, afficher un message
    if (files.length === 0) {
      fileListContainer.innerHTML = '<p>Aucun fichier trouvé.</p>';
    } else {
      // Sinon, afficher les fichiers
      files.forEach(file => {
        const fileCard = document.createElement('div');
        fileCard.classList.add('col-12', 'col-md-4', 'mb-4');
  
        fileCard.innerHTML = `
          <div class="card">
            <img src="${file.url}" class="card-img-top" alt="${file.name}">
            <div class="card-body">
              <h5 class="card-title">${file.name}</h5>
              <p class="card-text">Type: ${file.type}</p>
              <button class="btn btn-primary" onclick="downloadFile('${file.name}')">Télécharger</button>
            </div>
          </div>
        `;
  
        fileListContainer.appendChild(fileCard);
      });
    }
  }
  
  // Fonction pour télécharger un fichier
  function downloadFile(fileName) {
    const fileList = JSON.parse(localStorage.getItem('files')) || [];
    const file = fileList.find(f => f.name === fileName);
  
    if (file) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  }
  
  // Initialiser l'affichage des fichiers au chargement de la page
  document.addEventListener('DOMContentLoaded', function() {
    filterFiles();
  });
  