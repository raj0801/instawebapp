let form = $("#form");
let formChecked = false;
form.on("submit",function (event) {
    
    event.preventDefault();
    const elements = form[0].elements;
    const values = {};
  
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.type !== 'submit') {
            values[element.id] = element.value;
        }
    }


    $.ajax({
        type: "POST",
        url: "http://localhost:5500/insta/user/register",
        data: {
            record : values
        },
        success: function (response) {
            console.log("Success:", response);
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
    $("#staticBackdrop").css("display","none")
})




$('#inputNumber').on('input', function() {
    var inputValue = $(this).val();
    if (inputValue.length > 10) {
        $(this).val(inputValue.slice(0, 10));
    }
    
});
$("#inputEmail").on("blur", function () {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = $(this).val(); // Get the value from the input field
  
    if (emailRegex.test(email)) {
      console.log("");
      $(this).siblings(".invalid-tooltip").css("display","none")
    } else {
        $(this).siblings(".invalid-tooltip").css("display","block").text("Please Enter Valid Email Address")
      console.log("Invalid email address");
    }
  });
  

$("#inputNumber").on("blur",function(){
    let inputNumberLength = $(this).val()
    if(inputNumberLength.length < 10){
        $(this).siblings(".invalid-tooltip").css("display","block").text("Please Enter 10 Digit")
    }else{
        
        $(this).siblings(".invalid-tooltip").css("display","none")
    }
})


  