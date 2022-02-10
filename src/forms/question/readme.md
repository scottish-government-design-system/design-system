The "question" component wraps groups of form elements. For example labels, inputs, hint text, and error messages. Its primary purpose is to provide a container element that client-side validation can use.

A question can wrap multiple related form fields with shared form validation. A simple example would be asking for a building or street address, for which you need at least one of the fields to be completed.

Where appropriate (ideally always) you should use `aria-describedby` to associate any hint text and error messages with a field. 
