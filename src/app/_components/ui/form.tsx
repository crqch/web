import { forwardRef } from 'react'
import type { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'

type FormProps = React.FormHTMLAttributes<HTMLFormElement>

export const Form = forwardRef<HTMLFormElement, FormProps>(({ className = '', ...props }, ref) => (
  <form {...props} ref={ref} className={`flex flex-col ${className}`} />
))
Form.displayName = 'Form'

interface FormFieldProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>
  register: UseFormRegister<T>
  label?: string
  error?: FieldError
  asChild?: boolean
}

export const FormField = <T extends FieldValues>({
  register,
  label,
  error,
  className = '',
  ...props
}: FormFieldProps<T>): React.ReactElement => {

  return (
    <fieldset className={`space-y-2 flex flex-row items-center justify-between ${className}`}>
      {label && <label htmlFor={props.name}>{label}</label>}
      <input  {...props} {...register(props.name)} />
      {error && <small className="text-destructive">{error.message}</small>}
    </fieldset>
  )
}