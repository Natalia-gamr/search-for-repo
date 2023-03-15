

const form = document.querySelector('.form')
const wrapper = document.querySelector('.wrapper')
let input = form.querySelector('input')
let button = form.querySelector('button')

const itemEl = document.createElement('div')
wrapper.append(itemEl)
itemEl.classList.add('repo')

async function validateForm(e) {
    if (form.name.value && form.name.value.length > 2) {
        await data(e)
        form.reset();
        return;
    } else {
        const errEl = document.createElement('p')
        form.append(errEl)
        errEl.classList.add('error')
        errEl.innerHTML = 'Недостаточно символов'
        form.name.addEventListener('keypress', () => {
            errEl.remove()
        })
    }
}

button.onclick = async (e) => {
    e.preventDefault()
    await validateForm(e)
}

let str = document.createElement('p')
str.innerHTML = 'Репозиторий не найден'
str.classList.add('error')

async function data(e) {
    e.preventDefault()
    input = Object.fromEntries(new FormData(form))
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



function getData(data) {
    const items = data.items
    if (items.length == 0) {
        form.append(str)
        return;
    } else {
        for (let i = 0; i < 10; i++) {
            let el = items[i]
            itemEl.append(createEl(el))
        }
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

