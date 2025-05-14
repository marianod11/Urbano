import { Plus } from 'react-feather';
export default function ActionButton({ title, onClick }) {
  return (
    <button
      className="my-5 flex items-center gap-2 px-4 py-2 rounded-md w-full sm:w-auto justify-center text-white font-semibold bg-brand-primary hover:bg-red-hover transition-colors font-roboto"
      onClick={onClick}
    >
      <Plus /> {title}
    </button>
  );
}
