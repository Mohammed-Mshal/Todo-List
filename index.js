// Change Mode
let toggle = document.querySelector(`.toggle`);
let changeMode = (from, to) => {
  document.querySelectorAll(`.${from}`).forEach((e) => {
    e.classList.remove(from);
    e.classList.add(to);
  });
  toggle.dataset.mod = `.${to}`;
  localStorage.setItem(`mode`, `.${to}`);
};
// End Change Mode

// Array Tasks
let tasksArray = [];
// Array Checked
let arrayChecked = JSON.parse(localStorage.getItem(`checked`)) || [];

// Start Function
// Remove Element

function remo(btRemove) {
  // Remove From Page
  btRemove.parentElement.remove();

  // Remove From Checked Array In Local Storage If Found
  arrayChecked.splice(
    arrayChecked.indexOf(btRemove.parentElement.children[1].innerHTML),
    1
  );
  localStorage.setItem(`checked`, JSON.stringify(arrayChecked));

  // Remove From Tasks Array In Local Storage
  tasksArray = [];
  document.querySelectorAll(`.tasks .task div`).forEach((e) => {
    tasksArray.push(e.innerHTML);
  });
  localStorage.setItem(`tasks`, JSON.stringify(tasksArray));
  checkItems();
}
//  Add Task

function funAdd(t) {
  let newTask = document.createElement(`div`);
  newTask.classList.add(`task`);
  let textTask = document.createElement(`div`);
  textTask.innerHTML = t;
  document.querySelector(`.content form input`).value = "";
  let circle = document.createElement(`span`);
  circle.classList.add(`circle`);
  if (toggle.dataset.mod == `.dark`) {
    circle.classList.add(`dark`);
  } else if (toggle.dataset.mod == `.light`) {
    circle.classList.add(`light`);
  }
  circle.addEventListener(`click`, () => {
    if (circle.classList.contains(`checked`)) {
      circle.classList.remove(`checked`);
      arrayChecked.splice(
        arrayChecked.indexOf(circle.parentElement.children[1].innerHTML),
        1
      );
      localStorage.setItem(`checked`, JSON.stringify(arrayChecked));
    } else {
      circle.classList.add(`checked`);
      if (
        arrayChecked.indexOf(circle.parentElement.children[1].innerHTML) == -1
      ) {
        arrayChecked.push(circle.parentElement.children[1].innerHTML);
      }
      localStorage.setItem(`checked`, JSON.stringify(arrayChecked));
    }
    checkItems();
  });
  circle.classList.add(`transition`);
  let intoCircle = document.createElement(`span`);
  intoCircle.classList.add(`transition`);
  circle.appendChild(intoCircle);
  newTask.appendChild(circle);
  newTask.appendChild(textTask);
  document.querySelector(`.tasks`).appendChild(newTask);
  let btRemove = document.createElement(`span`);
  btRemove.classList.add(`remove`);
  btRemove.classList.add(`transition`);
  btRemove.addEventListener(`click`, () => {
    remo(btRemove);
  });
  newTask.appendChild(btRemove);
}
// Method To Get Length of Tasks Not Complete
function checkItems() {
  let numItem = document.querySelector(`.option .items`);
  let num = 0;
  document.querySelectorAll(`.tasks .task`).forEach((e) => {
    if (!e.children[0].classList.contains(`checked`) == true) {
      num++;
    }
  });
  numItem.innerHTML = `${num} items left`;
}
// End Function

// --------------------------

// Event On page Load
document.body.onload = () => {
  // Add Tasks Form Local Storage
  tasksArray=JSON.parse(localStorage.getItem(`tasks`))||[];
  document.querySelectorAll(`.tasks .task`).forEach((e) => {
    e.remove();
  });
  tasksArray.forEach((e) => {
    funAdd(e);
  });

  // Change Mode to Mode in Local Storage
  let mode = localStorage.getItem(`mode`) || `.light`;
  toggle.dataset.mod = mode;
  if (mode == `.dark`) {
    changeMode(`light`, `dark`);
  } else {
    changeMode(`dark`, `light`);
  }

  // Checked Tasks From Local Storage
  document.querySelectorAll(`.tasks .task div`).forEach((e) => {
    if (arrayChecked.indexOf(e.textContent) != -1) {
      e.parentElement.children[0].classList.add(`checked`);
    }
  });
  // Get Length Tasks Not Complete
  checkItems();
};
// button Add Task
document.querySelector(`form .add`).addEventListener(`click`, () => {
  let task = document.querySelector(`form .in`).value;
  if (task != ``) {
    funAdd(task);
    tasksArray.push(task);
    localStorage.setItem(`tasks`, JSON.stringify(tasksArray));
    checkItems();
  }
});
// Change Mode
toggle.addEventListener(`click`, () => {
  if (toggle.dataset.mod == `.dark`) {
    changeMode(`dark`, `light`);
  } else if (toggle.dataset.mod == `.light`) {
    changeMode(`light`, `dark`);
  }
});
// Remove All Complete Tasks
document.querySelector(`.option .clear`).addEventListener(`click`, () => {
  document.querySelectorAll(`.tasks .task`).forEach((e) => {
    if (e.children[0].classList.contains(`checked`) == true) {
      e.remove();
      localStorage.removeItem(`checked`);
      let tasks = [];
      document.querySelectorAll(`.tasks .task div`).forEach((e) => {
        tasks.push(e.innerHTML);
      });
      localStorage.setItem(`tasks`, JSON.stringify(tasks));
    }
  });
});
// Change Category view
document.querySelectorAll(`.cate li`).forEach((e) => {
  e.addEventListener(`click`, () => {
    document.querySelectorAll(`.cate li`).forEach((ele) => {
      ele.classList.remove(`active`);
    });
    e.classList.add(`active`);
    document.querySelector(`.tasks`).innerHTML = ``;

    if (e.dataset.cate == `all`) {
      tasksArray.forEach((ele) => {
        funAdd(ele);
      });
      arrayChecked = JSON.parse(localStorage.getItem(`checked`)) || [];
      document.querySelectorAll(`.tasks .task div`).forEach((e) => {
        if (arrayChecked.indexOf(e.textContent) != -1) {
          e.parentElement.children[0].classList.add(`checked`);
        }
      });
    } else if (e.dataset.cate == `active`) {
      tasksArray.forEach((ele) => {
        if (arrayChecked.indexOf(ele) == -1) {
          funAdd(ele);
        }
      });
    } else if (e.dataset.cate == `complete`) {
      tasksArray.forEach((ele) => {
        if (arrayChecked.indexOf(ele) != -1) {
          funAdd(ele);
        }
      });
      document.querySelectorAll(`.tasks .task .circle`).forEach((e) => {
        e.classList.add(`checked`);
      });
    }
  });
});
