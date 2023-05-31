const cancel = () => {

    let blur = document.querySelector('#blur');
    blur.classList.toggle('deleteActive');
    let popup = document.querySelector('#popup');
    popup.classList.toggle('deleteActive');
    console.log('cancelled');
    
}

const delete_popup = () => {
    
    let blur = document.querySelector('#blur');
    blur.classList.toggle('deleteActive');
    let popup = document.querySelector('#popup');
    popup.classList.toggle('deleteActive');
    console.log('blurred');   

}

