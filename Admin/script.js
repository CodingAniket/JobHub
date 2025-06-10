let fetchedData = [];
let userList = [];

async function fetchItems() {
  try {
    const response = await fetch('http://localhost:4000/api/userdata');
    const data = await response.json();
    console.log(data);
    fetchedData = data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:4000/api/users');
    const data = await response.json();
    console.log("User data:", data);
    userList = data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (email === "admin@jobhub.com" && pass === "admin123") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid admin credentials");
  }
}

function populateDashboard() {
  const tableBody = document.getElementById("resumeTableBody");
  tableBody.innerHTML = "";

  document.getElementById("totalUsers").innerText = userList.length;
  document.getElementById("totalResumes").innerText = fetchedData.length;

  fetchedData.forEach((user, index) => {
    const skillsHTML = (user.skills || []).map(skill => `<span class="badge bg-primary me-1">${skill}</span>`).join(" ");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.location}</td>
      <td>${skillsHTML}</td>
      <td>
        <button class="btn btn-sm btn-info me-1" onclick="viewResume(${index})">View Resume</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function populateUsers() {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  userList.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user._id}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function viewResume(index) {
  const user = fetchedData[index];
  const modalBody = document.getElementById("resumeDetails");

  const experience = (user.workExperience || []).map(exp => `
    <li>
      <strong>${exp.jobTitle}</strong> at ${exp.company}<br/>
      <small>${exp.startDate} to ${exp.endDate}</small><br/>
      <em>${exp.jobDescription}</em>
    </li>
  `).join("");

  const education = (user.education || []).map(edu => `
    <li>
      <strong>${edu.degree}</strong> from ${edu.institution} (Graduation: ${edu.graduationYear})
    </li>
  `).join("");

  const skills = (user.skills || []).map(skill => `<span class="badge bg-success me-1">${skill}</span>`).join("");

  modalBody.innerHTML = `
    <h5>${user.fullName}</h5>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Location:</strong> ${user.location}</p>
    <hr/>
    <h6>Work Experience</h6>
    <ul>${experience}</ul>
    <h6>Education</h6>
    <ul>${education}</ul>
    <h6>Skills</h6>
    <p>${skills}</p>
    <p><strong>Created At:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
  `;

  new bootstrap.Modal(document.getElementById("resumeModal")).show();
}

function editUser(index) {
  const user = fetchedData[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editFullName").value = user.fullName;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.phone;
  document.getElementById("editLocation").value = user.location;

  new bootstrap.Modal(document.getElementById("editUserModal")).show();
}

document.getElementById("editUserForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const index = document.getElementById("editIndex").value;
  fetchedData[index].fullName = document.getElementById("editFullName").value;
  fetchedData[index].email = document.getElementById("editEmail").value;
  fetchedData[index].phone = document.getElementById("editPhone").value;
  fetchedData[index].location = document.getElementById("editLocation").value;

  populateDashboard();
  populateUsers();
  bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
});

document.getElementById("addUserForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("newUserName").value;
  const email = document.getElementById("newUserEmail").value;
  const phone = document.getElementById("newUserPhone").value;

  fetchedData.push({ fullName: name, email, phone, location: "", skills: [] });
  document.getElementById("addUserForm").reset();
  bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
  populateUsers();
  populateDashboard();
});

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "index.html";
  }
}

async function deleteUser(index) {
  const userId = userList[index]._id;
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      console.log(result);

      userList.splice(index, 1); // update local copy
      populateUsers();
      populateDashboard();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}


window.onload = async () => {
  await fetchItems();
  await fetchUsers();
  populateDashboard();
  populateUsers();
};
