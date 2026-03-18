import prisma from '../../lib/prisma';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany().catch(() => []);

  return (
    <div>
      <h1 className="title">Gestion des Clients</h1>
      <div className="glass-card">
        <h2>Créer un Client</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>Ajoutez des clients pour pouvoir leur affecter des sorties et des locations internes.</p>
      </div>

      <div style={{ marginTop: '2rem' }} className="glass-card">
        <h2>Base Clients</h2>
        {clients.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun client dans la base.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyleType: 'none' }}>
            {clients.map((c: any) => (
              <li key={c.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <strong>{c.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
