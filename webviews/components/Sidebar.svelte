<!-- in svelte we will write the script like this -->
<script lang="ts">
import { onMount } from "svelte";
import HelloWorld from "./HelloWorld.svelte";
    let todos:Array<{text:string,completed:boolean}> =[];
    // here we are decelaring a type in typescript
    let text='';
    onMount(()=>{
        // this funciton get call when the component first get mounted
        window.addEventListener('message', event => {
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
    /*
        -> now everything we've done so far has been local to vscode and it means all that data will be on that person computer but sometimes we want to interact with the api store data into database
        -> now we will going to setup the api and backend and database stuff through which we can interact with and also do and authentication with github
        -> so we will going to make a new folder called 'api'
    */
</script>

<!-- and we will write the style like the -->
<style>
    .complete{
        text-decoration: line-through;
    }
</style>

<!-- and now here the body take  -->
<form on:submit|preventDefault={()=>{
    todos=[{text,completed:false},...todos];
    text="";
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

<button on:click={()=>{
     tsvscode.postMessage({
        //  here no we can use the vscode object because we include it inside our script tag in SidebarProvider ,const tsvscode = acquireVsCodeApi();
        // but by just putting that typescript doesnot know that this object exist so it will throw and error 
        // to solve that problem we have to create a new file called 'globals.d.ts' and declare global
                type: 'onInfo',
                value: 'info message'
            });
        // this postMessage function will post the data and will going to receive by the 'onDidReceiveMessage' function inside our 'SidebarProvider.ts'
         // here webview is telling extention to do something using "onDidReceiveMessage" and doing some command
        //  where we might want to do it's inverse where you want to send the information from extention to webview
        // for that we will going to set up some command to do this so we will going to add command 'vstodo.addTodo' in package.json and make command in extention.ts
}}>Click me</button>
<button on:click={()=>{
    tsvscode.postMessage({type: 'onError',value: 'error message'});
}}>click me for error</button>