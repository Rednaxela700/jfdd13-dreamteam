const
    inputMail = document.querySelector("#form__input"),
    submitMail = document.querySelector("#form__submit"),
    thankYou = document.querySelector("#thankYou");
    
function addMail(){
    localStorage.setItem("email", inputMail.value);
    checkboxObject.required = true; 
    thankYou.innerText = 'Dziękujemy! Zapewniamy o bezpieczeństwie Państwa danych.';
    event.preventDefault();
}

submitMail.addEventListener("click", addMail);
