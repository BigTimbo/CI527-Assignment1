window.addEventListener('load', () => {
    document.querySelector('#searchButton').addEventListener('click', (event) =>{
        // stop the page reload
        event.preventDefault();
        // select and reset any previous results
        let results = document.querySelector('#results');
        results.innerHTML = '';
        // select and display the loading gif
        let loading = document.querySelector('#loading');
        loading.style.display = "initial"
        // define and gather the search content and url for the Http request
        let searchTerm = encodeURIComponent(document.querySelector('#searchTerm').value.trim());
        let url = 'https://www.vam.ac.uk/api/json/museumobject/search?q=' + searchTerm + '&limit=30'; 
        let xhr = new XMLHttpRequest();
        // On successful load and 200 status from the http request do below
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                // hide the loading gif
                loading.style.display = "none";
                // select constructors for the JSON response array
                let json = xhr.responseText;
                let obj = JSON.parse(json);
                let records = obj.records;
                // for each record construct the card html and add relevant JSON content
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
                    // check if the primary image source is defined in JSON array
                    if (source !== undefined){
                        // apply the constructed url for the image path
                        img.src = "https://media.vam.ac.uk/media/thira/collection_images/" + source.substring(0, 6) + "/" +
                            source + ".jpg";
                        img.alt = "artwork image:" + record.fields.title;
                        // if this image path is defined but not on external server (404) then replace with default image
                        img.addEventListener('error', () => {
                            img.src = "images/artwork.jpg";
                            img.alt = "template artwork";
                        });
                    }else{
                        // if image source is undefined then set with default image
                        img.src = "images/artwork.jpg";
                        img.alt = "template artwork";
                    }
                    // add the JSON array title to card
                    a.appendChild(img);
                    let pTitle = document.createElement('p');
                    // check if title is empty and set unknown or given record
                    if (record.fields.title !== ""){
                        pTitle.textContent = record.fields.title;
                    }else{
                        pTitle.textContent = "Unknown";
                    }
                    a.appendChild(pTitle);
                    // add the JSON array artist to the card
                    let pArtist = document.createElement('p');
                    // check if artist is empty and set unknown or given record
                    if (record.fields.artist !== ""){
                        pArtist.textContent = record.fields.artist;
                    }else{
                        pArtist.textContent = "Unknown";
                    }
                    a.appendChild(pArtist);
                }
            }else{
                // if HTTP request status was not OK then report connection failure
                let p = document.createElement('p');
                p.textContent = "V&A API Connection Failed";
                results.appendChild(p);
            }
        });
        // Open and send http request
        xhr.open('GET', url, true);
        xhr.send();
    });
});