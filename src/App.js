import {API,graphqlOperation} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import React, { Component } from 'react';
import { createNotes, deleteNotes, updateNotes } from './graphql/mutations';
import {listNotes} from './graphql/queries';
import { onCreateNotes, onDeleteNotes, onUpdateNotes } from './graphql/subscriptions';

class App extends Component {
  state={
    note:"",
    notes:[],
    id:""
  }

   componentDidMount(){
    this.getNotes()
   this.createNoteListener = API.graphql(graphqlOperation(onCreateNotes)).subscribe({
      next:noteData =>{
        const newNote = noteData.value.data.onCreateNotes;
        const prevNote  = this.state.notes.filter(note => note.id !== newNote.id)
        const updatedNote = [...prevNote,newNote];
        this.setState({notes:updatedNote})
      }
    })
    this.deleteNoteListener = API.graphql(graphqlOperation(onDeleteNotes)).subscribe({
      next:noteData =>{
        const deletedNote = noteData.value.data.onDeleteNotes;
        const updatedNote  = this.state.notes.filter(note => note.id !== deletedNote.id)
        this.setState({notes:updatedNote})
      }
    })  
    this.updateNoteListener = API.graphql(graphqlOperation(onUpdateNotes)).subscribe({
      next:noteData =>{
        const updatedNote = noteData.value.data.onUpdateNotes;
        const index = this.state.notes.findIndex(note => note.id === updatedNote.id)
        const updatedNotes = [
          ...this.state.notes.slice(0,index),
          updatedNote,
          ...this.state.notes.slice(index+1)
        ]
        this.setState({notes:updatedNotes})
      }
    })  
        
        
  }

   getNotes= async () =>{
    const result = await API.graphql(graphqlOperation(listNotes))
    this.setState({notes:result.data.listNotes.items}) 
  }

   hasExitingNote= () =>{
     const {id,notes} = this.state;
    if(id){
      const isNote = notes.findIndex(note =>note.id === id) > -1
      return isNote
    }
    return false
 }

 componentWillUnmount(){
   this.createNoteListener.unsubscribe()
   this.updateNoteListener.unsubscribe()
   this.deleteNoteListener.unsubscribe()
 }

  handleUpdateNote = async ()=>{
    const {id,note} = this.state;
    const input  = {notes:note,id}

     await API.graphql(graphqlOperation(updateNotes,{input}));
    // const updatedNote = result.data.updateNotes;
    // const index = notes.findIndex(note => note.id === updatedNote.id)
    // const updatedNotes = [
    //   ...notes.slice(0,index),
    //   updatedNote,
    //   ...notes.slice(index+1)
    // ]
    this.setState({note:"",id:""})
  }

  handleSetNotes = ({notes,id}) => {
   this.setState({note:notes,id})
  }

  handleChangeNote = e =>{
     this.setState({note:e.target.value})
  }
  handleAddNote = async e => {
   e.preventDefault()
   const input ={notes:this.state.note}

    if(this.hasExitingNote()){
      this.handleUpdateNote()
      }
      else{ 
        await API.graphql(graphqlOperation(createNotes,{input}));
        // const newNote = result.data.createNotes;
        // const updatedNote =  [newNote,...this.state.notes];
          this.setState({note:""})
      }
  }

  handleDeleteNote = async (noteId) =>{
    const input ={id:noteId}
     await API.graphql(graphqlOperation(deleteNotes,{input}))
    // const deleteNoteId = result.data.deleteNotes.id;
    // const updatedNotes = this.state.notes.filter(note => note.id !== deleteNoteId)
    // this.setState({notes:updatedNotes})
  }


  render() {
     const {note,id,notes} = this.state
    return (
      <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">Amplify NoteTracker</h1> 
      {/* {Note  From} */}
      <form  onSubmit={this.handleAddNote}  className="mb3">
          <input
          type="text"
          className="pa2 f4"
          value={note}
          onChange={this.handleChangeNote}
          placeholder="Write Your Note"
          />
          <button type="submit" className="pa2 f4">{id ? 'UpdateNote' : 'Add Note'}</button>
          
      </form>
      {/* {notes List} */}
       <div>
         {notes.map(item =>(
           <div key={item.id} className="flex items-center">
               <li className="pa1 f3" onClick={()=>this.handleSetNotes(item)}>
                  {item.notes}
               </li>
               <button className="bg-transparent bn f4" onClick={()=>this.handleDeleteNote(item.id)}>
                 <span>&times;</span>
               </button>
            </div> 
         ))} 
        </div> 
      
 </div>
    );
  }
}

export default withAuthenticator(App,{includeGreetings:true});
