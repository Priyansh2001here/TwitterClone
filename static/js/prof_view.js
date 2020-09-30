function generate_f_unf_btn(follow_status, usr_id) {
    if (usrStat !== 403) {
        if (follow_status == null) {
            return "<div></div>"}
        else if (follow_status === true) {
            return `<div id="f-unf-btn-${usr_id}"><button class="btn btn-danger btn-danger-cstm" style="z-index: 1; position: absolute; left: 30vmin" onclick="profile_action('unfollow', ${usr_id})">Unfollow</button></div>`
        } else {
            return `<div id="f-unf-btn-${usr_id}"><button class="btn btn-primary" style="z-index: 1; position: absolute; left: 30vmin" onclick="profile_action('follow', ${usr_id})" >Follow</button></div>`
        }
    }
    return `<div ><button class="btn btn-primary" style="z-index: 1; position: absolute; left: 30vmin" onclick="$('#modalLRForm').modal('show')" >Login</button></div>`
}

async function profile_action(action, usr_id){

    $("#f-unf-btn-"+usr_id).html(`<div><button class="btn"></button></div>`)
    const url = '/accounts/profile/action'
    const csrf_token = getCookie('csrftoken')
    options = {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({
            usr_id:usr_id,
            action: action,
        })
    }
    let resp1 = await fetch(url, options)
    let resp = await resp1.json()

    if ((resp1.status === 200) && (action === "follow")){
        $("#f-unf-btn-"+usr_id).html(generate_f_unf_btn(true, usr_id))
    } else if (resp1.status === 200 && resp.message === "you are no longer a follower"){
        $("#f-unf-btn-"+usr_id).html(generate_f_unf_btn(false, usr_id))
    } else {
        alert(resp.message)
    }
}


function load_profile(pk=null) {
    let url
    if (pk === null) {
        url = '/accounts/api/profile'
    } else {
        url = `/accounts/api/profile/${pk}`
    }
    fetch(url)
        .then((resp) => resp.json())
        .then(function get_data(data) {

                const all_tweets = data.all_tweets
                wrapper.html("")
                for (let i = 0; i < all_tweets.length; i++) {
                    const item = format_tweet(all_tweets[i])
                    wrapper.append(item)
                }

                $('#usr-bio').html(data.bio)
                const banner_img_url = data.banner_img
                const prof_img_url = data.prof_img

                if (banner_img_url) {
                    $('#output-banner-img').attr('src', banner_img_url)
                }
                if (prof_img_url) {
                    $('#output-prof-img').attr('src', prof_img_url)
                }
                $('#btn-here').html(generate_f_unf_btn(data.is_following ,pk))

                $('#first_name').text(data.prof_user.first_name)
                $('#last_name').text(data.prof_user.last_name)
                $('#followers-count').text(data.followers + " followers")
                $('#following-count').text(data.following + " following")
            }
        )
}
