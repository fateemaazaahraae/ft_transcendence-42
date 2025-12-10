
export function showBlockedMessage(){
    //hide message input area 
    const messageInputDiv = document.getElementById('messageInputContainer') as HTMLElement;
   if(messageInputDiv){
        messageInputDiv.style.display ='none'
    }
    const blockedDiv=document.getElementById('blockeddiv');
    if(blockedDiv)
    {
        blockedDiv.classList.remove('hidden');
    }
    //close dropdownmenu
    const  dropdown=document.getElementById('dropdownMenu');
    if(dropdown)
    {
        dropdown.classList.add('hidden');
    }
}

export function blockUser(blockerId:number,blockedId:number){
    //send request to backend
    fetch('http://localhost:4000/api/block',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            blockedId:blockedId,
            blockerId:blockerId
        })
        
    })
    .then(response => response.json())
    .then(data => {
        console.log('User blocked succesfuly:',data);
        showBlockedMessage();
    })
    .catch(error =>{
        console.error("Error blocking user failed:",error);
    });
}

export function showMessageInput()
{
    const messageInputDiv = document.getElementById('messageInputContainer') as HTMLElement;
    if (messageInputDiv) {
        messageInputDiv.style.display = 'block';
    }

    //hide blocked message
    const blockedDiv = document.getElementById('blockeddiv');
    if (blockedDiv) {
        blockedDiv.classList.add('hidden');
    }
}
export function unblockUser(blockerId:number,blockedId:number)
{
    fetch('http://localhost:4000/api/unblock',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            blockedId:blockedId,
            blockerId:blockerId
        })
        
    })
    .then(response => response.json())
    .then(data => {
        console.log('User blocked succesfuly:',data);
        showMessageInput();
    })
    .catch(error =>{
        console.error("Error blocking user failed:",error);
    });
}