export default function Header({ title }) {
  return (
    <header
      className="bg-brand-header-background w-full py-4 px-5"
      style={{
        marginLeft: '-60px',
        width: 'calc(100% + 60px)',
        paddingLeft: '60px',
        marginTop: '-40px',
        paddingTop: 'calc(40px + 1rem)',
      }}
    >
      <h1 className="font-roboto text-3xl">{title}</h1>
    </header>
  );
}
