const url = "http://localhost:8080"
let stompClient;
let selectedUser;
let newMessage = new Map();

function connectToChat(userName) {
    console.log("Connecting to chat....");
    let socket = new SockJS(url + "/chat");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("Connected to: " + frame);
        stompClient.subscribe("/topic/messages/" + userName, function (res) {
            let data = JSON.parse(res.body);
            console.log("Response: " + data);
            if (selectedUser === data.fromLogin)
                render(data.message, data.fromLogin)
            else {
                newMessage.set(data.fromLogin, data.message)
                $('#userNameAppender_' + data.fromLogin).append('<span id="newMessage_' + data.fromLogin + '" style="color: red">+1</span>');

            }
        });
    })
}


function sendMsg(from, next) {
    stompClient.send("/app/chat/" + selectedUser, {}, JSON.stringify({
        fromLogin: next,
        message: next
    }))
}

function registration() {
    let username = document.getElementById("userName").value;
    $.get(url + "/registration/" + username, function (res) {
        connectToChat(username);
    }).fail(function (e) {
        if (e.status == 400)
            alert("User already exist");
    })
}

function fetchAll() {
    $.get(url + "/fetchAllUsers", function (res) {
      let users = res;
      let userTemplateHTML = "";
      for (let i=0 ; i<users.length ; i++) {
          userTemplateHTML = userTemplateHTML + '<a href="#" onclick="selectUser(\'' + users[i] + '\')"><li class="clearfix">\n' +
              '                        <img alt="avatar" height="55px"\n' +
              '                             src="user.png"\n' +
              '                             width="55px"/>\n' +
              '                        <div class="about">\n' +
              '                            <div id="userNameAppender_' + users[i] + '" class="name">' + users[i] + '</div>\n' +
              '                            <div class="status">\n' +
              '                                <i class="fa fa-circle online"></i>\n' +
              '                            </div>\n' +
              '                        </div>\n' +
              '                    </li></a>\n'
          $('#usersList').html(userTemplateHTML);
      }
    })
}

function selectUser(userName) {
    console.log("selecting users: " + userName);
    selectedUser = userName;
    let isNew = document.getElementById("newMessage_" + userName) !== null;
    if (isNew) {
        let element = document.getElementById("newMessage_" + userName);
        element.parentNode.removeChild(element);
        render(newMessage.get(userName), userName);
    }
    $('#selectedUserId').html('');
    $('#selectedUserId').append('Chat with ' + userName);
}