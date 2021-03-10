window.addEventListener('load', () => {
    document.querySelector('#searchButton').addEventListener('click', (event) =>{
        // stop the page reload
        event.preventDefault();
        // select and reset any previous results
        let results = document.querySelector('#results');
        results.innerHTML = '';
        let modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = '<div class="modal-close">+</div>';
        // select and display the loading gif
        let loading = document.querySelector('#loading');
        loading.style.display = "initial"
        // define and gather the search content and url for the Http request
        let searchTerm = encodeURIComponent(document.querySelector('#searchTerm').value.trim());
        let searchCat = document.querySelectorAll("option");
        // check which search category is selected
        let caseVal;
        for (let i = 0; i < searchCat.length; i++) {
            if(searchCat[i].selected){
                caseVal = i;
            }
        }
        // set the url search case based on the selected category
        let url;
        switch (caseVal) {
            case 0:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?q=' + searchTerm + '&limit=30';
                break;
            case 1:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?objectnamesearch=' + searchTerm + '&limit=30';
                break;
            case 2:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?namesearch=' + searchTerm + '&limit=30';
                break;
            case 3:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?placesearch=' + searchTerm + '&limit=30';
                break;
            case 4:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?materialsearch=' + searchTerm + '&limit=30';
                break;
            default:
                url = 'https://www.vam.ac.uk/api/json/museumobject/search?q=' + searchTerm + '&limit=30';
        }
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
                // Check if V&A database returned any results
                if (records.length === 0){
                    let h2 = document.createElement('h2');
                    h2.textContent = "No Results found in V&A database";
                    results.appendChild(h2);
                }else{
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
                        a.className = "VAItems";
                        div.appendChild(a);
                        let img = document.createElement('img');
                        let source = record.fields.primary_image_id;
                        // check if the primary image source is defined in JSON array
                        if (source !== undefined){
                            // apply the constructed url for the image path
                            img.src = "https://media.vam.ac.uk/media/thira/collection_images/" + source.substring(0, 6) + "/" +
                                source + "_jpg_ds.jpg";
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
                        // create the modal content
                        let form = document.createElement('form');
                        form.id = 'modalform';
                        modalContent.appendChild(form);
                        let fieldset = document.createElement('fieldset');
                        form.appendChild(fieldset);
                        // add the previously validated title content to the modal
                        let h3 = document.createElement('h3');
                        h3.textContent = pTitle.textContent;
                        fieldset.appendChild(h3);
                        // add the previously validated artist content to the modal
                        let modalpArtist = document.createElement('p');
                        modalpArtist.textContent = "Artist: " + pArtist.textContent;
                        fieldset.appendChild(modalpArtist);
                        // check if date is empty and set unknown or given record
                        let pDate = document.createElement('p');
                        if (record.fields.date_text !== ""){
                            pDate.textContent = "Date of Creation: " + record.fields.date_text;
                        }else{
                            pDate.textContent = "Date of Creation: Unknown";
                        }
                        fieldset.appendChild(pDate);
                        // check if place is empty and set unknown or given record
                        let pPlace = document.createElement('p');
                        if (record.fields.date_text !== ""){
                            pPlace.textContent = "Place of Creation: " + record.fields.place;
                        }else{
                            pPlace.textContent = "Place of Creation: Unknown";
                        }
                        fieldset.appendChild(pPlace);
                        // check if museum location is empty and set unknown or given record
                        let pLocation = document.createElement('p');
                        if (record.fields.date_text !== ""){
                            pLocation.textContent = "Museum Location: " + record.fields.location;
                        }else{
                            pLocation.textContent = "Museum Location: Unknown";
                        }
                        fieldset.appendChild(pLocation);
                    }
                    // target the modal elements
                    let closeModal = document.querySelector('.modal-close');
                    let modalbg = document.querySelector('.bg-modal');
                    let VAItems = document.querySelectorAll('.VAItems');
                    let itemForms = document.querySelectorAll('#modalform');
                    // for each of the V&A search items add these event listeners
                    for (let i=0; i < VAItems.length; i++) {
                        // when a V&A item is clicked, open it's modal
                        VAItems[i].addEventListener("click", function(){
                            modalbg.style.display = 'flex';
                            itemForms[i].style.display = 'initial';
                        });
                        // if the modal cross is clicked then close (hide) the modal
                        closeModal.addEventListener("click", function(){
                            modalbg.style.display = 'none';
                            itemForms[i].style.display = 'none';
                        });
                    }
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