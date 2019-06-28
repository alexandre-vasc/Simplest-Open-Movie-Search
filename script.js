window.addEventListener('DOMContentLoaded', defineEventListener, false);

// please don't stole my key T.T
const apikey = "504adb7"
const omdbapiHttp = 'http://www.omdbapi.com'
let resultsDiv;

function defineEventListener()  {
    // we need to wait the DOM to be ready before getting and element
    resultsDiv = document.getElementById('results-div')
    document.searchform.onsubmit = async e => {
        e.preventDefault()
    
        const form = e.target
        const formData = new FormData(form)
        formData.append('apikey', apikey)

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }
        
        const url = new URL(omdbapiHttp)
        for(var param of formData.entries()) {
            if (param[1].length > 0) {
                url.searchParams.append(param[0], param[1])
            }
         }
        
        try {
            const resp = await fetch(url, options)
            if (resp.ok) {
                const jsonResponse = await resp.json()
                resultsDiv.innerHTML = parseResults(jsonResponse)
            } else {
                resultsDiv.innerHTML = 
                  createMessageDiv("The omdbapi server did not accept the request. HTTP-Error: " + resp.status, 
                                   "no_connection")
            }

        } catch (e) {
            resultsDiv.innerHTML = createMessageDiv("Error fetching the omdbapi server", 
                                                    "no_connection")
        }
    }
}

function parseResults(jsonResult) {
    let htmlToReturn = "";
    if (jsonResult.Search) {
        jsonResult.Search.forEach(function(resultItem){
            htmlToReturn += createResultItem(
                resultItem.Title,
                resultItem.Year,
                resultItem.imdbID,
                resultItem.Type,
                resultItem.Poster)
        });
    } else if (jsonResult.Error === "Movie not found!") {        
        htmlToReturn = createMessageDiv("Nothing found!", "no_results")
    }
    return htmlToReturn;
}

function createMessageDiv(message, imageSrc) {
    imageSrc = imageSrc ? 
      "public/img/" + imageSrc + ".png" : "public/img/warning.png"
    const messageDiv = 
        `<div class="message-img-div">
            <img class="message-img" src="` + imageSrc + `"/>
        </div>
        <div class=message-text-div>
            <p>` + message + `</p>
        </div>`
    return messageDiv
}

function createResultItem(title, year, imdbID, type, pPoster) {
    // first, sanity check, to make sure
    if (!imdbID) {
        /*
         if imdbID is not defined, something is serious broken.
         Without it we can't create the link for the datails page.
         return nothing.
        */
        return ""
    }
    title = title || "unknown"
    year = year || "unknown"
    type = type || "unknown"
    pPoster = pPoster || "noposter.jpg"
    // create the element. A template string would be much prettier. 
    // but I think we don't have it in pure JS
    const itemDiv = `<div class="result-item" onclick="getItemDetails(this.id)" id="` + imdbID + `">
                        <div class="result-tittle">
                            <h2>` + title + `</h2>
                        </div>
                        <div class="poster-div">
                            <img class="poster-img" src="` + pPoster + `"/>
                        </div>
                        <div class="result-info">                
                            <h3><b>Year:</b> ` + year + `</h3>
                            <h3><b>Type: </b> ` + type + `</h3>
                            <small><b>imdbID:</b> ` + imdbID + `</small>
                        </div>
                    </div>`
    return itemDiv
}

async function getItemDetails(imdbID) {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    }
    
    const url = new URL(omdbapiHttp)
    url.searchParams.append("apikey", apikey)
    url.searchParams.append("plot", "full")
    url.searchParams.append("i", imdbID)
    
    try {
        const resp = await fetch(url, options)
        if (resp.ok) {
            const jsonResponse = await resp.json()
            resultsDiv.innerHTML = parseDetails(jsonResponse)
        } else {
            resultsDiv.innerHTML = 
              createMessageDiv("The omdbapi server did not accept the request. HTTP-Error: " + resp.status, 
                               "no_connection")
        }

    } catch (e) {
        resultsDiv.innerHTML = createMessageDiv("Error fetching the omdbapi server", 
                                                "no_connection")
    }
}

function parseDetails(resp) {    
    const tittle = resp.Title
    const imdbId =  resp.imdbID 
    if (!tittle || !imdbId) {
        // if we don't have those info something went wrong with the request
        return createMessageDiv("invalid response received")
    }
    const poster = resp.Poster || "public/img/no_poster.jpeg"          
    const release = resp.Released || "unkown"
    const type = resp.Type || "unkown"
    const runtime = resp.Runtime || "unkown"
    const genre = resp.Genre || "unkown"
    const director = resp.Director || "unkown"
    const writer = resp.Writer || "unkown"
    const production = resp.Production || "unkown"
    const metascore = resp.Metascore || "unkown" 
    const imdbRating = resp.imdbRating || "unkown" 
    const imdbVotes = resp.imdbVotes || "unkown" 
    const plot = resp.Plot || "not avaliable"
    const website = resp.Website || "#"

    let ratingImg
    switch (resp.Rated) {
        case "12":
            ratingImg = "https://www.askaboutgames.com/wp-content/uploads/2017/09/age-12-black.jpg"
            break
        case "PG-13":
            ratingImg = "https://wfmj.images.worldnow.com/images/23938899_SA.jpg"
            break
        case "G":
            ratingImg = "https://djqh0pophbxqy.cloudfront.net/wpdata/images/1284-o.png"
            break
        case "Restricted":
            ratingImg = "https://djqh0pophbxqy.cloudfront.net/wpdata/images/1828-o.png"
            break;
        default:
            ratingImg = "http://mimg.ugo.com/201006/48795/rp-16-9.jpg"
            break;
    }
    const html = (
        `<div class="movie-details">
            <div class="details-tittle">
                <h1>` + tittle + `</h1>
            </div>
            <div class="poster-detail"> 
                <img class="poster-img-big" src="` + poster + `" alt="movie poster"/>            
            </div>                 
            <div class="result-info">  
                <p><b>Release date: </b>` + release + `</p>
                <p><b>Type: </b>` + type + `</p>
                <p><b>Runtime: </b>` + runtime + `</p>
                <p><b>Genre: </b>` + genre + `</p>
                <small><b>Director: </b>` + director + `</small><br/>
                <small><b>Writer: </b>` + writer + `</small><br/>
                <small><b>Production: </b>` + production + `</small><br/>      
                <small><b>imdbID:</b> ` + imdbId + `</small><br/>
                <small><a href="` + website + `">visit website</a></small>
            </div>
            <div class="details-rating-div">
                <div class="pg-div rating-div">
                    <img class="pg-img" src="` + ratingImg + `" alt="rating img"/>                         
                </div>
                <div class="metascore-div rating-div">
                        <p><b>Metascore: </b>` + metascore + ` </p>
                </div>
                <div class="imbrating-div rating-div">
                        <p><b>imdbRating: </b> ` + imdbRating + `</p>
                        <p><b>imdbVotes: </b> ` + imdbVotes + `</p>
                </div>
            </div>
            <div class="plot-div">
                <p><b>Plot:</b></p>
                <p>` + plot + `</p>
            </div>
        </div>`)
    return html
}