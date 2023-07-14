import { jokes } from '../data/jokes.js';


// ++DRAWER

var click = document.querySelectorAll('[data-effect]');
var menu = document.querySelector('#drawer-container');
var pusher = document.querySelector('.drawer-pusher');
var effect;


// ++NOTES
const noteTextarea = document.getElementById('noteTextarea');
const saveButton = document.getElementById('saveButton');
const notasDiv = document.getElementById('notas');


// ++JOKES
const jokeBox = document.getElementById('jokeBox')


// ++SEARCH
const input = document.getElementById('query')

// ++UNSPLASH WALLPAPERS
// const wallpaper = document.getElementById('wallpaper')
// const changeBgBtn = document.getElementById('changeBgBtn')



// ++GITHUB API

const usernameInput = document.getElementById('usernameInput');
const tokenInput = document.getElementById('tokenInput');

const pushesBox = document.getElementById('pushesBox');
const fetchMoreBtn = document.getElementById('fetchMoreBtn');
let numberOfPushes = 5;
let username = 'araceliponce';
let accessToken = '';





window.addEventListener('DOMContentLoaded', () => getJoke())


//++SEARCH

const form = document.getElementById('form');
form.addEventListener('submit', handleForm);

function handleForm(e) {
  e.preventDefault();
  window.location.href = `https://www.google.com/search?q=${input.value.trim()}`;
  e.target.reset();
}





// changeBgBtn.addEventListener('click', () => getWallpaper());
let photoURLs = [];
let selectedURLs = [];

async function getWallpaper() {
  const username = 'ujitomo';
  const url = `https://api.unsplash.com/users/${username}/photos/?client_id=.............&orientation=landscape`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    // console.log(data)
    const photoURLs = data.map((photo) => photo.urls.regular); // Obtiene los URLs regulares de cada foto

    // console.log(photoURLs);
    setRandomBg(photoURLs)



  } catch (e) {
    console.log(e);
  }
}

function setRandomBg(photoURLs) {
  console.log('set randoom')
  const wallpaperDiv = document.getElementById('wallpaper');

  console.log(photoURLs)
  const availableURLs = photoURLs.filter((url) => !selectedURLs.includes(url));

  // console.log(availableURLs)
  if (availableURLs.length === 0) {
    // Si se han seleccionado todos los URLs, restablece el array de selecciones
    selectedURLs = [];
  }

  const randomIndex = Math.floor(Math.random() * availableURLs.length);
  const randomURL = availableURLs[randomIndex];

  wallpaperDiv.style.backgroundImage = `url(${randomURL})`;


  // Agrega el URL seleccionado al array de selecciones
  selectedURLs.push(randomURL);

}







// ++JOKES

function addJoke(data) {
  jokeBox.innerHTML = `
    <blockquote>${data.pt1}</blockquote>
    <small>${data.pt2}</small>
  `;
}

function getJoke() {
  const joke = Math.floor(Math.random() * jokes.length);
  addJoke(jokes[joke]);
}

jokeBox.addEventListener('click', () => {
  getJoke()
})




// ++DRAWER

// click event on all the data-effect buttons
for (var i = 0; i < click.length; i++) {
  click[i].addEventListener('click', addClass)
}

pusher.addEventListener('click', closeMenu);


function addClass(e) {
  effect = e.target.getAttribute('data-effect');
  // console.log(effect)

  menu.classList.toggle(effect);
  menu.classList.toggle('drawer-menu-open');
  // console.log(menu.classList)

}

function closeMenu(el) {
  // if the click target has this class then we close it
  if (el.target.classList.contains('drawer-pusher')) {
    menu.classList.toggle(effect);
    menu.classList.toggle('drawer-menu-open');
  }
}


// we also open and close on 'Space'
document.addEventListener('keydown', (e) => {
  const isInputElement = document.activeElement.tagName === 'INPUT';
  const isTextareaElement = document.activeElement.tagName === 'TEXTAREA';

  if (!isInputElement && !isTextareaElement && e.key === ' ') {
    // Ejecutar el código solo si el foco no está en un <input> o <textarea> y se presiona la tecla Espacio
    menu.classList.toggle('drawer-effect-3');
    menu.classList.toggle('drawer-menu-open');

  }
});






//++ NOTES


// Cargar notas almacenadas en el Local Storage
window.addEventListener('DOMContentLoaded', loadNotes);

// Agregar evento para guardar nota
saveButton.addEventListener('click', saveNote);
noteTextarea.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.shiftKey) {
    saveNote();
  }
});

function saveNote() {
  const noteContent = noteTextarea.value.trim();
  if (noteContent !== '') {
    const noteDiv = createNoteDiv(noteContent);
    notasDiv.appendChild(noteDiv);

    saveNoteToLocalStorage(noteContent);

    noteTextarea.value = ''; // cleaning the el
  }
}




