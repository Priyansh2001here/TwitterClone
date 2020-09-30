$('#regis-form').submit(register_form_submit)

async function register_form_submit(event) {
    event.preventDefault()
    var formElement = event.target
    const myFormData = new FormData(formElement)

    const usrname = $('#usrname').val()
    const pswd1 = $('#pswd1').val()
    const pswd2 = $('#pswd2').val()

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
    let resp = await fetch('/accounts/api/register', options)
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
