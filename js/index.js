

const form = document.querySelector('.form')
const wrapper = document.querySelector('.wrapper')
let input = form.querySelector('input')
let button = form.querySelector('button')

const itemEl = document.createElement('div')
wrapper.append(itemEl)
itemEl.classList.add('repo')
console.log(itemEl.children)

input.oninput = () => {
    if (input.value.length < 3) {
        err()
    } else {
        errEl.remove()
        button.removeAttribute('disabled')
        console.log(input.value)
    }
}


form.addEventListener('submit', async (e) => {
    await data(e)
    form.reset();
})

let str = document.createElement('p')
str.innerHTML = 'Репозиторий не найден'
str.classList.add('error')

async function data(e) {
    e.preventDefault()
    input = Object.fromEntries(new FormData(e.target))
    if (document.querySelectorAll('.repo__item')) {
        for (let el of document.querySelectorAll('.repo__item')) {
            el.remove();
        }
    }
    if (wrapper.querySelector('.error')) {
        wrapper.querySelector('.error').remove()
    }
    const response = await fetch(`https://api.github.com/search/repositories?q=${input.name}`);

    if (response.ok) {
        response.json().then(function (data) {
            getData(data);
        })
    } else {
        form.append(str)
        return;
    }

}
const errEl = document.createElement('p')

const err = () => {
    form.append(errEl)
    errEl.classList.add('error')
    errEl.innerHTML = 'Недостаточно символов'
}

function getData(data) {
    const items = data.items
    input.value = ''
    if (items.length == 0) {
        form.append(str)
        return;
    } else {
        getEl(itemEl, items)

    }
}

const getEl = (item, items) => {
    for (let i = 0; i < 10; i++) {
        let el = items[i]
        item.append(createEl(el))
    }
}

const createEl = (item) => {
    const div = document.createElement('div')
    itemEl.append(div)
    div.classList.add('repo__item')

    div.innerHTML = ` 
            <div class="repo__name">
                <img src="${item.owner.avatar_url}" alt="avatar ${item.owner.login}" class="repo__avatar">
                <div><a target='_blank' href=${item.html_url}>${item.name}</a></div>
            </div>
            <div class="repo__descr">${item.description}</div>
            <div class="repo__info">
                <div class="repo__login">author: ${item.owner.login}</div>
                <div class="repo__lang">language: ${item.language}</div>
            </div>
            
        `
    return div;
}

