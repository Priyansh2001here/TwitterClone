
var regis_form = document.getElementById('regis-form');
regis_form.addEventListener('submit', register_form_submit);


async function register_form_submit(event) {
    event.preventDefault()
    var formElement = event.target
    const myFormData = new FormData(formElement)

    const usrname = document.getElementById('usrname').value
    const pswd1 = document.getElementById('pswd1').value
    const pswd2 = document.getElementById('pswd2').value

    if (usrname.length > 25){
        alert('length of username must be less than 25')
        return
    } else if (pswd1 !== pswd2){
        alert("passwords don't match")
        return
    } else if (pswd2.length < 8){
        alert("password's length must be greater than 8")
        return
    }

    const options = {
        method: 'POST',
        headers:{
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: myFormData
    }
    let resp = await fetch('/accounts/usr_regis_api', options)
    if (resp.status === 200){
        location.reload()
    }else if(resp.status === 413) {
        resp = resp.json()
        alert(resp.message)
    }else {
        resp = await resp.json()
        alert(resp.message)
    }
}
