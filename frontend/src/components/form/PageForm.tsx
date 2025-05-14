import { Loader, X } from 'react-feather';
import {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

interface FormField<T extends FieldValues> {
  name: Path<T>;
  type: string;
  placeholder: string;
  required?: boolean;
  accept?: string;
}

interface PageFormProps<T extends FieldValues> {
  title: string;
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: SubmitHandler<T>;
  fields: FormField<T>[];
  submitText?: string;
}

export function PageForm<T extends FieldValues>({
  title,
  form,
  isSubmitting,
  error,
  onClose,
  onSubmit,
  fields,
  submitText = 'Save',
}: PageFormProps<T>) {
  const { register, handleSubmit, reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div>
      <div className="flex">
        <h1 className="font-semibold mb-3">{title}</h1>
        <button className="ml-auto focus:outline-none" onClick={handleClose}>
          <X size={30} />
        </button>
      </div>
      <hr />

      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map((field) => (
          <input
            key={field.name as string}
            type={field.type}
            className="input"
            placeholder={field.placeholder}
            disabled={isSubmitting}
            required={field.required}
            accept={field.accept}
            {...register(field.name as any)}
          />
        ))}

        <button
          className="btn bg-brand-primary hover:bg-red-hover font-roboto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader className="animate-spin mx-auto" />
          ) : (
            submitText
          )}
        </button>

        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
