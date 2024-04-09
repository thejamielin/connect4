import { useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import { apiAccountLogin, cacheSessionToken } from "../../dao";

export interface InputField {
  name : string,
  set : (input : string) => void, 
  value : string | undefined,
  hide? : boolean
}

function Inputs({fields} : {fields : InputField[]}) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          fields.map((field : InputField, i) => (
            <label key={i}>{field.name} <input type={field.hide ? "password" : undefined}
                                       value={field.value}
                                       onChange={e => field.set(e.target.value)}/></label>
          ))
        }
      </div>
    </div>
  );
}
export default Inputs;
