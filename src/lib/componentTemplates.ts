export const componentTemplates: any = {

  ////////////////////////////////////////////////////
  // BUTTONS
  ////////////////////////////////////////////////////

 TABLES: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<table class="table">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
</tr>
</thead>

<tbody>

<tr>
<td>John Doe</td>
<td>john@example.com</td>
<td>Admin</td>
</tr>

<tr>
<td>Jane Smith</td>
<td>jane@example.com</td>
<td>User</td>
</tr>

</tbody>

</table>
`,

    css: `
.table{
width:70%;
border-collapse:collapse;
font-family:sans-serif;
}

.table th,
.table td{
padding:10px;
border:1px solid #ddd;
text-align:left;
}

.table th{
background:#f4f4f4;
}

.table tr:hover{
background:#fafafa;
}
`,

    js: ``
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<div class="overflow-x-auto">

<table class="min-w-full border border-gray-200">

<thead class="bg-gray-100">

<tr>
<th class="px-4 py-2 text-left">Name</th>
<th class="px-4 py-2 text-left">Email</th>
<th class="px-4 py-2 text-left">Role</th>
</tr>

</thead>

<tbody>

<tr class="border-t">
<td class="px-4 py-2">John Doe</td>
<td class="px-4 py-2">john@example.com</td>
<td class="px-4 py-2">Admin</td>
</tr>

<tr class="border-t">
<td class="px-4 py-2">Jane Smith</td>
<td class="px-4 py-2">jane@example.com</td>
<td class="px-4 py-2">User</td>
</tr>

</tbody>

</table>

</div>
`
  }

},
PAGINATION: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<div class="pagination">

<button class="page-btn">Prev</button>

<button class="page-number active">1</button>
<button class="page-number">2</button>
<button class="page-number">3</button>

<button class="page-btn">Next</button>

</div>
`,

    css: `
.pagination{
display:flex;
gap:6px;
align-items:center;
font-family:sans-serif;
}

.page-btn,
.page-number{
padding:6px 12px;
border:1px solid #ddd;
background:white;
cursor:pointer;
border-radius:4px;
}

.page-number.active{
background:#3b82f6;
color:white;
border-color:#3b82f6;
}

.page-number:hover,
.page-btn:hover{
background:#f3f4f6;
}
`,

    js: `
const pages = document.querySelectorAll(".page-number");

pages.forEach(btn=>{
btn.addEventListener("click",()=>{

pages.forEach(p=>p.classList.remove("active"));
btn.classList.add("active");

});
});
`
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<div class="flex items-center gap-2">

<button class="px-3 py-1 border rounded hover:bg-gray-100">
Prev
</button>

<button class="px-3 py-1 border rounded bg-blue-500 text-white">
1
</button>

<button class="px-3 py-1 border rounded hover:bg-gray-100">
2
</button>

<button class="px-3 py-1 border rounded hover:bg-gray-100">
3
</button>

<button class="px-3 py-1 border rounded hover:bg-gray-100">
Next
</button>

</div>
`
  }

},

AVATARS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<div class="profile-card">
  <div class="avatar">
    <img src="https://i.pravatar.cc/150" alt="Profile">
  </div>
  <h3 class="name">John Doe</h3>
  <p class="role">Frontend Developer</p>
</div>
`,

    css: `
body{
  font-family:sans-serif;
  background:#f3f4f6;
  display:flex;
  align-items:center;
  justify-content:center;
  height:100vh;
}

.profile-card{
  padding:30px 40px;
  border-radius:16px;
  text-align:center;
  width:220px;
}

.avatar{
  width:120px;
  height:120px;
  border-radius:50%;
  overflow:hidden;
  margin:0 auto 15px auto;
}

.avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.name{
  margin:0;
  font-size:20px;
  font-weight:600;
}

