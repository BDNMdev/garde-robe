async function fetchFiles() {
  const res = await fetch('/files');
  const files = await res.json();
  renderFiles(files);
}

function renderFiles(files) {
  const container = document.getElementById('fileList');
  container.innerHTML = '';

  const filter = document.getElementById('fileFilter').value.toLowerCase();
  const search = document.getElementById('searchInput').value.toLowerCase();

  const filtered = files.filter(f =>
    (!filter || f.type === filter) &&
    (!search || f.name.toLowerCase().includes(search))
  );

  filtered.forEach(f => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';

    card.innerHTML = `
      <div class="card">
        ${
          f.type === 'image'
            ? `<img src="${f.url}" class="card-img-top" alt="${f.name}" />`
            : `<div class="card-body"><p class="card-text">${f.name}</p></div>`
        }
        <div class="card-footer text-center">
          <a href="${f.url}" target="_blank" class="btn btn-sm btn-outline-primary">Ouvrir</a>
          <a href="${f.url}" target="_blank" class="btn btn-sm btn-outline-success" download>Telecharger</a>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', fetchFiles);
document.getElementById('fileFilter').addEventListener('change', fetchFiles);

window.onload = fetchFiles;
