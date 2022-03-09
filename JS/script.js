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

window.addEventListener('load', () => {
    loadSection();
});


function loadSection() {

    function getValue(a, b) {
        if(!b) {
            return a;
        } else {
            return b;
        }
    }

    let defaultValue = 'newstories';

axios.get('https://hacker-news.firebaseio.com/v0/' + getValue(defaultValue, this.className) + '.json')
.then(res => {
    let listOfId = res.data;
    let count = 0;

    if (this.className != undefined) {
        thisUrl.push(this.className);
    }

    if(thisUrl.length > 2) {
        thisUrl.splice(0, 1);
    }
    // console.log(thisUrl);

    let currentSection = document.querySelector('.current-section');
    currentSection.innerHTML = getValue(defaultValue, this.className);

    if(thisUrl[0] === thisUrl[1]) {
        nextArray();
    } else {
        container.innerHTML = "";
        nextArray();
    }


    function nextArray() {

        let newArray = listOfId.slice(count, count + 10);

        newArray.map(id => {
            let infoUrl = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json';

            axios.get(infoUrl)
                .then(resTwo => {
                    let date = (new Date((_.get(resTwo, 'data.time')) * 1000).toISOString().slice(0, 19).replace('T', ' '));
                    let box = document.createElement('div');
                    box.className = 'news-box';
                    container.append(box);

                    box.innerHTML = `
                    <div class="box-header">
                    <h4 class="data">${date}</h4>
                    <p class="score">Score: <b>${resTwo.data.score}</b></p>
                    </div>
                    <h2 class="title">${resTwo.data.title}</h2>
                    <h3 class="link"><a href="${resTwo.data.url}">Click to read</a></h3>
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