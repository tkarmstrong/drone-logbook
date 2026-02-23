import { useState } from 'react';
import { useFlights, useAddFlight, type FlightPayload, type FlightLeg } from '../api/flights';
import { useAircraft } from '../api/aircraft';
import type { Flight } from '../api/flights';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

function Flights() {
  const { data: flights, isLoading: flightsLoading, error: flightsError } = useFlights();
  const { data: aircraftList, isLoading: aircraftLoading } = useAircraft();
  const addFlight = useAddFlight();

  const [pilotExemptionNumber, setPilotExemptionNumber] = useState('');
  const [spotterName, setSpotterName] = useState('');
  const [aircraftId, setAircraftId] = useState('');
  const [dateOfFlight, setDateOfFlight] = useState('');
  const [location, setLocation] = useState('');
  const [flightLat, setFlightLat] = useState<number | ''>('');
  const [flightLong, setFlightLong] = useState<number | ''>('');
  const [totalFlightTime, setTotalFlightTime] = useState<number | ''>('');
  const [totalNightTime, setTotalNightTime] = useState<number | ''>('');
  const [totalPicTime, setTotalPicTime] = useState<number | ''>('');
  const [totalTakeoffs, setTotalTakeoffs] = useState<number | ''>('');
  const [totalLands, setTotalLands] = useState<number | ''>('');
  const [maxAltitude, setMaxAltitude] = useState<number | ''>('');
  const [airspaceClass, setAirspaceClass] = useState('');
  const [authorization, setAuthorization] = useState('');
  const [preflightChecklistComplete, setPreflightChecklistComplete] = useState(false);
  const [batterySerialsText, setBatterySerialsText] = useState('');
  const [preFlightVoltage, setPreFlightVoltage] = useState<number | ''>('');
  const [postFlightVoltage, setPostFlightVoltage] = useState<number | ''>('');
  const [missionExperience, setMissionExperience] = useState('');
  const [missionNotes, setMissionNotes] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [weatherNotes, setWeatherNotes] = useState('');
  const [legTakeoffTime, setLegTakeoffTime] = useState('');
  const [legLandTime, setLegLandTime] = useState('');
  const [legFlightTime, setLegFlightTime] = useState<number | ''>('');
  const [legNotes, setLegNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!aircraftId) {
      setFormError('Select an aircraft.');
      return;
    }
    if (!dateOfFlight || !location || flightLat === '' || flightLong === '' || totalFlightTime === '' || !missionExperience) {
      setFormError('Fill in required fields: date, location, coordinates, total flight time, mission experience.');
      return;
    }

    const flightLegs: FlightLeg[] = [];
    if (legTakeoffTime && legLandTime && legFlightTime !== '') {
      flightLegs.push({
        takeoffTime: new Date(`${dateOfFlight}T${legTakeoffTime}`).toISOString(),
        landTime: new Date(`${dateOfFlight}T${legLandTime}`).toISOString(),
        flightTime: Number(legFlightTime),
        flightMalfunction: false,
        nightFlight: false,
        legNotes: legNotes || undefined,
      });
    }

    const payload: FlightPayload = {
      userData: {
        pilotExemptionNumber: pilotExemptionNumber || 'N/A',
        spotterName: spotterName || undefined,
      },
      aircraftData: { aircraftId },
      missionData: {
        dateOfFlight: new Date(dateOfFlight).toISOString(),
        location,
        flightLat: Number(flightLat),
        flightLong: Number(flightLong),
        totalFlightTime: Number(totalFlightTime),
        totalNightTime: totalNightTime !== '' ? Number(totalNightTime) : undefined,
        totalPicTime: totalPicTime !== '' ? Number(totalPicTime) : undefined,
        totalTakeoffs: totalTakeoffs !== '' ? Number(totalTakeoffs) : undefined,
        totalLands: totalLands !== '' ? Number(totalLands) : undefined,
        maxAltitude: maxAltitude !== '' ? Number(maxAltitude) : undefined,
        airspaceClass: airspaceClass || undefined,
        authorization: authorization || undefined,
        preflightChecklistComplete,
        batterySerials: batterySerialsText ? batterySerialsText.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        preFlightVoltage: preFlightVoltage !== '' ? Number(preFlightVoltage) : undefined,
        postFlightVoltage: postFlightVoltage !== '' ? Number(postFlightVoltage) : undefined,
        missionExperience,
        missionNotes: missionNotes || undefined,
        otherNotes: otherNotes || undefined,
      },
      flightData: { flightLegs },
      weatherData: { weatherNotes: weatherNotes || undefined },
    };

    addFlight.mutate(payload, {
      onSuccess: () => {
        setFormError('');
        setMissionNotes('');
        setOtherNotes('');
        setWeatherNotes('');
        setLegNotes('');
      },
      onError: (err) => {
        setFormError(err instanceof Error ? err.message : 'Failed to save flight');
      },
    });
  };

  return (
    <div>
      <h1>Flights</h1>
      <p>View and manage your flight records (FAA Part 107–oriented).</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginBottom: '2rem' }}>
        <h2 style={{ marginTop: '1.5rem' }}>Log a flight</h2>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Pilot & crew</legend>
          <div>
            <label htmlFor="pilotExemptionNumber">Pilot certificate / exemption number *</label>
            <input
              id="pilotExemptionNumber"
              type="text"
              value={pilotExemptionNumber}
              onChange={(e) => setPilotExemptionNumber(e.target.value)}
              placeholder="e.g. 1234567890"
            />
          </div>
          <div>
            <label htmlFor="spotterName">Visual observer (if any)</label>
            <input
              id="spotterName"
              type="text"
              value={spotterName}
              onChange={(e) => setSpotterName(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Aircraft</legend>
          <div>
            <label htmlFor="aircraftId">Aircraft *</label>
            <select
              id="aircraftId"
              value={aircraftId}
              onChange={(e) => setAircraftId(e.target.value)}
              required
            >
              <option value="">Select aircraft</option>
              {aircraftList?.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.make} {a.model} – {a.aircraftSerialNumber}
                  {a.registrationNumber ? ` (${a.registrationNumber})` : ''}
                </option>
              ))}
            </select>
            {aircraftLoading && <span> Loading aircraft…</span>}
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Mission</legend>
          <div>
            <label htmlFor="dateOfFlight">Date of flight *</label>
            <input
              id="dateOfFlight"
              type="date"
              value={dateOfFlight}
              onChange={(e) => setDateOfFlight(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="location">Location (description) *</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Smith Field, Anytown"
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div>
              <label htmlFor="flightLat">Latitude *</label>
              <input
                id="flightLat"
                type="number"
                step="any"
                value={flightLat}
                onChange={(e) => setFlightLat(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 40.7128"
                required
              />
            </div>
            <div>
              <label htmlFor="flightLong">Longitude *</label>
              <input
                id="flightLong"
                type="number"
                step="any"
                value={flightLong}
                onChange={(e) => setFlightLong(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. -74.0060"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="totalFlightTime">Total flight time (minutes) *</label>
            <input
              id="totalFlightTime"
              type="number"
              min="0"
              step="0.1"
              value={totalFlightTime}
              onChange={(e) => setTotalFlightTime(e.target.value === '' ? '' : Number(e.target.value))}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="totalNightTime">Night time (min)</label>
              <input
                id="totalNightTime"
                type="number"
                min="0"
                step="0.1"
                value={totalNightTime}
                onChange={(e) => setTotalNightTime(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="totalPicTime">PIC time (min)</label>
              <input
                id="totalPicTime"
                type="number"
                min="0"
                step="0.1"
                value={totalPicTime}
                onChange={(e) => setTotalPicTime(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="totalTakeoffs">Takeoffs</label>
              <input
                id="totalTakeoffs"
                type="number"
                min="0"
                value={totalTakeoffs}
                onChange={(e) => setTotalTakeoffs(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="totalLands">Landings</label>
              <input
                id="totalLands"
                type="number"
                min="0"
                value={totalLands}
                onChange={(e) => setTotalLands(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label htmlFor="missionExperience">Purpose / mission experience *</label>
            <input
              id="missionExperience"
              type="text"
              value={missionExperience}
              onChange={(e) => setMissionExperience(e.target.value)}
              placeholder="e.g. Part 107 practice, mapping"
              required
            />
          </div>
          <div>
            <label htmlFor="missionNotes">Mission notes</label>
            <textarea id="missionNotes" value={missionNotes} onChange={(e) => setMissionNotes(e.target.value)} rows={2} />
          </div>
          <div>
            <label htmlFor="otherNotes">Other notes</label>
            <textarea id="otherNotes" value={otherNotes} onChange={(e) => setOtherNotes(e.target.value)} rows={2} />
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>FAA / compliance</legend>
          <div>
            <label htmlFor="maxAltitude">Max altitude (ft AGL)</label>
            <input
              id="maxAltitude"
              type="number"
              min="0"
              value={maxAltitude}
              onChange={(e) => setMaxAltitude(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="airspaceClass">Airspace class</label>
            <input
              id="airspaceClass"
              type="text"
              value={airspaceClass}
              onChange={(e) => setAirspaceClass(e.target.value)}
              placeholder="e.g. Class G"
            />
          </div>
          <div>
            <label htmlFor="authorization">Authorization (e.g. LAANC, waiver #)</label>
            <input
              id="authorization"
              type="text"
              value={authorization}
              onChange={(e) => setAuthorization(e.target.value)}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={preflightChecklistComplete}
                onChange={(e) => setPreflightChecklistComplete(e.target.checked)}
              />
              Preflight checklist completed
            </label>
          </div>
          <div>
            <label htmlFor="batterySerials">Battery serials (comma-separated)</label>
            <input
              id="batterySerials"
              type="text"
              value={batterySerialsText}
              onChange={(e) => setBatterySerialsText(e.target.value)}
              placeholder="BAT001, BAT002"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div>
              <label htmlFor="preFlightVoltage">Pre-flight voltage (V)</label>
              <input
                id="preFlightVoltage"
                type="number"
                step="0.01"
                value={preFlightVoltage}
                onChange={(e) => setPreFlightVoltage(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="postFlightVoltage">Post-flight voltage (V)</label>
              <input
                id="postFlightVoltage"
                type="number"
                step="0.01"
                value={postFlightVoltage}
                onChange={(e) => setPostFlightVoltage(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Flight leg (optional)</legend>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="legTakeoffTime">Takeoff time</label>
              <input
                id="legTakeoffTime"
                type="time"
                value={legTakeoffTime}
                onChange={(e) => setLegTakeoffTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="legLandTime">Land time</label>
              <input
                id="legLandTime"
                type="time"
                value={legLandTime}
                onChange={(e) => setLegLandTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="legFlightTime">Leg time (min)</label>
              <input
                id="legFlightTime"
                type="number"
                min="0"
                step="0.1"
                value={legFlightTime}
                onChange={(e) => setLegFlightTime(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label htmlFor="legNotes">Leg notes</label>
            <input id="legNotes" type="text" value={legNotes} onChange={(e) => setLegNotes(e.target.value)} />
          </div>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Weather</legend>
          <div>
            <label htmlFor="weatherNotes">Weather notes</label>
            <textarea id="weatherNotes" value={weatherNotes} onChange={(e) => setWeatherNotes(e.target.value)} rows={2} />
          </div>
        </fieldset>

        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        {addFlight.isError && <p style={{ color: 'red' }}>{addFlight.error?.message}</p>}
        <button type="submit" disabled={addFlight.isPending}>
          {addFlight.isPending ? 'Saving…' : 'Save flight'}
        </button>
      </form>

      <h2>Your flights</h2>
      {flightsLoading && <p>Loading flights…</p>}
      {flightsError && <p>Sign in to view flights.</p>}
      {flights && Array.isArray(flights) && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {flights.map((f: Flight) => (
            <li key={f._id} style={{ border: '1px solid #ccc', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: 4 }}>
              <strong>{formatDate(f.missionData.dateOfFlight)}</strong> – {f.missionData.location}
              {f.missionData.totalFlightTime != null && ` · ${f.missionData.totalFlightTime} min`}
              {f.missionData.missionExperience && ` · ${f.missionData.missionExperience}`}
              {f.aircraftData?.aircraftId && typeof f.aircraftData.aircraftId === 'object' && (
                <span> · {String((f.aircraftData.aircraftId as { make?: string; model?: string }).make)} {(f.aircraftData.aircraftId as { model?: string }).model}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {flights && Array.isArray(flights) && flights.length === 0 && <p>No flights logged yet. Use the form above to add one.</p>}
    </div>
  );
}

export default Flights;
