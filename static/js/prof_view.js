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
                wrapper.innerHTML = ""
                for (let i = 0; i < all_tweets.length; i++) {
                    let retweetElm = getRetweetElm(all_tweets[i])
                    const btnElm = gen_btnElm(all_tweets[i])
                    const imgElm = get_imgElm(all_tweets[i])
                    const item = format_tweet(all_tweets[i], imgElm, retweetElm, btnElm)
                    wrapper.innerHTML += item
                }

                document.getElementById('usr-bio').innerText = data.bio
                const banner_img_url = data.banner_img
                const prof_img_url = data.prof_img

                if (banner_img_url) {
                    document.getElementById('output-banner-img').src = banner_img_url
                }
                if (prof_img_url) {
                    document.getElementById('output-prof-img').src = prof_img_url
                }


                document.getElementById('first_name').innerText = data.prof_user.first_name
                document.getElementById('last_name').innerText = data.prof_user.last_name
                document.getElementById('followers-count').innerText = data.followers + " followers"
                document.getElementById('following-count').innerText = data.following + " following"
            }
        )
}