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
                document.querySelector('#results').style.display = "initial";
                for (let i = 0; i < records.length; i++) {
                    let record = records[i];
                    let p = document.createElement('p');
                    p.textContent = 'Title: ' + record.fields.title;
                    results.appendChild(p);
                }
            }else{
                // error condtion
            }
        });
        xhr.open('GET', url, true);
        xhr.send();
    });
});