import BreadRegistration from '../components/BreadRegistration';
import OrderRegistration from '../components/OrderRegistration';

export default function Inicio() {
  return (
    <>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Panel 1: Bread Registration */}
          <section className="lg:col-span-5 space-y-6">
             <BreadRegistration />
          </section>

          {/* Panel 2: Order Registration */}
          <section className="lg:col-span-7">
             <OrderRegistration />
          </section>
          
        </div>
      </div>
    </>
  );
}
