import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="h-screen bg-amber-100 flex flex-col justify-center items-center gap-10 container px-24">
      <Link className="w-full" to="/history">
        <button className="w-full text-xl py-2 px-3 rounded bg-amber-400 text-stone-800 hover:bg-amber-500">
          History
        </button>
      </Link>
      <Link className="w-full" to="/order">
        <button className="w-full text-xl py-2 px-3 rounded bg-amber-400 text-stone-800 hover:bg-amber-500">
          Order
        </button>
      </Link>
    </div>
  );
}
