let remove_banner = 0, remove_avatar = 0, change_banner=0, change_avatar=0

function rem_av() {
    $('#remove-prof-img').css('display', 'none')
    $('#output-prof-img').attr('src', "https://www.w3schools.com/w3images/avatar2.png")
    $('#prof-img').val("")
    remove_avatar = 1
}

function rem_ban() {
    remove_banner = 1
    $('#remove-banner-img').css('display', 'none')
    $('#output-banner-img').attr('src', "https://adhyatmik.in/wp-content/uploads/2019/02/Background-Header-1.jpg")
    $('#banner-img').val("")
}

async function getProfDetails() {
    let resp1 = await fetch('/accounts/prof_update')
    resp1 = await resp1.json()

    $('#usr-bio').text(resp1.bio)

    if (resp1.prof_img) {
        $('#remove-prof-img').css('display', 'inline')

        $('#output-prof-img')
            .css('display', 'block')
            .attr('src', resp1.prof_img)
    }
    if (resp1.banner_img) {
        $('#remove-banner-img').css('display', 'inline')
        $('#output-banner-img')
            .css('display', 'block')
            .attr('src', resp1.banner_img)
    }

}

function load_av() {
    let prof_img = document.getElementById('prof-img').files[0]
    $('#output-prof-img')
        .attr('src', URL.createObjectURL(prof_img))
        .css('display', 'block')
        .css('display', 'inline')
    change_avatar = 1
}

function load_banner() {
    let banner_img = document.getElementById('banner-img').files[0]
    $('#output-banner-img')
        .attr('src', URL.createObjectURL(banner_img))
        .css('display', 'block')
        .css('display', 'inline')
    change_banner = 1
}

getProfDetails()
getUsrDetails()

let formdata = new FormData()
$('#my-frm').submit(submit_from)

async function getUsrDetails() {
    console.log('triggered')
    let resp1 = await fetch('/accounts/api/userinfo')
    resp1 = await resp1.json()
    $('#first_name').val(resp1.first_name)
    $('#last_name').val(resp1.last_name)
}

async function submit_from(event) {
    event.preventDefault()
    const btn = document.getElementById('prof-update-btn')
    let prof_img = document.getElementById('prof-img').files[0]
    let banner_img = document.getElementById('banner-img').files[0]

    btn.disabled = true
    if (remove_avatar === 1) {
        formdata.append('prof_img', '')
    } else if (prof_img && change_avatar === 1) {
        formdata.append('prof_img', prof_img)
    }

    if (remove_banner === 1) {
        formdata.append('banner_img', '')
    } else if (banner_img && change_banner === 1) {
        formdata.append('banner_img', banner_img)
    }

    formdata.append('first_name',    document.getElementById('first_name').value)
    formdata.append('last_name',     document.getElementById('last_name').value)


    const options = {
        method: 'POST',
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: formdata
    }

    formdata.append('bio', document.getElementById('usr-bio').value)

    let resp = await fetch('/accounts/prof_update', options)
    if (resp.status === 200){
        alert('saved')
        formdata = new FormData()
    }else if (resp.status === 413){
        alert("image too large to upload")
    } else {
        alert('error occurred')
    }
    btn.disabled = false
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
