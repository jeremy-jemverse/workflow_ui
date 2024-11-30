import { FormTextarea } from "./components/ui/form-textarea";

function App() {
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Basic textarea */}
      <FormTextarea
        label="Basic textarea"
        placeholder="Enter your text here..."
      />

      {/* Required textarea */}
      <FormTextarea
        label="Required textarea"
        required
        placeholder="This field is required"
      />

      {/* With character count */}
      <FormTextarea
        label="With character limit"
        characterCount
        maxLength={100}
        placeholder="Limited to 100 characters"
      />

      {/* With error state */}
      <FormTextarea
        label="Error state"
        error="This field has an error"
        placeholder="Error state example"
      />

      {/* Disabled state */}
      <FormTextarea
        label="Disabled state"
        disabled
        placeholder="This field is disabled"
      />
    </div>
  );
}

export default App;