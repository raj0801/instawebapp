let form = $("#form")
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
  
    console.log(values);


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
})
