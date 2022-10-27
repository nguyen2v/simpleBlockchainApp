// This component is to display the prop passed down from component './index.jsx'
function Contract({ value }) {
  return (
    <code
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10rem',
      }}
    >
      <span style={{ color: 'red', fontSize: '2em' }}>
        <strong>{value}</strong>
      </span>
    </code>
  );
}

export default Contract;
