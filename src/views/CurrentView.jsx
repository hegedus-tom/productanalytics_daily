import CurrentInsights from '../components/current/CurrentInsights'
import CurrentCatalogOverview from '../components/current/CurrentCatalogOverview'
import CurrentProductCoverage from '../components/current/CurrentProductCoverage'
import ProductTable from '../components/ProductTable'

export default function CurrentView() {
  return (
    <div>
      <CurrentInsights />
      <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '0 0 28px' }} />
      <CurrentCatalogOverview />
      <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '0 0 28px' }} />
      <CurrentProductCoverage />
      <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '0 0 28px' }} />
      <ProductTable />
    </div>
  )
}
