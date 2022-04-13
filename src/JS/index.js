import '../css/style.css';
import _ from 'lodash';
import axios from 'axios';

let container = document.querySelector('.container');
const body = document.querySelector('body');

// Up and Down buttons
let up = document.createElement('a');
up.className = 'up';
up.innerHTML = '<i class="fa-solid fa-angle-up fa-2x"></i>';
up.href = '#';
body.prepend(up);

let down = document.createElement('a');
down.className = 'down';
down.innerHTML = '<i class="fa-solid fa-chevron-down fa-2x"></i>'; 
down.href = '#buttonLM';
body.append(down);

// Load More button
let button = document.createElement('button');
button.className = 'button';
button.id = 'buttonLM';
button.innerText = 'Load More';
container.after(button);

// Menu Options
let news = document.querySelector('.newstories');
let best = document.querySelector('.beststories');
let topp = document.querySelector('.topstories');

let allSection = [news, topp, best];

allSection.forEach(element => {
    element.addEventListener('click', loadSection);
});

let thisUrl = ['newstories'];
let count = 0;


function loadSection(e) {

    console.log('prima funzione');
    let getClass = e.target.className;
    let defaultValue = 'newstories';

    function getValue(a, b) {
        if(!b) {
            return a;
        } else {
            return b;
        }
    }
    
    let primoUrl = 'https://hacker-news.firebaseio.com/v0/' + getValue(defaultValue, getClass) + '.json';

axios.get(primoUrl)
.then(res => {
    let listOfId = _.get(res, 'data', '');

    if (getClass != undefined) {
        thisUrl.push(getClass);
    }

    if(thisUrl.length > 2) {
        thisUrl.splice(0, 1);
    }
    console.log(thisUrl);

    let currentSection = document.querySelector('.current-section');
    currentSection.innerHTML = getValue(defaultValue, getClass);

    if(thisUrl[0] === thisUrl[1]) {
        nextArray();
    } else {
        container.innerHTML = "";
        nextArray();
    }

    function nextArray() {
        console.log('seconda funzione');
        let newArray = listOfId.slice(count, count + 10);

        newArray.map(id => {
            let infoUrl = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json';

            axios.get(infoUrl)
                .then(resTwo => {
                    let date = (new Date((_.get(resTwo, 'data.time', '')) * 1000).toISOString().slice(0, 19).replace('T', ' '));
                    let box = document.createElement('div');
                    box.className = 'news-box';
                    container.append(box);

                    const score = _.get(resTwo, 'data.score', 'No score');
                    const title = _.get(resTwo, 'data.title', 'No title');
                    const url = _.get(resTwo, 'data.url', 'No url');

                    box.innerHTML = `
                    <div class="box-header">
                    <h4 class="data">${date}</h4>
                    <p class="score">Score: <b>${score}</b></p>
                    </div>
                    <h2 class="title">${title}</h2>
                    <h3 class="link"><a href="${url}">Click to read</a></h3>
                    `;
                })
                .catch(err => console.log(err));
        });

        count += 10;
    }
    button.addEventListener('click', nextArray);
})
.catch(err => console.log(err));
};

window.addEventListener('load', (e) => {
    console.log('window load')
    loadSection(e);
});