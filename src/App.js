import {API,graphqlOperation} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import React, { Component } from 'react';
import { createNotes, deleteNotes, updateNotes } from './graphql/mutations';
import {listNotes} from './graphql/queries';

class App extends Component {
  state={
    note:"",
    notes:[],
    id:""
  }

  async componentDidMount(){
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

  handleUpdateNote = async ()=>{
    const {id,note,notes} = this.state;
    const input  = {notes:note,id}

    const result = await API.graphql(graphqlOperation(updateNotes,{input}));
    const updatedNote = result.data.updateNotes;
    console.log(updatedNote)
    const index = notes.findIndex(note => note.id === updatedNote.id)
    console.log(index)
    const updatedNotes = [
      ...notes.slice(0,index),
      updatedNote,
      ...notes.slice(index+1)
    ]
    this.setState({notes:updatedNotes,note:"",id:""})
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
        const result = await API.graphql(graphqlOperation(createNotes,{input}));
        const newNote = result.data.createNotes;
        const updatedNote =  [newNote,...this.state.notes];
          this.setState({notes:updatedNote,note:""})
      }
  }

  handleDeleteNote = async (noteId) =>{
    const input ={id:noteId}
    const result = await API.graphql(graphqlOperation(deleteNotes,{input}))
    const deleteNoteId = result.data.deleteNotes.id;
    const updatedNotes = this.state.notes.filter(note => note.id !== deleteNoteId)
    this.setState({notes:updatedNotes})
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
