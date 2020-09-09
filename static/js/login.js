
var login_form = document.getElementById('login-form');
login_form.addEventListener('submit', login_form_submit);


async function login_form_submit(event) {
    event.preventDefault()
    const myForm = event.target
    const myFormData = new FormData(myForm)

    const csrftoken = getCookie('csrftoken')
    const options = {
        method : 'POST',
        headers:{
            "X-CSRFToken": csrftoken
        },
        body: myFormData
    }
    let resp1 = await fetch(`/accounts/api/login`, options)
    if (resp1.status === 401){
        alert('invalid credentials')
    }else if (resp1.status === 400){
        alert('something not ok')
    }else if (resp1.status === 200){
        resp1 = await resp1.json()
        localStorage.setItem('jwt', resp1.token)
        location.reload()
    }else {
        alert('error occurred')
    }
}