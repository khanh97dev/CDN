var usersOnline = [];
var idUserHere = userHere.id;
var userAll = [];
var elementUsers = $('#notification-user-online .users');
var timeOutSet;
var notifyPermissionsEditForUser = {
  on: function(){
    $('#dropdown-user-online').find('i').css('color', 'var(--success)');
  },
  off:function(){
    $('#dropdown-user-online').find('i').css('color', 'var(--danger)');
  }
}
// handle set html in navabar header
function setHtmlUsers(users, setTimeOut = 200){
  clearTimeout(timeOutSet)
  timeOutSet = setTimeout( () => {
    setUserHereIsMaster().then( () => {
      elementUsers.html('')
      users.forEach( (user, index) => {
        elementUsers.append(`
          <a class="dropdown-item d-flex align-items-center user-online" href="#">
            <div class="mr-3">
              <div class="icon-circle bg-primary text-white">
                <i class="fas fa-user-alt"></i>
              </div>
            </div>
            <div>
              <div class="small text-success">Online</div>
              <span class="font-weight-bold">
                <b>${(index + 1)}. </b>${user.name}
                ${ user.is_master
                  ? `<b class="text-success"><i class="fa fa-user" aria-hidden="true"></i></b>`
                  : ''
                }
                ${
                  userHere && userHere.is_master
                    ? `
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox"
                          name="set-edit"
                          class="custom-control-input"
                          id="user-${user.id}"
                          ${user.is_edit ? 'checked' : ''}
                        >
                        <label class="custom-control-label" for="user-${user.id}">Quyền chỉnh sửa</label>
                      </div>
                    `
                    : ''
                }
              </span>
              <div class="row justify-content-between">
              </div>
            </div>
          </a>
        `)
      })
      $('input[name="set-edit"]').on( 'click', function(){
        var checked = $(this).prop('checked');
        var id = $(this).attr('id').replace('user-', '');
        checked
          ? $.post(`/set-role-edit/${id}/1`)
          : $.post(`/set-role-edit/${id}/0`)
        sentWhisper('watch-user-edit', { id: id, is_edit: checked })
      })
      // counter user online
      $('#count-notification-user').html($('.user-online').length + '+')
      return elementUsers
    } )
  }, setTimeOut )
}
Echo.join('watch')
  .here( users => {
    // Set is whisper
    if(userHere.is_master || userHere.is_edit){
      $('#btn-update').fadeIn()
      setLocalStorage('is_whisper', 1)
      if(userHere.is_master == 0){
        setTimeout(() => {
          notifyPermissionsEditForUser.on();
        }, 1000);
      }
    } else{
      $('#btn-update').fadeOut()
      setLocalStorage('is_whisper', 0)
      notifyPermissionsEditForUser.off();
    }
    users = users.filter( userFind => userFind.id != idUserHere);
    usersOnline = users;
    return setHtmlUsers(users);
  })
  .joining( user => {
    let indexUser = usersOnline.findIndex( userFind => userFind.id === user.id )
    if(indexUser === -1) usersOnline.push(user)
    if(usersOnline) setHtmlUsers(usersOnline, 2000); // 2s
  })
  .leaving((user) => {
    // get id user remove
    let id = user.id
    // handle remove user when leave
    usersOnline = usersOnline.filter( userFind => userFind.id != id )
    // check last user here and set master
    setHtmlUsers( usersOnline, 5000 ) // 5s
  })
  .listenForWhisper( 'watch-user-edit', user => {
    let id = user.id
    let isEdit = user.is_edit
    if(id == idUserHere){
      if(isEdit){
        $('#btn-update').fadeIn()
        // notification
        $toastRemove();
        notifyPermissionsEditForUser.on();
        setLocalStorage('is_whisper', 1);
      }else{
        $('#btn-update').fadeOut();
        // notification
        $toastRemove();
        notifyPermissionsEditForUser.off();
        setLocalStorage('is_whisper', 0)
      }
    }
  })
  // end Echo set

// set user here is master
async function setUserHereIsMaster(){
  if(usersOnline.length === 0 && userHere.is_master == 0){
    return await $.post('/set-role-master/'+ idUserHere + '/1').done( userMaster => {
      userHere = userMaster;
      $('#btn-update').fadeIn();
      notifyPermissionsEditForUser.on();
    })
  } else {
    return await $.post('/get-role-master').done(userMaster => {
      usersOnline.some( (user, index) => {
        if(user.id === userMaster.id )
          return usersOnline[index] = userMaster;
      });
    })
  }
}

// handle set function localStorage
function setLocalStorage(key, val){
  return localStorage.setItem(key, val)
}

// handle sent whisper when cell changed
function sentWhisper(event, data){
  let isWhisper = localStorage.getItem('is_whisper') ? parseInt(localStorage.getItem('is_whisper')) : 0
  if(isWhisper){
    return Echo.join('watch')
      .whisper( event, data )
  }
}
// listen is edit
