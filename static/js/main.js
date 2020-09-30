
let userDetails;

let wrapper;

$('#tweet-create-form').submit(create_tweet)

function search(){
    const search_term = $('#search-field').val()

    if (search_term === ""){
        $('#tweets-here').css('display', 'block')
        $('#search-results').css('display', 'none')
        return
    }

    const url = `/accounts/api/search/${search_term}`
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
                const results = data.results
                if (results){
                    $('#tweets-here').style.display = 'none'

                    $('#search-results')
                        .css('display', 'block')
                        .html("")

                    for (let i = 0; i< results.length; i++) {
                        const url = `/accounts/profile/${results[i][1]}`
                        $('#search-results').append( `
                        <div><a href=${url}>
                            <div>${results[i][0]}</div>
                            <hr>
                            <br>
                        </div>        
                        `)
                    }

                } else {
                    $('#search-results').html('No Search Results')
                }
            }
        )
}

function get_date_time(date_time_created){
    const myDateTime = new Date(date_time_created)
    return myDateTime.toLocaleString()
}

async function create_tweet(event) {
    event.preventDefault()
    let myForm = event.target
    let myFormdata = new FormData(myForm)
    const url = '/api/create'
    const options = {
        method : 'POST',
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: myFormdata
    }
    let resp = await fetch(url, options)
    if (resp.status === 200) {
        resp = await resp.json()
        let tweets_here_elm = $('#tweets-here')
        let tweets_here = tweets_here_elm.html()

        let retweetElm = getRetweetElm(resp)
        const btnElm = gen_btnElm(resp)
        const imgElm = get_imgElm(resp)
        const item = format_tweet(resp, imgElm, retweetElm, btnElm)

        tweets_here = item + tweets_here
        tweets_here_elm.html(tweets_here)
        myForm.reset()
        $('#output').css('display', 'none')
        $('#image-reset').css('display', 'none')

    }else if (resp.status === 413){
        alert("image too large to upload")
    }else {
        alert("error occurred")
    }
}

async function stack(all=true, pk=null, load_feed=true, load_profile_bool=false){
    wrapper = $("#tweets-here");
    await get_user()
    if (all) {
        await load_tweets();
    }
    else if (pk === null){
        await load_tweets(all=false, pk, load_feed, load_profile_bool)
    } else {
        await load_tweets(all=false, pk, load_feed, load_profile_bool)
    }
}

let loadFile = function (event) {
    let image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.style.display = 'block'
    let reset_Btn = $("#image-reset");
    reset_Btn.html(`<button type="button" onclick="reset_img()" class="btn btn-danger">Remove Image</button>`)
    reset_Btn.css('display', 'block')
};


function reset_img() {
    const form_elements = document.getElementById('tweet-create-form').elements;
    form_elements[2].value="";

    document.getElementById("output").src = ""

    document.getElementById("output").innerHTML = `
        <img id="output" width="200" disabled="disabled" class="hidden" alt="Selected Image"/>`
    const reset_Btn = document.getElementById("image-reset");
    reset_Btn.innerHTML = ``
}