function createNoteDiv(content) {
  const noteDiv = document.createElement('div');
  // noteDiv.classList.add('nota', 'd-flex');
  noteDiv.classList.add('nota');

  const lines = content.split('\n');

  lines.forEach(line => {
    const words = line.split(' ');

    const lineDiv = document.createElement('div');

    words.forEach(word => {
      const wordElement = document.createElement('span');

      if (word.includes('//') || word.includes('www')) {
        const link = document.createElement('a');
        link.href = word.startsWith('www') ? `http://${word}` : word;
        link.textContent = word;
        wordElement.appendChild(link);
      } else {
        wordElement.textContent = word;
      }

      lineDiv.appendChild(wordElement);
      lineDiv.appendChild(document.createTextNode(' '));
    });

    noteDiv.appendChild(lineDiv);
    noteDiv.appendChild(document.createElement('br'));



  });

  //++to delete 
  const absoluteBox = document.createElement('div')
  const deleteButton = document.createElement('button');
  // deleteButton.textContent = 'x';
  deleteButton.className = 'btn--close';

  absoluteBox.className = 'absolute'
  absoluteBox.append(deleteButton)
  // noteDiv.appendChild(deleteButton);
  noteDiv.appendChild(absoluteBox);
  deleteButton.addEventListener('click', () => {
    deleteNoteFromLocalStorage(content);
    noteDiv.remove();
  });

  return noteDiv;
}


function saveNoteToLocalStorage(content) {
  let savedNotes = localStorage.getItem('notas');

  if (savedNotes === null) {
    savedNotes = [];
  } else {
    savedNotes = JSON.parse(savedNotes);
  }

  savedNotes.push(content);
  localStorage.setItem('notas', JSON.stringify(savedNotes));
}


//to delete
function deleteNoteFromLocalStorage(content) {
  let savedNotes = localStorage.getItem('notas');

  if (savedNotes !== null) {
    savedNotes = JSON.parse(savedNotes);
    const updatedNotes = savedNotes.filter(note => note !== content);
    localStorage.setItem('notas', JSON.stringify(updatedNotes));
  }
}


function loadNotes() {
  const savedNotes = localStorage.getItem('notas');

  if (savedNotes !== null) {
    const parsedNotes = JSON.parse(savedNotes);

    parsedNotes.forEach(note => {
      const noteDiv = createNoteDiv(note);
      notasDiv.appendChild(noteDiv);
    });
  }
}











//++CLOCK

const deg = 6;
const hour = document.querySelector(".hour");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

const setClock = () => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * deg;
  let ss = day.getSeconds() * deg;

  hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  min.style.transform = `rotateZ(${mm}deg)`;
  sec.style.transform = `rotateZ(${ss}deg)`;
};

// first time
setClock();
// Update every 1000 ms
setInterval(setClock, 1000);





// ++ BG COLORS


const colorInput = document.getElementById('colorInput');

colorInput.addEventListener('input', (event) => {
  const newBgColor = event.target.value;

  // Update the --bg CSS variable
  root.style.setProperty('--bg', newBgColor);
  // document.body.style.setProperty('--bg', newColor);

  // Save the new color value to local storage
  localStorage.setItem('bgColor', newBgColor);
});



function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

// +--bg does not change on click of btn or input

document.addEventListener('click', () => {
  // console.log(document.activeElement)

  const isInputElement = document.activeElement.tagName === 'INPUT';
  const isButtonElement = document.activeElement.tagName === 'BUTTON';
  const isTextareaElement = document.activeElement.tagName === 'TEXTAREA';


  if (!isInputElement && !isButtonElement && !isTextareaElement) {
    const newColor = getRandomColor();

    // document.body.style.setProperty('--bg', newColor);
    root.style.setProperty('--bg', newColor);

    colorInput.value = newColor;
    localStorage.setItem('bgColor', newColor);
  }

});


const resetColorBtn = document.getElementById('resetColorBtn');
resetColorBtn.addEventListener('click', () => {
  let ogColor = '#E0B489';
  root.style.setProperty('--bg', ogColor);
  localStorage.setItem('bgColor', ogColor);

  colorInput.value = ogColor;

})




// ++GITHUB API

/* Colocar accessToken para 

1. ver pushes en repositorios privados
2. evitar error por exceder:
        Object { message: "API rate limit exceeded for ... (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)", documentation_url: "https://docs.github.com/rest/overview/resources-in-the-redrawer-api#rate-limiting" } */

usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    username = usernameInput.value.trim();
    accessToken = '';
    fetchPushes(username, accessToken);
  }
});

tokenInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    accessToken = tokenInput.value.trim();
    fetchPushes(username, accessToken);
  }
});

function fetchPushes(username, accessToken) {
  let url = `https://api.github.com/users/${username}/events`;
  let headers = {};

  if (accessToken !== '') {
    headers = {
      Authorization: `token ${accessToken}`
    };
  }

  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        const pushEvents = data.filter(event => event.type === 'PushEvent');
        const pushes = pushEvents.map(event => {
          const isPublic = event.public;

          return {
            repo: event.repo.name,
            message: event.payload.commits[0].message,
            date: event.created_at,
            public: isPublic
          };
        });

        renderPushes(pushes);
      } else {
        console.error('Invalid API response format.');

      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

fetchMoreBtn.addEventListener('click', () => {
  numberOfPushes += 5;
  fetchPushes(username, accessToken);
});

function renderPushes(pushes) {
  pushesBox.innerHTML = '';

  pushes.slice(0, numberOfPushes).forEach(push => {
    const li = document.createElement('li');
    li.textContent = `Repo: ${push.repo} - Message: ${push.message} - Date: ${push.date}`;
    pushesBox.appendChild(li);
  });

  if (pushes.length > numberOfPushes) {
    fetchMoreBtn.style.display = 'block';
  } else {
    fetchMoreBtn.style.display = 'none';
  }
}

fetchPushes(username, accessToken);
