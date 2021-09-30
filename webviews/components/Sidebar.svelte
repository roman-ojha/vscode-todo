<!-- in svelte we will write the script like this -->
<script lang="ts">
import { stringify } from "querystring";
import { onMount } from "svelte";
import HelloWorld from "./HelloWorld.svelte";
    let accessToken='';
    let todos:Array<{text:string,completed:boolean}> =[];
    // here we are decelaring a type in typescript
    let text='';
    let loading =true;
    let user:{name:string,id:number}|null=null;
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
                case 'token':
                     accessToken=message.value
                        // so for url we will going to use 'constant.ts' 'apiBaseUrl' so it means we will going to add the script in 'SideBarProvider.ts' page
                    // and in a global.d.ts we will going to add 'apiBaseUrl' as a string
                    const response= await fetch(`${apiBaseUrl}/me`,{
                        headers:{
                            // now in authorization we have to pass the token 
                            // and the way to get the token inside this file is by adding script in 'SidebarProvider.ts'
                            // const accessToken=${JSON.stringify(TokenManager.getToken())}
                            // and again we have to add a globals in 'globals.d.ts'
                            // it is ok to do that but when the toke changes then it is hard to update that token from the script so, there is the another way to do this
                            // so todo do that in sidebar we will send a message to our vscode extention telling it that we want some token 
                            // so we will store the accessToken as variable in here, let accessToken='';
                            // and we will post the message like this:
                                // tsvscode.postMessage({type:'get-token'});
                                // and we will make a case at the upper side when sidebar loded
                                // now we can remove tokenvalue form 'SidebarProvider.ts' script and add case inside the 'onDidReceiveMessage' inside 'SidebarProvider.ts'
                            authorization:`Bearer ${accessToken}`
                        }
                    });
                    const data=await response.json();
                    // here now we will get the user data
                    user=data.user;
                    loading=false;
                    // ERROR: CORS error: so we will going to install two packages : npm i cors , npm i -D @types/cors
                    // and we will going to import 'cors' in api index.ts and we will add 
                    // app.use(cors({ origin: "*" })); in index.ts
           
             }
        });
            tsvscode.postMessage({type:'get-token',value:undefined});
            // now here we will post the message saying 'get-token'
            // so when a svelte component mount for the first time it will going to send a post message to our extention and it will going to pass the 'type:'get-token'' and it will go to 'SidebarProvider.ts and it will recive the massage using 'onDidReceiveMessage()' and then when the case match then it will send the message back to the webview passing it a current token form the 'Tokenmanager.ts' and after that the uppder part of the case 'token'  will going to call and it will fetch the current user form the server and it means whenever the extention load the token will going to fetch 
            
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

<!-- here we will going to show the user data firstly we will load until data didn't came -->
{#if loading}
<div>loading...</div>
{:else if user}
<pre>{JSON.stringify(user,null,2)}</pre>
{:else}
<div>no user is logged in</div>
{/if}
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
}}>Click me hard</button>
<button on:click={()=>{
    tsvscode.postMessage({type: 'onError',value: 'error message'});
}}>click me for error</button>