const list = document.querySelector(".list");
const template = document.querySelector("#checklist-template").content;
const newItemTemplate = template.querySelector(".checklist-item");
const form = document.querySelector(".input-text");
const adviceNames = document.querySelectorAll(".advice-name");
const adviceItem1 = document.querySelector(".advice-item-1");
const adviceItem2 = document.querySelector(".advice-item-2");

let cache = JSON.parse(localStorage.getItem("to-do")) || [];
let sessionCache = JSON.parse(sessionStorage.getItem("tasks")) || [];

function createItemObject(arr, id, text) {
  arr.push({
    text: text,
    done: false,
    id: id,
  });
}

function changeItemDone(arr, item) {
  arr.forEach((obj) => {
    if (obj.id === item.id) {
      obj.done = !obj.done;
    }
  });
  return arr;
}

function addListeners(item) {
  const listCheckbox = item.querySelector(".checkbox");
  const deleteButton = item.querySelector(".delete-button");

  listCheckbox.addEventListener("change", function () {
    item.classList.toggle("checked");

    cache = changeItemDone(cache, item);
    localStorage.setItem("to-do", JSON.stringify(cache));
  });

  deleteButton.addEventListener("click", function () {
    cache = cache.filter((obj) => obj.id !== item.id);
    localStorage.setItem("to-do", JSON.stringify(cache));
    item.remove();
  });
}

function adviceCheck(value) {
  const adviceNameTemp = value.querySelectorAll(".advice-name");
  const arr = [];

  adviceNameTemp.forEach((item) => {
    const checkObj = {
      name: item,
      checkbox: item.querySelector(".advice-item__checkbox"),
    };

    arr.push(checkObj);
  });

  arr.forEach((item) => {
    item.checkbox.addEventListener("change", () => {
      if (arr.every((obj) => obj.checkbox.checked)) {
        value.classList.add("complete");
      } else {
        value.classList.remove("complete");
      }
    });
  });
  return arr;
}

function adviceAddEvent(checkbox, name) {
  checkbox.addEventListener("change", () => {
    name.classList.toggle("checked");

    sessionCache = changeItemDone(sessionCache, checkbox);
    sessionStorage.setItem("tasks", JSON.stringify(sessionCache));
  });
}

function addAdviceComplete(item) {
  const tempCheckbox = item.querySelectorAll(".advice-item__checkbox");

  if (Array.from(tempCheckbox).every((obj) => obj.checked)) {
    item.classList.add("complete");
  } else {
    item.classList.remove("complete");
  }
}

function init() {
  if (localStorage.getItem("to-do")) {
    for (let obj of cache) {
      const post = newItemTemplate.cloneNode(true);
      const checkbox = post.querySelector(".checkbox");
      const postText = post.querySelector("span");
      post.id = obj.id;
      postText.textContent = obj.text;

      if (obj.done) {
        post.classList.add("checked");
        checkbox.checked = true;
      } else {
        post.classList.remove("checked");
        checkbox.checked = false;
      }
      addListeners(post);
      list.append(post);
    }
  }

  if (JSON.parse(sessionStorage.getItem("tasks"))) {
    sessionCache.forEach((item, i) => {
      let checkboxTemp = adviceNames[i].querySelector(".advice-item__checkbox");
      let nameTemp = adviceNames[i];
      checkboxTemp.id = item.id;

      if (item.done) {
        nameTemp.classList.add("checked");
        checkboxTemp.checked = true;
      } else {
        nameTemp.classList.remove("checked");
      }
    });
    addAdviceComplete(adviceItem1);
    addAdviceComplete(adviceItem2);
  }

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    const text = form.querySelector("input");
    let itemText = text.value;
    let clone = newItemTemplate.cloneNode(true);
    let description = clone.querySelector("span");

    clone.id = cache.length;
    description.textContent = itemText;
    addListeners(clone);

    createItemObject(cache, clone.id, itemText);
    localStorage.setItem("to-do", JSON.stringify(cache));

    list.append(clone);
    text.value = "";
  });

  adviceNames.forEach((name, i) => {
    const adviceCheckbox = name.querySelector(".advice-item__checkbox");

    if (sessionCache.length < adviceNames.length) {
      adviceCheckbox.id = `${i}`;

      createItemObject(sessionCache, adviceCheckbox.id);
      sessionStorage.setItem("tasks", JSON.stringify(sessionCache));
    }
    adviceAddEvent(adviceCheckbox, name);
  });
  adviceCheck(adviceItem1);
  adviceCheck(adviceItem2);
}

init();
