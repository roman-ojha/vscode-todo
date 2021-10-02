<!-- now we will going to render this components into  -->
<script lang="ts">
import { join } from "path";

    import { onMount } from "svelte";
    import type{ User } from '../types';
    export let user:User;
    export let accessToken:string;
    let text='';
    let todos:Array<{text:string,completed:boolean,id:number}> =[];
    // here we are decelaring a type in typescript

    async function addTodo(t:string){
        const respose=await fetch(`${apiBaseUrl}/todo`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:`Bearer ${accessToken}`
               
            },
            body:JSON.stringify({
                text:t,
            })
        });
        const {todo} =await respose.json();
        todos=[todo,...todos];
          // here we post the data to the server now we have to fetch the data from the server as well
        // now we have to create another route in api/src/index.ts
        // now after completing get request form the server side now we can get the data useing get request
        // and we know that we want to fetch the data when the extention is rendering  so we have to fetch inside onMount() function
    }

    onMount(async()=>{
        // this funciton get call when the component first get mounted
        window.addEventListener('message', async event => {
            // here we are getting the data that the extension is sending to webview
            const message = event.data; // The json data that the extension sent
            console.log({message});
            switch (message.type) {
                case 'new-todo':
                    // todos=[{text:message.value,completed:false},...todos];
                    addTodo(message.value)
                    break;
           
             }
        });     

        // now here we will going to fetch the todo list data form the server
            const respose=await fetch(`${apiBaseUrl}/todo`,{
            headers:{
                authorization:`Bearer ${accessToken}`
                 // we should also test out our authentication middleware
                //  and we will add the complete todo functionality where we will going to add a functionality into our api
            },
        });  
        const payload =await respose.json(); 
        todos=payload.todos;
    })
</script>


<!-- and we will write the style like the -->
<style>
    .complete{
        text-decoration: line-through;
    }
</style>

<div>Hello: {user.name}</div>
<!-- now we can display user  -->
<form on:submit|preventDefault={async ()=>{
    //here when user submit we want to do a post request
    addTodo(text);
    text="";
  
}}>
    <input bind:value={text}/>
    <!-- getting todo text -->
</form>

<!-- displaying todo list -->
<ul>
    {#each todos as todo (todo.id)}
        <li
        class:complete={todo.completed}
        on:click={async ()=>{
            // here we reversing the completed todo list 
            // in class name we can do one of them
            // class={todo.completed?"complete" :""}
            todo.completed=!todo.completed;
            // here now now after completing the completed functionality in backend we will route that back in here
            const response= await fetch(`${apiBaseUrl}/todo`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                authorization:`Bearer ${accessToken}`

                },
                 body:JSON.stringify({
                    id:todo.id,
                })
            })
            console.log(await response.json());
           
        }}>{todo.text}</li>
    {/each}
</ul>

