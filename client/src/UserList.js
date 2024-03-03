import React,{useState,useEffect} from 'react';


const UserList = ({ users, onAllotButtonClick }) => {
  const [count,setCount] = useState(0)
  useEffect(() => {
    // Increment count for each user with houseAlloted equal to 'None'
    setCount(users.filter(user => user.houseAlloted === 'None').length);
  }, [users]); // Update count whenever users change
  return (
    <div>
      <h1 style={{textAlign:'center'}}>New Registrations</h1>
      <hr style={{marginTop:10}} />
      {users.map((user, index) => (
        user.houseAlloted=="None" && (
        <div key={index}>
        <br/>
          <p>Name: <strong>{user.name}</strong></p>
          <p>ID: <strong>{user.ID}</strong></p>
          <p>Address: <strong>{user.add}</strong></p>
          <p>House Allotted: <strong>{user.houseAlloted}</strong></p>
          <button style={{marginLeft:400,width:100,fontSize:15,background:'skyblue',border:'none',borderRadius:'7px',marginBottom:10}} 
              onClick={() => {onAllotButtonClick(user)}}>
            Allot
          </button>
          <hr />
        </div>
      ))
      )}
      {count==0 && (
        <div>
        <h1 style={{textAlign:'center'}}>------NO NEW REGISTRATIONS------</h1>
        </div>
      )}
    </div>
  );
};

export default UserList;