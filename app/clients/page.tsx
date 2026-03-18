import prisma from '../../lib/prisma';
import { createClient } from '../actions/clients';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { stockMovements: { include: { product: true } } }
  }).catch(() => []);

  return (
    <div>
      <h1 className="title">Gestion des Clients</h1>
      
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2>Créer un Client / Entreprise</h2>
        <form action={createClient} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <input type="text" name="name" placeholder="Nom du client" required style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)' }} />
          <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Ajouter Client</button>
        </form>
      </div>

      <div className="glass-card">
        <h2>Base Clients</h2>
        {clients.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun client dans la base.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {clients.map((c: any) => (
              <li key={c.id} style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.4)' }}>
                <strong style={{ fontSize: '1.2rem', color: '#111827' }}>{c.name}</strong>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#4b5563' }}>
                  <strong>Produits affectés au client :</strong>
                  {c.stockMovements.length > 0 ? (
                    <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                      {c.stockMovements.filter((m: any) => m.type === 'OUT').map((m: any) => (
                        <li key={m.id}>
                          {Math.abs(m.quantityChange)}x {m.product?.referenceName} - 
                          <span style={{ fontWeight: 'bold', marginLeft: '5px', color: m.assignmentType === 'LOCATION_INTERNE' ? '#8b5cf6' : '#ef4444' }}>
                            [{m.assignmentType}]
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : <p style={{ marginTop: '0.5rem' }}>Aucune sortie enregistrée pour ce client.</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
