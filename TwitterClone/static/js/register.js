
var regis_form = document.getElementById('regis-form');
regis_form.addEventListener('submit', register_form_submit);


async function register_form_submit(event) {
    event.preventDefault()
    var formElement = event.target
    const myFormData = Object.values(event.target).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {})

    const options = {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: JSON.stringify(
            myFormData
        )
    }
    let resp = await fetch('/accounts/usr_regis_api', options)
    console.log('response  ->        ', resp)
    if (resp.status === 200){
        location.reload()
    }else {
        resp = await resp.json()
        console.log('triggered')
        console.log('json ->   ', resp)
        console.log(resp.message)
        alert(resp.message)
    }
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