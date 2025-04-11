document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const files = document.getElementById('fileInput').files;
  const type = document.getElementById('fileType').value;

  if (files.length === 0) {
    alert('Veuillez sélectionner au moins un fichier.');
    return;
  }

  const formData = new FormData();
  for (let file of files) {
    formData.append('files', file);
  }
  formData.append('type', type);

  // 🎯 Barre de progression
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('uploadProgress');
  const statusText = document.getElementById('uploadStatus');

  // Réinitialise la barre
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%';
  progressBar.textContent = '0%';
  statusText.textContent = '';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload', true);

  // 📊 Suivi progression
  xhr.upload.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + '%';
      progressBar.textContent = percent + '%';
    }
  });

  // ✅ Résultat
  xhr.onload = () => {
    if (xhr.status === 200) {
      try {
        const result = JSON.parse(xhr.responseText);
        statusText.textContent = '✅ ' + result.message;
      } catch {
        statusText.textContent = '✅ Fichier(s) téléchargé(s) !';
      }
    } else {
      statusText.textContent = '❌ Erreur lors de l’envoi.';
    }
  };

  xhr.onerror = () => {
    statusText.textContent = '❌ Une erreur est survenue.';
  };

  xhr.send(formData);
});
