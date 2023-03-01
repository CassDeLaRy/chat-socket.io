//HTML SCREENS
const loginScreen = document.querySelector('.login-screen');
const chatScreen = document.querySelector('.chat-screen');
const conectedUsersArea = document.querySelector('.conectedUsersArea');
chatScreen.style.display = 'none';
conectedUsersArea.style.display = 'none';

//HTML REFERENCES
const usernameInput = document.querySelector('.usernameInput');
const usernameButton = document.querySelector('.usernameButton');
const inputMessage = document.querySelector('.inputMessage');
const inputMessageButton = document.getElementById('inputMessageButton');
const messagesList = document.querySelector('.messages');
const conectedUsers = document.querySelector('.conectedUsers');
const photoInput = document.querySelector('.photoInput');
const photoButton = document.querySelector('.photoButton');


let DataURL;

const socket = io();

socket.on('user-connected', ( users ) => {
    conectedUsers.innerHTML = '';
    for (const user in users) {
        conectedUsers.insertAdjacentHTML('beforeend',`<li>> ${user}</li>`);
    }
})

socket.on('login', ( ) => {
    alert('Bienvenido a Misivas!')
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'inline';
    conectedUsersArea.style.display = 'inline';
})

socket.on('login-issue', () => {
    alert('El nombre que intentas usar no esta disponible, intenta uno nuevo');
    usernameInput.value = '';
})

socket.on('send-message', ({message, user, image}) => {
    messagesList.insertAdjacentHTML('beforeend',`<li>${user}: ${message}</li>`);
    if(image!== undefined){
        const imagen = document.createElement("img")
        imagen.src = image
        messagesList.appendChild(imagen);
    }
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('send-private-message', ({from, message, image}) => {
    messagesList.insertAdjacentHTML('beforeend',`<li>[susurro] ${from}: ${message}</li>`);
    if(image!== undefined){
        const imagen = document.createElement("img")
        imagen.src = image
        messagesList.appendChild(imagen);
    }
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('send-private-message-issue', () => {
    alert('No existe el usuario a quien intentas mandar un mensjae');
    usernameInput.value = '';
})

usernameButton.addEventListener('click', ()=>{
    let username = usernameInput.value;
    socket.emit('register', username);
});

inputMessageButton.addEventListener('click', ()=>{
    if ( inputMessage.value.startsWith('/susurrar') ) {
        const targetUser = inputMessage.value.split(' ')[1];
        const message = inputMessage.value.substr(targetUser.length + 10 );
        socket.emit('send-private-message', { targetUser, message, image: DataURL });
    }else {
        socket.emit('send-message', { message: inputMessage.value, image: DataURL});
    }
    inputMessage.value = '';
    DataURL = undefined;
});

photoButton.addEventListener('click', ()=>{
    photoInput.click();
})

photoInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        DataURL = reader.result
    };
    reader.readAsDataURL(file);
    //DataURL ? alert('Foto Adjuntada') : alert('Adjunte una vez mas para confirmar');
})