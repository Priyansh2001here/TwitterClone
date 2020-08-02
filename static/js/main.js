
var userDetails;

var wrapper = document.getElementById("tweets-here");
stack();


async function stack(){
    console.log('stack')
    await get_user()
    await load_tweets();
}

var loadFile = function (event) {
    console.log("triggered")
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
    var reset_Btn = document.getElementById("image-reset");

    reset_Btn.innerHTML = `<button type="button" onclick="reset_img()" class="btn btn-danger">Remove Image</button>`
};

function reset_img() {
    const form_elements = document.getElementById('tweet-create-form').elements;
    console.log("reset_img fun triggered")
    console.log( "form_elements[2].value    ->   ", form_elements[2].value)
    form_elements[2].value="";

    console.log("elm    -> " ,document.getElementById("output").src)
    document.getElementById("output").src = ""
    console.log("elm    -> " ,document.getElementById("output").src)

    document.getElementById("output").innerHTML = `
        <img id="output" width="200" disabled="disabled" class="hidden" alt="Selected Image"/>`
    const reset_Btn = document.getElementById("image-reset");
    reset_Btn.innerHTML = ``
}

function getRetweetElm(obj) {

    var imgElmRe;
    if (obj.parent_serialized.img != null){
        imgElmRe = (`
                    <div>
                        <img src="${obj.parent_serialized.img}" height="80%" width="80%" alt="Retweeted Image">
                    </div>
                `)
    }else {
        imgElmRe = '<div disabled="disabled"></div>'
    }

    retweetElm = `
                <div class='container'>
                    <div class='col-md-8 col-sm-12 mx-auto border rounded py-3 mb-4'>
                        <div>
                            <small>${obj.parent_serialized.owner_name}</small>
                        </div>
                            <div class="container retwtcls">
                                ${obj.parent_serialized.content}
                            </div>
                            <div>
                                ${imgElmRe}
                            </div>
                    </div>
                </div>
            `
    return retweetElm
}

function retweetBtn(tweetID) {
    if (usrStat !== 403) {
        return (
            `
    <div ><a href="/tweets/${tweetID}/retweet"><button class="btn btn-success" style="padding-left: 3px;margin-left: 3px">Retweet</button></a></div>
            `
        )
    }else {
        return `<div disabled="disabled"></div>`
    }
}

function button_generator(tweet_id, to_do) {
    var new_btn;
    if (usrStat === 403){
        return (`
                    <div>
                    <button class="btn btn-primary" onclick="$('#modalLRForm').modal('show')">Login</button>
                        </div>
                    `)
    }


    // $('#modalLRForm').modal('show')


    else if (to_do === "unlike") {
        new_btn = `
                        <div id="tweet-${tweet_id}">
                    <button class="btn btn-danger" id=${tweet_id} onclick=action(${tweet_id},'unlike')>Unlike</button>
                        </div>
                    `
    }else if (to_do === "like"){
        new_btn = `
                           <div id="tweet-${tweet_id}">
                        <button class="btn" style="background-color: aquamarine" id=${tweet_id}, onclick=action(${tweet_id},'like')>Like</button>
                            </div>
                    `
    }
    return new_btn;
}

function if_liked(tweet_obj) {
    return !!tweet_obj.likes.includes(userDetails.id);

}

async function action(tweet_id, action){
    document.getElementById("tweet-" + tweet_id).innerHTML = `
                        <div id="tweet-${tweet_id}">
                            <button class="btn" id=${tweet_id}>.....</button>
                        </div>
                        `
    var tempBtn
    const csrftoken = getCookie('csrftoken')
    const options = {
        method : 'POST',
        headers:{
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            id:tweet_id,
            action: action,
        })
    }
    let resp1 = await fetch(`/api/${tweet_id}/${action}`, options)
    let status = await resp1.json()
    const server_response = status.message

    if (server_response === "liked")
    {
        tempBtn = button_generator(tweet_id, 'unlike')
        var element = document.getElementById("tweet-" + tweet_id)
        element.innerHTML = tempBtn
    }else if (server_response === "like deleted")
    {
        tempBtn = button_generator(tweet_id, 'like')
        var element = document.getElementById("tweet-" + tweet_id)
        element.innerHTML = tempBtn
    }
}

async function get_user() {
    const url = "/accounts/usrinfo"
    let resp1 = await fetch(url);
    userDetails = await resp1.json()
    usrStat = resp1.status
}

function load_tweets() {
    const url = "/tweets_api"
    fetch(url)
        .then((resp) => resp.json())
        .then(function get_data(data) {
            wrapper.innerHTML = ""
            for (let i = 0; i< data.length; i++){


                if (if_liked(data[i])){
                    btnElm = button_generator(data[i].id, 'unlike')
                } else
                {
                    btnElm = button_generator(data[i].id, 'like')
                }

                var is_retweet;
                let retweetElm;
                is_retweet = data[i].parent_serialized != null;

                if (is_retweet)
                {
                    retweetElm = getRetweetElm(data[i])
                }else
                {
                    retweetElm = `<div disabled="disabled"></div>`
                }

                let imgElm;
                if (data[i].img != null)
                {
                    imgElm = ( `
                        <div>
                            <img src="${data[i].img}" height="80%" width="80%" style="margin-bottom: 1%; margin-top: 0.3%">
                        </div>
                    `)
                }

                else
                {
                    imgElm = '<div disabled="disabled"></div>'
                }

                const item =
                    `                    <div class='container'>
                        <div class='col-md-8 col-sm-12 mx-auto border rounded py-3 mb-4'>
                            <div>
                                <small>${data[i].owner_name}</small>
                            </div>
                            <div class="container">
                                ${data[i].content}
                            </div>
                                <br>
                                <div class="container">
                                    ${imgElm}
                                </div>
                            <div style="align-items: flex-start">
                                ${retweetElm}
                            </div>
                            <div style="padding-bottom: 1px">
                                <div class="btn-group">${btnElm}${retweetBtn(data[i].id)}</div>
                            </div>
                        </div>
                    </div>`;
                wrapper.innerHTML+=item
            }

        } )
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}