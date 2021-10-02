<!-- in svelte we will write the script like this -->
<script lang="ts">
import { stringify } from "querystring";
import { onMount } from "svelte";
import HelloWorld from "./HelloWorld.svelte";
import Todo from "./Todo.svelte";
import type {User} from '../types';
    let accessToken='';
    let loading =true;
    // let user:{name:string,id:number}|null=null;
    // here now we created 'User' type we can use it like this
    let user:User|null=null;
    // now in todo we only have one page, if we want multiple pages then we cans do that
    // and we are making a variable which defind the current page
    // and now we can use the if statement to check and display the multiple pages
    let page:"todos"|"contact"=tsvscode.getState()?.page||"todos"; // this logic will be expalin bellows
    // but here is the thing if we had made the multiple pages and we are in some another page after refreshing the extention we will be at the default page and we are not at the page we used to be so to solve that problem we have to save the state of the page
    // to do that in 'tsvscode' there is a two method in it 
    /*
        const tsvscode: {
            setState: (state: any) => void;
            //  this will set the new state
            getState: () => any;
            // this will get the current state that we just set
        };
    */
//    to do that in svelte we can use a '$'
    $:{
        // this codeblock will call every single time what ever variable that you use inside here changed
        tsvscode.setState({page});
        // here now we will save the page value
        // it means every time the page object change it will save the value of that page 
        // now what we can do now to get the value is :
        //  let page:"todos"|"contact"=tsvscode.getState()?.page||"todos";
    }
    onMount(async()=>{
        // this funciton get call when the component first get mounted
        window.addEventListener('message', async event => {
            // here we are getting the data that the extension is sending to webview
            const message = event.data; // The json data that the extension sent
            console.log({message});
            switch (message.type) {
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

            // the next thing that we will going to do is to logout button user
            // and so we will going to create an different file and create a logic of todo in that file 'Todo.svelte' and past the entire form and we will copy all the stuff need there and delete some from here
            
    })
    /*
        -> now everything we've done so far has been local to vscode and it means all that data will be on that person computer but sometimes we want to interact with the api store data into database
        -> now we will going to setup the api and backend and database stuff through which we can interact with and also do and authentication with github
        -> so we will going to make a new folder called 'api'
    */
</script>


<!-- and now here the body take  -->

<!-- here we will going to show the user data firstly we will load until data didn't came -->
{#if loading}
<div>loading...</div>
{:else if user}
    {#if page === "todos"}
    <Todo user={user} {accessToken}/>
    <!-- so if user exit the we will pass the user as a props in 'Todo.svelte' -->
    <!-- and now we will going to create a new file called 'types.ts'  and put some type of user:
    export type User = {
      id: string;
      name: string;
      githubId: string;
    };
    -> so that we can use that user every place
    -> now we will going to export :
    -> export let user:User; from 'Todo.svelte'
    --> 
    <button on:click={()=>{
        page="contact"
    }}>Contact</button>
    <!-- here we are making a button to go the the contact page -->
    {:else}
    <!-- now here we are makig the multiple pages using page vairiable -->
    <div>Contack me here:adlfdsafdasfdsa</div>
    <button on:click={()=>{
        page="todos"
    }}>go Back</button>
    {/if}
<button on:click={()=>{
    accessToken=""
    // for the logout we will set the accessToken to empty it means we clear the user token now user have to login again
    user=null
    tsvscode.postMessage({type:'logout',value:undefined});
    // and we will going to post the message for logout
    // and in for the logout case in 'SidebarProvider.ts' we will going to setToken("") empty
}}>logout</button>
<!-- user will logout after clicking this button -->
<!-- now we had completed the logout on we will going to add todo table inside our database 
using jwt token and authenticate and find the user and save it
now we will go to api inside 'entities' folder we will create a file called 'todo.ts' we will create a schema for the todo
-->
{:else}
<button on:click={()=>{
     tsvscode.postMessage({type:'authenticate',value:undefined});
    //  here we will authenticate the use it they are not logged in
    // now we will going to listen for that in our 'SidebarProvider.ts' by 'onDidReceiveMessage()'
    // and write case where we will call the 'authenticate()' function 
}}>login with Github</button>
<!-- if user is not logged in -->
{/if}
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