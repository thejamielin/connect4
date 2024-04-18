import "./index.css"

export interface InputField {
  name: string;
  set: (input: any) => void;
  value: any;
  type?: string;
}

function Inputs({ fields }: { fields: InputField[] }) {
  return (
    <form className="fields-container">
      {fields.map((field: InputField, i) => (
        <div className="field">
          <label key={i} htmlFor={field.name}>
            {field.name}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.name}
            value={field.value}
            onChange={(e) => field.set(e.target.value)}
          />
        </div>
      ))}
    </form>);
}
export default Inputs;
