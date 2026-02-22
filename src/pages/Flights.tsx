import { useFlights } from '../api/flights';

function Flights() {
  const { data, isLoading, error } = useFlights();

  return (
    <div>
      <h1>Flights</h1>
      <p>View and manage your flight records.</p>
      {isLoading && <p>Loading flights...</p>}
      {error && <p>Sign in to view flights.</p>}
      {data && Array.isArray(data) && (
        <ul>
          {data.map((flight: { _id?: string; [key: string]: unknown }, i: number) => (
            <li key={(flight._id as string) ?? i}>Flight record</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Flights;