.role{
  margin-top:5px;
  color:#6b7280;
  font-size:14px;
}
`,

    js: ``
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `

  <div class=" p-8  text-center w-56">
    
    <div class="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
      <img 
        src="https://i.pravatar.cc/150" 
        alt="Profile"
        class="w-full h-full object-cover"
      >
    </div>

    <h3 class="text-lg font-semibold text-gray-900">
      John Doe
    </h3>

    <p class="text-sm text-gray-500">
      Frontend Developer
    </p>

  </div>

`
  }

},
MODALS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<button id="openModal">Open Modal</button>

<div class="modal" id="modal">

  <div class="modal-content">

    <h2>Modal Title</h2>

    <p>This is a basic modal example.</p>

    <button id="closeModal">Close</button>

  </div>

</div>
`,

    css: `
.modal{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.5);
display:flex;
align-items:center;
justify-content:center;
visibility:hidden;
opacity:0;
transition:0.3s;
}

.modal.active{
visibility:visible;
opacity:1;
}

.modal-content{
background:white;
padding:20px;
border-radius:8px;
width:300px;
text-align:center;
font-family:sans-serif;
}

.modal-content button{
margin-top:10px;
padding:8px 14px;
border:none;
background:#3b82f6;
color:white;
border-radius:6px;
cursor:pointer;
}
`,

    js: `
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.onclick = () => modal.classList.add("active");

closeBtn.onclick = () => modal.classList.remove("active");

modal.onclick = (e)=>{
if(e.target === modal){
modal.classList.remove("active");
}
};
`
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<button
onclick="document.getElementById('modal').classList.remove('hidden')"
class="px-4 py-2 bg-blue-500 text-white rounded">
Open Modal
</button>

<div
id="modal"
class="fixed inset-0 bg-black/50 flex items-center justify-center hidden">

<div class="bg-white rounded-lg p-6 w-80 text-center">

<h2 class="text-lg font-semibold mb-2">
Modal Title
</h2>

<p class="text-gray-600 mb-4">
This is a basic modal example.
</p>

<button
onclick="document.getElementById('modal').classList.add('hidden')"
class="px-4 py-2 bg-blue-500 text-white rounded">
Close
</button>

</div>

</div>
`
  }

},

DROPDOWNS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<div class="dropdown">

<button id="dropdownBtn" class="dropdown-btn">
Select Option
</button>

<ul id="dropdownMenu" class="dropdown-menu">

<li>Profile</li>
<li>Settings</li>
<li>Logout</li>

</ul>

</div>
`,

    css: `

.dropdown{
position:relative;
display:inline-block;
font-family:sans-serif;
}

.dropdown-btn{
padding:18px 18px;
border:none;
background:#3b82f6;
color:white;
border-radius:6px;
cursor:pointer;

}

.dropdown-menu{
position:absolute;
top:110%;
left:0;
background:white;
border:1px solid #ddd;
border-radius:6px;
list-style:none;
padding:0;
margin:0;
width:140px;
display:none;
box-shadow:0 5px 15px rgba(0,0,0,0.15);
}

.dropdown-menu li{
padding:8px 12px;
cursor:pointer;
}

.dropdown-menu li:hover{
background:#f3f4f6;
}

.dropdown-menu.show{
display:block;
}

`,

    js: `
const btn = document.getElementById("dropdownBtn");
const menu = document.getElementById("dropdownMenu");

btn.onclick = () => {
menu.classList.toggle("show");
};

document.addEventListener("click",(e)=>{
if(!btn.contains(e.target) && !menu.contains(e.target)){
menu.classList.remove("show");
}
});
`
  },



  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<div class="relative inline-block">

<button
onclick="document.getElementById('menu').classList.toggle('hidden')"
class="px-4 py-2 bg-blue-500 text-white rounded">
Select Option
</button>

<ul
id="menu"
class="absolute mt-2 w-40 bg-white border rounded shadow hidden">

<li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
Profile
</li>

<li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
Settings
</li>

<li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
Logout
</li>

</ul>

