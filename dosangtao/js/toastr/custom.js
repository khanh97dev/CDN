// toastr progress
var varToastLoading;
toastr.options.progressBar = true;

window.$toastRemove = function(){
  return toastr.remove()
}
window.$toastClear = function(){
  return toastr.clear()
}
window.$toastSuccess = function(message, title){
  if(varToastLoading) varToastLoading.remove();
  return toastr.success(message, title, {
    timeOut: 3000,
    progressBar: true,
  })
}
window.$toastInfo = function(message, title){
  return toastr.info(message, title, {
    timeOut: 12000, // 12s
    progressBar: true,
  })
}
window.$toastError = function(message, title){
  if(varToastLoading) varToastLoading.remove();
  return toastr.error(message, title, {
    timeOut: 3000,
    progressBar: true,
  })
}
window.$toastWarning = function(message, title){
  return toastr.warning(message, title, {
    timeOut: 12000, // 12s
    progressBar: true,
  })
}
// toast center screen
window.$toast = function ({type, message, title, option}){
  let optionDefault = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": 0,
    "extendedTimeOut": 0,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "tapToDismiss": false
  };
  option = Object.assign(optionDefault, option);
  return toastr[type](message, title, option);
}

/* Custom message */
window.$toastLoading = function(message = 'Đang tải'){
  if(varToastLoading) varToastLoading.remove();
  return toastLoading('info', 'Xin vui lòng đợi...', message);
}
window.$toastOK = function(){
  toastr.clear();

  return toastr.success('OK!', false, {
    timeOut: 1000,
    rtl: true,
    progressBar: true,
  })
}

// load ajax notification
async function getLoad(url){
  toastLoading("info", "Xin vui lòng đợi!", "Dữ liệu đang được tải...");
  return await $.get(url)
    .done(function(){
      setTimeout(() => {
        $toastRemove();
        $toastSuccess('Dữ liệu đã tả thành công!');
      }, 200)
    })
    .fail(function(){
      setTimeout(() => {
        $toastRemove();
        $toastError('Lỗi!');
      }, 200)
    });
}

async function postLoad(url, data){
  toastLoading("info", "Xin vui lòng đợi!", "Dữ liệu đang được tải...");

  return await $.post(url, data)
    .done(function(){
      setTimeout(() => {
        $toastRemove();
        $toastSuccess('Dữ liệu đã tả thành công!');
      }, 200)
    })
    .fail(function(){
      setTimeout(() => {
        $toastRemove();
        $toastError('Lỗi!');
      }, 200)
    });
}

function toastLoading(type, title, message) {
    let iconLoading;
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": 0,
        "onclick": null,
        "onCloseClick": null,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    };
    iconLoading = "<span> <i class='fa fa-spinner fa-pulse'></i></span>";
    const content = message + iconLoading;

    varToastLoading = toastr[type](content, title);
}
