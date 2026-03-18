import prisma from '../../lib/prisma';
import { createMovement } from '../actions/movements';

export default async function MovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    include: { product: true, client: true },
    orderBy: { date: 'desc' },
    take: 50
  }).catch(() => []);

  const products = await prisma.product.findMany().catch(() => []);
  const clients = await prisma.client.findMany().catch(() => []);

  return (
    <div>
      <h1 className="title">Mouvements de Stocks (I/O)</h1>
      
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2>Nouveau Mouvement (Entrée ou Sortie)</h2>
        <form action={createMovement} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          
          <select name="type" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}>
            <option value="IN">Entrée en stock (+)</option>
            <option value="OUT">Sortie de stock / Affectation (-)</option>
          </select>
          
          <select name="productId" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}>
            <option value="">-- Sélectionner le produit --</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>{p.referenceName}</option>
            ))}
          </select>

          <input type="number" min="1" step="1" name="quantity" placeholder="Quantité" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
          
          <select name="clientId" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}>
            <option value="">-- Client (Optionnel ou pour sortie) --</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="assignmentType" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white', gridColumn: 'span 2' }}>
            <option value="">-- Type d'affectation (Requis si Sortie pour un Client) --</option>
            <option value="ACHAT">Achat définitif (Déduit de la valorisation du stock)</option>
            <option value="LOCATION_INTERNE">Location interne (Reste valorisé au bilan annuel)</option>
          </select>

          <button type="submit" style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer I/O</button>
        </form>
      </div>

      <div className="glass-card">
        <h2>Historique Récent</h2>
        {movements.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun mouvement enregistré.</p>
        ) : (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.5rem 0' }}>Date</th>
                <th>Type</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Client / Statut</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m: any) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    {new Date(m.date).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ color: m.type === 'IN' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {m.type === 'IN' ? 'Entrée' : 'Sortie'}
                  </td>
                  <td>{m.product?.referenceName}</td>
                  <td>{Math.abs(m.quantityChange)}</td>
                  <td>
                    {m.client ? (
                      <div>
                        {m.client.name} <br/>
                        <span style={{ fontSize: '0.8rem', color: m.assignmentType === 'LOCATION_INTERNE' ? '#8b5cf6' : '#ef4444' }}>
                          [{m.assignmentType}]
                        </span>
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
