const user_module_ids = <%- JSON.stringify(user_modules.map(user_module => user_module._id)) %>;
// console.log(user_module_ids);

function handleSubmit() {
  if (confirm("Are you sure you wish to submit the test? Make sure you have completed all the modules.")) {

    // clear local timers
    for (const key of user_module_ids) {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    }

    document.myForm.submit();
  }
  else {
    console.log("Not submitting form.");
  }
}

window.onload = () => {
  document.myForm.addEventListener('submit', (e) => {
    e.preventDefault();
  })
}