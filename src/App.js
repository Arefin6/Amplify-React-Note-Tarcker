/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { withAuthenticator } from "aws-amplify-react";
import {API,graphqlOperation} from 'aws-amplify';
import { createNotes,deleteNotes, updateNotes} from './graphql/mutations';
import {listNotes} from './graphql/queries';
import {onCreateNotes } from './graphql/subscriptions';

function App() {
  const [notes,setNotes] = useState([]);
  const [note,setNote] = useState("");
  const [id,setID]= useState("");


  useEffect(()=>{
    (async () => {
      const result = await API.graphql(graphqlOperation(listNotes))
      setNotes(result.data.listNotes.items) 
    })()

    API.graphql(graphqlOperation(onCreateNotes)).subscribe({
      next:noteData =>{
        const newNote = noteData.value.data.onCreateNotes;
        const previousNotes = notes.filter(note => note.id !== newNote.id);
        const updatedNotes =  [...previousNotes,newNote];
        setNotes(updatedNotes);
      }
    })
  },[])

  const hasExitingNote= () =>{
    if(id){
      const isNote = notes.findIndex(note =>note.id === id)>-1
      return isNote
    }
    return false
 }

  const handleAddNote =async(e)=>{
    e.preventDefault();
    const input ={notes:note}
     if(hasExitingNote){
        handleUpdateNote()
     } 
     else{
     const result = await API.graphql(graphqlOperation(createNotes,{input}));
      const newNote = result.data.createNotes;
      const updatedNote =  [newNote,...notes];
      setNotes(updatedNote);
      setNote("");
     }  
   
 }

 const handleUpdateNote = async () =>{
   const input ={id,notes:note};
   const result = await API.graphql(graphqlOperation(updateNotes,{input}));
   const updatedNote = result.data.updateNotes;
   const index = notes.findIndex(note=>note.id === updatedNote.id)
   const updatedNotes =[
     ...notes.slice(0,index),
     updatedNote,
     ...notes.slice(0,index+1)
   ]
   setNotes(updatedNotes)
   setNote("")
   setID("")
 }
 

  const handleDelete = async (noteId) =>{
       const input ={id:noteId}
       const result = await API.graphql(graphqlOperation(deleteNotes,{input}))
       const deleteNoteId = result.data.deleteNotes.id;
       const updatedNotes = notes.filter(note => note.id !== deleteNoteId)
       setNotes(updatedNotes)
       
  }

   const handleSetNote = ({notes,id})=>{
      setNote(notes)
      setID(id)
   }


     

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
         <h1 className="code f2-1">Amplify NoteTracker</h1> 
         {/* {Note  From} */}
         <form  onSubmit={handleAddNote}  className="mb3">
             <input
             type="text"
             className="pa2 f4"
             value={note}
             onChange={(e)=>setNote(e.target.value)}
             placeholder="Write Your Note"
             />
             <button type="submit" className="pa2 f4">{id ? 'UpdateNote' : 'Add Note'}</button>
             
         </form>
         {/* {notes List} */}
          <div>
            {notes.map(item =>(
              <div key={item.id} className="flex items-center">
                  <li className="pa1 f3" onClick={()=>handleSetNote(item)}>
                     {item.notes}
                  </li>
                  <button className="bg-transparent bn f4" onClick={()=>handleDelete(item.id)}>
                    <span>&times;</span>
                  </button>
               </div> 
            ))} 
           </div> 
         
    </div>
  );
}

export default withAuthenticator(App,{includeGreetings:true});
