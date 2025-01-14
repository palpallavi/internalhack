function deletegroup() {
  let team_code = document.getElementById('teamid').innerText;
  let reg_id = getCookie('uuid');
  data = {
    reg_id: reg_id,
    team_code: team_code
  };
  fetch('http://localhost:8000/team/deletegroup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(function (res) {
      console.log(res);
      window.location = "/account/profile?tab=team"
    });
}

function removeMember(memberid) {
  let reg_id = document.getElementById(memberid).innerText;
  let team_code = document.getElementById('teamid').innerText;
  console.log(reg_id, team_code)
  data = {
    reg_id: reg_id,
    team_code: team_code
  };
  fetch('http://localhost:8000/team/removeteammember', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(function (res) {
      console.log(res);
      window.location = "/account/profile?tab=team"
    });
}

function joinTeam() {
  let team_code = document.getElementById("team_code_input").value;
  let reg_id = getCookie('uuid');
  data = {
    reg_id: reg_id,
    team_code: team_code
  };
  fetch('http://localhost:8000/team/jointeam', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(function (res) {
      console.log(res);
      window.location = "/account/profile?tab=team"
    });
}


function createTeam_and_generateCode() {
  let team_name = document.getElementById("team_name_input").value;

  let reg_id = getCookie('uuid');
  data = {
    team_leaderid: reg_id,
    team_name: team_name
  };
  fetch('http://localhost:8000/team/createteam', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(function (res) {
      console.log(res);
      window.location = '/account/profile?tab=team'
    });
}

function delete_cookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function signout() {
  console.log('Clck')
  delete_cookie('jwt_token');
  window.location = '/';
}

function display_dashboard(payload) {
  console.log(payload);

  let userdata = payload.userdata;
  // let teamdata = payload.teamdata;

  // userdata = {
  //   gravatar: 'https://bulma.io/images/placeholders/128x128.png',
  //   name: 'Shadab Majid Shaikh',
  //   _id: 'C39824782738',
  //   email: 'shadabshaik@gamil.com',
  //   mobile: '8974573495',
  //   dept: 'Computer',
  //   year: 'BE'
  // }


  if (userdata.gravatar_url == 'http://www.gravatar.com/avatar/2533554fff89b7aef3f8aff5eef02a0e') {
    userdata.gravatar_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwjmWcbAVI_chtFQiSWVBZCGbFgg3r9F4j_SGIgPHnQtTasagzWA&s'
  }
  document.getElementById('user_gravatar').src = userdata.gravatar_url;
  document.getElementById('user_name').innerText = userdata.name;
  document.getElementById('user_regid').innerText = userdata._id;
  document.getElementById('user_email').innerText = userdata.email;
  document.getElementById('user_deptyear').innerText = userdata.dept + ', ' + userdata.year;
  document.getElementById('user_mobile').innerText = userdata.mobile;

  if (userdata.is_inteam) {

    let teamdata = payload.teamdata;
    let count = 1;
    teamdata.map((team_member) => {
      if ((team_member.is_teamleader === true))
        document.getElementById('membername' + count).innerText = team_member.name + ' ( Team Leader ) ' ;
      else
        document.getElementById('membername' + count).innerText = team_member.name;
      document.getElementById('memberid' + count).innerText = team_member._id;
      if ((userdata.is_teamleader === true))
        if (team_member.is_teamleader !== true)
          document.getElementById('memberbtn' + count).style.display = "block";

      count++;
    })
    if (userdata.is_teamleader === true)
      document.getElementById('deletegroupbtn').innerHTML = "Leave & Delete Team";

  }

  document.getElementById('teamname').innerText = payload.team_name;
  document.getElementById('teamid').innerText = userdata.team_id;


}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function loaddata() {
  reg_id = getCookie('uuid');
  console.log(reg_id);

  data = {
    id: reg_id
  };
  fetch('http://localhost:8000/fetch/user_dashboard', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(function (res) {
      in_team = res.userdata.is_inteam;
      if (in_team) {
        document.getElementById('create_join_section').style.display = "none";
        document.getElementById('team_members_list_section').style.display = "block";
      } else {
        document.getElementById('team_members_list_section').style.display = "none";
        document.getElementById('create_join_section').style.display = "block";
      }
      display_dashboard(res)
    });
}

function ready() {
  hideAll();
  loaddata();
  tabLoad() ; 
}

function getGetParam(param){
  var url_string = window.location.href
  var url = new URL(url_string);
  return url.searchParams.get(param);
}

function tabLoad(){
  let tab_name = getGetParam('tab') ;
  console.log(tab_name) ;
  openTab('id_section_' + tab_name, document.getElementById(tab_name + '_tab')) ; 
}

function hideAll() {
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
}

function openTab(sectionName, element) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  tabheaders = document.getElementsByClassName("tab_headers");
  console.log(tabheaders)
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabheaders[i].classList.remove('is-active');
  }
  document.getElementById(sectionName).style.display = "block";
  element.classList.add('is-active');
  let tab_name = sectionName.split('id_section_')[1] ; 
  history.pushState({}, null, window.location.href.split('?')[0] + '?tab=' + tab_name);
}