</div>
`
  }

},



NOTIFICATIONS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<button id="showNotification">Show Notification</button>

<div class="notification" id="notification">

<span>This is a notification message.</span>

<button id="closeNotification">✕</button>

</div>
`,

    css: `
.notification{
  position:fixed;
  top:10%;
  left:25%;
  background:#3b82f6;
  color:white;
  padding:12px 16px;
  border-radius:6px;
  display:flex;
  align-items:center;
  gap:12px;
  font-family:sans-serif;
  box-shadow:0 4px 15px rgba(0,0,0,0.2);
  opacity:0;
  transition:0.3s;
}

.notification.show{
opacity:1;
transform:translateY(0);
}

.notification button{
background:transparent;
border:none;
color:white;
font-size:16px;
cursor:pointer;
}
`,

    js: `
const showBtn = document.getElementById("showNotification");
const closeBtn = document.getElementById("closeNotification");
const notification = document.getElementById("notification");

showBtn.onclick = () => {
notification.classList.add("show");

setTimeout(()=>{
notification.classList.remove("show");
},3000);
};

closeBtn.onclick = () => {
notification.classList.remove("show");
};
`
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `

<button
onclick="document.getElementById('toast').classList.remove('hidden')"
class="px-4 py-2 bg-blue-500 text-white rounded">
Show Notification
</button>

<div
id="toast"
  class="fixed top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 
         bg-blue-500 text-white px-4 py-3 rounded shadow 
         hidden flex items-center gap-3">

<span>This is a notification message.</span>

<button
onclick="document.getElementById('toast').classList.add('hidden')"
class="font-bold">
✕
</button>

</div>

`
  }

}
,

  BUTTONS: {

    HTML: {
      html: `
<button class="btn">Click Me</button>
`,

      css: `
.btn{
  padding:10px 20px;
  border:none;
  border-radius:6px;
  background:#3b82f6;
  color:white;
  cursor:pointer;
}

.btn:hover{
  background:#2563eb;
}
`,

      js: ``
    },

    TAILWIND: {
      tailwind: `
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click Me
</button>
`
    }

  },

  ////////////////////////////////////////////////////
  // CHECKBOXES
  ////////////////////////////////////////////////////

  CHECKBOXES: {

    HTML: {
      html: `
<label class="checkbox">
  <input type="checkbox">
  <span>Accept Terms</span>
</label>
`,

      css: `
.checkbox{
  display:flex;
  align-items:center;
  gap:8px;
  font-family:sans-serif;
}
`,

      js: ``
    },

    TAILWIND: {
      tailwind: `
<label class="flex items-center gap-2">
  <input type="checkbox" class="w-4 h-4">
  <span>Accept Terms</span>
</label>
`
    }

  },

  ////////////////////////////////////////////////////
  // RADIO BUTTONS
  ////////////////////////////////////////////////////

  RADIOBUTTONS: {

    HTML: {
      html: `
<div class="radio-group">

  <label class="radio">
    <input type="radio" name="plan" checked>
    <span class="custom-radio"></span>
    Basic
  </label>

  <label class="radio">
    <input type="radio" name="plan">
    <span class="custom-radio"></span>
    Pro
  </label>

  <label class="radio">
    <input type="radio" name="plan">
    <span class="custom-radio"></span>
    Enterprise
  </label>

</div>
`,

      css: `
.radio-group{
  display:flex;
  flex-direction:column; 
  gap:12px;
  font-family:sans-serif;
}

.radio{
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
}

.radio input{
  display:none;
}

.custom-radio{
  width:20px;
  height:20px;
  border-radius:50%;
  background:linear-gradient(#ffffff,#e5e7eb);
  border:2px solid #cbd5e1;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:
    inset 0 2px 3px rgba(0,0,0,0.15),
    0 2px 4px rgba(0,0,0,0.15);
}

.custom-radio::after{
  content:"";
  width:10px;
  height:10px;
  border-radius:50%;
  background:linear-gradient(#3b82f6,#2563eb);
  transform:scale(0);
  transition:0.2s;
}

.radio input:checked + .custom-radio::after{
  transform:scale(1);
}
`,

      js: ``
    },

    TAILWIND: {
      tailwind: `
<div class="flex flex-col gap-2">

<label class="flex items-center gap-2">
  <input type="radio" name="gender">
  Male
</label>

<label class="flex items-center gap-2">
  <input type="radio" name="gender">
  Female
</label>

</div>
`
    }

  },

  ////////////////////////////////////////////////////
  // CARDS
  ////////////////////////////////////////////////////

  CARDS: {

    HTML: {
      html: `
<div class="card">
  <h3>Card Title</h3>
  <p>This is a simple card.</p>
  <button>Action</button>
</div>
`,

      css: `


.card{
  width:260px;
  padding:20px;
  border-radius:10px;
  box-shadow:0 5px 20px rgba(0,0,0,.15);
  font-family:sans-serif;
  background: #f0f0f0;
  border:2px solid blue;
}

.card button{
  margin-top:10px;
  padding:8px 14px;
  border:none;
  background:#3b82f6;
  color:white;
  border-radius:6px;
}



.card button{
  margin-top:10px;
  padding:8px 14px;
  border:none;
  background:#3b82f6;
  color:white;
  border-radius:6px;
}
`,

      js: ``
    },

    TAILWIND: {
      tailwind: `
<div class="bg-white shadow-lg rounded-lg p-6 w-64">

<h3 class="text-lg font-semibold mb-2">
  Card Title
</h3>

<p class="text-gray-600 mb-4">
  This is a simple card component
</p>

<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Action
</button>

</div>
`
    }

  },

  ////////////////////////////////////////////////////
  // SEARCH BARS
  ////////////////////////////////////////////////////

  SEARCHBARS: {

    HTML: {
      html: `
<div class="search">
  <input placeholder="Search..." />
  <button>Search</button>
</div>
`,

      css: `
.search{
  display:flex;
  gap:10px;
}

.search input{
  padding:8px;
  border:1px solid #ccc;
  border-radius:6px;
}

.search button{
  padding:8px 12px;
  background:#3b82f6;
  color:white;
  border:none;
  border-radius:6px;
}
`,

      js: ``
    },

    TAILWIND: {
      tailwind: `
<div class="flex gap-2">

<input
class="border px-3 py-2 rounded"
placeholder="Search..."
/>

<button
class="bg-blue-500 text-white px-4 py-2 rounded"
>
Search
</button>

</div>
`
    }

  }