function getRetweetElm(obj) {

    if (get_is_retweet(obj)){

        const date_time_created = get_date_time(obj.date_created)

        let imgElmRe;
        if (obj.parent_serialized.img != null) {
            imgElmRe = (`
                    <div>
                        <img src="${obj.parent_serialized.img}" height="80%" width="80%" alt="Retweeted Image">
                    </div>
                `)
        } else {
            imgElmRe = '<div disabled="disabled"></div>'
        }

        return `
                <div class='container'>
                    <div class='col-md-8 col-sm-12 mx-auto border rounded py-3 mb-4'>
                        <div>

                               <small><a href="/accounts/profile/${obj.owner_id}">${obj.owner_name}</a></small>
                                <!---<span style="float: right; margin: 0 1.5%; width: 30%;height: 30%; flex: auto">
                                    <small>${date_time_created}</small>
                                </span> -->
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
    }
    else {
        return `<div disabled="disabled"></div>`
    }
}

function retweetBtn(tweetID, retweet_count) {
    if (usrStat !== 403 ) {
        if (!retweet_count){
            retweet_count = 0
        }
        return (
            `
            <div>
                <a href="/tweets/${tweetID}/retweet"><button class="btn btn-success" style="padding-left: 3px;margin-left: 3px">Retweet</button></a>
                <div style="margin-left: 7%">
                    <small>${retweet_count} retweets</small>
                </div>
            </div>
            `
        )
    }else {
        return `<div disabled="disabled"></div>`
    }
}

function button_generator(tweet_id, likes_count, to_do) {
    let new_btn;
    if (!likes_count){
        likes_count = 0
    }
    if (usrStat === 403){
        return (`
                 <div>
                    <button class="btn btn-primary" onclick="$('#modalLRForm').modal('show')">Login</button>
                 </div>
                    `)
    }


    else if (to_do === "unlike") {
        new_btn = `
                   <div id="tweet-${tweet_id}">
                       <button class="btn btn-danger" id=${tweet_id} onclick="action(${tweet_id},${likes_count}, 'unlike')">Unlike</button>
                       <div>
                           <small>${likes_count} likes</small>
                       </div>
                   </div>
                   `
    }else if (to_do === "like"){
        new_btn = `
                   <div id="tweet-${tweet_id}">
                       <button class="btn" style="background-color: aquamarine" id=${tweet_id} onclick="action(${tweet_id}, ${likes_count}, 'like')">Like</button>
                       <div>
                           <small>${likes_count} Likes</small>
                       </div>
                   </div>
                  `
    }
    return new_btn;
}

function if_liked(tweet_obj) {
    return tweet_obj.is_liked
}

async function action(tweet_id, likes_count, action){
    $("#tweet" + tweet_id).html(`
                        <div id="tweet-${tweet_id}">
                            <button class="btn" id=${tweet_id}>.....</button>
                        </div>
                        `)
    let tempBtn
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
    let resp1 = await fetch(`/api/action`, options)
    let status = await resp1.json()
    const server_response = status.message

    if (server_response === "liked")
    {
        likes_count+=1
        tempBtn = button_generator(tweet_id, likes_count, 'unlike')
        let element = $("#tweet-" + tweet_id)
        element.html(tempBtn)
    }else if (server_response === "like deleted")
    {
        likes_count-=1
        tempBtn = button_generator(tweet_id, likes_count, 'like')
        let element = $("#tweet-" + tweet_id)
        element.html(tempBtn)
    }
}

async function get_user() {
    const url = "/accounts/api/userinfo"
    let resp1 = await fetch(url);
    userDetails = resp1
    usrStat = resp1.status
}

function get_imgElm(obj) {
    if (obj.img != null) {
        return (`
                        <div>
                            <img src="${obj.img}" height="80%" width="80%" style="margin-bottom: 1%; margin-top: 0.3%" alt="tweeted image">
                        </div>
                    `)
    } else {
        return '<div disabled="disabled"></div>'
    }
}


function gen_btnElm(obj) {
    let btnElm;
    if (if_liked(obj)) {
        btnElm = button_generator(obj.id, obj.likes_count, 'unlike')
    } else {
        btnElm = button_generator(obj.id, obj.likes_count, 'like')
    }
    return btnElm
}

function get_is_retweet(obj){
    return obj.parent_serialized != null;
}

function load_tweets(all=false, pk=null, load_feed=true, load_profile_bool=false) {
    if (!all && load_feed && pk===null) {

        if (usrStat !== 403 ){
            $('#tweets-here').html('Loading......')
            $('#feed-global').html('<a class="nav-link" style="cursor: pointer" onclick="load_tweets(false, null, false)">Global<span class="sr-only">(current)</span></a>')
        }

        const url = "/api/tweets"
        fetch(url)
            .then((resp) => resp.json())
            .then(function get_data(data) {


                wrapper.html("")
                for (let i = 0; i < data.length; i++) {
                    const item = format_tweet(data[i])
                    wrapper.append(item)
                }
            })

    }

    else if (!all && load_profile_bool){
        load_profile(pk);
    }
    else if (!load_feed && !all){

        const url = "/api/tweets/global"
        fetch(url)
            .then((resp) => resp.json())
            .then(function get_data(data) {
                    wrapper.html("")
                    for (let i = 0; i < data.length; i++) {

                        const item = format_tweet(data[i])
                        wrapper.append(item)
                    }
                }

            )

        $('#tweets-here').html('Loading......')
        $('#feed-global').html('<a class="nav-link" style="cursor: pointer" onclick="load_tweets(false, null, true, true)">Feed<span class="sr-only">(current)</span></a>')
    }

}

function format_tweet(obj){

    let retweetElm = getRetweetElm(obj)
    const btnElm = gen_btnElm(obj)
    const imgElm = get_imgElm(obj)

    const date_time_created = get_date_time(obj.date_created)

    return `                    
                    <div class='container'>
                        <div class='col-md-8 col-sm-12 mx-auto rounded py-3 mb-4'>
                            <div class="flex-spacer">
                               <small style="float: left; margin: 0 1.5%;width: 63%;"><a href="/accounts/profile/${obj.owner_id}">${obj.owner_name}</a></small>
                                <span style="  float: right; margin: 0 1.5%; width: 30%;">
                                    <small>${date_time_created}</small>
                                </span>
                            </div>
                            <div class="container">
                                ${obj.content}
                            </div>
                                <br>
                                <div class="container">
                                    ${imgElm}
                                </div>
                            <div style="align-items: flex-start">
                                ${retweetElm}
                            </div>
                            <div style="padding-bottom: 1px">
                                <div class="btn-group">${btnElm}${retweetBtn(obj.id, obj.retweet_count)}</div>
                            </div>
                        </div>
                    <hr>
                    </div>    
                `
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
