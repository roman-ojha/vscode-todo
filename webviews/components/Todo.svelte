<!-- now we will going to render this components into  -->
<script lang="ts">
    import { onMount } from "svelte";
    import type{ User } from '../types';
    export let user:User;
    export let accessToken:string;
    let text='';
    let todos:Array<{text:string,completed:boolean}> =[];
    // here we are decelaring a type in typescript
    onMount(async()=>{
        // this funciton get call when the component first get mounted
        window.addEventListener('message', async event => {
            // here we are getting the data that the extension is sending to webview
            const message = event.data; // The json data that the extension sent
            console.log({message});
            switch (message.type) {
                case 'new-todo':
                    todos=[{text:message.value,completed:false},...todos];
                    break;
           
             }
        });        
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
    const respose=await fetch(`${apiBaseUrl}/todo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            authorization:`Bearer ${accessToken}`
        },
        body:JSON.stringify({
            text,
        })
    });
    const {todo} =await respose.json();
    todos=[todo,...todos];
    text="";
    // here we post the data to the server now we have to fetch the data from the server as well
    // now we have to create another route in api/src/index.ts
}}>
    <input bind:value={text}/>
    <!-- getting todo text -->
</form>

<!-- displaying todo list -->
<ul>
    {#each todos as todo (todo.text)}
        <li
        class:complete={todo.completed}
        on:click={()=>{
            // here we reversing the completed todo list 
            // in class name we can do one of them
            // class={todo.completed?"complete" :""}
            todo.completed=!todo.completed;
        }}>{todo.text}</li>
    {/each}
</ul>

