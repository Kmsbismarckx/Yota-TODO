const list = document.querySelector('.list');
const listItems = list.children;
const template = document.querySelector('#checklist-template').content;
const newItemTemplate = template.querySelector('.checklist-item');
const listLabel = list.querySelectorAll('label');
const message = document.querySelector('.message');
const form = document.querySelector('.input-text');
const adviceNames = document.querySelectorAll('.advice-name')
const adviceItems1 = document.querySelector('.advice-item-1');
const adviceNames1 = adviceItems1.querySelectorAll('.advice-name');
const adviceItems2 = document.querySelector('.advice-item-2')
const adviceNames2 = adviceItems2.querySelectorAll('.advice-name');

let cache = JSON.parse(localStorage.getItem('to-do')) || [];
let sessionCache = JSON.parse(sessionStorage.getItem('tasks')) || [];

function createItemObject(arr, text, id) {
  const itemObject = {};
  itemObject.text = text;
  itemObject.done = false;
  itemObject.id = id;

  arr.push(itemObject);
}

// function createTaskObject(arr, id) {
//   const tasksObject = {};
//   tasksObject.done = false;
//   tasksObject.id = id;
//
//   arr.push(tasksObject)
// }

function changeItemDone(arr, item) {
  const arrCache = arr;
  arr.forEach((obj) => {
    if (obj.id === item.id) {
      obj.done = !obj.done;
    }
  });
}


function onChange(item) {
  const listCheckbox = item.querySelector('.checkbox');
  const deleteButton = item.querySelector('.delete-button');
  //changing
  listCheckbox.addEventListener('change', function () {
    cache = JSON.parse(localStorage.getItem('to-do'));
    item.classList.toggle('checked');

    changeItemDone(cache, item);
    localStorage.setItem('to-do', JSON.stringify(cache));
  })
  //delete
  deleteButton.addEventListener('click', function() {
    cache = JSON.parse(localStorage.getItem('to-do'))
    let deleteItem = cache.filter(obj => obj.id !== item.id);

    localStorage.setItem('to-do', JSON.stringify(deleteItem));
    item.remove();
  })
}

function adviceCheck(value) {
  const adviceNameTemp = value.querySelectorAll('.advice-name');
  const arr = [];

  adviceNameTemp.forEach((item) => {
    const checkObj = {};
    checkObj.name = adviceNameTemp;
    checkObj.checkbox = item.querySelector('.advice-item__checkbox');
    arr.push(checkObj);
  });

  arr.forEach((item) => {
    item.checkbox.addEventListener('change', (item) => {
      if (arr.every((obj) => (obj.checkbox.checked))) {
        value.classList.add('complete')
      } else {
        value.classList.remove('complete')
      }
    })
  });


}

function init() {

  if (cache.length !== 0) {
    for (let obj of cache) {
      const post = newItemTemplate.cloneNode(true);
      const postText = post.querySelector('span')
      post.id = obj.id;
      postText.textContent = obj.text;

      if (obj.done) {
        post.classList.add('checked');
      } else {
        post.classList.remove('checked');
      }
      onChange(post);

      list.append(post);
    }
  }

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    const text = form.querySelector('input');
    const randomId = Math.random() * 15.75;

    let itemText = text.value;
    let clone = newItemTemplate.cloneNode(true);
    let description = clone.querySelector('span');

    clone.id = randomId.toFixed(2);
    description.textContent = itemText;
    onChange(clone);

    createItemObject(cache, itemText, clone.id);
    localStorage.setItem('to-do', JSON.stringify(cache));

    list.append(clone);
    text.value = '';
  })

  adviceNames.forEach((name) => {
    const adviceCheckbox = name.querySelector('.advice-item__checkbox');
    //adviceCheckbox.id = adviceCheckbox.id === ''? (Math.random() * 15.75).toFixed(2) : adviceCheckbox.id;

    if (sessionCache.length < adviceNames.length) {
      createTaskObject(sessionCache, adviceCheckbox.id);
      //sessionStorage.setItem('tasks', JSON.stringify(sessionCache));
    }

    name.addEventListener('change', () => {
      //sessionStorage = JSON.parse(localStorage.getItem('tasks'));
      name.classList.toggle('checked');

      //changeItemDone(sessionCache, adviceCheckbox);
      //sessionStorage.setItem('tasks', JSON.stringify(sessionCache));
    })
  });
  adviceCheck(adviceItems1);
  adviceCheck(adviceItems2);
}

init()
