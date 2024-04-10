import { useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import { apiAccountLogin, cacheSessionToken } from "../../dao";

export interface InputField {
  name : string,
  set : (input : any) => void, 
  value : any,
  type? : string
}

function Inputs({fields} : {fields : InputField[]}) {
  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          fields.map((field : InputField, i) => (
            <label key={i}>{field.name} <input type={field.type}
                                       value={field.value}
                                       onChange={e => field.set(e.target.value)}/></label>
          ))
        }
      </div>
    </div>
  );
}
export default Inputs;
