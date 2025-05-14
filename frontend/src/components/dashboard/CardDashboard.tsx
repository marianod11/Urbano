export default function CardDashboard({ title, data }) {
  return (
    <div className="card shadow text-white bg-brand-primary flex-1">
      <h1 className="font-roboto sm:text-4xl text-center mb-3">{data}</h1>
      <p className="text-center sm:text-lg font-roboto">{title}</p>
    </div>
  );
}