,


  TOOLTIPS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<div class="tooltip">

<button class="tooltip-btn">
Hover Me
</button>

<span class="tooltip-text">
Tooltip message
</span>

</div>
`,

    css: `
.tooltip{
position:relative;
display:inline-block;
font-family:sans-serif;
}

.tooltip-btn{
padding:8px 14px;
border:none;
background:#3b82f6;
color:white;
border-radius:6px;
cursor:pointer;
}

.tooltip-text{
position:absolute;
bottom:120%;
left:50%;
transform:translateX(-50%);
background:#111;
color:white;
padding:6px 10px;
border-radius:4px;
font-size:12px;
white-space:nowrap;
opacity:0;
visibility:hidden;
transition:0.2s;
}

.tooltip:hover .tooltip-text{
opacity:1;
visibility:visible;
}
`,

    js: ``
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<div class="relative group inline-block">

<button class="px-4 py-2 bg-blue-500 text-white rounded">
Hover Me
</button>

<span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
bg-black text-white text-xs px-2 py-1 rounded
opacity-0 group-hover:opacity-100 transition">

Tooltip message

</span>

</div>
`
  }

}

,
NAVIGATION: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<header class="header">

  <nav class="navbar">


    <ul class="nav-links">
      <li><a href="#" onclick="event.preventDefault()">Home</a></li>
      <li><a href="#" onclick="event.preventDefault()">About</a></li>
      <li><a href="#" onclick="event.preventDefault()">Services</a></li>
      <li><a href="#" onclick="event.preventDefault()">Contact</a></li>
    </ul>

  </nav>

