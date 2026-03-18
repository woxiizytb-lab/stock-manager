import prisma from '../../lib/prisma';

export default async function MovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    include: { product: true, client: true },
    orderBy: { date: 'desc' }
  }).catch(() => []);

  return (
    <div>
      <h1 className="title">Mouvements de Stocks (I/O)</h1>
      <div className="glass-card">
        <h2>Nouveau Mouvement d'Entrée ou Sortie</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>Sélectionnez un article, entrez une quantité (+ ou -) et associez un client (Achat ou Location interne) si c'est une sortie.</p>
      </div>

      <div style={{ marginTop: '2rem' }} className="glass-card">
        <h2>Historique des Mouvements</h2>
        {movements.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun mouvement enregistré.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyleType: 'none' }}>
            {movements.map((m: any) => (
              <li key={m.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: m.type === 'IN' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                  {m.type === 'IN' ? 'Entrée' : 'Sortie'}
                </span>
                {' '} - Produit: {m.product?.referenceName} - QTE: {m.quantityChange}
                {m.client && ` - Client: ${m.client.name} (${m.assignmentType})`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
