import { useState } from 'react';
import { useAircraft, useAddAircraft, type AircraftPayload, type Aircraft } from '../api/aircraft';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

function AircraftPage() {
  const { data: aircraftList, isLoading, error } = useAircraft();
  const addAircraft = useAddAircraft();

  const [dateActivated, setDateActivated] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationExpiration, setRegistrationExpiration] = useState('');
  const [flightControllerSerialNumber, setFlightControllerSerialNumber] = useState('');
  const [aircraftSerialNumber, setAircraftSerialNumber] = useState('');
  const [propNumber, setPropNumber] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!dateActivated || !make || !model || !flightControllerSerialNumber || !aircraftSerialNumber || propNumber === '') {
      setFormError('Fill in all required fields.');
      return;
    }

    const payload: AircraftPayload = {
      dateActivated: new Date(dateActivated).toISOString(),
      make,
      model,
      flightControllerSerialNumber,
      aircraftSerialNumber,
      propNumber: Number(propNumber),
    };
    if (registrationNumber) payload.registrationNumber = registrationNumber;
    if (registrationExpiration) payload.registrationExpiration = new Date(registrationExpiration).toISOString();
    if (notes) payload.notes = notes;

    addAircraft.mutate(payload, {
      onSuccess: () => {
        setFormError('');
        setMake('');
        setModel('');
        setRegistrationNumber('');
        setRegistrationExpiration('');
        setFlightControllerSerialNumber('');
        setAircraftSerialNumber('');
        setPropNumber('');
        setNotes('');
      },
      onError: (err) => {
        setFormError(err instanceof Error ? err.message : 'Failed to add aircraft');
      },
    });
  };

  return (
    <div>
      <h1>Aircraft</h1>
      <p>View and manage your aircraft (FAA-oriented).</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginBottom: '2rem' }}>
        <h2 style={{ marginTop: '1.5rem' }}>Add aircraft</h2>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Identification</legend>
          <div>
            <label htmlFor="dateActivated">Date activated *</label>
            <input
              id="dateActivated"
              type="date"
              value={dateActivated}
              onChange={(e) => setDateActivated(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="make">Make *</label>
            <input
              id="make"
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. DJI"
              required
            />
          </div>
          <div>
            <label htmlFor="model">Model *</label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Mavic 3"
              required
            />
          </div>
          <div>
            <label htmlFor="aircraftSerialNumber">Aircraft serial number *</label>
            <input
              id="aircraftSerialNumber"
              type="text"
              value={aircraftSerialNumber}
              onChange={(e) => setAircraftSerialNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="flightControllerSerialNumber">Flight controller serial number *</label>
            <input
              id="flightControllerSerialNumber"
              type="text"
              value={flightControllerSerialNumber}
              onChange={(e) => setFlightControllerSerialNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="propNumber">Number of propellers *</label>
            <input
              id="propNumber"
              type="number"
              min={1}
              value={propNumber}
              onChange={(e) => setPropNumber(e.target.value === '' ? '' : Number(e.target.value))}
              required
            />
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Registration (FAA)</legend>
          <div>
            <label htmlFor="registrationNumber">Registration number</label>
            <input
              id="registrationNumber"
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. FA3X1234567 or N-number"
            />
          </div>
          <div>
            <label htmlFor="registrationExpiration">Registration expiration</label>
            <input
              id="registrationExpiration"
              type="date"
              value={registrationExpiration}
              onChange={(e) => setRegistrationExpiration(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Notes</legend>
          <div>
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </fieldset>

        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        {addAircraft.isError && <p style={{ color: 'red' }}>{addAircraft.error?.message}</p>}
        <button type="submit" disabled={addAircraft.isPending}>
          {addAircraft.isPending ? 'Saving…' : 'Add aircraft'}
        </button>
      </form>

      <h2>Your aircraft</h2>
      {isLoading && <p>Loading aircraft…</p>}
      {error && <p>Sign in to view aircraft.</p>}
      {aircraftList && aircraftList.length === 0 && <p>No aircraft added yet. Use the form above to add one.</p>}
      {aircraftList && aircraftList.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {aircraftList.map((a: Aircraft) => (
            <li
              key={a._id}
              style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', borderRadius: 4 }}
            >
              <strong>{a.make} {a.model}</strong>
              {a.aircraftSerialNumber && ` · S/N ${a.aircraftSerialNumber}`}
              {a.registrationNumber && ` · ${a.registrationNumber}`}
              {a.registrationExpiration && (
                <span style={{ color: new Date(a.registrationExpiration) < new Date() ? 'red' : 'inherit' }}>
                  {' '}· Reg expires {formatDate(a.registrationExpiration)}
                </span>
              )}
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                Activated {formatDate(a.dateActivated)} · {a.propNumber} prop(s)
                {a.maintenance && a.maintenance.length > 0 && ` · ${a.maintenance.length} maintenance record(s)`}
              </div>
              {a.notes && <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{a.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AircraftPage;
