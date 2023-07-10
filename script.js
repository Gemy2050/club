window.onload = () => {
  document.querySelector(".load").remove();
  document.querySelector(".container").style.display = "block";
}

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
let addButton = document.querySelector(".add");
let popup = document.querySelector(".popup-add");
let form = document.querySelector(".popup-add form");
let delForm = document.querySelector(".popup-delete form");
let tableBody = document.querySelector("table tbody");
let delButton = document.querySelector(".delete")

let hoursObj = new Object({});


let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"]




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




addButton.onclick = () => {
  popup.classList.add("active")
}
delButton.onclick = () => {
  document.querySelector(".popup-delete").classList.add("active")
}

document.querySelector(".popup .close").onclick = function() {
  this.parentElement.parentElement.classList.remove("active");
}
document.querySelector(".popup .close-delete").onclick = function() {
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
      // swal.fire(`مش موجوده أصلا ياعم`,'',"error", '1500');
      swal.fire({
        // icon: 'error',
        title: `مش موجوده أصلا ياعم`,
        imageUrl: './angry.jpg',
        imageHeight: 180,
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
    imageUrl: './logo.jpg',
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
    })
})
}

getResponse();