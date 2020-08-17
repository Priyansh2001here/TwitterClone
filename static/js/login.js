
var login_form = document.getElementById('login-form');
login_form.addEventListener('submit', login_form_submit);


async function login_form_submit(event) {
    event.preventDefault()
    const myForm = event.target
    const myFormData = Object.values(event.target).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {})

    const csrftoken = getCookie('csrftoken')
    const options = {
        method : 'POST',
        headers:{
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(
            myFormData
        )
    }
    let resp1 = await fetch(`/accounts/login_api`, options)
    if (resp1.status === 401){
        alert('invalid credentials')
    }else if (resp1.status === 400){
        alert('something not ok')
    }else if (resp1.status === 200){
        location.reload()
    }else {
        alert('error occured')
    }
}