/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { withAuthenticator } from "aws-amplify-react";

function App() {
  const [notes,setNotes] = useState([]);
  const [note,setNote] = useState("");

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
         <h1 className="code f2-1">Amplify NoteTracker</h1> 
         {/* {Note  From} */}
         <from className="mb3">
             <input
             type="text"
             className="pa2 f4"
             onChange={(e)=>setNote(e.target.value)}
             placeholder="write Your Note"
             />
             <button className="pa2 f4">Add Note</button>
             
         </from>
         {/* {notes List} */}
          <div>
            {notes.map(item =>(
              <div key={item.id} className="flex items-center">
                  <li className="pa1 f3">
                     {item.note}
                  </li>
                  <button className="bg-transparent bn f4">
                    <span>&times;</span>
                  </button>
               </div> 
            ))} 
           </div> 
         
    </div>
  );
}

export default withAuthenticator(App,{includeGreetings:true});