</header>
`,

    css: `
.navbar{
display:flex;
justify-content:space-between;
align-items:center;
padding:12px 20px;
background:#3b82f6;
color:white;
font-family:sans-serif;
}

.logo{
font-weight:bold;
font-size:18px;
}

.nav-links{
list-style:none;
display:flex;
gap:20px;
margin:0;
padding:0;
}

.nav-links a{
color:white;
text-decoration:none;
}

.menu-btn{
display:none;
background:none;
border:none;
color:white;
font-size:20px;
cursor:pointer;
}

/* mobile */

@media(max-width:600px){

.nav-links{
position:absolute;
top:60px;
left:0;
width:100%;
background:#3b82f6;
flex-direction:column;
display:none;
padding:10px 0;
}

.nav-links.show{
display:flex;
}

.menu-btn{
display:block;
}

}
`,

    js: ` `
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<header class="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
  
  <nav class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white border">

  

    <ul class="flex gap-8 font-medium">

      <li>
        <a href="#" onclick="event.preventDefault()" class="hover:text-gray-200">
          Home
        </a>
      </li>

      <li>
        <a href="#" onclick="event.preventDefault()" class="hover:text-gray-200">
          About
        </a>
      </li>

      <li>
        <a href="#" onclick="event.preventDefault()" class="hover:text-gray-200">
          Services
        </a>
      </li>

      <li>
        <a href="#" onclick="event.preventDefault()" class="hover:text-gray-200">
          Contact
        </a>
      </li>

    </ul>

  </nav>

</header>
`
  }

},


INPUTS: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<div class="input-group">

<label for="name">
Name
</label>

<input
type="text"
id="name"
placeholder="Enter your name"
/>

</div>
`,

    css: `
.input-group{
display:flex;
flex-direction:column;
gap:6px;
font-family:sans-serif;
width:220px;
}

.input-group label{
font-size:14px;
color:#333;
}

.input-group input{
padding:8px 10px;
border:1px solid #ccc;
border-radius:6px;
outline:none;
transition:0.2s;
}

.input-group input:focus{
border-color:#3b82f6;
box-shadow:0 0 0 2px rgba(59,130,246,0.2);
}
`,

    js: ``
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<div class="flex flex-col gap-1 w-56">

<label class="text-sm text-gray-700">
Name
</label>

<input
type="text"
placeholder="Enter your name"
class="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

</div>
`
  }

}
,


TOGGLES: {

  ////////////////////////////////////////////////////
  // HTML VERSION
  ////////////////////////////////////////////////////

  HTML: {
    html: `
<label class="toggle">

<input type="checkbox" id="toggleSwitch">

<span class="slider"></span>

</label>
`,

    css: `
.toggle{
position:relative;
display:inline-block;
width:50px;
height:26px;
}

.toggle input{
opacity:0;
width:0;
height:0;
}

.slider{
position:absolute;
cursor:pointer;
top:0;
left:0;
right:0;
bottom:0;
background:#ccc;
transition:.3s;
border-radius:30px;
}

.slider:before{
position:absolute;
content:"";
height:20px;
width:20px;
left:3px;
bottom:3px;
background:white;
transition:.3s;
border-radius:50%;
}

input:checked + .slider{
background:#3b82f6;
}

input:checked + .slider:before{
transform:translateX(24px);
}
`,

    js: `
const toggle = document.getElementById("toggleSwitch");

toggle.addEventListener("change",()=>{
console.log("Toggle state:", toggle.checked);
});
`
  },

  ////////////////////////////////////////////////////
  // TAILWIND VERSION
  ////////////////////////////////////////////////////

  TAILWIND: {
    tailwind: `
<label class="inline-flex items-center cursor-pointer">

<input type="checkbox" class="sr-only peer">

<div class="w-11 h-6 bg-gray-300 rounded-full peer 
peer-checked:bg-blue-500 relative">

<span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
transition peer-checked:translate-x-5"></span>

</div>

</label>
`
  }

}




};