let addBtn = document.querySelector('.addBtn');
let deleteBtn = document.querySelector('.deleteBtn')
let modalContain = document.querySelector('.modalContain')
let textArea =document.querySelector('.textArea')
let priorityColor = 'red';
let mainContain = document.querySelector('.mainArea')
let uid = new ShortUniqueId();


let isModalHidden = true;
// Adding active class to colors
let priorityColorAll= document.querySelectorAll('.priority-color')
for(let i=0;i<priorityColorAll.length;i++){
    priorityColorAll[i].addEventListener('click',function(){
        for(let j=0;j<priorityColorAll.length;j++){
            priorityColorAll[j].classList.remove('active')
        }
        priorityColorAll[i].classList.add('active')
        priorityColor=priorityColorAll[i].classList[1];
    })
}

// Filter Ticket
let colorAll = document.querySelectorAll('.color')

for(let i=0;i<colorAll.length;i++){
    colorAll[i].addEventListener('click',function(e){
    let filterTicketColor = colorAll[i].classList[1];
    let allTicketColor = document.querySelectorAll('.ticket-color')
    for(let j=0;j<allTicketColor.length;j++){
        let currentTicketColor = allTicketColor[j].classList[1];
        if(filterTicketColor == currentTicketColor){
            allTicketColor[j].parentElement.style.display='block'
        }
        else{
            allTicketColor[j].parentElement.style.display='none'
        }
    }
    })
}

for(let i=0;i<colorAll.length;i++){
    colorAll[i].addEventListener('dblclick',function(){
        let allTicketColor = document.querySelectorAll('.ticket-color')
      for(let j=0;j<allTicketColor.length;j++){
        allTicketColor[j].parentElement.style.display = 'block';
      }
    })
}
// getting items from LocalStrorage and adding it to UI
let ticketArr =[]

if(localStorage.getItem('ticket')){
    let ticketArrStr = localStorage.getItem('ticket')
   ticketArr = JSON.parse(ticketArrStr)
   for(let i=0;i<ticketArr.length;i++){
   let ticket = ticketArr[i]
   createTicket(ticket.value,ticket.color,ticket.id)
}
}




addBtn.addEventListener('click',function(){
    
    if(isModalHidden == true){
        modalContain.style.display = 'flex'
        isModalHidden=false;
    }
    else{
        modalContain.style.display = 'none'
        isModalHidden = true;
    }
})
deleteBtn.addEventListener('click',function(){
    if(deleteBtn.style.color == 'black'){
        deleteBtn.style.color = 'red';
    }
    else{
        deleteBtn.style.color = 'black';
    }
})
// creating tickets from Modal Container
textArea.addEventListener('keydown',function(e){
    
    let key = e.key;
    if(key == 'Enter'){
      createTicket(textArea.value,priorityColor)
      
      modalContain.style.display = 'none';
      isModalHidden=true;
      textArea.value="";
    }
})

   function createTicket(task,priorityColor,ticketId){
     let ticketContain = document.createElement('div')
       let id
       if(!ticketId){
        id = uid.rnd()
       }
       else{
        id=ticketId
       }
       ticketContain.className = 'ticket-cont';
       ticketContain.innerHTML = `
       <div class="ticket-color ${priorityColor}"></div>
       <div class="ticket-id">${id}</div>
       <div class="ticket-area">${task}</div>
       <div class="lockBtn fa-solid fa-lock"></div>`
    //    Pushing the already created tickets to localStorage
       if(!ticketId){
       ticketArr.push({color:priorityColor,id:id,value:task})
       updateLocalStorage();
       }

     mainContain.appendChild(ticketContain)
    //  Delete task
     ticketContain.addEventListener('click',function(e){
        if(deleteBtn.style.color == 'red'){
            ticketContain.remove();
            let ticketIdx = ticketArr.findIndex(function(objectId){
                return objectId.id == id
            })
            ticketArr.splice(ticketIdx,1)
            updateLocalStorage();
        }
        
    })
    // Lock & unlock button and update the task
    let lockBtn=ticketContain.querySelector('.lockBtn.fa-solid.fa-lock')
    let ticketArea=ticketContain.querySelector('.ticket-area')
    lockBtn.addEventListener('click',function(){
        console.log(ticketArr);
        if(lockBtn.classList.contains('fa-lock')){
            lockBtn.classList.replace('fa-lock','fa-unlock')
            ticketArea.setAttribute('contenteditable','true')
        }
        else{
            lockBtn.classList.replace('fa-unlock','fa-lock')
            ticketArea.setAttribute('contenteditable','false')
        }
        let ticketIdx = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id
        })
        ticketArr[ticketIdx].value = ticketArea.innerText
        updateLocalStorage();
        console.log(ticketArr)
        
    })
    // Cyclic Function
    
    let colorArea = ticketContain.querySelector('.ticket-color')
    colorArea.addEventListener('click',function(e){
       
        let colorArr = ['red','blue','green','violet']
        let idx =0;
        let currentColor = colorArea.classList[1];
        for(let i=0;i<colorArr.length;i++){
           if(currentColor == colorArr[i]){
                idx=i;
                break;
            }
        }
        // idx++
        // if(idx == color.length){
        //     idx=0;
        // }
        idx=(idx+1)%colorAll.length
        let nxtColor = colorArr[idx]
        colorArea.classList.replace(currentColor,nxtColor)
        let ticketIdx = ticketArr.findIndex(function(ticketObj){
            return ticketObj.id == id
        })
        ticketArr[ticketIdx].color = nxtColor
        updateLocalStorage();

    })

    
 }
 
 function updateLocalStorage(){
    let ticketArrStr = JSON.stringify(ticketArr)
    localStorage.setItem('ticket',ticketArrStr)
 }

   





