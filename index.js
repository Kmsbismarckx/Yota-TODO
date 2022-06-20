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

function createTaskObject(arr, id) {
  const tasksObject = {};
  tasksObject.done = false;
  tasksObject.id = id;

  arr.push(tasksObject)
}

function changeItemDone(arr, item) {
  const arrCache = arr;
  arrCache.forEach((obj) => {
    if (obj.id === item.id) {
      obj.done = !obj.done;
    }
  })
  return arrCache;
}


function onChange(item) {
  const listCheckbox = item.querySelector('.checkbox');
  const deleteButton = item.querySelector('.delete-button');
  //changing
  listCheckbox.addEventListener('change', function () {
    cache = JSON.parse(localStorage.getItem('to-do'));
    item.classList.toggle('checked');

    cache = changeItemDone(cache, item);
    localStorage.setItem('to-do', JSON.stringify(cache));
  })
  //delete
  deleteButton.addEventListener('click', function() {
    cache = JSON.parse(localStorage.getItem('to-do'))
    let deleteItem = cache.filter(obj => obj.id !== item.id);
    cache = deleteItem;
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
  return arr;
}

function adviceAddEvent(checkbox, name) {
  checkbox.addEventListener('change', () => {
    sessionCache = JSON.parse(sessionStorage.getItem('tasks'));
    name.classList.toggle('checked');

    sessionCache = changeItemDone(sessionCache, checkbox);
    sessionStorage.setItem('tasks', JSON.stringify(sessionCache));
  })
}

function init() {

  if (localStorage.getItem('to-do')) {
    cache = JSON.parse(localStorage.getItem('to-do'));
    for (let obj of cache) {
      const post = newItemTemplate.cloneNode(true);
      const checkbox = post.querySelector('.checkbox');
      const postText = post.querySelector('span')
      post.id = obj.id;
      postText.textContent = obj.text;

      if (obj.done) {
        post.classList.add('checked');
        checkbox.checked = true;
      } else {
        post.classList.remove('checked');
        checkbox.checked = false;
      }
      onChange(post);
      list.append(post);
    }
  }

  let sessionCacheTemp = JSON.parse(sessionStorage.getItem('tasks'));
  console.log(sessionCache);
  const name1 = document.querySelector('.advice-item-1')
  const name2 = document.querySelector('.advice-item-2')
  if (sessionCacheTemp.length > 0) {
    sessionCacheTemp.forEach((item, i) => {
      let checkboxTemp = adviceNames[i].querySelector('.advice-item__checkbox');
      let nameTemp = adviceNames[i]
      checkboxTemp.id = item.id;
      if (item.done) {
        adviceCheck(name1);
        adviceCheck(name2);
      } else {
        nameTemp.classList.remove('checked');
      }
    });

    // function nameCheck(item) {
    //
    //   const itemName = Array.from(item.querySelectorAll('.advice-name'));
    //   console.log(itemName[0].id);
    //   if ( itemName.every( (obj) => {obj.classList.contains('.checked')}) ) {
    //     item.classList.add('complete')
    //   } else {
    //     item.classList.remove('complete')
    //   }
    //
    // }
    // TODO: Пофиксить
    // adviceCheck(name1);
    // adviceCheck(name2);

    sessionStorage.setItem('tasks', JSON.stringify(sessionCacheTemp));
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

  adviceNames.forEach((name, i) => {
    const adviceCheckbox = name.querySelector('.advice-item__checkbox');

    if (sessionCache.length < adviceNames.length) {
      adviceCheckbox.id = i;

      createTaskObject(sessionCache, adviceCheckbox.id);
      sessionStorage.setItem('tasks', JSON.stringify(sessionCache));
    }
    adviceAddEvent(adviceCheckbox, name);
  });
  adviceCheck(adviceItems1);
  adviceCheck(adviceItems2);
}
init()
