import prisma from '../../lib/prisma';

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: { category: true }
  }).catch(() => []); // graceful fallback if db not ready

  return (
    <div>
      <h1 className="title">Inventaire (Références)</h1>
      <div className="glass-card">
        <h2>Ajouter un Produit / Une Catégorie</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>Ici vous pourrez créer de nouvelles références et les lier à des catégories (Bureau, Voitures, Location interne).</p>
      </div>

      <div style={{ marginTop: '2rem' }} className="glass-card">
        <h2>Liste des Produits</h2>
        {products.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Aucun produit stocké pour le moment.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyleType: 'none' }}>
            {products.map((p: any) => (
              <li key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <strong>{p.referenceName}</strong> - {p.category?.name} ({p.defaultPurchasePrice}€)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
