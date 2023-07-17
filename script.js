import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';


const firebaseConfig = {
  apiKey: "AIzaSyBp8VDM0i3MRj3ubLXGtFEh_OfMdt4b1_Y",
  authDomain: "firstproject-ee3fe.firebaseapp.com",
  projectId: "firstproject-ee3fe",
  storageBucket: "firstproject-ee3fe.appspot.com",
  messagingSenderId: "427355085094",
  appId: "1:427355085094:web:82916109a1ae5f5518c9e7"
};


firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Variables
let popup = document.querySelector(".popup-add");
let form = document.querySelector(".popup-add form");
let delForm = document.querySelector(".popup-delete form");
let loginForm = document.querySelector(".popup-login form");
let resetForm = document.querySelector(".popup-reset form");
let tableBody = document.querySelector("table tbody");
let adminButton = document.querySelector("button.admin")

let hoursObj = new Object({});


let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"]

let today = new Date().getDay();
document.querySelectorAll("thead th").forEach((el) => {
  if(el.dataset.idx == today)
    el.classList.add("active");
})


tableBody.innerHTML = '';

hours.forEach((hour) => {
  tableBody.innerHTML += `
    <tr data-id=${hour}>
      <th>${hour}</th>
      <td data-day=0 data-hour=${hour}></td>
      <td data-day=1 data-hour=${hour}></td>
      <td data-day=2 data-hour=${hour}></td>
      <td data-day=3 data-hour=${hour}></td>
      <td data-day=4 data-hour=${hour}></td>
      <td data-day=5 data-hour=${hour}></td>
      <td data-day=6 data-hour=${hour}></td>
    </tr>  
  `
});



document.addEventListener("click", (e) => {
  if(e.target.classList.contains("add")) {
    popup.classList.add("active")
  } else if(e.target.classList.contains("delete")) {
    document.querySelector(".popup-delete").classList.add("active")
  } else if(e.target.classList.contains("reset")) {
    document.querySelector(".popup-reset").classList.add("active")
  }
})

adminButton.onclick = () => {
  document.querySelector(".popup-login").classList.add("active")
}

document.querySelector(".popup .close").onclick = function() {
  this.parentElement.parentElement.classList.remove("active");
}
document.querySelector(".popup .close-delete").onclick = function() {
  this.parentElement.parentElement.classList.remove("active");
}
document.querySelector(".popup .close-login").onclick = function() {
  this.parentElement.parentElement.classList.remove("active");
}
document.querySelector(".popup .close-reset").onclick = function() {
  this.parentElement.parentElement.classList.remove("active");
}


delForm.onsubmit = (e) => {
  e.preventDefault();

  getDoc(doc(db, "club", `${delForm.day.value}`)).then((e)=>{
    if(![undefined, ''].includes(e.data().hours[delForm.hour.value])) {
      hoursObj = e.data().hours;
      deleteData();
      getResponse();
      delForm.reset();
    } else {
      swal.fire({
        title: `مش موجوده أصلا ياعم`,
        imageUrl: './angry.jpg',
        imageWidth: 180,
        showCloseButton: true
      })
    }
});
}



form.onsubmit = (e) => {
  e.preventDefault();

    getDoc(doc(db, "club", `${form.day.value}`)).then((e)=>{
      if(e.data()) {
        hoursObj = e.data().hours;
      }
    
    addData();

  });

}

resetForm.onsubmit = (e) => {
  e.preventDefault();

  if(resetForm.newPass.value == resetForm.confirmPass.value) {

    setDoc(doc(db, "admin", `admin`) , {
      admin: "admin",
      password: resetForm.newPass.value,
    });

    new swal({
      icon: "success",
      title: 'تم',
      showConfirmButton: true,
      timer: 1500,
    })
    document.querySelector(".popup-reset").classList.remove("active");
    document.querySelector("audio").pause();
    document.querySelector("audio").currentTime = 0;
    localStorage.setItem("pass", resetForm.newPass.value);
  } else {
    new swal({
      imageUrl: './angry.jpg',
      imageWidth: 180,
      title: 'خخخخخخ الاتنين مش زى بعض',
      showConfirmButton: true,
      timer: 1500,
    });
    document.querySelector("audio").play();
  }

}

function addData() {
  hoursObj[`${form.hour.value}`] = form.name.value;
    

  setDoc(doc(db, "club", `${form.day.value}`) , {
    id: days.indexOf(form.day.value),
    hours: hoursObj,

  });

  getResponse();

  swal.fire({
    icon: 'success',
    title: 'تم',
    showConfirmButton: false,
    timer: 1200,
  })
  
  form.reset();
  popup.classList.remove("active");
  
  hoursObj = {};
}

function deleteData() {
  
  hoursObj[`${delForm.hour.value}`] = '';
  setDoc(doc(db, "club", `${delForm.day.value}`), {
      id: days.indexOf(delForm.day.value),
      hours: hoursObj,
  });

  hoursObj = {};


  document.querySelector(".popup-delete").classList.remove("active");

  tds.forEach((td) => {
    if(td.dataset.day == days.indexOf(delForm.day.value) && td.dataset.hour == delForm.hour.value) {
      td.innerHTML = '';
    }
  })
  
  swal.fire({
    title: `تم المسح`,
    icon: 'success',
    showConfirmButton: false,
    timer: 1200,
  })
}


/* get all Docs */

async function getAllDocs(collectionName){
  
  let q = query(collection(db, `${collectionName}`));

  let querySnapshot = await getDocs(q);
  let list = querySnapshot.docs.map(doc => doc.data());

  localStorage.setItem("club", JSON.stringify(list))

  return list;
};


let tds = document.querySelectorAll("table tbody tr td");
function getResponse() {

  getAllDocs("club").then((arr) => {

    arr.forEach((el) => {
      tds.forEach((td) => {
        if(el.id == td.dataset.day &&  el.hours[td.dataset.hour]) {
          td.innerHTML = el.hours[td.dataset.hour]
        }
      })
    });
    document.querySelector(".load").style.display="none";
    document.querySelector(".container").style.display = "block";
  })
}

getResponse();



let innerButtons = `
<button class="add">تعديل</button>
<button class="delete">حذف</button>
<button class="reset">تغيير كلمه سر</button>
`;

getDoc(doc(db, "admin", `admin`)).then((e)=>{


let admin = e.data().admin;
let password = e.data().password;



loginForm.onsubmit = (e) => {
  e.preventDefault();

  if(loginForm.admin.value == admin && loginForm.password.value == password) {
    localStorage.setItem("pass", password);
    document.querySelector(".container .buttons").innerHTML = innerButtons;
    adminButton.style.display="none";
    document.querySelector(".popup-login").classList.remove("active");
    new swal({
      text: "تم تسجيل الدخول",
      icon: "success",
      timer: 2500,

    });
  } else {
    new swal({
      text: "المستخدم غير موجود",
      icon: "error"
    })
  }
}

if(localStorage.getItem("pass") == password) {
  document.querySelector(".container .buttons").innerHTML = innerButtons;
  adminButton.style.display="none";
} else {
  localStorage.removeItem("pass");
}

});
