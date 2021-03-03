window.addEventListener('load', () => {
    document.querySelector('#searchButton').addEventListener('click', (event) =>{
        event.preventDefault();
        let searchTerm = encodeURIComponent(document.querySelector('#searchTerm').value.trim());
        let url = 'https://www.vam.ac.uk/api/json/museumobject/search?q=' + searchTerm + '&limit=30'; 
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                let results = document.querySelector('#results');
                results.innerHTML = '';
                let json = xhr.responseText;
                let obj = JSON.parse(json);
                let records = obj.records;
                while (xhr.readyState == 3) {
                    document.querySelector('#loading').style.display = "initial";
                }
                document.querySelector('#loading').style.display = "none";
                for (let i = 0; i < records.length; i++) {
                    let record = records[i];
                    let li = document.createElement('li');
                    li.className = 'card';
                    results.appendChild(li);
                    let div = document.createElement('div');
                    div.className = 'card-content';
                    li.appendChild(div);
                    let a = document.createElement('a');
                    a.href = "search.html";
                    div.appendChild(a);
                    let img = document.createElement('img');
                    let source = record.fields.primary_image_id;
                    img.src = "http://media.vam.ac.uk/media/thira/collection_images/" + source.substring(0, 6) + "/" + source + ".jpg";
                    a.appendChild(img);
                    let pTitle = document.createElement('p');
                    pTitle.textContent = record.fields.title;
                    a.appendChild(pTitle);
                    let pArtist = document.createElement('p');
                    pArtist.textContent = record.fields.artist;
                    a.appendChild(pArtist);
                }
            }else{
                // error condtion
            }
        });
        xhr.open('GET', url, true);
        xhr.send();
    });
});